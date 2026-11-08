import { z } from 'zod'
import type { AccessLog, User } from '@prisma/client'
import type { Db } from '@/server/db'
import { DomainError } from '@/server/errors'
import { hashPassword } from '@/server/auth/password'
import { logAccess } from '@/server/services/accessLog'

const createStaffSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(1).max(100),
  role: z.enum(['STAFF', 'MANAGER']),
})

/**
 * All accounts for the manager account page, newest first.
 */
export async function listUsers(db: Db): Promise<User[]> {
  return db.user.findMany({ orderBy: { createdAt: 'desc' } })
}

/**
 * Creates a STAFF or MANAGER account (MANAGER only at the API boundary).
 * `role` is restricted to staff roles — a CUSTOMER role is a `VALIDATION`
 * error. Logs `ACCOUNT_CHANGE` (D-24).
 */
export async function createStaffAccount(
  db: Db,
  actorId: string,
  input: { email: string; password: string; name: string; role: 'STAFF' | 'MANAGER' },
): Promise<User> {
  const parsed = createStaffSchema.safeParse(input)
  if (!parsed.success) throw new DomainError('VALIDATION', 'Invalid account input')

  const email = parsed.data.email.toLowerCase()
  const existing = await db.user.findUnique({ where: { email } })
  if (existing) throw new DomainError('EMAIL_TAKEN', 'Email already registered')

  const passwordHash = await hashPassword(parsed.data.password)
  const user = await db.user.create({
    data: {
      email,
      passwordHash,
      name: parsed.data.name,
      roleCode: parsed.data.role,
    },
  })

  await logAccess(db, { userId: actorId, action: 'ACCOUNT_CHANGE', target: user.id })
  return user
}

/**
 * Locks or unlocks an account (MANAGER only). A manager cannot lock their
 * own account (`VALIDATION`), so a lot never loses its last active manager
 * by self-lock. Logs `ACCOUNT_CHANGE` (D-24).
 */
export async function setLocked(
  db: Db,
  actorId: string,
  userId: string,
  locked: boolean,
): Promise<User> {
  if (locked && userId === actorId) {
    throw new DomainError('VALIDATION', 'A manager cannot lock their own account')
  }

  const existing = await db.user.findUnique({ where: { id: userId } })
  if (!existing) throw new DomainError('NOT_FOUND', 'User not found')

  const user = await db.user.update({ where: { id: userId }, data: { locked } })

  await logAccess(db, { userId: actorId, action: 'ACCOUNT_CHANGE', target: user.id })
  return user
}

/**
 * Access log entries (manager audit view), newest first, with the acting
 * user's name resolved (nullable — a purged or system entry has no user).
 */
export async function listAccessLogs(
  db: Db,
  opts: { limit?: number } = {},
): Promise<Array<AccessLog & { userName: string | null }>> {
  const logs = await db.accessLog.findMany({
    include: { user: true },
    orderBy: { createdAt: 'desc' },
    take: opts.limit ?? 200,
  })

  return logs.map(({ user, ...log }) => ({ ...log, userName: user?.name ?? null }))
}
