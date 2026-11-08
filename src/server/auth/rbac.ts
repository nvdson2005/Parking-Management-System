import { DomainError } from '@/server/errors'
import type { Role } from '@/lib/types'
import type { CurrentUser } from './session'
import { getCurrentUser } from './session'

export function assertRole(user: CurrentUser | null, roles: Role[]): CurrentUser {
  if (!user) throw new DomainError('UNAUTHENTICATED', 'Authentication required')
  if (!roles.includes(user.role)) throw new DomainError('FORBIDDEN', 'Insufficient role')
  return user
}

export async function requireRole(...roles: Role[]): Promise<CurrentUser> {
  return assertRole(await getCurrentUser(), roles)
}
