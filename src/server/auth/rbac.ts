import { cache } from 'react'
import { redirect } from 'next/navigation'
import { db } from '@/server/db'
import { DomainError } from '@/server/errors'
import { logAccess } from '@/server/services/accessLog'
import { sectionAllows, type Section } from '@/lib/sections'
import type { Role } from '@/lib/types'
import type { CurrentUser } from './session'
import { getCurrentUser } from './session'

export function assertRole(user: CurrentUser | null, roles: Role[]): CurrentUser {
  if (!user) throw new DomainError('UNAUTHENTICATED', 'Authentication required')
  if (!roles.includes(user.role)) throw new DomainError('FORBIDDEN', 'Insufficient role')
  return user
}

// One flag per server render. A page and its section layout can both refuse
// the same request; only the first refusal is logged. Outside a render (route
// handlers, tests) React's cache does not memoize, so every call logs.
const deniedInThisRender = cache(() => ({ logged: false }))

/** Writes one ACCESS_DENIED row for a refused, signed-in user (G-06, FR-43). */
async function logDenied(userId: string, target: string): Promise<void> {
  const flag = deniedInThisRender()
  if (flag.logged) return
  flag.logged = true
  await logAccess(db, { userId, action: 'ACCESS_DENIED', target })
}

/**
 * Server-side role check for API routes and pages. A signed-in user with the
 * wrong role is logged as ACCESS_DENIED before the FORBIDDEN error (G-06,
 * FR-43). Unauthenticated requests are not logged: there is no account to
 * attribute them to.
 */
export async function requireRole(...roles: Role[]): Promise<CurrentUser> {
  const user = await getCurrentUser()
  if (user && !roles.includes(user.role)) {
    await logDenied(user.id, `roles:${roles.join(',')}`)
  }
  return assertRole(user, roles)
}

/**
 * Role check for a protected page section, called by its layout. This is the
 * decision point for page access: the Edge middleware only checks that the
 * user is signed in, because it cannot write the log. A refused user is
 * logged once and sent to the read-only /denied page (G-06, FR-43, NFR-09).
 */
export async function requireSection(section: Section): Promise<CurrentUser> {
  const user = await getCurrentUser()
  if (!user) redirect('/login')
  if (!sectionAllows(section, user.role)) {
    await logDenied(user.id, `page:${section}`)
    redirect('/denied')
  }
  return user
}
