import { db } from '@/server/db'
import { DomainError } from '@/server/errors'
import { logAccess } from '@/server/services/accessLog'
import type { Role } from '@/lib/types'
import type { CurrentUser } from './session'
import { getCurrentUser } from './session'

export function assertRole(user: CurrentUser | null, roles: Role[]): CurrentUser {
  if (!user) throw new DomainError('UNAUTHENTICATED', 'Authentication required')
  if (!roles.includes(user.role)) throw new DomainError('FORBIDDEN', 'Insufficient role')
  return user
}

/**
 * Server-side role check. A signed-in user with the wrong role is logged as
 * ACCESS_DENIED before the FORBIDDEN error (G-06, FR-43). Unauthenticated
 * requests are not logged: there is no account to attribute them to.
 */
export async function requireRole(...roles: Role[]): Promise<CurrentUser> {
  const user = await getCurrentUser()
  if (user && !roles.includes(user.role)) {
    await logAccess(db, { userId: user.id, action: 'ACCESS_DENIED', target: `roles:${roles.join(',')}` })
  }
  return assertRole(user, roles)
}
