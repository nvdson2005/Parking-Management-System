import { describe, it, expect, beforeEach } from 'vitest'
import { db } from '@/server/db'
import { resetDb, makeFixture, type Fixture } from './helpers/db'
import { staffLookup } from '@/server/services/lookup'
import { listActiveReservations } from '@/server/services/reservations'
import { addMinutes } from '@/lib/time'

// A-65, G-08 (Q34): staff see vehicle, session and reservation information.

let f: Fixture

async function vehicle(plate: string, ownerId: string | null, type: 'MOTORBIKE' | 'CAR' = 'MOTORBIKE') {
  return db.vehicle.create({
    data: { plate, qrCode: `QR-${plate}`, rfidCode: `RFID-${plate}`, vehicleTypeCode: type, ownerId },
  })
}

async function reservation(vehicleId: string, zoneId: string, arrivalTime: Date, holdUntil: Date) {
  return db.reservation.create({
    data: {
      customerId: f.student.id,
      vehicleId,
      zoneId,
      vehicleTypeCode: 'MOTORBIKE',
      arrivalTime,
      holdUntil,
      status: 'PENDING',
    },
  })
}

describe('staffLookup (A-65, G-08)', () => {
  beforeEach(async () => {
    await resetDb()
    f = await makeFixture()
  })

  it('finds a vehicle by plate regardless of separators and returns its active reservation', async () => {
    const v = await vehicle('51F-123.45', f.student.id)
    const now = new Date()
    const r = await reservation(v.id, f.zoneA.id, addMinutes(now, 30), addMinutes(now, 60))

    const result = await staffLookup(db, { method: 'PLATE', identifier: '51f 123 45', viewerId: f.staff.id })

    expect(result.vehicle).toEqual({ id: v.id, plate: '51F-123.45', vehicleTypeCode: 'MOTORBIKE', hasOwner: true })
    expect(result.openSession).toBeNull()
    expect(result.activeReservation).toEqual({
      id: r.id,
      zoneName: 'A',
      arrivalTime: r.arrivalTime,
      holdUntil: r.holdUntil,
    })
  })

  it('finds the same vehicle by QR and by RFID', async () => {
    const v = await vehicle('51F-222.22', null)
    const byQr = await staffLookup(db, { method: 'QR', identifier: 'qr-51f-222.22', viewerId: f.staff.id })
    const byRfid = await staffLookup(db, { method: 'RFID', identifier: v.rfidCode, viewerId: f.staff.id })
    expect(byQr.vehicle.id).toBe(v.id)
    expect(byRfid.vehicle.id).toBe(v.id)
    expect(byQr.vehicle.hasOwner).toBe(false)
  })

  it('returns the open session of a parked vehicle', async () => {
    const v = await vehicle('51F-333.33', null)
    const entryTime = new Date('2026-11-23T08:00:00.000Z')
    const s = await db.parkingSession.create({
      data: {
        vehicleId: v.id,
        plateSnapshot: v.plate,
        zoneId: f.zoneB.id,
        vehicleTypeCode: 'MOTORBIKE',
        feeGroup: 'GUEST',
        idMethod: 'QR',
        entryTime,
        entryStaffId: f.staff.id,
        status: 'OPEN',
      },
    })

    const result = await staffLookup(db, { method: 'PLATE', identifier: '51F-333.33', viewerId: f.staff.id })
    expect(result.openSession).toEqual({ id: s.id, zoneName: 'B', entryTime, idMethod: 'QR' })
    expect(result.activeReservation).toBeNull()
  })

  it('does not report an expired hold as active and marks it NO_SHOW', async () => {
    const v = await vehicle('51F-444.44', f.student.id)
    const now = new Date()
    const r = await reservation(v.id, f.zoneA.id, addMinutes(now, -60), addMinutes(now, -30))

    const result = await staffLookup(db, { method: 'PLATE', identifier: '51F-444.44', viewerId: f.staff.id })
    expect(result.activeReservation).toBeNull()
    expect((await db.reservation.findUnique({ where: { id: r.id } }))?.status).toBe('NO_SHOW')
  })

  it('throws NOT_FOUND for an unknown identifier and logs nothing', async () => {
    const before = await db.accessLog.count()
    await expect(
      staffLookup(db, { method: 'PLATE', identifier: '99Z-999.99', viewerId: f.staff.id }),
    ).rejects.toMatchObject({ code: 'NOT_FOUND' })
    expect(await db.accessLog.count()).toBe(before)
  })

  it('logs one VIEW_FULL_PLATE row for the staff member on a successful lookup', async () => {
    const v = await vehicle('51F-555.55', null)
    await staffLookup(db, { method: 'PLATE', identifier: '51F-555.55', viewerId: f.staff.id })
    const logs = await db.accessLog.findMany({ where: { action: 'VIEW_FULL_PLATE' } })
    expect(logs).toHaveLength(1)
    expect(logs[0]).toMatchObject({ userId: f.staff.id, target: `vehicle:${v.id}` })
  })

  it('rejects an empty identifier or an unknown method', async () => {
    await expect(staffLookup(db, { method: 'PLATE', identifier: '  ', viewerId: f.staff.id })).rejects.toThrow()
    await expect(
      staffLookup(db, { method: 'BARCODE' as 'PLATE', identifier: 'x', viewerId: f.staff.id }),
    ).rejects.toThrow()
  })
})

describe('listActiveReservations (A-65, G-08)', () => {
  beforeEach(async () => {
    await resetDb()
    f = await makeFixture()
  })

  it('lists only unexpired PENDING holds, earliest arrival first, optionally by zone', async () => {
    const now = new Date()
    const v1 = await vehicle('51F-600.01', f.student.id)
    const v2 = await vehicle('51F-600.02', f.student.id)
    const v3 = await vehicle('51F-600.03', f.student.id)
    const late = await reservation(v1.id, f.zoneA.id, addMinutes(now, 90), addMinutes(now, 120))
    const early = await reservation(v2.id, f.zoneB.id, addMinutes(now, 10), addMinutes(now, 40))
    await reservation(v3.id, f.zoneA.id, addMinutes(now, -60), addMinutes(now, -30)) // expired
    const cancelled = await reservation(v3.id, f.zoneA.id, addMinutes(now, 20), addMinutes(now, 50))
    await db.reservation.update({ where: { id: cancelled.id }, data: { status: 'CANCELLED' } })

    const all = await listActiveReservations(db, {})
    expect(all.map((r) => r.id)).toEqual([early.id, late.id])
    expect(all[0]).toMatchObject({ plate: '51F-600.02', zoneId: f.zoneB.id, zoneName: 'B', vehicleTypeCode: 'MOTORBIKE' })

    const zoneA = await listActiveReservations(db, { zoneId: f.zoneA.id })
    expect(zoneA.map((r) => r.id)).toEqual([late.id])
  })
})
