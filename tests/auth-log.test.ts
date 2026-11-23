import { describe, it, expect, vi, beforeEach } from 'vitest'
import type { CurrentUser } from '@/server/auth/session'

// requireRole reads the session through getCurrentUser (cookies); fake it.
let currentUser: CurrentUser | null = null
vi.mock('@/server/auth/session', async (orig) => ({
  ...(await orig<typeof import('@/server/auth/session')>()),
  getCurrentUser: async () => currentUser,
}))

import { db } from '@/server/db'
import { DomainError } from '@/server/errors'
import { resetDb, makeFixture, type Fixture } from './helpers/db'
import { authenticate } from '@/server/services/auth'
import { requireRole, requireSection } from '@/server/auth/rbac'

let f: Fixture

beforeEach(async () => {
  await resetDb()
  f = await makeFixture()
  currentUser = null
})

async function rows(action: string) {
  return db.accessLog.findMany({ where: { action } })
}

describe('G-06 failed sign-in logging (FR-43)', () => {
  it('logs LOGIN_FAILED for a wrong password, against the account, and no LOGIN', async () => {
    await expect(authenticate(db, f.student.email, 'wrong')).rejects.toThrow(DomainError)

    const failed = await rows('LOGIN_FAILED')
    expect(failed).toHaveLength(1)
    expect(failed[0].userId).toBe(f.student.id)
    expect(failed[0].target).toBe('reason:BAD_PASSWORD')
    expect(await rows('LOGIN')).toHaveLength(0)
  })

  it('logs LOGIN_FAILED with no account and without storing the email for an unknown email', async () => {
    await expect(authenticate(db, 'nobody@x.com', 'whatever')).rejects.toThrow(DomainError)

    const failed = await rows('LOGIN_FAILED')
    expect(failed).toHaveLength(1)
    expect(failed[0].userId).toBeNull()
    expect(failed[0].target).toBe('reason:UNKNOWN_EMAIL')
    expect(JSON.stringify(failed[0])).not.toContain('nobody@x.com')
  })

  it('logs LOGIN_FAILED with reason LOCKED for a locked account', async () => {
    await db.user.update({ where: { id: f.student.id }, data: { locked: true } })

    await expect(authenticate(db, f.student.email, 'password123')).rejects.toThrow(DomainError)

    const failed = await rows('LOGIN_FAILED')
    expect(failed).toHaveLength(1)
    expect(failed[0].userId).toBe(f.student.id)
    expect(failed[0].target).toBe('reason:LOCKED')
  })

  it('writes no LOGIN_FAILED on a successful sign-in', async () => {
    await authenticate(db, f.student.email, 'password123')
    expect(await rows('LOGIN_FAILED')).toHaveLength(0)
  })
})

describe('G-06 access-denied logging (FR-43)', () => {
  it('logs ACCESS_DENIED when a signed-in user lacks the role, and still throws FORBIDDEN', async () => {
    currentUser = { id: f.student.id, role: 'CUSTOMER', name: 'S', userGroup: 'STUDENT' }

    await expect(requireRole('MANAGER')).rejects.toMatchObject({ code: 'FORBIDDEN' })

    const denied = await rows('ACCESS_DENIED')
    expect(denied).toHaveLength(1)
    expect(denied[0].userId).toBe(f.student.id)
    expect(denied[0].target).toBe('roles:MANAGER')
  })

  it('logs nothing for an unauthenticated request (401)', async () => {
    await expect(requireRole('MANAGER')).rejects.toMatchObject({ code: 'UNAUTHENTICATED' })
    expect(await db.accessLog.count()).toBe(0)
  })

  it('logs nothing when the role is allowed', async () => {
    currentUser = { id: f.manager.id, role: 'MANAGER', name: 'M', userGroup: null }
    await requireRole('STAFF', 'MANAGER')
    expect(await rows('ACCESS_DENIED')).toHaveLength(0)
  })

  it('logs nothing when the role is allowed in a shared section (MANAGER in /staff)', async () => {
    currentUser = { id: f.manager.id, role: 'MANAGER', name: 'M', userGroup: null }
    await expect(requireSection('/staff')).resolves.toMatchObject({ id: f.manager.id })
    expect(await rows('ACCESS_DENIED')).toHaveLength(0)
  })
})

// redirect() throws an error whose digest carries the target URL.
async function redirectTarget(p: Promise<unknown>): Promise<string> {
  const err = (await p.then(
    () => null,
    (e: unknown) => e,
  )) as { digest?: string } | null
  expect(err?.digest).toMatch(/^NEXT_REDIRECT/)
  return err!.digest!.split(';')[2]
}

describe('G-06 page section guard (FR-43, review of PR #11)', () => {
  it('logs one ACCESS_DENIED for a wrong role and redirects to /denied', async () => {
    currentUser = { id: f.student.id, role: 'CUSTOMER', name: 'S', userGroup: 'STUDENT' }

    expect(await redirectTarget(requireSection('/manager'))).toBe('/denied')

    const denied = await rows('ACCESS_DENIED')
    expect(denied).toHaveLength(1)
    expect(denied[0].userId).toBe(f.student.id)
    expect(denied[0].target).toBe('page:/manager')
  })

  it('logs one row per refused request: two attempts are two rows, not more', async () => {
    currentUser = { id: f.staff.id, role: 'STAFF', name: 'T', userGroup: null }
    await redirectTarget(requireSection('/manager'))
    await redirectTarget(requireSection('/customer'))
    expect((await rows('ACCESS_DENIED')).map((r) => r.target).sort()).toEqual(['page:/customer', 'page:/manager'])
  })

  it('sends a signed-out user to /login and logs nothing', async () => {
    expect(await redirectTarget(requireSection('/staff'))).toBe('/login')
    expect(await db.accessLog.count()).toBe(0)
  })

  it('returns the user and logs nothing when the role is allowed', async () => {
    currentUser = { id: f.student.id, role: 'CUSTOMER', name: 'S', userGroup: 'STUDENT' }
    await expect(requireSection('/customer')).resolves.toMatchObject({ id: f.student.id })
    expect(await db.accessLog.count()).toBe(0)
  })
})
