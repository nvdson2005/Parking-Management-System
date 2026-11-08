import type { ParkingLot, PrismaClient, Zone } from '@prisma/client'
import { z } from 'zod'
import type { Db } from '@/server/db'
import { DomainError } from '@/server/errors'
import { logAccess } from '@/server/services/accessLog'
import { publishAvailabilityChanged } from '@/server/bus'
import type { VehicleTypeCode } from '@/lib/types'

const capacitiesSchema = z
  .object({
    MOTORBIKE: z.number().int().min(0).optional(),
    CAR: z.number().int().min(0).optional(),
  })
  .strict()

const createLotSchema = z.object({
  name: z.string().min(1),
  address: z.string().min(1),
})

const updateLotSchema = z
  .object({
    name: z.string().min(1).optional(),
    address: z.string().min(1).optional(),
    status: z.enum(['ACTIVE', 'SUSPENDED']).optional(),
  })
  .strict()

const createZoneSchema = z.object({
  lotId: z.string().min(1),
  name: z.string().min(1),
  capacities: capacitiesSchema,
})

const updateZoneSchema = z
  .object({
    name: z.string().min(1).optional(),
    capacities: capacitiesSchema.optional(),
  })
  .strict()

/**
 * Writes each provided per-vehicle-type capacity into `zone_capacities`,
 * upserting on the `(zoneId, vehicleTypeCode)` composite key so a type's
 * capacity can be added or changed without touching the others.
 */
async function upsertCapacities(
  db: Db,
  zoneId: string,
  capacities: Partial<Record<VehicleTypeCode, number>>,
): Promise<void> {
  for (const [vehicleTypeCode, capacity] of Object.entries(capacities) as [VehicleTypeCode, number][]) {
    await db.zoneCapacity.upsert({
      where: { zoneId_vehicleTypeCode: { zoneId, vehicleTypeCode } },
      update: { capacity },
      create: { zoneId, vehicleTypeCode, capacity },
    })
  }
}

/**
 * Creates a parking lot (MANAGER only, FR-07/FR-10). Logs `LOT_CHANGE` and
 * broadcasts availability after the row is persisted so live views refresh.
 */
export async function createLot(
  db: Db,
  actorId: string,
  input: { name: string; address: string },
): Promise<ParkingLot> {
  const parsed = createLotSchema.safeParse(input)
  if (!parsed.success) throw new DomainError('VALIDATION', 'Invalid lot input')

  const lot = await db.parkingLot.create({ data: { ...parsed.data, status: 'ACTIVE' } })

  await logAccess(db, { userId: actorId, action: 'LOT_CHANGE', target: lot.id })
  publishAvailabilityChanged()
  return lot
}

/**
 * Updates a lot's name/address/status (MANAGER only). The Active/Suspended
 * toggle flows through `status` (FR-10). Logs `LOT_CHANGE` and broadcasts
 * availability so a suspension immediately hides the lot's free spots.
 */
export async function updateLot(
  db: Db,
  actorId: string,
  lotId: string,
  input: { name?: string; address?: string; status?: 'ACTIVE' | 'SUSPENDED' },
): Promise<ParkingLot> {
  const parsed = updateLotSchema.safeParse(input)
  if (!parsed.success) throw new DomainError('VALIDATION', 'Invalid lot input')

  const existing = await db.parkingLot.findUnique({ where: { id: lotId } })
  if (!existing) throw new DomainError('NOT_FOUND', 'Lot not found')

  const lot = await db.parkingLot.update({ where: { id: lotId }, data: parsed.data })

  await logAccess(db, { userId: actorId, action: 'LOT_CHANGE', target: lot.id })
  publishAvailabilityChanged()
  return lot
}

/**
 * Creates a zone under a lot and upserts its per-vehicle-type capacities
 * (integers ≥ 0, FR-08). The create + capacity writes run in one
 * transaction so a half-built zone is never visible. Logs `LOT_CHANGE`.
 */
export async function createZone(
  db: Db,
  actorId: string,
  input: { lotId: string; name: string; capacities: Partial<Record<VehicleTypeCode, number>> },
): Promise<Zone> {
  const parsed = createZoneSchema.safeParse(input)
  if (!parsed.success) throw new DomainError('VALIDATION', 'Invalid zone input')

  const prisma = db as PrismaClient

  const zone = await prisma.$transaction(async (tx) => {
    const lot = await tx.parkingLot.findUnique({ where: { id: parsed.data.lotId } })
    if (!lot) throw new DomainError('NOT_FOUND', 'Lot not found')

    const created = await tx.zone.create({ data: { lotId: parsed.data.lotId, name: parsed.data.name } })
    await upsertCapacities(tx, created.id, parsed.data.capacities)
    return created
  })

  await logAccess(db, { userId: actorId, action: 'LOT_CHANGE', target: zone.id })
  publishAvailabilityChanged()
  return zone
}

/**
 * Updates a zone's name and/or per-vehicle-type capacities (FR-08). A
 * lowered capacity takes effect immediately in `getAvailability`/`getFree`,
 * which clamp free spots at 0. Logs `LOT_CHANGE`.
 */
export async function updateZone(
  db: Db,
  actorId: string,
  zoneId: string,
  input: { name?: string; capacities?: Partial<Record<VehicleTypeCode, number>> },
): Promise<Zone> {
  const parsed = updateZoneSchema.safeParse(input)
  if (!parsed.success) throw new DomainError('VALIDATION', 'Invalid zone input')

  const prisma = db as PrismaClient

  const zone = await prisma.$transaction(async (tx) => {
    const existing = await tx.zone.findUnique({ where: { id: zoneId } })
    if (!existing) throw new DomainError('NOT_FOUND', 'Zone not found')

    const updated =
      parsed.data.name !== undefined
        ? await tx.zone.update({ where: { id: zoneId }, data: { name: parsed.data.name } })
        : existing

    if (parsed.data.capacities) await upsertCapacities(tx, zoneId, parsed.data.capacities)
    return updated
  })

  await logAccess(db, { userId: actorId, action: 'LOT_CHANGE', target: zone.id })
  publishAvailabilityChanged()
  return zone
}

export type LotWithZones = ParkingLot & {
  zones: (Zone & { capacities: { vehicleTypeCode: string; capacity: number }[] })[]
}

/**
 * Lists every lot with its zones and per-vehicle-type capacities for the
 * manager configuration page.
 */
export async function listLots(db: Db): Promise<LotWithZones[]> {
  return db.parkingLot.findMany({
    include: { zones: { include: { capacities: true }, orderBy: { name: 'asc' } } },
    orderBy: { name: 'asc' },
  })
}
