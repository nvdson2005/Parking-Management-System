import type { Db } from '@/server/db'
import { DomainError } from '@/server/errors'
import { startOfLocalDay, endOfLocalDay } from '@/lib/time'

export type Report = {
  utilisationByHour: Array<{ hour: number; rate: number }>
  peakHours: Array<{ hour: number; entries: number }>
  revenue: { total: number; byDate: Array<{ date: string; amount: number }> }
  noShowRate: number | null
}

const HOURS = Array.from({ length: 24 }, (_, hour) => hour)

function round4(value: number): number {
  return Math.round(value * 10_000) / 10_000
}

function addLocalDays(d: Date, days: number): Date {
  const date = new Date(d)
  date.setDate(date.getDate() + days)
  return date
}

// `YYYY-MM-DD` in local time, matching the local-day grouping used for
// revenue (not `toISOString`, which would shift across the UTC boundary).
function localDateKey(d: Date): string {
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

/**
 * Builds the four MANAGER report metrics (D-30) over an inclusive local-date
 * range. `from`/`to` are interpreted as whole local calendar days; `from`
 * after `to` is a `VALIDATION` error.
 */
export async function buildReport(db: Db, input: { from: Date; to: Date }): Promise<Report> {
  const rangeStart = startOfLocalDay(input.from)
  const rangeEnd = endOfLocalDay(input.to)
  if (startOfLocalDay(input.from) > startOfLocalDay(input.to)) {
    throw new DomainError('VALIDATION', 'from must be on or before to')
  }

  const days: Date[] = []
  for (
    let day = startOfLocalDay(input.from);
    day <= startOfLocalDay(input.to);
    day = addLocalDays(day, 1)
  ) {
    days.push(new Date(day))
  }

  const capacityAgg = await db.zoneCapacity.aggregate({ _sum: { capacity: true } })
  const totalCapacity = capacityAgg._sum.capacity ?? 0

  // Any session entering after the range end cannot be occupied at any sample
  // instant inside the range, so it is excluded up front.
  const sessions = await db.parkingSession.findMany({
    where: { entryTime: { lte: rangeEnd } },
    select: { entryTime: true, exitTime: true },
  })

  const utilisationByHour = HOURS.map((hour) => {
    if (totalCapacity === 0) return { hour, rate: 0 }
    let rateSum = 0
    for (const day of days) {
      const sample = new Date(day)
      sample.setHours(hour, 30, 0, 0)
      let occupied = 0
      for (const session of sessions) {
        if (session.entryTime <= sample && (session.exitTime === null || session.exitTime > sample)) {
          occupied += 1
        }
      }
      rateSum += occupied / totalCapacity
    }
    return { hour, rate: round4(rateSum / days.length) }
  })

  const entryCounts = new Array<number>(24).fill(0)
  for (const session of sessions) {
    if (session.entryTime >= rangeStart && session.entryTime <= rangeEnd) {
      entryCounts[session.entryTime.getHours()] += 1
    }
  }
  const peakHours = entryCounts
    .map((entries, hour) => ({ hour, entries }))
    .filter((row) => row.entries > 0)
    .sort((a, b) => b.entries - a.entries || a.hour - b.hour)
    .slice(0, 3)

  const payments = await db.payment.findMany({
    where: { status: 'CONFIRMED', paidAt: { gte: rangeStart, lte: rangeEnd } },
    select: { amount: true, paidAt: true },
  })
  let total = 0
  const byDateMap = new Map<string, number>()
  for (const payment of payments) {
    total += payment.amount
    const key = localDateKey(payment.paidAt)
    byDateMap.set(key, (byDateMap.get(key) ?? 0) + payment.amount)
  }
  const byDate = [...byDateMap.entries()]
    .map(([date, amount]) => ({ date, amount }))
    .sort((a, b) => a.date.localeCompare(b.date))

  const reservations = await db.reservation.findMany({
    where: { arrivalTime: { gte: rangeStart, lte: rangeEnd } },
    select: { status: true },
  })
  const denominator = reservations.filter((r) => r.status !== 'CANCELLED').length
  const noShows = reservations.filter((r) => r.status === 'NO_SHOW').length
  const noShowRate = denominator === 0 ? null : round4(noShows / denominator)

  return {
    utilisationByHour,
    peakHours,
    revenue: { total, byDate },
    noShowRate,
  }
}
