import { z } from 'zod'
import type { AccessLog, User } from '@prisma/client'
import type { Db } from '@/server/db'
import { DomainError } from '@/server/errors'
import { hashPassword } from '@/server/auth/password'
import { logAccess } from '@/server/services/accessLog'
import { createNotification } from '@/server/services/notifications'
import { inTransaction } from '@/server/tx'
import type { UserGroup } from '@/lib/types'

const createStaffSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(1).max(100),
  role: z.enum(['STAFF', 'MANAGER']),
})

export type AccountView = Pick<
  User,
  'id' | 'email' | 'name' | 'roleCode' | 'userGroup' | 'requestedUserGroup' | 'locked' | 'createdAt'
>

/**
 * All accounts for the manager account page, newest first. Only the fields the
 * page needs: the password hash never leaves the server.
 */
export async function listUsers(db: Db): Promise<AccountView[]> {
  return db.user.findMany({
    select: {
      id: true,
      email: true,
      name: true,
      roleCode: true,
      userGroup: true,
      requestedUserGroup: true,
      locked: true,
      createdAt: true,
    },
    orderBy: { createdAt: 'desc' },
  })
}

const groupSchema = z.enum(['STUDENT', 'LECTURER_STAFF'])

/**
 * A customer asks to move to another fee group (Q38, FR-08). Customers do not
 * change their own group; the request waits for a Manager (`setUserGroup`). A
 * new request replaces an older one; asking for the current group is a
 * VALIDATION error. The request and its `ACCOUNT_CHANGE` row are one nested
 * write, so neither is kept without the other.
 */
export async function requestGroupChange(db: Db, customerId: string, group: UserGroup): Promise<AccountView> {
  const parsed = groupSchema.safeParse(group)
  if (!parsed.success) throw new DomainError('VALIDATION', 'Invalid group')
  const user = await db.user.findUnique({ where: { id: customerId } })
  if (!user || user.roleCode !== 'CUSTOMER') throw new DomainError('NOT_FOUND', 'Customer not found')
  if (user.userGroup === parsed.data) throw new DomainError('VALIDATION', 'Already in this group')

  const updated = await db.user.update({
    where: { id: customerId },
    data: {
      requestedUserGroup: parsed.data,
      accessLogs: { create: { action: 'ACCOUNT_CHANGE', target: `group-request:${parsed.data}` } },
    },
  })
  return toView(updated)
}

/** A customer's pending fee-group request, or null (Q38, FR-08). */
export async function getGroupRequest(db: Db, customerId: string): Promise<UserGroup | null> {
  const user = await db.user.findUnique({ where: { id: customerId }, select: { requestedUserGroup: true } })
  return (user?.requestedUserGroup as UserGroup | null) ?? null
}

/**
 * A Manager sets a customer's fee group (Q38, FR-07), usually to apply the
 * customer's request, which is then cleared. Only customers have a group.
 * Sessions already open keep the fee group they started with. The change, its
 * `ACCOUNT_CHANGE` row and the customer's GROUP_CHANGED notification commit
 * together.
 */
export async function setUserGroup(
  db: Db,
  actorId: string,
  userId: string,
  group: UserGroup,
): Promise<AccountView> {
  const parsed = groupSchema.safeParse(group)
  if (!parsed.success) throw new DomainError('VALIDATION', 'Invalid group')

  return inTransaction(db, async (tx) => {
    const user = await tx.user.findUnique({ where: { id: userId } })
    if (!user) throw new DomainError('NOT_FOUND', 'User not found')
    if (user.roleCode !== 'CUSTOMER') throw new DomainError('VALIDATION', 'Only customers have a fee group')

    const updated = await tx.user.update({
      where: { id: userId },
      data: { userGroup: parsed.data, requestedUserGroup: null },
    })
    await logAccess(tx, {
      userId: actorId,
      action: 'ACCOUNT_CHANGE',
      target: `${userId};group:${user.userGroup ?? '-'}->${parsed.data}`,
    })
    if (user.userGroup !== parsed.data) {
      await createNotification(tx, { userId, type: 'GROUP_CHANGED' })
    }
    return toView(updated)
  })
}

function toView(u: User): AccountView {
  const { id, email, name, roleCode, userGroup, requestedUserGroup, locked, createdAt } = u
  return { id, email, name, roleCode, userGroup, requestedUserGroup, locked, createdAt }
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
): Promise<AccountView> {
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
  return toView(user)
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
): Promise<AccountView> {
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
  return toView(user)
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
