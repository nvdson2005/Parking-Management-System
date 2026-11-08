import type { PrismaClient, Reservation } from '@prisma/client'
import { z } from 'zod'
import type { Db } from '@/server/db'
import { DomainError } from '@/server/errors'
import { withLock } from '@/server/lock'
import { getFree } from '@/server/services/availability'
import { publishAvailabilityChanged } from '@/server/bus'
import { addMinutes, endOfLocalDay, HOLD_MINUTES } from '@/lib/time'
import type { VehicleTypeCode } from '@/lib/types'

const createReservationSchema = z.object({
  customerId: z.string().min(1),
  vehicleId: z.string().min(1),
  zoneId: z.string().min(1),
  arrivalTime: z.date(),
  now: z.date().optional(),
})

const cancelReservationSchema = z.object({
  customerId: z.string().min(1),
  reservationId: z.string().min(1),
  now: z.date().optional(),
})

/**
 * Expires PENDING reservations whose hold window has elapsed (`holdUntil <=
 * now`), flipping them to NO_SHOW and returning how many were expired
 * (FR-23). Deliberately takes a `Db` and does *not* acquire `withLock`: it is
 * invoked both as the first step inside the already-locked reservation/entry
 * transactions (passing the transaction client) and standalone from the
 * instrumentation timer, so acquiring the non-reentrant lock here would
 * deadlock the locked callers.
 */
export async function expireReservations(db: Db, now: Date = new Date()): Promise<number> {
  const result = await db.reservation.updateMany({
    where: { status: 'PENDING', holdUntil: { lte: now } },
    data: { status: 'NO_SHOW' },
  })
  return result.count
}

/**
 * Creates a same-day PENDING reservation (FR-21). Runs inside `withLock` + a
 * transaction so the capacity read and the create can't interleave with a
 * concurrent entry/reservation. Checks run in the brief's order: expire
 * stale holds first, then ownership, arrival window, lot status, duplicate
 * hold, open session, and finally free capacity.
 */
export async function createReservation(
  db: Db,
  input: {
    customerId: string
    vehicleId: string
    zoneId: string
    arrivalTime: Date
    now?: Date
  },
): Promise<Reservation> {
  const parsed = createReservationSchema.safeParse(input)
  if (!parsed.success) throw new DomainError('VALIDATION', 'Invalid reservation input')
  const data = parsed.data
  const now = data.now ?? new Date()

  const prisma = db as PrismaClient

  const reservation = await withLock(() =>
    prisma.$transaction(async (tx) => {
      await expireReservations(tx, now)

      const vehicle = await tx.vehicle.findUnique({ where: { id: data.vehicleId } })
      if (!vehicle || vehicle.ownerId !== data.customerId) {
        throw new DomainError('NOT_OWNER', 'You do not own this vehicle')
      }

      if (data.arrivalTime < now || data.arrivalTime > endOfLocalDay(now)) {
        throw new DomainError('RESERVATION_WINDOW', 'Arrival must be later today')
      }

      const zone = await tx.zone.findUnique({ where: { id: data.zoneId }, include: { lot: true } })
      if (!zone) throw new DomainError('NOT_FOUND', 'Zone not found')
      if (zone.lot.status === 'SUSPENDED') throw new DomainError('LOT_SUSPENDED', 'Lot is suspended')

      const existing = await tx.reservation.findFirst({
        where: { vehicleId: vehicle.id, status: 'PENDING' },
      })
      if (existing) throw new DomainError('VEHICLE_ALREADY_RESERVED', 'Vehicle already has a reservation')

      const openSession = await tx.parkingSession.findFirst({
        where: { vehicleId: vehicle.id, status: 'OPEN' },
      })
      if (openSession) throw new DomainError('VEHICLE_PARKED', 'Vehicle is currently parked')

      const type = vehicle.vehicleTypeCode as VehicleTypeCode
      const free = await getFree(tx, data.zoneId, type, now)
      if (free <= 0) throw new DomainError('ZONE_FULL', 'Zone is full')

      return tx.reservation.create({
        data: {
          customerId: data.customerId,
          vehicleId: vehicle.id,
          zoneId: data.zoneId,
          vehicleTypeCode: type,
          arrivalTime: data.arrivalTime,
          holdUntil: addMinutes(data.arrivalTime, HOLD_MINUTES),
          status: 'PENDING',
        },
      })
    }),
  )

  publishAvailabilityChanged()
  return reservation
}

/**
 * Cancels the customer's own PENDING reservation before its arrival time
 * (FR-22). Any other case — not theirs, not PENDING, or `now >= arrivalTime`
 * — is `NOT_CANCELLABLE`.
 */
export async function cancelReservation(
  db: Db,
  input: { customerId: string; reservationId: string; now?: Date },
): Promise<Reservation> {
  const parsed = cancelReservationSchema.safeParse(input)
  if (!parsed.success) throw new DomainError('VALIDATION', 'Invalid cancel input')
  const data = parsed.data
  const now = data.now ?? new Date()

  const prisma = db as PrismaClient

  const reservation = await withLock(() =>
    prisma.$transaction(async (tx) => {
      const existing = await tx.reservation.findUnique({ where: { id: data.reservationId } })
      if (
        !existing ||
        existing.customerId !== data.customerId ||
        existing.status !== 'PENDING' ||
        now >= existing.arrivalTime
      ) {
        throw new DomainError('NOT_CANCELLABLE', 'This reservation cannot be cancelled')
      }

      return tx.reservation.update({ where: { id: existing.id }, data: { status: 'CANCELLED' } })
    }),
  )

  publishAvailabilityChanged()
  return reservation
}

export async function listReservations(db: Db, customerId: string): Promise<Reservation[]> {
  return db.reservation.findMany({ where: { customerId }, orderBy: { arrivalTime: 'desc' } })
}
