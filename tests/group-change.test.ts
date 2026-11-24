/**
 * Q38 (23/11): a customer asks to change fee group, a Manager applies it
 * (FR-07, FR-08). Also: account APIs never return a password hash.
 */
import { describe, it, expect, beforeEach, vi } from 'vitest'
import type { CurrentUser } from '@/server/auth/session'

let currentUser: CurrentUser | null = null
vi.mock('@/server/auth/session', async (orig) => ({
  ...(await orig<typeof import('@/server/auth/session')>()),
  getCurrentUser: async () => currentUser,
}))

import { db } from '@/server/db'
import { resetDb, makeFixture, type Fixture } from './helpers/db'
import { createStaffAccount, listUsers, requestGroupChange, setUserGroup } from '@/server/services/accounts'
import { recordEntry } from '@/server/services/entry'
import { GET as accountsGET, POST as accountsPOST } from '@/app/api/accounts/route'
import { PATCH as accountPATCH } from '@/app/api/accounts/[id]/route'
import { POST as requestPOST } from '@/app/api/account/group-request/route'

type Handler = (r: Request, c: unknown) => Promise<Response>
async function call(handler: Handler, method: string, body?: unknown, ctx: unknown = {}) {
  const res = await handler(
    new Request('http://test.local/api', {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: body === undefined ? undefined : JSON.stringify(body),
    }),
    ctx,
  )
  return { status: res.status, body: await res.json() }
}

let f: Fixture
const asUser = (u: { id: string; name: string; userGroup: string | null }, role: CurrentUser['role']) => {
  currentUser = { id: u.id, role, name: u.name, userGroup: u.userGroup } as CurrentUser
}

beforeEach(async () => {
  await resetDb()
  f = await makeFixture()
  currentUser = null
})

const user = (id: string) => db.user.findUniqueOrThrow({ where: { id } })

describe('customer request (FR-08)', () => {
  it('records the requested group without changing the current one', async () => {
    await requestGroupChange(db, f.student.id, 'LECTURER_STAFF')
    expect(await user(f.student.id)).toMatchObject({ userGroup: 'STUDENT', requestedUserGroup: 'LECTURER_STAFF' })
  })

  it('rejects asking for the current group, and requests from non-customers', async () => {
    await expect(requestGroupChange(db, f.student.id, 'STUDENT')).rejects.toMatchObject({ code: 'VALIDATION' })
    await expect(requestGroupChange(db, f.staff.id, 'STUDENT')).rejects.toMatchObject({ code: 'NOT_FOUND' })
  })

  it('POST /api/account/group-request: customer only, validates the group', async () => {
    asUser(f.student, 'CUSTOMER')
    expect(await call(requestPOST as Handler, 'POST', { group: 'LECTURER_STAFF' })).toMatchObject({
      status: 200,
      body: { userGroup: 'STUDENT', requestedUserGroup: 'LECTURER_STAFF' },
    })
    expect((await call(requestPOST as Handler, 'POST', { group: 'GUEST' })).status).toBe(400)
    asUser(f.staff, 'STAFF')
    expect((await call(requestPOST as Handler, 'POST', { group: 'STUDENT' })).status).toBe(403)
  })
})

describe('manager change (FR-07)', () => {
  it('rejects approval without a pending request and leaves account evidence unchanged', async () => {
    await expect(setUserGroup(db, f.manager.id, f.student.id, 'LECTURER_STAFF')).rejects.toMatchObject({ code: 'VALIDATION' })
    expect(await user(f.student.id)).toMatchObject({ userGroup: 'STUDENT', requestedUserGroup: null })
    expect(await db.accessLog.count({ where: { userId: f.manager.id, action: 'ACCOUNT_CHANGE' } })).toBe(0)
    expect(await db.notification.count({ where: { userId: f.student.id, type: 'GROUP_CHANGED' } })).toBe(0)
  })

  it('rejects a target different from the pending request without consuming it', async () => {
    await requestGroupChange(db, f.student.id, 'LECTURER_STAFF')
    const logsBefore = await db.accessLog.count({ where: { action: 'ACCOUNT_CHANGE' } })
    await expect(setUserGroup(db, f.manager.id, f.student.id, 'STUDENT')).rejects.toMatchObject({ code: 'VALIDATION' })
    expect(await user(f.student.id)).toMatchObject({ userGroup: 'STUDENT', requestedUserGroup: 'LECTURER_STAFF' })
    expect(await db.accessLog.count({ where: { action: 'ACCOUNT_CHANGE' } })).toBe(logsBefore)
    expect(await db.notification.count({ where: { userId: f.student.id, type: 'GROUP_CHANGED' } })).toBe(0)
  })

  it('applies the group, clears the request, logs ACCOUNT_CHANGE and notifies the customer', async () => {
    await requestGroupChange(db, f.student.id, 'LECTURER_STAFF')
    await setUserGroup(db, f.manager.id, f.student.id, 'LECTURER_STAFF')

    expect(await user(f.student.id)).toMatchObject({ userGroup: 'LECTURER_STAFF', requestedUserGroup: null })
    const log = await db.accessLog.findFirst({ where: { userId: f.manager.id, action: 'ACCOUNT_CHANGE' } })
    expect(log?.target).toBe(`${f.student.id};group:STUDENT->LECTURER_STAFF`)
    expect(await db.notification.count({ where: { userId: f.student.id, type: 'GROUP_CHANGED' } })).toBe(1)
  })

  it('refuses a group for staff and managers', async () => {
    await expect(setUserGroup(db, f.manager.id, f.staff.id, 'STUDENT')).rejects.toMatchObject({ code: 'VALIDATION' })
  })

  it('an open session keeps its fee group; the next entry uses the new one', async () => {
    const v = await db.vehicle.create({
      data: { plate: '59B-381.01', qrCode: 'QR-381', rfidCode: 'RF-381', vehicleTypeCode: 'MOTORBIKE', ownerId: f.student.id },
    })
    const first = await recordEntry(db, { method: 'PLATE', identifier: v.plate, zoneId: f.zoneA.id, staffId: f.staff.id })
    await requestGroupChange(db, f.student.id, 'LECTURER_STAFF')
    await setUserGroup(db, f.manager.id, f.student.id, 'LECTURER_STAFF')
    expect((await db.parkingSession.findUniqueOrThrow({ where: { id: first.id } })).feeGroup).toBe('STUDENT')

    await db.parkingSession.update({ where: { id: first.id }, data: { status: 'CLOSED', exitTime: new Date() } })
    const second = await recordEntry(db, { method: 'PLATE', identifier: v.plate, zoneId: f.zoneA.id, staffId: f.staff.id })
    expect(second.feeGroup).toBe('LECTURER_STAFF')
  })

  it('PATCH /api/accounts/[id]: one change per request', async () => {
    asUser(f.manager, 'MANAGER')
    const ctx = { params: Promise.resolve({ id: f.student.id }) }
    expect((await call(accountPATCH as Handler, 'PATCH', { userGroup: 'LECTURER_STAFF' }, ctx)).status).toBe(400)
    await requestGroupChange(db, f.student.id, 'LECTURER_STAFF')
    expect((await call(accountPATCH as Handler, 'PATCH', { userGroup: 'LECTURER_STAFF' }, ctx)).body).toMatchObject({
      userGroup: 'LECTURER_STAFF',
    })
    expect((await call(accountPATCH as Handler, 'PATCH', { userGroup: 'LECTURER_STAFF' }, ctx)).status).toBe(400)
    expect((await call(accountPATCH as Handler, 'PATCH', { locked: true, userGroup: 'STUDENT' }, ctx)).status).toBe(400)
    expect((await call(accountPATCH as Handler, 'PATCH', { userGroup: 'GUEST' }, ctx)).status).toBe(400)
  })
})

describe('account APIs never return a password hash', () => {
  it('list, create and update responses have no passwordHash', async () => {
    asUser(f.manager, 'MANAGER')
    const list = await call(accountsGET as Handler, 'GET')
    expect(list.body.length).toBeGreaterThan(0)
    const created = await call(accountsPOST as Handler, 'POST', {
      email: 'new.staff@test.local',
      password: 'password123',
      name: 'N',
      role: 'STAFF',
    })
    const ctx = { params: Promise.resolve({ id: f.staff.id }) }
    const locked = await call(accountPATCH as Handler, 'PATCH', { locked: true }, ctx)
    for (const body of [...list.body, created.body, locked.body]) {
      expect(body).not.toHaveProperty('passwordHash')
    }
    expect(JSON.stringify(await listUsers(db))).not.toContain('$2')
    expect(await createStaffAccount(db, f.manager.id, { email: 'x@test.local', password: 'password123', name: 'X', role: 'STAFF' })).not.toHaveProperty('passwordHash')
  })
})
