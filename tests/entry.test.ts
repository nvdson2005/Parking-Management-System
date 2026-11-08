import { describe, it, expect } from 'vitest'
import { db } from '@/server/db'
import { resetDb, makeFixture } from './helpers/db'
import { addVehicle } from '@/server/services/vehicles'
import { recordEntry } from '@/server/services/entry'

const HOUR = 60 * 60 * 1000

describe('recordEntry', () => {
  it('opens session for registered vehicle by QR with owner feeGroup and plate snapshot', async () => {
    await resetDb()
    const f = await makeFixture()
    const vehicle = await addVehicle(db, { ownerId: f.student.id, plate: '51F-123.45', vehicleType: 'MOTORBIKE' })

    const session = await recordEntry(db, {
      method: 'QR',
      identifier: vehicle.qrCode,
      zoneId: f.zoneA.id,
      staffId: f.staff.id,
    })

    expect(session.status).toBe('OPEN')
    expect(session.vehicleId).toBe(vehicle.id)
    expect(session.feeGroup).toBe('STUDENT')
    expect(session.plateSnapshot).toBe('51F-123.45')
    expect(session.idMethod).toBe('QR')
    expect(session.vehicleTypeCode).toBe('MOTORBIKE')
    expect(session.entryStaffId).toBe(f.staff.id)
  })

  it('creates guest vehicle for unknown plate with feeGroup GUEST', async () => {
    await resetDb()
    const f = await makeFixture()

    const session = await recordEntry(db, {
      method: 'PLATE',
      identifier: '99Z-00000',
      zoneId: f.zoneA.id,
      vehicleType: 'MOTORBIKE',
      staffId: f.staff.id,
    })

    expect(session.feeGroup).toBe('GUEST')
    expect(session.plateSnapshot).toBe('99Z-00000')
    const vehicle = await db.vehicle.findUnique({ where: { id: session.vehicleId! } })
    expect(vehicle?.ownerId).toBeNull()
    expect(vehicle?.qrCode).toMatch(/^QR-[A-Z2-7]{10}$/)
    expect(vehicle?.rfidCode).toMatch(/^RF-[A-Z2-7]{10}$/)
  })

  it('VALIDATION when required zoneId is missing', async () => {
    await resetDb()
    const f = await makeFixture()

    await expect(
      // zoneId absent, as a malformed JSON request body can provide.
      recordEntry(db, { method: 'PLATE', identifier: '59A-90000', vehicleType: 'MOTORBIKE', staffId: f.staff.id } as never),
    ).rejects.toMatchObject({ code: 'VALIDATION' })
  })

  it('VALIDATION for an unknown identification method', async () => {
    await resetDb()
    const f = await makeFixture()

    await expect(
      recordEntry(db, { method: 'BADGE', identifier: 'x', zoneId: f.zoneA.id, staffId: f.staff.id } as never),
    ).rejects.toMatchObject({ code: 'VALIDATION' })
  })

  it('requires vehicleType for an unknown plate', async () => {
    await resetDb()
    const f = await makeFixture()

    await expect(
      recordEntry(db, { method: 'PLATE', identifier: '88Z-11111', zoneId: f.zoneA.id, staffId: f.staff.id }),
    ).rejects.toMatchObject({ code: 'VALIDATION' })
  })

  it('finds existing vehicle when plate typed lowercase with spaces', async () => {
    await resetDb()
    const f = await makeFixture()
    const vehicle = await addVehicle(db, { ownerId: f.student.id, plate: '51F-123.45', vehicleType: 'MOTORBIKE' })

    const session = await recordEntry(db, {
      method: 'PLATE',
      identifier: '  51f 123.45 ',
      zoneId: f.zoneA.id,
      staffId: f.staff.id,
    })

    expect(session.vehicleId).toBe(vehicle.id)
    expect(await db.vehicle.count()).toBe(1)
  })

  it('UNKNOWN_CODE for unknown QR', async () => {
    await resetDb()
    const f = await makeFixture()

    await expect(
      recordEntry(db, { method: 'QR', identifier: 'QR-NOTACODE1', zoneId: f.zoneA.id, staffId: f.staff.id }),
    ).rejects.toMatchObject({ code: 'UNKNOWN_CODE' })
  })

  it('EX-01 ZONE_FULL when zone A (cap 2) has 2 open sessions', async () => {
    await resetDb()
    const f = await makeFixture()
    await recordEntry(db, { method: 'PLATE', identifier: '59A-00001', zoneId: f.zoneA.id, vehicleType: 'MOTORBIKE', staffId: f.staff.id })
    await recordEntry(db, { method: 'PLATE', identifier: '59A-00002', zoneId: f.zoneA.id, vehicleType: 'MOTORBIKE', staffId: f.staff.id })

    await expect(
      recordEntry(db, { method: 'PLATE', identifier: '59A-00003', zoneId: f.zoneA.id, vehicleType: 'MOTORBIKE', staffId: f.staff.id }),
    ).rejects.toMatchObject({ code: 'ZONE_FULL' })
  })

  it('EX-04 ALREADY_OPEN on second entry of same vehicle', async () => {
    await resetDb()
    const f = await makeFixture()
    const vehicle = await addVehicle(db, { ownerId: f.student.id, plate: '30A-77777', vehicleType: 'MOTORBIKE' })
    await recordEntry(db, { method: 'QR', identifier: vehicle.qrCode, zoneId: f.zoneA.id, staffId: f.staff.id })

    await expect(
      recordEntry(db, { method: 'QR', identifier: vehicle.qrCode, zoneId: f.zoneB.id, staffId: f.staff.id }),
    ).rejects.toMatchObject({ code: 'ALREADY_OPEN' })
  })

  it('EX-05 LOT_SUSPENDED when lot suspended', async () => {
    await resetDb()
    const f = await makeFixture()
    await db.parkingLot.update({ where: { id: f.lot.id }, data: { status: 'SUSPENDED' } })

    await expect(
      recordEntry(db, { method: 'PLATE', identifier: '59A-55555', zoneId: f.zoneA.id, vehicleType: 'MOTORBIKE', staffId: f.staff.id }),
    ).rejects.toMatchObject({ code: 'LOT_SUSPENDED' })
  })

  it('fulfils own pending reservation even when free is 0', async () => {
    await resetDb()
    const f = await makeFixture()
    // 1 open session fills one of 2 slots.
    await recordEntry(db, { method: 'PLATE', identifier: '59A-10001', zoneId: f.zoneA.id, vehicleType: 'MOTORBIKE', staffId: f.staff.id })

    const vehicle = await addVehicle(db, { ownerId: f.student.id, plate: '30A-22222', vehicleType: 'MOTORBIKE' })
    const now = new Date()
    const reservation = await db.reservation.create({
      data: {
        customerId: f.student.id,
        vehicleId: vehicle.id,
        zoneId: f.zoneA.id,
        vehicleTypeCode: 'MOTORBIKE',
        arrivalTime: new Date(now.getTime() + HOUR),
        holdUntil: new Date(now.getTime() + 2 * HOUR),
        status: 'PENDING',
      },
    })

    const session = await recordEntry(db, {
      method: 'PLATE',
      identifier: '30A-22222',
      zoneId: f.zoneA.id,
      staffId: f.staff.id,
      now,
    })

    expect(session.reservationId).toBe(reservation.id)
    const updated = await db.reservation.findUnique({ where: { id: reservation.id } })
    expect(updated?.status).toBe('FULFILLED')
  })

  it('early arrival (before arrivalTime, before holdUntil) still fulfils', async () => {
    await resetDb()
    const f = await makeFixture()
    const vehicle = await addVehicle(db, { ownerId: f.student.id, plate: '30A-33333', vehicleType: 'MOTORBIKE' })
    const now = new Date()
    const reservation = await db.reservation.create({
      data: {
        customerId: f.student.id,
        vehicleId: vehicle.id,
        zoneId: f.zoneA.id,
        vehicleTypeCode: 'MOTORBIKE',
        arrivalTime: new Date(now.getTime() + HOUR),
        holdUntil: new Date(now.getTime() + 2 * HOUR),
        status: 'PENDING',
      },
    })

    const session = await recordEntry(db, {
      method: 'QR',
      identifier: vehicle.qrCode,
      zoneId: f.zoneA.id,
      staffId: f.staff.id,
      now,
    })

    expect(session.reservationId).toBe(reservation.id)
    expect((await db.reservation.findUnique({ where: { id: reservation.id } }))?.status).toBe('FULFILLED')
  })

  it('entry into other zone cancels reservation and counts as walk-in', async () => {
    await resetDb()
    const f = await makeFixture()
    const vehicle = await addVehicle(db, { ownerId: f.student.id, plate: '30A-44444', vehicleType: 'MOTORBIKE' })
    const now = new Date()
    const reservation = await db.reservation.create({
      data: {
        customerId: f.student.id,
        vehicleId: vehicle.id,
        zoneId: f.zoneB.id,
        vehicleTypeCode: 'MOTORBIKE',
        arrivalTime: new Date(now.getTime() + HOUR),
        holdUntil: new Date(now.getTime() + 2 * HOUR),
        status: 'PENDING',
      },
    })

    const session = await recordEntry(db, {
      method: 'QR',
      identifier: vehicle.qrCode,
      zoneId: f.zoneA.id,
      staffId: f.staff.id,
      now,
    })

    expect(session.reservationId).toBeNull()
    expect(session.zoneId).toBe(f.zoneA.id)
    const cancelled = await db.reservation.findUnique({ where: { id: reservation.id } })
    expect(cancelled?.status).toBe('CANCELLED')
    expect(cancelled?.cancelReason).toBe('ENTERED_OTHER_ZONE')
    expect(cancelled?.cancelZoneId).toBe(f.zoneA.id)

    // The customer's list carries the zone they actually entered, for display.
    const { listReservations } = await import('@/server/services/reservations')
    const listed = (await listReservations(db, f.student.id)).find((r) => r.id === reservation.id)
    expect(listed?.cancelZoneName).toBe('A')
  })

  it('expires a stale reservation before the capacity check so the freed spot is usable', async () => {
    await resetDb()
    const f = await makeFixture({ carCapC: 1 })
    const reserved = await addVehicle(db, { ownerId: f.student.id, plate: '51A-030.30', vehicleType: 'CAR' })
    const now = new Date('2026-02-01T10:00:00Z')

    const stale = await db.reservation.create({
      data: {
        customerId: f.student.id,
        vehicleId: reserved.id,
        zoneId: f.zoneC.id,
        vehicleTypeCode: 'CAR',
        arrivalTime: new Date('2026-02-01T09:00:00Z'),
        holdUntil: new Date('2026-02-01T09:30:00Z'), // already elapsed at `now`
        status: 'PENDING',
      },
    })

    const session = await recordEntry(db, {
      method: 'PLATE',
      identifier: '51A-040.40',
      zoneId: f.zoneC.id,
      vehicleType: 'CAR',
      staffId: f.staff.id,
      now,
    })

    expect(session.status).toBe('OPEN')
    expect((await db.reservation.findUnique({ where: { id: stale.id } }))?.status).toBe('NO_SHOW')
  })

  it('20 concurrent entries into zone with cap 2 -> exactly 2 succeed', async () => {
    await resetDb()
    const f = await makeFixture()

    const results = await Promise.allSettled(
      Array.from({ length: 20 }, (_, i) =>
        recordEntry(db, {
          method: 'PLATE',
          identifier: `59X-${i}`,
          zoneId: f.zoneA.id,
          vehicleType: 'MOTORBIKE',
          staffId: f.staff.id,
        }),
      ),
    )

    expect(results.filter((r) => r.status === 'fulfilled')).toHaveLength(2)
  })
})
