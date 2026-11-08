import type { ParkingSession, PrismaClient, Vehicle } from '@prisma/client'
import type { Db } from '@/server/db'
import { DomainError } from '@/server/errors'
import { withLock } from '@/server/lock'
import { getFree } from '@/server/services/availability'
import { findVehicleByIdentifier, generateCode } from '@/server/services/vehicles'
import { logAccess } from '@/server/services/accessLog'
import { publishAvailabilityChanged } from '@/server/bus'
import { normalizePlate } from '@/lib/plate'
import type { IdMethod, VehicleTypeCode } from '@/lib/types'

const MAX_CODE_ATTEMPTS = 10

/**
 * Creates an unowned Guest vehicle for an unknown plate (FR-12, D-36) with
 * fresh QR/RFID codes, retrying on the astronomically unlikely code
 * collision. Deliberately does *not* go through `addVehicle`, which would
 * nest the non-reentrant process lock already held by `recordEntry`.
 */
async function createGuestVehicle(db: Db, plate: string, vehicleType: VehicleTypeCode): Promise<Vehicle> {
  for (let attempt = 0; attempt < MAX_CODE_ATTEMPTS; attempt++) {
    try {
      return await db.vehicle.create({
        data: {
          plate,
          qrCode: generateCode('QR'),
          rfidCode: generateCode('RF'),
          vehicleTypeCode: vehicleType,
          ownerId: null,
        },
      })
    } catch (err) {
      if (attempt === MAX_CODE_ATTEMPTS - 1) throw err
    }
  }
  /* istanbul ignore next -- unreachable: loop always returns or throws */
  throw new DomainError('VALIDATION', 'Could not create guest vehicle')
}

/**
 * Records a vehicle entry (EX-01, EX-04, EX-05, reservation fulfilment).
 *
 * The whole find-then-create sequence runs inside `withLock` (single-process
 * serialization for the MVP's SQLite deployment) and a `db.$transaction`, so
 * concurrent entries can't both pass the capacity read and both open a
 * session beyond capacity. `logAccess` and the availability broadcast run
 * after the transaction commits.
 */
export async function recordEntry(
  db: Db,
  input: {
    method: IdMethod
    identifier: string
    zoneId: string
    vehicleType?: VehicleTypeCode
    staffId: string
    now?: Date
  },
): Promise<ParkingSession> {
  const now = input.now ?? new Date()

  // `recordEntry` is always the top-level caller holding a real client (the
  // route and tests pass `db`), so it owns the transaction boundary the
  // `Db` union type can't express.
  const prisma = db as PrismaClient

  const session = await withLock(() =>
    prisma.$transaction(async (tx) => {
      const zone = await tx.zone.findUnique({ where: { id: input.zoneId }, include: { lot: true } })
      if (!zone) throw new DomainError('NOT_FOUND', 'Zone not found')
      if (zone.lot.status === 'SUSPENDED') throw new DomainError('LOT_SUSPENDED', 'Lot is suspended')

      let vehicle = await findVehicleByIdentifier(tx, input.method, input.identifier)
      if (!vehicle) {
        if (input.method !== 'PLATE') throw new DomainError('UNKNOWN_CODE', 'Unknown code')
        if (!input.vehicleType) throw new DomainError('VALIDATION', 'Vehicle type is required')
        vehicle = await createGuestVehicle(tx, normalizePlate(input.identifier), input.vehicleType)
      }

      const type = vehicle.vehicleTypeCode as VehicleTypeCode

      const openSession = await tx.parkingSession.findFirst({
        where: { vehicleId: vehicle.id, status: 'OPEN' },
      })
      if (openSession) throw new DomainError('ALREADY_OPEN', 'Vehicle already has an open session')

      const reservation = await tx.reservation.findFirst({
        where: { vehicleId: vehicle.id, status: 'PENDING', holdUntil: { gt: now } },
        orderBy: { arrivalTime: 'asc' },
      })

      let ownReservationId: string | null = null
      if (reservation) {
        if (reservation.zoneId === input.zoneId) {
          ownReservationId = reservation.id
        } else {
          // Reservation held for a different zone: cancel it (D-34) and
          // treat this as a walk-in.
          await tx.reservation.update({ where: { id: reservation.id }, data: { status: 'CANCELLED' } })
        }
      }

      if (!ownReservationId) {
        const free = await getFree(tx, input.zoneId, type, now)
        if (free <= 0) throw new DomainError('ZONE_FULL', 'Zone is full')
      }

      const owner = vehicle.ownerId
        ? await tx.user.findUnique({ where: { id: vehicle.ownerId } })
        : null
      const feeGroup = owner?.userGroup ?? 'GUEST'

      const created = await tx.parkingSession.create({
        data: {
          vehicleId: vehicle.id,
          plateSnapshot: vehicle.plate,
          zoneId: input.zoneId,
          vehicleTypeCode: type,
          feeGroup,
          idMethod: input.method,
          entryTime: now,
          entryStaffId: input.staffId,
          status: 'OPEN',
          reservationId: ownReservationId,
        },
      })

      if (ownReservationId) {
        await tx.reservation.update({ where: { id: ownReservationId }, data: { status: 'FULFILLED' } })
      }

      return created
    }),
  )

  await logAccess(db, { userId: input.staffId, action: 'ENTRY', target: session.id })
  publishAvailabilityChanged()

  return session
}
