import { Role } from './types'

export function normalizePlate(raw: string): string {
  return raw.trim().toUpperCase().replace(/\s/g, '')
}

/**
 * Separator-insensitive comparison key: uppercases and strips everything but
 * letters/digits, so `51F-123.45`, `51f 123 45` and `51F12345` compare equal.
 * Used for vehicle lookup and the exit plate-mismatch check; stored and
 * displayed plates still use `normalizePlate`.
 */
export function plateCompareKey(raw: string): string {
  return normalizePlate(raw).replace(/[^A-Z0-9]/g, '')
}

export function maskPlate(plate: string): string {
  const hyphenIndex = plate.indexOf('-')
  let prefix: string
  let rest: string

  if (hyphenIndex !== -1) {
    prefix = plate.substring(0, hyphenIndex + 1)
    rest = plate.substring(hyphenIndex + 1)
  } else {
    prefix = plate.substring(0, 3)
    rest = plate.substring(3)
  }

  if (rest.length <= 2) {
    return plate
  }

  // Keep last 2 characters
  const lastTwo = rest.substring(rest.length - 2)
  const middle = rest.substring(0, rest.length - 2)

  // Mask all letters/digits, keep separators
  let masked = ''
  for (let i = 0; i < middle.length; i++) {
    const char = middle[i]
    if (/[a-zA-Z0-9]/.test(char)) {
      masked += '*'
    } else {
      masked += char
    }
  }

  return prefix + masked + lastTwo
}

/**
 * Who sees a full plate (FR-42, P03 §2.3): a Manager always; the vehicle's
 * owner; Staff, except on a session that has ended (Q46, 23/11: Staff need the
 * full plate only while the vehicle is in the lot). `closedSession` is true
 * only when the plate belongs to a CLOSED parking session.
 */
export function canViewFullPlate(
  viewer: { id: string; role: Role } | null,
  ownerId: string | null,
  closedSession = false,
): boolean {
  if (!viewer) return false
  if (viewer.role === 'MANAGER') return true
  if (ownerId !== null && viewer.id === ownerId) return true
  return viewer.role === 'STAFF' && !closedSession
}

export function presentPlate(
  plate: string,
  viewer: { id: string; role: Role } | null,
  ownerId: string | null,
  closedSession = false,
): string {
  if (plate === '[purged]') {
    return '[purged]'
  }
  return canViewFullPlate(viewer, ownerId, closedSession) ? plate : maskPlate(plate)
}
