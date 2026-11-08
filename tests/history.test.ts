import { describe, it, expect } from 'vitest'
import { db } from '@/server/db'
import { resetDb, makeFixture } from './helpers/db'
import { addVehicle, removeVehicle } from '@/server/services/vehicles'
import { recordEntry } from '@/server/services/entry'
import { confirmExit } from '@/server/services/exit'
import { customerHistory, allPayments } from '@/server/services/history'

async function openAndClose(
  zoneId: string,
  staffId: string,
  ownerId: string,
  plate: string,
  entryTime: Date,
  exitTime: Date,
) {
  const vehicle = await addVehicle(db, { ownerId, plate, vehicleType: 'MOTORBIKE' })
  const session = await recordEntry(db, {
    method: 'QR',
    identifier: vehicle.qrCode,
    zoneId,
    staffId,
    now: entryTime,
  })
  const { session: closed, payment } = await confirmExit(db, {
    sessionId: session.id,
    observedPlate: plate,
    confirmMismatch: false,
    lostCard: false,
    staffId,
    now: exitTime,
  })
  return { vehicle, session: closed, payment }
}

describe('customerHistory', () => {
  it('returns only the customer own-vehicle sessions, newest first, with amounts', async () => {
    await resetDb()
    const f = await makeFixture()

    const { session: older, payment: payOlder } = await openAndClose(
      f.zoneA.id,
      f.staff.id,
      f.student.id,
      '51F-111.11',
      new Date('2025-01-01T08:00:00Z'),
      new Date('2025-01-01T10:00:00Z'),
    )
    const { session: newer, payment: payNewer } = await openAndClose(
      f.zoneB.id,
      f.staff.id,
      f.student.id,
      '51F-222.22',
      new Date('2025-02-01T08:00:00Z'),
      new Date('2025-02-01T10:00:00Z'),
    )
    // Another customer's session must not leak into the student's history.
    await openAndClose(
      f.zoneA.id,
      f.staff.id,
      f.lecturer.id,
      '51F-333.33',
      new Date('2025-03-01T08:00:00Z'),
      new Date('2025-03-01T10:00:00Z'),
    )

    const history = await customerHistory(db, f.student.id)

    expect(history).toHaveLength(2)
    expect(history[0].sessionId).toBe(newer.id)
    expect(history[0].plate).toBe('51F-222.22')
    expect(history[0].zoneName).toBe('B')
    expect(history[0].entryTime).toEqual(newer.entryTime)
    expect(history[0].exitTime).toEqual(newer.exitTime)
    expect(history[0].amount).toBe(payNewer.amount)
    expect(history[0].paidAt).toEqual(payNewer.paidAt)

    expect(history[1].sessionId).toBe(older.id)
    expect(history[1].amount).toBe(payOlder.amount)
  })

  it('includes sessions still open, with null exit/amount/paidAt', async () => {
    await resetDb()
    const f = await makeFixture()
    const vehicle = await addVehicle(db, { ownerId: f.student.id, plate: '51F-444.44', vehicleType: 'MOTORBIKE' })
    const session = await recordEntry(db, {
      method: 'QR',
      identifier: vehicle.qrCode,
      zoneId: f.zoneA.id,
      staffId: f.staff.id,
    })

    const history = await customerHistory(db, f.student.id)

    expect(history).toHaveLength(1)
    expect(history[0].sessionId).toBe(session.id)
    expect(history[0].exitTime).toBeNull()
    expect(history[0].amount).toBeNull()
    expect(history[0].paidAt).toBeNull()
  })

  it('excludes sessions of a vehicle the customer no longer owns', async () => {
    await resetDb()
    const f = await makeFixture()
    const { vehicle, session } = await openAndClose(
      f.zoneA.id,
      f.staff.id,
      f.student.id,
      '51F-555.55',
      new Date('2025-01-01T08:00:00Z'),
      new Date('2025-01-01T10:00:00Z'),
    )
    expect(session).toBeTruthy()

    // History has a session, so removeVehicle unlinks ownership rather than deleting.
    await removeVehicle(db, f.student.id, vehicle.id)

    const history = await customerHistory(db, f.student.id)
    expect(history).toHaveLength(0)
  })
})

describe('allPayments', () => {
  it('returns all payments newest first', async () => {
    await resetDb()
    const f = await makeFixture()

    const { payment: pay1 } = await openAndClose(
      f.zoneA.id,
      f.staff.id,
      f.student.id,
      '51F-666.66',
      new Date('2025-01-01T08:00:00Z'),
      new Date('2025-01-01T10:00:00Z'),
    )
    const { payment: pay2 } = await openAndClose(
      f.zoneB.id,
      f.staff.id,
      f.lecturer.id,
      '51F-777.77',
      new Date('2025-02-01T08:00:00Z'),
      new Date('2025-02-01T10:00:00Z'),
    )

    const payments = await allPayments(db, {})

    expect(payments).toHaveLength(2)
    expect(payments[0].paymentId).toBe(pay2.id)
    expect(payments[0].plateSnapshot).toBe('51F-777.77')
    expect(payments[0].amount).toBe(pay2.amount)
    expect(payments[0].confirmedByName).toBe(f.staff.name)
    expect(payments[0].zoneName).toBe('B')
    expect(payments[1].paymentId).toBe(pay1.id)
  })

  it('filters inclusively by paidAt range', async () => {
    await resetDb()
    const f = await makeFixture()

    const { payment: pay1 } = await openAndClose(
      f.zoneA.id,
      f.staff.id,
      f.student.id,
      '51F-888.88',
      new Date('2025-01-01T08:00:00Z'),
      new Date('2025-01-01T10:00:00Z'),
    )
    await openAndClose(
      f.zoneA.id,
      f.staff.id,
      f.student.id,
      '51F-999.99',
      new Date('2025-02-01T08:00:00Z'),
      new Date('2025-02-01T10:00:00Z'),
    )

    const payments = await allPayments(db, {
      from: new Date('2025-01-01T10:00:00Z'),
      to: new Date('2025-01-31T00:00:00Z'),
    })

    expect(payments).toHaveLength(1)
    expect(payments[0].paymentId).toBe(pay1.id)
  })
})
