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
import { requireRole } from '@/server/auth/rbac'
import { logPageDenied } from '@/server/services/accessLog'

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

  it('logPageDenied logs a protected prefix and ignores anything else', async () => {
    await logPageDenied(db, f.student.id, '/manager')
    await logPageDenied(db, f.student.id, '/evil?x=<script>')
    await logPageDenied(db, f.student.id, undefined)

    const denied = await rows('ACCESS_DENIED')
    expect(denied).toHaveLength(1)
    expect(denied[0].target).toBe('page:/manager')
  })
})
