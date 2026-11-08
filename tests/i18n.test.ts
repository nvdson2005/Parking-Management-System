import { describe, it, expect } from 'vitest'
import { vi } from '@/i18n/vi'
import { en } from '@/i18n/en'
import type { ErrorCode } from '@/server/errors'

// Kept in sync by hand with `ErrorCode` in src/server/errors.ts (Task 4).
// This file only adds dictionary keys, so it does not modify or re-export
// that module's internals — it mirrors the literal union here.
const ERROR_CODES: ErrorCode[] = [
  'VALIDATION',
  'UNAUTHENTICATED',
  'FORBIDDEN',
  'INVALID_CREDENTIALS',
  'ACCOUNT_LOCKED',
  'EMAIL_TAKEN',
  'PLATE_TAKEN',
  'NOT_FOUND',
  'UNKNOWN_CODE',
  'ZONE_FULL',
  'ALREADY_OPEN',
  'LOT_SUSPENDED',
  'NO_OPEN_SESSION',
  'PLATE_MISMATCH',
  'RESERVATION_WINDOW',
  'NOT_CANCELLABLE',
  'VEHICLE_ALREADY_RESERVED',
  'VEHICLE_PARKED',
  'NOT_OWNER',
]

function collectKeys(obj: unknown, prefix = ''): string[] {
  if (typeof obj !== 'object' || obj === null) return [prefix]
  return Object.entries(obj).flatMap(([key, value]) =>
    collectKeys(value, prefix ? `${prefix}.${key}` : key),
  )
}

describe('i18n dictionaries', () => {
  it('vi and en declare the exact same set of keys', () => {
    const viKeys = collectKeys(vi).sort()
    const enKeys = collectKeys(en).sort()
    expect(enKeys).toEqual(viKeys)
  })

  it('both dictionaries have an errors.<code> key for every ErrorCode', () => {
    const viKeys = new Set(collectKeys(vi))
    const enKeys = new Set(collectKeys(en))
    for (const code of ERROR_CODES) {
      expect(viKeys.has(`errors.${code}`)).toBe(true)
      expect(enKeys.has(`errors.${code}`)).toBe(true)
    }
  })
})
