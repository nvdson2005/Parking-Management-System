import { z } from 'zod'
import type { Db } from '@/server/db'
import { DomainError } from '@/server/errors'
import { logAccess } from '@/server/services/accessLog'
import { expireReservations } from '@/server/services/reservations'
import { findVehicleByIdentifier } from '@/server/services/vehicles'
import type { IdMethod, VehicleTypeCode } from '@/lib/types'

const lookupSchema = z.object({
  method: z.enum(['PLATE', 'QR', 'RFID']),
  identifier: z.string().trim().min(1),
  viewerId: z.string().min(1),
})

export type LookupResult = {
  vehicle: { id: string; plate: string; vehicleTypeCode: VehicleTypeCode; hasOwner: boolean }
  openSession: { id: string; zoneName: string; entryTime: Date; idMethod: IdMethod } | null
  activeReservation: { id: string; zoneName: string; arrivalTime: Date; holdUntil: Date } | null
}

/**
 * Staff lookup (A-65, G-08, Q34): finds a vehicle by plate (separator- and
 * case-insensitive), QR or RFID, and returns its open session and its active
 * reservation, so staff can decide early arrivals and lost cards. Stale holds
 * are expired first. The full plate is shown, so a successful lookup logs
 * VIEW_FULL_PLATE (D-31); an unknown identifier throws NOT_FOUND and logs
 * nothing. Read-only apart from the expiry update and the log row, so no lock.
 */
export async function staffLookup(
  db: Db,
  input: { method: IdMethod; identifier: string; viewerId: string },
): Promise<LookupResult> {
  const { method, identifier, viewerId } = lookupSchema.parse(input)
  const now = new Date()
  await expireReservations(db, now)

  const vehicle = await findVehicleByIdentifier(db, method, identifier)
  if (!vehicle) throw new DomainError('NOT_FOUND', 'Vehicle not found')

  const session = await db.parkingSession.findFirst({
    where: { vehicleId: vehicle.id, status: 'OPEN' },
    include: { zone: { select: { name: true } } },
  })
  const reservation = await db.reservation.findFirst({
    where: { vehicleId: vehicle.id, status: 'PENDING', holdUntil: { gt: now } },
    include: { zone: { select: { name: true } } },
    orderBy: { arrivalTime: 'asc' },
  })

  await logAccess(db, { userId: viewerId, action: 'VIEW_FULL_PLATE', target: `vehicle:${vehicle.id}` })

  return {
    vehicle: {
      id: vehicle.id,
      plate: vehicle.plate,
      vehicleTypeCode: vehicle.vehicleTypeCode as VehicleTypeCode,
      hasOwner: vehicle.ownerId !== null,
    },
    openSession: session
      ? { id: session.id, zoneName: session.zone.name, entryTime: session.entryTime, idMethod: session.idMethod as IdMethod }
      : null,
    activeReservation: reservation
      ? { id: reservation.id, zoneName: reservation.zone.name, arrivalTime: reservation.arrivalTime, holdUntil: reservation.holdUntil }
      : null,
  }
}
