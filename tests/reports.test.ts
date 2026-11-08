import { describe, it, expect } from 'vitest'
import { db } from '@/server/db'
import { resetDb, makeFixture } from './helpers/db'
import { buildReport } from '@/server/services/reports'

// A local calendar day used across the data cases. Using `new Date(y, m, d,
// h, min)` keeps every timestamp in the machine's local zone, matching the
// report's local-day/hour sampling.
const Y = 2025
const M = 5 // June (0-based)
const D = 15

function local(day: number, hour: number, minute = 0): Date {
  return new Date(Y, M, day, hour, minute, 0, 0)
}

async function makeSession(
  zoneId: string,
  staffId: string,
  plate: string,
  entryTime: Date,
  exitTime: Date | null,
) {
  return db.parkingSession.create({
    data: {
      plateSnapshot: plate,
      zoneId,
      vehicleTypeCode: 'MOTORBIKE',
      feeGroup: 'STUDENT',
      idMethod: 'QR',
      entryTime,
      exitTime,
      entryStaffId: staffId,
      status: exitTime ? 'CLOSED' : 'OPEN',
    },
  })
}

async function makePayment(
  sessionId: string,
  confirmedById: string,
  amount: number,
  paidAt: Date,
  status = 'CONFIRMED',
) {
  return db.payment.create({
    data: { sessionId, amount, status, paidAt, confirmedById },
  })
}

async function makeReservation(
  customerId: string,
  vehicleId: string,
  zoneId: string,
  arrivalTime: Date,
  status: string,
) {
  return db.reservation.create({
    data: {
      customerId,
      vehicleId,
      zoneId,
      vehicleTypeCode: 'MOTORBIKE',
      arrivalTime,
      holdUntil: new Date(arrivalTime.getTime() + 30 * 60_000),
      status,
    },
  })
}

/**
 * Seeds the brief's canonical one-day dataset: total capacity 5 (A2+B2+C1),
 * sessions S1 08:00-10:00 and S2 09:00-open, payments 2000 + 3000 on D, and
 * reservations 1 NO_SHOW + 1 FULFILLED + 1 CANCELLED.
 */
async function seedCanonical() {
  const f = await makeFixture()

  const s1 = await makeSession(f.zoneA.id, f.staff.id, '51F-000.01', local(D, 8), local(D, 10))
  const s2 = await makeSession(f.zoneA.id, f.staff.id, '51F-000.02', local(D, 9), null)

  await makePayment(s1.id, f.manager.id, 2000, local(D, 10))
  await makePayment(s2.id, f.manager.id, 3000, local(D, 12))

  const { addVehicle } = await import('@/server/services/vehicles')
  const v1 = await addVehicle(db, { ownerId: f.student.id, plate: '51F-100.01', vehicleType: 'MOTORBIKE' })
  const v2 = await addVehicle(db, { ownerId: f.student.id, plate: '51F-100.02', vehicleType: 'MOTORBIKE' })
  const v3 = await addVehicle(db, { ownerId: f.student.id, plate: '51F-100.03', vehicleType: 'MOTORBIKE' })

  await makeReservation(f.student.id, v1.id, f.zoneA.id, local(D, 8), 'NO_SHOW')
  await makeReservation(f.student.id, v2.id, f.zoneA.id, local(D, 8), 'FULFILLED')
  await makeReservation(f.student.id, v3.id, f.zoneA.id, local(D, 8), 'CANCELLED')

  return f
}

describe('buildReport', () => {
  it('utilisation hour 9 = 2/5 = 0.4, hour 8 = 0.2, hour 11 = 0.2', async () => {
    await resetDb()
    await seedCanonical()

    const report = await buildReport(db, { from: local(D, 0), to: local(D, 23) })

    const byHour = Object.fromEntries(report.utilisationByHour.map((u) => [u.hour, u.rate]))
    expect(byHour[8]).toBe(0.2)
    expect(byHour[9]).toBe(0.4)
    expect(byHour[11]).toBe(0.2)
    expect(byHour[7]).toBe(0)
    expect(report.utilisationByHour).toHaveLength(24)
  })

  it('peakHours top entry hours = [8, 9]', async () => {
    await resetDb()
    await seedCanonical()

    const report = await buildReport(db, { from: local(D, 0), to: local(D, 23) })

    expect(report.peakHours.map((p) => p.hour)).toEqual([8, 9])
    expect(report.peakHours.every((p) => p.entries === 1)).toBe(true)
  })

  it('revenue total 5000, byDate [{date: D, amount: 5000}]', async () => {
    await resetDb()
    await seedCanonical()

    const report = await buildReport(db, { from: local(D, 0), to: local(D, 23) })

    expect(report.revenue.total).toBe(5000)
    expect(report.revenue.byDate).toEqual([{ date: '2025-06-15', amount: 5000 }])
  })

  it('noShowRate = 1 / (3 - 1) = 0.5', async () => {
    await resetDb()
    await seedCanonical()

    const report = await buildReport(db, { from: local(D, 0), to: local(D, 23) })

    expect(report.noShowRate).toBe(0.5)
  })

  it('empty range -> zeros and noShowRate null', async () => {
    await resetDb()
    await makeFixture()

    const report = await buildReport(db, { from: local(D, 0), to: local(D, 23) })

    expect(report.utilisationByHour).toHaveLength(24)
    expect(report.utilisationByHour.every((u) => u.rate === 0)).toBe(true)
    expect(report.peakHours).toEqual([])
    expect(report.revenue.total).toBe(0)
    expect(report.revenue.byDate).toEqual([])
    expect(report.noShowRate).toBeNull()
  })

  it('from > to -> VALIDATION', async () => {
    await resetDb()
    await makeFixture()

    await expect(
      buildReport(db, { from: local(D + 1, 0), to: local(D, 0) }),
    ).rejects.toMatchObject({ code: 'VALIDATION' })
  })
})
