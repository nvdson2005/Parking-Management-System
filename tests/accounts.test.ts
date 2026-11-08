import { describe, it, expect } from 'vitest'
import { db } from '@/server/db'
import { resetDb, makeFixture } from './helpers/db'
import { listUsers, createStaffAccount, setLocked, listAccessLogs } from '@/server/services/accounts'
import { authenticate } from '@/server/services/auth'

describe('accounts service', () => {
  it('creates a STAFF account that can then authenticate', async () => {
    await resetDb()
    const f = await makeFixture()

    const before = await db.accessLog.count({ where: { action: 'ACCOUNT_CHANGE' } })
    const staff = await createStaffAccount(db, f.manager.id, {
      email: 'New.Staff@test.local',
      password: 'password123',
      name: 'New Staff',
      role: 'STAFF',
    })
    expect(staff.roleCode).toBe('STAFF')
    expect(staff.email).toBe('new.staff@test.local')

    const authed = await authenticate(db, 'new.staff@test.local', 'password123')
    expect(authed.id).toBe(staff.id)

    const after = await db.accessLog.count({ where: { action: 'ACCOUNT_CHANGE' } })
    expect(after).toBe(before + 1)
  })

  it('rejects a CUSTOMER role for createStaffAccount with VALIDATION', async () => {
    await resetDb()
    const f = await makeFixture()

    await expect(
      createStaffAccount(db, f.manager.id, {
        email: 'bad@test.local',
        password: 'password123',
        name: 'Bad',
        role: 'CUSTOMER' as 'STAFF',
      }),
    ).rejects.toMatchObject({ code: 'VALIDATION' })
  })

  it('locking an account makes authenticate throw ACCOUNT_LOCKED and logs ACCOUNT_CHANGE', async () => {
    await resetDb()
    const f = await makeFixture()

    const before = await db.accessLog.count({ where: { action: 'ACCOUNT_CHANGE' } })
    const locked = await setLocked(db, f.manager.id, f.staff.id, true)
    expect(locked.locked).toBe(true)

    await expect(authenticate(db, f.staff.email, 'password123')).rejects.toMatchObject({
      code: 'ACCOUNT_LOCKED',
    })

    const after = await db.accessLog.count({ where: { action: 'ACCOUNT_CHANGE' } })
    expect(after).toBe(before + 1)
  })

  it('forbids a manager locking themselves with VALIDATION', async () => {
    await resetDb()
    const f = await makeFixture()

    await expect(setLocked(db, f.manager.id, f.manager.id, true)).rejects.toMatchObject({
      code: 'VALIDATION',
    })
  })

  it('listUsers returns all accounts', async () => {
    await resetDb()
    const f = await makeFixture()

    const users = await listUsers(db)
    expect(users.length).toBeGreaterThanOrEqual(4)
    expect(users.some((u) => u.id === f.manager.id)).toBe(true)
  })

  it('listAccessLogs returns newest first with userName', async () => {
    await resetDb()
    const f = await makeFixture()

    await setLocked(db, f.manager.id, f.staff.id, true)
    await setLocked(db, f.manager.id, f.staff.id, false)

    const logs = await listAccessLogs(db, { limit: 200 })
    expect(logs.length).toBeGreaterThanOrEqual(2)
    expect(logs[0].userName).toBe(f.manager.name)
    const times = logs.map((l) => l.createdAt.getTime())
    for (let i = 1; i < times.length; i++) {
      expect(times[i - 1]).toBeGreaterThanOrEqual(times[i])
    }
  })
})
