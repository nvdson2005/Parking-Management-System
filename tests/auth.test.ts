import { describe, it, expect } from 'vitest'
import { db } from '@/server/db'
import { DomainError } from '@/server/errors'
import { resetDb, makeFixture } from './helpers/db'
import { registerCustomer, authenticate } from '@/server/services/auth'
import { signSession, resolveSessionUser } from '@/server/auth/session'
import { assertRole } from '@/server/auth/rbac'

describe('auth service', () => {
  it('registers and authenticates a customer', async () => {
    await resetDb()
    await makeFixture()

    await registerCustomer(db, {
      email: 'A@x.com',
      password: 'password123',
      name: 'An',
      userGroup: 'STUDENT',
    })

    const u = await authenticate(db, 'a@x.com', 'password123')
    expect(u.roleCode).toBe('CUSTOMER')
    expect(await db.accessLog.count({ where: { action: 'LOGIN' } })).toBe(1)
  })

  it('rejects duplicate email', async () => {
    await resetDb()
    await makeFixture()

    await registerCustomer(db, {
      email: 'dup@x.com',
      password: 'password123',
      name: 'Dup',
      userGroup: 'STUDENT',
    })

    await expect(
      registerCustomer(db, {
        email: 'DUP@x.com',
        password: 'password123',
        name: 'Dup Two',
        userGroup: 'STUDENT',
      }),
    ).rejects.toMatchObject({ code: 'EMAIL_TAKEN' })
  })

  it('rejects wrong password with INVALID_CREDENTIALS', async () => {
    await resetDb()
    const fixture = await makeFixture()

    await expect(authenticate(db, fixture.student.email, 'wrong-password')).rejects.toMatchObject({
      code: 'INVALID_CREDENTIALS',
    })
  })

  it('rejects locked account with ACCOUNT_LOCKED', async () => {
    await resetDb()
    const fixture = await makeFixture()
    await db.user.update({ where: { id: fixture.student.id }, data: { locked: true } })

    await expect(authenticate(db, fixture.student.email, 'password123')).rejects.toMatchObject({
      code: 'ACCOUNT_LOCKED',
    })
  })

  it('resolveSessionUser returns null for locked user with valid token', async () => {
    await resetDb()
    const fixture = await makeFixture()

    const token = await signSession({
      id: fixture.student.id,
      role: 'CUSTOMER',
      name: fixture.student.name,
      userGroup: 'STUDENT',
    })

    await db.user.update({ where: { id: fixture.student.id }, data: { locked: true } })

    const result = await resolveSessionUser(db, token)
    expect(result).toBeNull()
  })

  it('assertRole: customer on staff action -> FORBIDDEN, null -> UNAUTHENTICATED, manager on staff action -> ok', () => {
    const customer = { id: 'c1', role: 'CUSTOMER' as const, name: 'Cust', userGroup: 'STUDENT' as const }
    const manager = { id: 'm1', role: 'MANAGER' as const, name: 'Mgr', userGroup: null }

    try {
      assertRole(customer, ['STAFF', 'MANAGER'])
      throw new Error('expected assertRole to throw')
    } catch (err) {
      expect(err).toBeInstanceOf(DomainError)
      expect((err as DomainError).code).toBe('FORBIDDEN')
    }

    try {
      assertRole(null, ['STAFF', 'MANAGER'])
      throw new Error('expected assertRole to throw')
    } catch (err) {
      expect(err).toBeInstanceOf(DomainError)
      expect((err as DomainError).code).toBe('UNAUTHENTICATED')
    }

    expect(assertRole(manager, ['STAFF', 'MANAGER'])).toBe(manager)
  })
})
