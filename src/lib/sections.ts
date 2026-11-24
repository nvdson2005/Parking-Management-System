import type { Role } from '@/lib/types'

/**
 * Role-protected page sections and the roles allowed in each. Pure, so both
 * the Edge middleware (sign-in check) and the Node section layouts (role
 * check and ACCESS_DENIED log, G-06, FR-43) read the same table.
 */
export const SECTION_ROLES = {
  '/customer': ['CUSTOMER'],
  '/staff': ['STAFF', 'MANAGER'],
  '/manager': ['MANAGER'],
} as const satisfies Record<string, readonly Role[]>

export type Section = keyof typeof SECTION_ROLES

export const SECTIONS = Object.keys(SECTION_ROLES) as Section[]

/** The section a path belongs to: `/staff` and `/staff/...`, not `/staffing`. */
export function sectionOf(pathname: string): Section | null {
  return SECTIONS.find((s) => pathname === s || pathname.startsWith(`${s}/`)) ?? null
}

export function sectionAllows(section: Section, role: Role): boolean {
  return (SECTION_ROLES[section] as readonly Role[]).includes(role)
}
