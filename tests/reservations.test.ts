import { describe, it, expect } from 'vitest'
import { db } from '@/server/db'
import { resetDb, makeFixture } from './helpers/db'
import { addVehicle } from '@/server/services/vehicles'
import {
  createReservation,
  cancelReservation,
  expireReservations,
  listReservations,
} from '@/server/services/reservations'
import { getFree } from '@/server/services/availability'
import { recordEntry } from '@/server/services/entry'

const MINUTE = 60 * 1000

// A fixed local noon avoids crossing the local-day boundary when tests add
// an hour to `now`.
function localNoon(): Date {
  return new Date(2026, 0, 1, 12, 0, 0, 0)
}

describe('createReservation', () => {
  it('creates PENDING with holdUntil = arrival + 30 min and reduces free by 1', async () => {
    await resetDb()
    const f = await makeFixture()
    const vehicle = await addVehicle(db, { ownerId: f.student.id, plate: '51F-111.11', vehicleType: 'MOTORBIKE' })
    const now = localNoon()
    const arrival = new Date(now.getTime() + 60 * MINUTE)

    const freeBefore = await getFree(db, f.zoneA.id, 'MOTORBIKE', now)

    const reservation = await createReservation(db, {
      customerId: f.student.id,
      vehicleId: vehicle.id,
      zoneId: f.zoneA.id,
      arrivalTime: arrival,
      now,
    })

    expect(reservation.status).toBe('PENDING')
    expect(reservation.vehicleTypeCode).toBe('MOTORBIKE')
    expect(reservation.holdUntil.getTime()).toBe(arrival.getTime() + 30 * MINUTE)

    const freeAfter = await getFree(db, f.zoneA.id, 'MOTORBIKE', now)
    expect(freeAfter).toBe(freeBefore - 1)
  })

  it('NOT_OWNER when the vehicle belongs to someone else', async () => {
    await resetDb()
    const f = await makeFixture()
    const vehicle = await addVehicle(db, { ownerId: f.student.id, plate: '51F-222.22', vehicleType: 'MOTORBIKE' })
    const now = localNoon()

    await expect(
      createReservation(db, {
        customerId: f.lecturer.id,
        vehicleId: vehicle.id,
        zoneId: f.zoneA.id,
        arrivalTime: new Date(now.getTime() + 60 * MINUTE),
        now,
      }),
    ).rejects.toMatchObject({ code: 'NOT_OWNER' })
  })

  it('RESERVATION_WINDOW for arrival in the past or tomorrow', async () => {
    await resetDb()
    const f = await makeFixture()
    const vehicle = await addVehicle(db, { ownerId: f.student.id, plate: '51F-333.33', vehicleType: 'MOTORBIKE' })
    const now = localNoon()

    await expect(
      createReservation(db, {
        customerId: f.student.id,
        vehicleId: vehicle.id,
        zoneId: f.zoneA.id,
        arrivalTime: new Date(now.getTime() - 60 * MINUTE),
        now,
      }),
    ).rejects.toMatchObject({ code: 'RESERVATION_WINDOW' })

    const tomorrow = new Date(2026, 0, 2, 12, 0, 0, 0)
    await expect(
      createReservation(db, {
        customerId: f.student.id,
        vehicleId: vehicle.id,
        zoneId: f.zoneA.id,
        arrivalTime: tomorrow,
        now,
      }),
    ).rejects.toMatchObject({ code: 'RESERVATION_WINDOW' })
  })

  it('LOT_SUSPENDED when lot suspended; existing PENDING kept on suspend', async () => {
    await resetDb()
    const f = await makeFixture()
    const v1 = await addVehicle(db, { ownerId: f.student.id, plate: '51F-444.44', vehicleType: 'MOTORBIKE' })
    const v2 = await addVehicle(db, { ownerId: f.lecturer.id, plate: '51F-555.55', vehicleType: 'MOTORBIKE' })
    const now = localNoon()
    const arrival = new Date(now.getTime() + 60 * MINUTE)

    const existing = await createReservation(db, {
      customerId: f.student.id,
      vehicleId: v1.id,
      zoneId: f.zoneA.id,
      arrivalTime: arrival,
      now,
    })

    await db.parkingLot.update({ where: { id: f.lot.id }, data: { status: 'SUSPENDED' } })

    await expect(
      createReservation(db, {
        customerId: f.lecturer.id,
        vehicleId: v2.id,
        zoneId: f.zoneA.id,
        arrivalTime: arrival,
        now,
      }),
    ).rejects.toMatchObject({ code: 'LOT_SUSPENDED' })

    const kept = await db.reservation.findUnique({ where: { id: existing.id } })
    expect(kept?.status).toBe('PENDING')
  })

  it('ZONE_FULL when no free spot', async () => {
    await resetDb()
    const f = await makeFixture({ carCapC: 1 })
    const v1 = await addVehicle(db, { ownerId: f.student.id, plate: '51A-000.01', vehicleType: 'CAR' })
    const v2 = await addVehicle(db, { ownerId: f.lecturer.id, plate: '51A-000.02', vehicleType: 'CAR' })
    const now = localNoon()
    const arrival = new Date(now.getTime() + 60 * MINUTE)

    await createReservation(db, {
      customerId: f.student.id,
      vehicleId: v1.id,
      zoneId: f.zoneC.id,
      arrivalTime: arrival,
      now,
    })

    await expect(
      createReservation(db, {
        customerId: f.lecturer.id,
        vehicleId: v2.id,
        zoneId: f.zoneC.id,
        arrivalTime: arrival,
        now,
      }),
    ).rejects.toMatchObject({ code: 'ZONE_FULL' })
  })

  it('VEHICLE_ALREADY_RESERVED on second reservation for same vehicle', async () => {
    await resetDb()
    const f = await makeFixture()
    const vehicle = await addVehicle(db, { ownerId: f.student.id, plate: '51F-666.66', vehicleType: 'MOTORBIKE' })
    const now = localNoon()
    const arrival = new Date(now.getTime() + 60 * MINUTE)

    await createReservation(db, {
      customerId: f.student.id,
      vehicleId: vehicle.id,
      zoneId: f.zoneA.id,
      arrivalTime: arrival,
      now,
    })

    await expect(
      createReservation(db, {
        customerId: f.student.id,
        vehicleId: vehicle.id,
        zoneId: f.zoneB.id,
        arrivalTime: arrival,
        now,
      }),
    ).rejects.toMatchObject({ code: 'VEHICLE_ALREADY_RESERVED' })
  })

  it('VEHICLE_PARKED when vehicle has open session', async () => {
    await resetDb()
    const f = await makeFixture()
    const vehicle = await addVehicle(db, { ownerId: f.student.id, plate: '51F-777.77', vehicleType: 'MOTORBIKE' })
    const now = localNoon()

    await recordEntry(db, {
      method: 'QR',
      identifier: vehicle.qrCode,
      zoneId: f.zoneA.id,
      staffId: f.staff.id,
      now,
    })

    await expect(
      createReservation(db, {
        customerId: f.student.id,
        vehicleId: vehicle.id,
        zoneId: f.zoneB.id,
        arrivalTime: new Date(now.getTime() + 60 * MINUTE),
        now,
      }),
    ).rejects.toMatchObject({ code: 'VEHICLE_PARKED' })
  })
})

describe('cancelReservation', () => {
  it('cancel before arrival -> CANCELLED; at/after arrival -> NOT_CANCELLABLE', async () => {
    await resetDb()
    const f = await makeFixture()
    const vehicle = await addVehicle(db, { ownerId: f.student.id, plate: '51F-888.88', vehicleType: 'MOTORBIKE' })
    const now = localNoon()
    const arrival = new Date(now.getTime() + 60 * MINUTE)

    const reservation = await createReservation(db, {
      customerId: f.student.id,
      vehicleId: vehicle.id,
      zoneId: f.zoneA.id,
      arrivalTime: arrival,
      now,
    })

    const cancelled = await cancelReservation(db, {
      customerId: f.student.id,
      reservationId: reservation.id,
      now: new Date(arrival.getTime() - 10 * MINUTE),
    })
    expect(cancelled.status).toBe('CANCELLED')
    expect(cancelled.cancelReason).toBe('CUSTOMER')
    expect(cancelled.cancelZoneId).toBeNull()

    const again = await createReservation(db, {
      customerId: f.student.id,
      vehicleId: vehicle.id,
      zoneId: f.zoneA.id,
      arrivalTime: arrival,
      now,
    })

    await expect(
      cancelReservation(db, {
        customerId: f.student.id,
        reservationId: again.id,
        now: arrival,
      }),
    ).rejects.toMatchObject({ code: 'NOT_CANCELLABLE' })
  })

  it('NOT_CANCELLABLE when another customer attempts the cancel', async () => {
    await resetDb()
    const f = await makeFixture()
    const vehicle = await addVehicle(db, { ownerId: f.student.id, plate: '51F-999.99', vehicleType: 'MOTORBIKE' })
    const now = localNoon()
    const arrival = new Date(now.getTime() + 60 * MINUTE)

    const reservation = await createReservation(db, {
      customerId: f.student.id,
      vehicleId: vehicle.id,
      zoneId: f.zoneA.id,
      arrivalTime: arrival,
      now,
    })

    await expect(
      cancelReservation(db, {
        customerId: f.lecturer.id,
        reservationId: reservation.id,
        now,
      }),
    ).rejects.toMatchObject({ code: 'NOT_CANCELLABLE' })
  })
})

describe('expireReservations', () => {
  it('marks NO_SHOW at holdUntil and frees the spot', async () => {
    await resetDb()
    const f = await makeFixture()
    const vehicle = await addVehicle(db, { ownerId: f.student.id, plate: '51F-121.21', vehicleType: 'MOTORBIKE' })
    const now = localNoon()
    const arrival = now
    const capacity = await getFree(db, f.zoneA.id, 'MOTORBIKE', now)

    const reservation = await createReservation(db, {
      customerId: f.student.id,
      vehicleId: vehicle.id,
      zoneId: f.zoneA.id,
      arrivalTime: arrival,
      now,
    })
    expect(await getFree(db, f.zoneA.id, 'MOTORBIKE', now)).toBe(capacity - 1)

    const later = new Date(arrival.getTime() + 31 * MINUTE)
    const count = await expireReservations(db, later)
    expect(count).toBe(1)

    const updated = await db.reservation.findUnique({ where: { id: reservation.id } })
    expect(updated?.status).toBe('NO_SHOW')
    expect(await getFree(db, f.zoneA.id, 'MOTORBIKE', later)).toBe(capacity)
  })
})

describe('listReservations', () => {
  it('returns only the customer own reservations', async () => {
    await resetDb()
    const f = await makeFixture()
    const v1 = await addVehicle(db, { ownerId: f.student.id, plate: '51F-131.31', vehicleType: 'MOTORBIKE' })
    const v2 = await addVehicle(db, { ownerId: f.lecturer.id, plate: '51F-141.41', vehicleType: 'MOTORBIKE' })
    const now = localNoon()
    const arrival = new Date(now.getTime() + 60 * MINUTE)

    await createReservation(db, { customerId: f.student.id, vehicleId: v1.id, zoneId: f.zoneA.id, arrivalTime: arrival, now })
    await createReservation(db, { customerId: f.lecturer.id, vehicleId: v2.id, zoneId: f.zoneB.id, arrivalTime: arrival, now })

    const list = await listReservations(db, f.student.id)
    expect(list).toHaveLength(1)
    expect(list[0].customerId).toBe(f.student.id)
  })
})

describe('walk-in vs reservation interplay', () => {
  it('walk-in rejected when last free spot is reserved (ZONE_FULL)', async () => {
    await resetDb()
    const f = await makeFixture({ carCapC: 1 })
    const reserved = await addVehicle(db, { ownerId: f.student.id, plate: '51A-010.10', vehicleType: 'CAR' })
    const now = localNoon()
    const arrival = new Date(now.getTime() + 60 * MINUTE)

    await createReservation(db, {
      customerId: f.student.id,
      vehicleId: reserved.id,
      zoneId: f.zoneC.id,
      arrivalTime: arrival,
      now,
    })

    await expect(
      recordEntry(db, {
        method: 'PLATE',
        identifier: '51A-020.20',
        zoneId: f.zoneC.id,
        vehicleType: 'CAR',
        staffId: f.staff.id,
        now,
      }),
    ).rejects.toMatchObject({ code: 'ZONE_FULL' })
  })
})
