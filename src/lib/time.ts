export const HOLD_MINUTES = 30
export const RETENTION_MONTHS = 12

export function endOfLocalDay(d: Date): Date {
  const date = new Date(d)
  date.setHours(23, 59, 59, 999)
  return date
}

export function startOfLocalDay(d: Date): Date {
  const date = new Date(d)
  date.setHours(0, 0, 0, 0)
  return date
}

export function addMinutes(d: Date, m: number): Date {
  const date = new Date(d)
  date.setMinutes(date.getMinutes() + m)
  return date
}

export function subMonths(d: Date, m: number): Date {
  const date = new Date(d)
  date.setMonth(date.getMonth() - m)
  return date
}
