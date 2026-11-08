import { randomBytes } from 'crypto'
import { z } from 'zod'
import { Prisma } from '@prisma/client'
import type { Vehicle } from '@prisma/client'
import type { Db } from '@/server/db'
import { DomainError } from '@/server/errors'
import { withLock } from '@/server/lock'
import { normalizePlate } from '@/lib/plate'
import type { IdMethod, VehicleTypeCode } from '@/lib/types'

// RFC 4648 base32 alphabet (no padding), matching D-32's "uppercase base32" codes.
const BASE32_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'
const CODE_LENGTH = 10
const MAX_CODE_ATTEMPTS = 10

/**
 * `${prefix}-` followed by 10 uppercase base32 characters drawn from
 * `crypto.randomBytes`, used for both QR (`QR-`) and RFID (`RF-`) codes.
 */
export function generateCode(prefix: 'QR' | 'RF'): string {
  const bytes = randomBytes(CODE_LENGTH)
  let code = ''
  for (let i = 0; i < CODE_LENGTH; i++) {
    code += BASE32_ALPHABET[bytes[i] % BASE32_ALPHABET.length]
  }
  return `${prefix}-${code}`
}

/**
 * Separator-insensitive comparison key for an already-`normalizePlate`'d
 * string: strips everything but letters/digits so hyphen and spacing
 * variants (e.g. `51F-123.45` vs `51F123.45`) resolve to the same vehicle,
 * without changing `normalizePlate`'s own stored/displayed output.
 */
function plateCompareKey(normalizedPlate: string): string {
  return normalizedPlate.replace(/[^A-Z0-9]/g, '')
}

async function findVehicleByCompareKey(db: Db, compareKey: string): Promise<Vehicle | null> {
  const candidates = await db.vehicle.findMany()
  return candidates.find((candidate) => plateCompareKey(candidate.plate) === compareKey) ?? null
}

/**
 * Prisma's unique-constraint violation (P2002) for `Vehicle`, with the
 * mapped column name(s) it hit (`plate`, `qr_code` or `rfid_code`), so
 * callers can tell "the plate itself conflicted" apart from "a generated
 * code happened to collide".
 */
function uniqueConflictTarget(err: unknown): string[] | null {
  if (!(err instanceof Prisma.PrismaClientKnownRequestError) || err.code !== 'P2002') return null
  const target = err.meta?.target
  return Array.isArray(target) ? (target as string[]) : null
}

const addVehicleSchema = z.object({
  ownerId: z.string().min(1),
  plate: z.string().min(1),
  vehicleType: z.enum(['MOTORBIKE', 'CAR']),
})

/**
 * Registers a vehicle for `input.ownerId`:
 * - no vehicle shares the plate (by compare key) → create one with fresh
 *   `qrCode`/`rfidCode` (D-32);
 * - a Guest vehicle (`ownerId === null`) shares the plate → claim it
 *   (D-33), keeping its existing codes and vehicle type;
 * - another customer (or the same one) already owns that plate →
 *   `PLATE_TAKEN`.
 *
 * The whole find-then-act sequence runs inside `withLock` so two concurrent
 * calls (including separator variants of the same plate, which only agree
 * on the compare key, not the stored string) can't both pass the read and
 * both create/claim a row — this is a single-process serialization, not a
 * DB-level constraint, matching the MVP's single-process SQLite deployment.
 */
export async function addVehicle(
  db: Db,
  input: { ownerId: string; plate: string; vehicleType: VehicleTypeCode },
): Promise<Vehicle> {
  const parsed = addVehicleSchema.parse(input)
  const plate = normalizePlate(parsed.plate)
  const compareKey = plateCompareKey(plate)

  return withLock(async () => {
    const existing = await findVehicleByCompareKey(db, compareKey)
    if (existing) {
      if (existing.ownerId !== null) {
        throw new DomainError('PLATE_TAKEN', 'Plate already registered')
      }
      // Claim: this update only runs after the read above, both inside the
      // same lock epoch, so no other `addVehicle` call can race it.
      return db.vehicle.update({ where: { id: existing.id }, data: { ownerId: parsed.ownerId } })
    }

    for (let attempt = 0; attempt < MAX_CODE_ATTEMPTS; attempt++) {
      try {
        return await db.vehicle.create({
          data: {
            plate,
            qrCode: generateCode('QR'),
            rfidCode: generateCode('RF'),
            vehicleTypeCode: parsed.vehicleType,
            ownerId: parsed.ownerId,
          },
        })
      } catch (err) {
        const target = uniqueConflictTarget(err)
        if (!target) throw err

        // The exact plate string collided (e.g. the same plate was just
        // created by another caller inside this same lock epoch): surface
        // PLATE_TAKEN instead of retrying with new codes.
        if (target.includes('plate')) throw new DomainError('PLATE_TAKEN', 'Plate already registered')

        // Astronomically unlikely qrCode/rfidCode collision: retry with
        // freshly generated codes rather than surfacing a raw 500.
        if (attempt === MAX_CODE_ATTEMPTS - 1) throw err
      }
    }

    /* istanbul ignore next -- unreachable: loop always returns or throws */
    throw new DomainError('VALIDATION', 'Could not register vehicle')
  })
}

export async function listVehicles(db: Db, ownerId: string): Promise<Vehicle[]> {
  return db.vehicle.findMany({ where: { ownerId }, orderBy: { createdAt: 'desc' } })
}

/**
 * Removes `vehicleId` from `ownerId`'s vehicles. `NOT_OWNER` if the vehicle
 * belongs to someone else (or no one). If it has any session or
 * reservation history, it is unlinked (`ownerId = null`, Guest-claimable
 * again) instead of deleted, to preserve that history's vehicle reference.
 */
export async function removeVehicle(db: Db, ownerId: string, vehicleId: string): Promise<void> {
  const vehicle = await db.vehicle.findUnique({ where: { id: vehicleId } })
  if (!vehicle || vehicle.ownerId !== ownerId) {
    throw new DomainError('NOT_OWNER', 'You do not own this vehicle')
  }

  const [sessionCount, reservationCount] = await Promise.all([
    db.parkingSession.count({ where: { vehicleId } }),
    db.reservation.count({ where: { vehicleId } }),
  ])

  if (sessionCount > 0 || reservationCount > 0) {
    await db.vehicle.update({ where: { id: vehicleId }, data: { ownerId: null } })
    return
  }

  await db.vehicle.delete({ where: { id: vehicleId } })
}

/**
 * Looks up a vehicle by its entry identifier. PLATE uses the same
 * separator-insensitive compare key as `addVehicle`; QR/RFID match the
 * trimmed, uppercased code exactly.
 */
export async function findVehicleByIdentifier(db: Db, method: IdMethod, identifier: string): Promise<Vehicle | null> {
  if (method === 'PLATE') {
    const compareKey = plateCompareKey(normalizePlate(identifier))
    return findVehicleByCompareKey(db, compareKey)
  }

  const code = identifier.trim().toUpperCase()
  if (method === 'QR') {
    return db.vehicle.findUnique({ where: { qrCode: code } })
  }
  return db.vehicle.findUnique({ where: { rfidCode: code } })
}
