import { describe, it, expect } from 'vitest'
import { db } from '@/server/db'
import { resetDb, makeFixture } from './helpers/db'
import { addVehicle } from '@/server/services/vehicles'
import { recordEntry } from '@/server/services/entry'
import { previewExit, confirmExit } from '@/server/services/exit'

async function openSession(zoneId: string, staffId: string, ownerId: string, plate: string) {
  const vehicle = await addVehicle(db, { ownerId, plate, vehicleType: 'MOTORBIKE' })
  const session = await recordEntry(db, { method: 'QR', identifier: vehicle.qrCode, zoneId, staffId })
  return { vehicle, session }
}

describe('exit', () => {
  it('closes session and creates CONFIRMED payment with group fee', async () => {
    await resetDb()
    const f = await makeFixture({ tariffs: { MOTORBIKE_STUDENT: 3000 } })
    const { session } = await openSession(f.zoneA.id, f.staff.id, f.student.id, '51F-123.45')

    const { session: closed, payment } = await confirmExit(db, {
      sessionId: session.id,
      observedPlate: '51F-123.45',
      confirmMismatch: false,
      lostCard: false,
      staffId: f.staff.id,
    })

    expect(closed.status).toBe('CLOSED')
    expect(closed.exitStaffId).toBe(f.staff.id)
    expect(closed.exitTime).toBeInstanceOf(Date)
    expect(payment.amount).toBe(3000)
    expect(payment.status).toBe('CONFIRMED')
    expect(payment.confirmedById).toBe(f.staff.id)
    expect(await db.sessionEvent.count({ where: { sessionId: session.id } })).toBe(0)
    expect(await db.accessLog.findFirst({ where: { action: 'EXIT', target: session.id } })).not.toBeNull()
    expect(await db.accessLog.findFirst({ where: { action: 'MANUAL_CONFIRM', target: session.id } })).toBeNull()
  })

  it('preview flags plateMismatch when observed plate differs', async () => {
    await resetDb()
    const f = await makeFixture()
    const { vehicle } = await openSession(f.zoneA.id, f.staff.id, f.student.id, '51F-123.45')

    const match = await previewExit(db, { method: 'QR', identifier: vehicle.qrCode, observedPlate: '  51f-123.45 ' })
    expect(match.plateMismatch).toBe(false)
    expect(match.fee).toBe(2000)
    expect(match.zoneName).toBe('A')
    expect(match.feeGroup).toBe('STUDENT')

    const mismatch = await previewExit(db, { method: 'QR', identifier: vehicle.qrCode, observedPlate: '99Z-99999' })
    expect(mismatch.plateMismatch).toBe(true)
  })

  it('EX-02 confirm without confirmMismatch -> PLATE_MISMATCH; with it -> closed + PLATE_MISMATCH_CONFIRMED event', async () => {
    await resetDb()
    const f = await makeFixture()
    const { session } = await openSession(f.zoneA.id, f.staff.id, f.student.id, '51F-123.45')

    await expect(
      confirmExit(db, {
        sessionId: session.id,
        observedPlate: '99Z-99999',
        confirmMismatch: false,
        lostCard: false,
        staffId: f.staff.id,
      }),
    ).rejects.toMatchObject({ code: 'PLATE_MISMATCH' })

    const { session: closed } = await confirmExit(db, {
      sessionId: session.id,
      observedPlate: '99Z-99999',
      confirmMismatch: true,
      lostCard: false,
      staffId: f.staff.id,
    })

    expect(closed.status).toBe('CLOSED')
    const event = await db.sessionEvent.findFirst({ where: { sessionId: session.id, type: 'PLATE_MISMATCH_CONFIRMED' } })
    expect(event).not.toBeNull()
    expect(event?.note).toContain('99Z-99999')
    expect(await db.accessLog.findFirst({ where: { action: 'MANUAL_CONFIRM', target: session.id } })).not.toBeNull()
  })

  it('EX-03 lostCard via PLATE -> LOST_CARD event + payment + closed', async () => {
    await resetDb()
    const f = await makeFixture()
    const { session } = await openSession(f.zoneA.id, f.staff.id, f.student.id, '51F-123.45')

    const { session: closed, payment } = await confirmExit(db, {
      sessionId: session.id,
      observedPlate: '51F-123.45',
      confirmMismatch: false,
      lostCard: true,
      staffId: f.staff.id,
    })

    expect(closed.status).toBe('CLOSED')
    expect(payment.status).toBe('CONFIRMED')
    const event = await db.sessionEvent.findFirst({ where: { sessionId: session.id, type: 'LOST_CARD' } })
    expect(event).not.toBeNull()
    expect(await db.accessLog.findFirst({ where: { action: 'MANUAL_CONFIRM', target: session.id } })).not.toBeNull()
  })

  it('NO_OPEN_SESSION when vehicle has no open session', async () => {
    await resetDb()
    const f = await makeFixture()
    const vehicle = await addVehicle(db, { ownerId: f.student.id, plate: '51F-123.45', vehicleType: 'MOTORBIKE' })

    await expect(
      previewExit(db, { method: 'QR', identifier: vehicle.qrCode, observedPlate: '51F-123.45' }),
    ).rejects.toMatchObject({ code: 'NO_OPEN_SESSION' })
  })

  it('exit allowed while lot SUSPENDED', async () => {
    await resetDb()
    const f = await makeFixture()
    const { session } = await openSession(f.zoneA.id, f.staff.id, f.student.id, '51F-123.45')
    await db.parkingLot.update({ where: { id: f.lot.id }, data: { status: 'SUSPENDED' } })

    const { session: closed } = await confirmExit(db, {
      sessionId: session.id,
      observedPlate: '51F-123.45',
      confirmMismatch: false,
      lostCard: false,
      staffId: f.staff.id,
    })

    expect(closed.status).toBe('CLOSED')
  })

  it('fee uses feeGroup snapshotted at entry even if vehicle later claimed by a customer', async () => {
    await resetDb()
    const f = await makeFixture({ tariffs: { MOTORBIKE_GUEST: 7000, MOTORBIKE_STUDENT: 3000 } })

    const session = await recordEntry(db, {
      method: 'PLATE',
      identifier: '99Z-00000',
      zoneId: f.zoneA.id,
      vehicleType: 'MOTORBIKE',
      staffId: f.staff.id,
    })
    expect(session.feeGroup).toBe('GUEST')

    // A student later claims the guest vehicle.
    await addVehicle(db, { ownerId: f.student.id, plate: '99Z-00000', vehicleType: 'MOTORBIKE' })

    const { payment } = await confirmExit(db, {
      sessionId: session.id,
      observedPlate: '99Z-00000',
      confirmMismatch: false,
      lostCard: false,
      staffId: f.staff.id,
    })

    expect(payment.amount).toBe(7000)
  })
})
