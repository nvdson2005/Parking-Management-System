import { describe, it, expect } from 'vitest'
import { defaultArrival, minArrivalInput, toLocalDateTimeInput } from '@/lib/arrival'

// Local-time dates: the rule is "within the current local day" (FR-27, spec 006 FR-006..FR-008).
const at = (h: number, m: number, s = 0) => new Date(2026, 10, 24, h, m, s, 0)

describe('defaultArrival (spec 006, US2)', () => {
  it.each([
    [at(10, 0, 0), at(10, 5)],
    [at(10, 3, 20), at(10, 5)],
    [at(10, 4, 30), at(10, 10)],
    [at(23, 50, 0), at(23, 55)],
    [at(23, 55, 30), at(23, 59)],
    [at(23, 58, 0), at(23, 59)],
  ])('at %s the default is %s', (now, expected) => {
    expect(defaultArrival(now)).toEqual(expected)
  })

  it.each([[at(23, 58, 30)], [at(23, 59, 0)], [at(23, 59, 59)]])(
    'at %s no valid time remains today',
    (now) => {
      expect(defaultArrival(now)).toBeNull()
    },
  )

  it('is always in the future and on the same local day', () => {
    for (let minute = 0; minute < 24 * 60 - 2; minute += 7) {
      const now = new Date(2026, 10, 24, 0, minute, 45)
      const value = defaultArrival(now)!
      expect(value.getTime()).toBeGreaterThan(now.getTime())
      expect(value.getDate()).toBe(24)
      expect(value.getSeconds()).toBe(0)
    }
  })
})

describe('toLocalDateTimeInput', () => {
  it('formats local time for a datetime-local input', () => {
    expect(toLocalDateTimeInput(new Date(2026, 0, 5, 7, 9, 30))).toBe('2026-01-05T07:09')
  })
})

// FR-007 (analysis C1): the picker's `min` must not offer the current minute,
// which is already past by some seconds and fails RESERVATION_WINDOW.
describe('minArrivalInput', () => {
  it.each([
    [at(10, 3, 40), '2026-11-24T10:04'],
    [at(10, 3, 0), '2026-11-24T10:04'],
    [at(23, 58, 10), '2026-11-24T23:59'],
  ])('at %s the earliest selectable time is %s', (now, expected) => {
    expect(minArrivalInput(now)).toBe(expected)
  })
})
