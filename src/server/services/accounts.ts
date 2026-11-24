import { z } from 'zod'
import type { AccessLog, User } from '@prisma/client'
import type { Db } from '@/server/db'
import { DomainError } from '@/server/errors'
import { hashPassword } from '@/server/auth/password'
import { logAccess } from '@/server/services/accessLog'
import { inTransaction } from '@/server/tx'

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
  // The account and its ACCOUNT_CHANGE row commit together (FR-43).
  const user = await inTransaction(db, async (tx) => {
    const created = await tx.user.create({
      data: {
        email,
        passwordHash,
        name: parsed.data.name,
        roleCode: parsed.data.role,
      },
    })
    await logAccess(tx, { userId: actorId, action: 'ACCOUNT_CHANGE', target: created.id })
    return created
  })
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

  const user = await inTransaction(db, async (tx) => {
    const existing = await tx.user.findUnique({ where: { id: userId } })
    if (!existing) throw new DomainError('NOT_FOUND', 'User not found')
    const updated = await tx.user.update({ where: { id: userId }, data: { locked } })
    await logAccess(tx, { userId: actorId, action: 'ACCOUNT_CHANGE', target: updated.id })
    return updated
  })
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

/**
 * Query for GET /api/access-logs (A-65, KB-15): `limit` 1-500, default 200
 * (the screen's default). A missing value means the default; anything else
 * that is not an integer in range is a VALIDATION error.
 */
export const accessLogQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(500).default(200),
})
