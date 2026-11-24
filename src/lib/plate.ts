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

const ALNUM = /[a-zA-Z0-9]/g

/**
 * Masks a plate for viewers who may not see it in full (FR-42): keeps the
 * prefix up to the hyphen (or the first 3 characters) and the last 2, and
 * replaces the letters and digits in between with `*`. A short plate is still
 * masked: if 2 or fewer characters follow the prefix they are all hidden, and
 * a plate that is only a prefix keeps just its first character. Every plate
 * with a letter or digit therefore shows at least one `*` (review of PR #11).
 */
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
    if (/[a-zA-Z0-9]/.test(rest)) return prefix + rest.replace(ALNUM, '*')
    if (plate.length <= 1) return plate.replace(ALNUM, '*')
    return plate.charAt(0) + plate.slice(1).replace(ALNUM, '*')
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

/** What a plate is replaced with by the 12-month purge (P03 §3.9). */
export const PURGED_PLATE = '[purged]'

/** Prefix of the EX-02 event note that records the plate seen at the exit. */
export const OBSERVED_PLATE_PREFIX = 'Observed plate: '
const NOTE_SEPARATOR = ' — '

/** The EX-02 note `Observed plate: <plate>[ — <staff note>]`. */
export function observedPlateNote(plate: string, staffNote?: string | null): string {
  const base = `${OBSERVED_PLATE_PREFIX}${plate}`
  return staffNote ? `${base}${NOTE_SEPARATOR}${staffNote}` : base
}

/** The only event whose note starts with a system-written plate (EX-02). */
export const PLATE_MISMATCH_EVENT = 'PLATE_MISMATCH_CONFIRMED'

/**
 * An event note as the viewer may see it: in an EX-02 note (event type
 * PLATE_MISMATCH_CONFIRMED) the observed plate is masked unless the viewer may
 * see the session's full plate (Q46). Other notes, such as LOST_CARD, are
 * staff text and are shown as written, even if they start with the same words.
 */
export function presentEventNote(note: string, eventType: string, showFullPlate: boolean): string {
  if (showFullPlate || eventType !== PLATE_MISMATCH_EVENT || !note.startsWith(OBSERVED_PLATE_PREFIX)) return note
  const rest = note.slice(OBSERVED_PLATE_PREFIX.length)
  const cut = rest.indexOf(NOTE_SEPARATOR)
  const plate = cut === -1 ? rest : rest.slice(0, cut)
  const tail = cut === -1 ? '' : rest.slice(cut)
  return `${OBSERVED_PLATE_PREFIX}${plate === PURGED_PLATE ? plate : maskPlate(plate)}${tail}`
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
