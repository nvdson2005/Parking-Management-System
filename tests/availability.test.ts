import { describe, it, expect } from 'vitest'
import { db } from '@/server/db'
import { resetDb, makeFixture } from './helpers/db'
import { getAvailability, getFree } from '@/server/services/availability'
import { onAvailabilityChanged } from '@/server/bus'
import { addVehicle } from '@/server/services/vehicles'
import { recordEntry } from '@/server/services/entry'
import { confirmExit } from '@/server/services/exit'
import { createReservation, cancelReservation } from '@/server/services/reservations'
import { updateLot, updateZone } from '@/server/services/lots'

const NOW = new Date('2026-01-01T10:00:00Z')
const HOLD_UNTIL = new Date('2026-01-01T10:30:00Z')

async function openSession(zoneId: string, staffId: string) {
  return db.parkingSession.create({
    data: {
      plateSnapshot: '29A-12345',
      zoneId,
      vehicleTypeCode: 'MOTORBIKE',
      feeGroup: 'STUDENT',
      idMethod: 'PLATE',
      entryTime: NOW,
      entryStaffId: staffId,
      status: 'OPEN',
    },
  })
}

async function pendingReservation(zoneId: string, customerId: string, vehicleId: string, holdUntil: Date) {
  return db.reservation.create({
    data: {
      customerId,
      vehicleId,
      zoneId,
      vehicleTypeCode: 'MOTORBIKE',
      arrivalTime: NOW,
      holdUntil,
      status: 'PENDING',
    },
  })
}

describe('availability service', () => {
  it('free = capacity - open - pending reservations', async () => {
    await resetDb()
    const fixture = await makeFixture()
    const vehicle = await db.vehicle.create({
      data: {
        plate: '29A-00001',
        qrCode: 'qr-1',
        rfidCode: 'rfid-1',
        vehicleTypeCode: 'MOTORBIKE',
        ownerId: fixture.student.id,
      },
    })

    await openSession(fixture.zoneA.id, fixture.staff.id)
    await pendingReservation(fixture.zoneA.id, fixture.student.id, vehicle.id, HOLD_UNTIL)

    const a = await getAvailability(db, NOW)
    const moto = a[0].zones.find((z) => z.zoneName === 'A')!.byType.find((t) => t.vehicleType === 'MOTORBIKE')!
    expect(moto).toMatchObject({ capacity: 2, open: 1, reserved: 1, free: 0 })

    expect(await getFree(db, fixture.zoneA.id, 'MOTORBIKE', NOW)).toBe(0)
  })

  it('ignores CLOSED sessions and non-PENDING / expired reservations', async () => {
    await resetDb()
    const fixture = await makeFixture()
    const vehicle = await db.vehicle.create({
      data: {
        plate: '29A-00002',
        qrCode: 'qr-2',
        rfidCode: 'rfid-2',
        vehicleTypeCode: 'MOTORBIKE',
        ownerId: fixture.student.id,
      },
    })

    const closed = await openSession(fixture.zoneA.id, fixture.staff.id)
    await db.parkingSession.update({ where: { id: closed.id }, data: { status: 'CLOSED', exitTime: NOW } })

    await pendingReservation(fixture.zoneA.id, fixture.student.id, vehicle.id, HOLD_UNTIL)
    await db.reservation.create({
      data: {
        customerId: fixture.student.id,
        vehicleId: vehicle.id,
        zoneId: fixture.zoneA.id,
        vehicleTypeCode: 'MOTORBIKE',
        arrivalTime: NOW,
        holdUntil: HOLD_UNTIL,
        status: 'CANCELLED',
      },
    })
    await db.reservation.create({
      data: {
        customerId: fixture.student.id,
        vehicleId: vehicle.id,
        zoneId: fixture.zoneA.id,
        vehicleTypeCode: 'MOTORBIKE',
        arrivalTime: NOW,
        holdUntil: new Date('2026-01-01T09:00:00Z'), // expired, before NOW
        status: 'PENDING',
      },
    })

    const moto = await getFree(db, fixture.zoneA.id, 'MOTORBIKE', NOW)
    expect(moto).toBe(1) // capacity 2 - 0 open - 1 pending (unexpired) reservation
  })

  it('never returns negative free when capacity lowered below occupancy', async () => {
    await resetDb()
    const fixture = await makeFixture()

    await openSession(fixture.zoneA.id, fixture.staff.id)
    await openSession(fixture.zoneA.id, fixture.staff.id)

    await db.zoneCapacity.update({
      where: { zoneId_vehicleTypeCode: { zoneId: fixture.zoneA.id, vehicleTypeCode: 'MOTORBIKE' } },
      data: { capacity: 1 },
    })

    expect(await getFree(db, fixture.zoneA.id, 'MOTORBIKE', NOW)).toBe(0)
  })

  it('reports SUSPENDED lot status with normal counts', async () => {
    await resetDb()
    const fixture = await makeFixture()
    await db.parkingLot.update({ where: { id: fixture.lot.id }, data: { status: 'SUSPENDED' } })

    const a = await getAvailability(db, NOW)
    expect(a[0].status).toBe('SUSPENDED')
    const moto = a[0].zones.find((z) => z.zoneName === 'A')!.byType.find((t) => t.vehicleType === 'MOTORBIKE')!
    expect(moto).toMatchObject({ capacity: 2, open: 0, reserved: 0, free: 2 })
  })

  it('expires stale PENDING reservations before reporting availability', async () => {
    await resetDb()
    const fixture = await makeFixture()
    const vehicle = await db.vehicle.create({
      data: {
        plate: '29A-00009',
        qrCode: 'qr-stale',
        rfidCode: 'rfid-stale',
        vehicleTypeCode: 'MOTORBIKE',
        ownerId: fixture.student.id,
      },
    })
    const stale = await pendingReservation(fixture.zoneA.id, fixture.student.id, vehicle.id, NOW)

    const a = await getAvailability(db, NOW)
    const moto = a[0].zones.find((z) => z.zoneName === 'A')!.byType.find((t) => t.vehicleType === 'MOTORBIKE')!
    expect(moto).toMatchObject({ reserved: 0, free: 2 })
    expect((await db.reservation.findUnique({ where: { id: stale.id } }))?.status).toBe('NO_SHOW')
  })

  it('publishes availability:changed when the read expires a hold, and only then', async () => {
    await resetDb()
    const fixture = await makeFixture()
    const vehicle = await db.vehicle.create({
      data: {
        plate: '29A-00010',
        qrCode: 'qr-pub',
        rfidCode: 'rfid-pub',
        vehicleTypeCode: 'MOTORBIKE',
        ownerId: fixture.student.id,
      },
    })
    await pendingReservation(fixture.zoneA.id, fixture.student.id, vehicle.id, NOW)

    let events = 0
    const off = onAvailabilityChanged(() => {
      events++
    })
    try {
      await getAvailability(db, NOW)
      expect(events).toBe(1)
      // Nothing left to expire: a second read must not broadcast again.
      await getAvailability(db, NOW)
      expect(events).toBe(1)
    } finally {
      off()
    }
  })
})

/**
 * Runs `action` while counting `availability:changed` broadcasts, so a test
 * can assert that a mutation reaches the SSE stream (RT-01).
 */
async function countBroadcasts(action: () => Promise<unknown>): Promise<number> {
  let events = 0
  const off = onAvailabilityChanged(() => {
    events++
  })
  try {
    await action()
  } finally {
    off()
  }
  return events
}

// A fixed local noon keeps a +1 h arrival inside the same local day.
const LOCAL_NOON = new Date(2026, 0, 1, 12, 0, 0, 0)
const ARRIVAL = new Date(LOCAL_NOON.getTime() + 60 * 60 * 1000)

describe('availability broadcast on every event that changes free (FR-18, RT-01, A-49)', () => {
  it('entry: broadcasts and decrements free by 1 in the entered zone only', async () => {
    await resetDb()
    const f = await makeFixture()
    const vehicle = await addVehicle(db, { ownerId: f.student.id, plate: '51F-401.01', vehicleType: 'MOTORBIKE' })
    const freeA = await getFree(db, f.zoneA.id, 'MOTORBIKE')
    const freeB = await getFree(db, f.zoneB.id, 'MOTORBIKE')

    const events = await countBroadcasts(() =>
      recordEntry(db, { method: 'QR', identifier: vehicle.qrCode, zoneId: f.zoneA.id, staffId: f.staff.id }),
    )

    expect(events).toBeGreaterThanOrEqual(1)
    expect(await getFree(db, f.zoneA.id, 'MOTORBIKE')).toBe(freeA - 1)
    expect(await getFree(db, f.zoneB.id, 'MOTORBIKE')).toBe(freeB)
  })

  it('exit: broadcasts and increments free by 1', async () => {
    await resetDb()
    const f = await makeFixture()
    const vehicle = await addVehicle(db, { ownerId: f.student.id, plate: '51F-402.02', vehicleType: 'MOTORBIKE' })
    const session = await recordEntry(db, {
      method: 'QR',
      identifier: vehicle.qrCode,
      zoneId: f.zoneA.id,
      staffId: f.staff.id,
    })
    const freeBefore = await getFree(db, f.zoneA.id, 'MOTORBIKE')

    const events = await countBroadcasts(() =>
      confirmExit(db, {
        sessionId: session.id,
        observedPlate: '51F-402.02',
        confirmMismatch: false,
        lostCard: false,
        staffId: f.staff.id,
      }),
    )

    expect(events).toBe(1)
    expect(await getFree(db, f.zoneA.id, 'MOTORBIKE')).toBe(freeBefore + 1)
  })

  it('reservation: broadcasts and decrements free by 1', async () => {
    await resetDb()
    const f = await makeFixture()
    const vehicle = await addVehicle(db, { ownerId: f.student.id, plate: '51F-403.03', vehicleType: 'MOTORBIKE' })
    const freeBefore = await getFree(db, f.zoneA.id, 'MOTORBIKE', LOCAL_NOON)

    const events = await countBroadcasts(() =>
      createReservation(db, {
        customerId: f.student.id,
        vehicleId: vehicle.id,
        zoneId: f.zoneA.id,
        arrivalTime: ARRIVAL,
        now: LOCAL_NOON,
      }),
    )

    expect(events).toBe(1)
    expect(await getFree(db, f.zoneA.id, 'MOTORBIKE', LOCAL_NOON)).toBe(freeBefore - 1)
  })

  it('cancellation: broadcasts and gives the held spot back', async () => {
    await resetDb()
    const f = await makeFixture()
    const vehicle = await addVehicle(db, { ownerId: f.student.id, plate: '51F-404.04', vehicleType: 'MOTORBIKE' })
    const freeBefore = await getFree(db, f.zoneA.id, 'MOTORBIKE', LOCAL_NOON)
    const reservation = await createReservation(db, {
      customerId: f.student.id,
      vehicleId: vehicle.id,
      zoneId: f.zoneA.id,
      arrivalTime: ARRIVAL,
      now: LOCAL_NOON,
    })

    const events = await countBroadcasts(() =>
      cancelReservation(db, { customerId: f.student.id, reservationId: reservation.id, now: LOCAL_NOON }),
    )

    expect(events).toBe(1)
    expect(await getFree(db, f.zoneA.id, 'MOTORBIKE', LOCAL_NOON)).toBe(freeBefore)
  })

  it('capacity change: broadcasts and free follows the new capacity', async () => {
    await resetDb()
    const f = await makeFixture({ motoCapA: 2 })

    const events = await countBroadcasts(() =>
      updateZone(db, f.manager.id, f.zoneA.id, { capacities: { MOTORBIKE: 5 } }),
    )

    expect(events).toBe(1)
    expect(await getFree(db, f.zoneA.id, 'MOTORBIKE')).toBe(5)
  })

  it('lot suspension: broadcasts so every open view shows the new status', async () => {
    await resetDb()
    const f = await makeFixture()

    const events = await countBroadcasts(() => updateLot(db, f.manager.id, f.lot.id, { status: 'SUSPENDED' }))

    expect(events).toBeGreaterThanOrEqual(1)
    const [lot] = await getAvailability(db)
    expect(lot.status).toBe('SUSPENDED')
  })
})
