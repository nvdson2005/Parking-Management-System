import { describe, it, expect, beforeEach } from 'vitest'
import { db } from '@/server/db'
import { resetDb } from './helpers/db'
import { registerCustomer } from '@/server/services/auth'

// Review of PR #11 (A-28, KB-07): registration and its LOGIN row commit together.

beforeEach(async () => {
  await resetDb()
})

describe('registration and its LOGIN row commit together', () => {
  const input = { email: 'new@x.com', password: 'password123', name: 'N', userGroup: 'STUDENT' as const }

  it('leaves no account when the LOGIN row cannot be written, so a retry succeeds', async () => {
    await db.$executeRawUnsafe(
      "CREATE TRIGGER fail_access_log BEFORE INSERT ON access_logs BEGIN SELECT RAISE(ABORT, 'log down'); END;",
    )
    try {
      await expect(registerCustomer(db, input)).rejects.toThrow()
      expect(await db.user.count({ where: { email: input.email } })).toBe(0)
    } finally {
      await db.$executeRawUnsafe('DROP TRIGGER fail_access_log;')
    }

    const user = await registerCustomer(db, input)
    expect(await db.accessLog.count({ where: { userId: user.id, action: 'LOGIN' } })).toBe(1)
  })
})
