const MINUTE_MS = 60_000
const STEP_MINUTES = 5

/** `YYYY-MM-DDTHH:mm` in local time, the value format of `<input type="datetime-local">`. */
export function toLocalDateTimeInput(d: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

/**
 * `min` for the arrival picker (FR-007): the next whole minute. The current
 * minute is already past by some seconds, so the server would reject it.
 */
export function minArrivalInput(now: Date): string {
  return toLocalDateTimeInput(new Date(now.getTime() + MINUTE_MS))
}

/**
 * Default arrival time for a new reservation (FR-27: from now until the end of
 * the local day). Returns the first 5-minute mark at least one minute after
 * `now`. Near midnight it falls back to 23:59 while that is still at least one
 * minute away; after that no valid time remains today and it returns `null`.
 */
export function defaultArrival(now: Date): Date | null {
  const earliest = new Date(now.getTime() + MINUTE_MS)
  const lastOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 0, 0)
  if (earliest > lastOfDay) return null

  const mark = new Date(earliest)
  mark.setSeconds(0, 0)
  if (mark < earliest) mark.setMinutes(mark.getMinutes() + 1)
  const remainder = mark.getMinutes() % STEP_MINUTES
  if (remainder !== 0) mark.setMinutes(mark.getMinutes() + STEP_MINUTES - remainder)

  return mark > lastOfDay ? lastOfDay : mark
}
