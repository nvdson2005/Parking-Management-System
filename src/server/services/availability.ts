import type { Db } from '@/server/db'
import { expireReservations } from '@/server/services/reservations'
import type { LotStatus, VehicleTypeCode } from '@/lib/types'

export type TypeAvailability = {
  vehicleType: VehicleTypeCode
  capacity: number
  open: number
  reserved: number
  free: number
}

export type ZoneAvailability = {
  zoneId: string
  zoneName: string
  byType: TypeAvailability[]
}

export type LotAvailability = {
  lotId: string
  lotName: string
  status: LotStatus
  zones: ZoneAvailability[]
}

function clampFree(capacity: number, open: number, reserved: number): number {
  return Math.max(0, capacity - open - reserved)
}

/**
 * Free spots for one zone + vehicle type: capacity minus OPEN sessions minus
 * PENDING reservations whose hold has not expired, clamped to never go
 * negative (e.g. after a manager lowers capacity below current occupancy).
 */
export async function getFree(db: Db, zoneId: string, vehicleType: VehicleTypeCode, now: Date = new Date()): Promise<number> {
  const [capacityRow, open, reserved] = await Promise.all([
    db.zoneCapacity.findUnique({
      where: { zoneId_vehicleTypeCode: { zoneId, vehicleTypeCode: vehicleType } },
    }),
    db.parkingSession.count({
      where: { zoneId, vehicleTypeCode: vehicleType, status: 'OPEN' },
    }),
    db.reservation.count({
      where: { zoneId, vehicleTypeCode: vehicleType, status: 'PENDING', holdUntil: { gt: now } },
    }),
  ])

  const capacity = capacityRow?.capacity ?? 0
  return clampFree(capacity, open, reserved)
}

/**
 * Availability for every lot/zone/vehicle-type combination that has a
 * configured capacity. `reserved` counts PENDING reservations with
 * `holdUntil > now`; `free` is clamped at 0.
 */
export async function getAvailability(db: Db, now: Date = new Date()): Promise<LotAvailability[]> {
  await expireReservations(db, now)

  const lots = await db.parkingLot.findMany({
    include: {
      zones: {
        include: {
          capacities: { include: { vehicleType: true } },
        },
      },
    },
    orderBy: { name: 'asc' },
  })

  const [openCounts, reservedCounts] = await Promise.all([
    db.parkingSession.groupBy({
      by: ['zoneId', 'vehicleTypeCode'],
      where: { status: 'OPEN' },
      _count: { _all: true },
    }),
    db.reservation.groupBy({
      by: ['zoneId', 'vehicleTypeCode'],
      where: { status: 'PENDING', holdUntil: { gt: now } },
      _count: { _all: true },
    }),
  ])

  const openMap = new Map(openCounts.map((row) => [`${row.zoneId}:${row.vehicleTypeCode}`, row._count._all]))
  const reservedMap = new Map(
    reservedCounts.map((row) => [`${row.zoneId}:${row.vehicleTypeCode}`, row._count._all]),
  )

  return lots.map((lot) => ({
    lotId: lot.id,
    lotName: lot.name,
    status: lot.status as LotStatus,
    zones: lot.zones.map((zone) => ({
      zoneId: zone.id,
      zoneName: zone.name,
      byType: zone.capacities.map((cap) => {
        const key = `${zone.id}:${cap.vehicleTypeCode}`
        const open = openMap.get(key) ?? 0
        const reserved = reservedMap.get(key) ?? 0
        return {
          vehicleType: cap.vehicleTypeCode as VehicleTypeCode,
          capacity: cap.capacity,
          open,
          reserved,
          free: clampFree(cap.capacity, open, reserved),
        }
      }),
    })),
  }))
}
