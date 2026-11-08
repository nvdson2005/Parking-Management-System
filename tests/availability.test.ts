import { describe, it, expect } from 'vitest'
import { db } from '@/server/db'
import { resetDb, makeFixture } from './helpers/db'
import { getAvailability, getFree } from '@/server/services/availability'

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
})
