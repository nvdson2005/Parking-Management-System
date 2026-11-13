/**
 * A-77 — Đối chiếu 4 chỉ số báo cáo (D-30) với số tính tay trên dữ liệu mẫu.
 *
 * Dữ liệu mẫu, ngày D = 10/11/2026 (giờ địa phương), tổng sức chứa = 10:
 *   S1 07:10-09:40  S2 07:50-08:20  S3 08:05-10:15  S4 08:40-12:00 (ô tô)
 *   S5 08:55-đang gửi  S6 09:20-09:50  S7 13:00-14:10 (ô tô)  S8 22:30-00:40 (D+1)
 *   Thanh toán = giờ ra: xe máy 2.000, ô tô 10.000.
 *   Đặt chỗ: R1-R3 FULFILLED, R4 NO_SHOW, R5-R6 CANCELLED,
 *            R7 PENDING đã quá hạn giữ chỗ, R8 NO_SHOW ngày D+1.
 */
import { describe, it, expect, beforeAll } from 'vitest'
import { db } from '@/server/db'
import { resetDb, makeFixture } from './helpers/db'
import { buildReport } from '@/server/services/reports'

const Y = 2026
const M = 10 // tháng 11 (0-based)
const D = 10

function local(day: number, hour: number, minute = 0): Date {
  return new Date(Y, M, day, hour, minute, 0, 0)
}

async function seedA77() {
  const f = await makeFixture({ motoCapA: 6, carCapC: 2 })

  const sessions: Array<[string, 'MOTORBIKE' | 'CAR', Date, Date | null, number | null]> = [
    ['S1', 'MOTORBIKE', local(D, 7, 10), local(D, 9, 40), 2000],
    ['S2', 'MOTORBIKE', local(D, 7, 50), local(D, 8, 20), 2000],
    ['S3', 'MOTORBIKE', local(D, 8, 5), local(D, 10, 15), 2000],
    ['S4', 'CAR', local(D, 8, 40), local(D, 12, 0), 10000],
    ['S5', 'MOTORBIKE', local(D, 8, 55), null, null],
    ['S6', 'MOTORBIKE', local(D, 9, 20), local(D, 9, 50), 2000],
    ['S7', 'CAR', local(D, 13, 0), local(D, 14, 10), 10000],
    ['S8', 'MOTORBIKE', local(D, 22, 30), local(D + 1, 0, 40), 2000],
  ]
  for (const [code, type, entry, exit, amount] of sessions) {
    const s = await db.parkingSession.create({
      data: {
        plateSnapshot: `A77-${code}`,
        zoneId: type === 'CAR' ? f.zoneC.id : f.zoneA.id,
        vehicleTypeCode: type,
        feeGroup: 'GUEST',
        idMethod: 'PLATE',
        entryTime: entry,
        exitTime: exit,
        entryStaffId: f.staff.id,
        exitStaffId: exit ? f.staff.id : null,
        status: exit ? 'CLOSED' : 'OPEN',
      },
    })
    if (exit && amount !== null) {
      await db.payment.create({
        data: { sessionId: s.id, amount, status: 'CONFIRMED', paidAt: exit, confirmedById: f.manager.id },
      })
    }
  }

  const { addVehicle } = await import('@/server/services/vehicles')
  const reservations: Array<[Date, string]> = [
    [local(D, 8), 'FULFILLED'], // R1
    [local(D, 9), 'FULFILLED'], // R2
    [local(D, 10), 'FULFILLED'], // R3
    [local(D, 11), 'NO_SHOW'], // R4
    [local(D, 12), 'CANCELLED'], // R5
    [local(D, 15), 'CANCELLED'], // R6
    [local(D, 16), 'PENDING'], // R7: quá hạn -> phải thành NO_SHOW khi lập báo cáo
    [local(D + 1, 9), 'NO_SHOW'], // R8: ngoài khoảng ngày D
  ]
  const ids: string[] = []
  for (let i = 0; i < reservations.length; i++) {
    const [arrival, status] = reservations[i]
    const v = await addVehicle(db, {
      ownerId: f.student.id,
      plate: `51F-777.0${i + 1}`,
      vehicleType: 'MOTORBIKE',
    })
    const r = await db.reservation.create({
      data: {
        customerId: f.student.id,
        vehicleId: v.id,
        zoneId: f.zoneA.id,
        vehicleTypeCode: 'MOTORBIKE',
        arrivalTime: arrival,
        holdUntil: new Date(arrival.getTime() + 30 * 60_000),
        status,
      },
    })
    ids.push(r.id)
  }
  return { r7Id: ids[6] }
}

describe('A-77 report vs hand calculation (D-30)', () => {
  let r7Id: string

  beforeAll(async () => {
    await resetDb()
    ;({ r7Id } = await seedA77())
  })

  it('QE-A77-01 utilisation by hour, day D', async () => {
    const report = await buildReport(db, { from: local(D, 0), to: local(D, 0) })
    // Số xe trong bãi tại h:30 / 10 (S2 không được đếm ở mốc nào — E-6)
    const expected: Record<number, number> = {
      0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0,
      7: 0.1, 8: 0.2, 9: 0.5, 10: 0.2, 11: 0.2, 12: 0.1, 13: 0.2,
      14: 0.1, 15: 0.1, 16: 0.1, 17: 0.1, 18: 0.1, 19: 0.1, 20: 0.1, 21: 0.1,
      22: 0.2, 23: 0.2,
    }
    const actual = Object.fromEntries(report.utilisationByHour.map((u) => [u.hour, u.rate]))
    expect(actual).toEqual(expected)
  })

  it('QE-A77-02 peak hours, day D (tie broken by earlier hour)', async () => {
    const report = await buildReport(db, { from: local(D, 0), to: local(D, 0) })
    expect(report.peakHours).toEqual([
      { hour: 8, entries: 3 },
      { hour: 7, entries: 2 },
      { hour: 9, entries: 1 },
    ])
  })

  it('QE-A77-03 revenue, day D = 28.000 (S8 paid on D+1 excluded)', async () => {
    const report = await buildReport(db, { from: local(D, 0), to: local(D, 0) })
    expect(report.revenue.total).toBe(28000)
    expect(report.revenue.byDate).toEqual([{ date: '2026-11-10', amount: 28000 }])
  })

  it('QE-A77-04 no-show rate, day D = 2 / (7 - 2) = 0.4', async () => {
    const report = await buildReport(db, { from: local(D, 0), to: local(D, 0) })
    expect(report.noShowRate).toBe(0.4)
    expect((await db.reservation.findUnique({ where: { id: r7Id } }))?.status).toBe('NO_SHOW')
  })

  it('QE-A77-05 day boundary, day D+1', async () => {
    const report = await buildReport(db, { from: local(D + 1, 0), to: local(D + 1, 0) })
    expect(report.revenue.total).toBe(2000)
    expect(report.revenue.byDate).toEqual([{ date: '2026-11-11', amount: 2000 }])
    expect(report.peakHours).toEqual([])
    expect(report.noShowRate).toBe(1)
    const byHour = Object.fromEntries(report.utilisationByHour.map((u) => [u.hour, u.rate]))
    expect(byHour[0]).toBe(0.2) // S5 + S8 (S8 ra 00:40)
    expect(byHour[1]).toBe(0.1) // chỉ S5
    expect(byHour[23]).toBe(0.1)
  })

  it('QE-A77-06 two-day range averages utilisation and sums revenue', async () => {
    const report = await buildReport(db, { from: local(D, 0), to: local(D + 1, 0) })
    const byHour = Object.fromEntries(report.utilisationByHour.map((u) => [u.hour, u.rate]))
    expect(byHour[9]).toBe(0.3) // (0.5 + 0.1) / 2
    expect(byHour[0]).toBe(0.1) // (0 + 0.2) / 2
    expect(report.revenue.total).toBe(30000)
    expect(report.noShowRate).toBe(0.5) // (2 + 1) / (8 - 2)
  })
})
