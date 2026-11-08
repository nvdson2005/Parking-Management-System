import { Role } from './types'

export function normalizePlate(raw: string): string {
  return raw.trim().toUpperCase().replace(/\s/g, '')
}

export function maskPlate(plate: string): string {
  let hyphenIndex = plate.indexOf('-')
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

export function presentPlate(
  plate: string,
  viewer: { id: string; role: Role } | null,
  ownerId: string | null
): string {
  if (plate === '[purged]') {
    return '[purged]'
  }

  const canViewFull =
    (viewer?.role === 'STAFF' || viewer?.role === 'MANAGER') ||
    (viewer?.id === ownerId)

  return canViewFull ? plate : maskPlate(plate)
}
