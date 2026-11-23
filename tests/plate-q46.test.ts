import { describe, it, expect, vi, beforeEach } from 'vitest'
import type { CurrentUser } from '@/server/auth/session'

// Q46 (23/11): on a session that has ended, Staff see the plate masked and a
// Manager sees it in full. A full plate shown is logged as VIEW_FULL_PLATE.

let currentUser: CurrentUser | null = null
vi.mock('@/server/auth/session', async (orig) => ({
  ...(await orig<typeof import('@/server/auth/session')>()),
  getCurrentUser: async () => currentUser,
}))
vi.mock('@/i18n', async (orig) => ({
  ...(await orig<typeof import('@/i18n')>()),
  getLang: async () => 'en' as const,
}))

import { renderToStaticMarkup } from 'react-dom/server'
import { db } from '@/server/db'
import { resetDb, makeFixture, type Fixture } from './helpers/db'
import { listSessions } from '@/server/services/sessions'
import SessionDetailPage from '@/app/staff/sessions/[id]/page'

// vitest compiles JSX with the classic runtime, which needs React in scope.
vi.stubGlobal('React', await import('react'))

const PLATE = '59X1-678.90'
const MASKED = '59X1-***.90'

let f: Fixture
let staff: CurrentUser
let manager: CurrentUser

async function session(status: 'OPEN' | 'CLOSED') {
  const now = new Date()
  return db.parkingSession.create({
    data: {
      plateSnapshot: PLATE,
      zoneId: f.zoneA.id,
      vehicleTypeCode: 'MOTORBIKE',
      feeGroup: 'GUEST',
      idMethod: 'PLATE',
      entryTime: now,
      exitTime: status === 'CLOSED' ? now : null,
      entryStaffId: f.staff.id,
      exitStaffId: status === 'CLOSED' ? f.staff.id : null,
      status,
    },
  })
}

async function detail(id: string): Promise<string> {
  return renderToStaticMarkup(await SessionDetailPage({ params: Promise.resolve({ id }) }))
}
const views = () => db.accessLog.count({ where: { action: 'VIEW_FULL_PLATE' } })

beforeEach(async () => {
  await resetDb()
  f = await makeFixture()
  staff = { id: f.staff.id, role: 'STAFF', name: 'T', userGroup: null }
  manager = { id: f.manager.id, role: 'MANAGER', name: 'M', userGroup: null }
})

describe('session lists and GET /api/sessions (listSessions)', () => {
  it('Staff: open sessions in full, closed sessions masked', async () => {
    await session('OPEN')
    await session('CLOSED')
    expect((await listSessions(db, { status: 'OPEN' }, staff))[0].plate).toBe(PLATE)
    expect((await listSessions(db, { status: 'CLOSED' }, staff))[0].plate).toBe(MASKED)
  })

  it('Manager: closed sessions in full', async () => {
    await session('CLOSED')
    expect((await listSessions(db, { status: 'CLOSED' }, manager))[0].plate).toBe(PLATE)
  })
})

describe('session detail page', () => {
  it('Staff on a closed session: masked plate, no VIEW_FULL_PLATE row', async () => {
    currentUser = staff
    const s = await session('CLOSED')
    const html = await detail(s.id)
    expect(html).toContain(MASKED)
    expect(html).not.toContain(PLATE)
    expect(await views()).toBe(0)
  })

  it('Staff on an open session: full plate, one VIEW_FULL_PLATE row', async () => {
    currentUser = staff
    const s = await session('OPEN')
    expect(await detail(s.id)).toContain(PLATE)
    expect(await views()).toBe(1)
  })

  it('Manager on a closed session: full plate, one VIEW_FULL_PLATE row', async () => {
    currentUser = manager
    const s = await session('CLOSED')
    expect(await detail(s.id)).toContain(PLATE)
    expect(await views()).toBe(1)
  })
})
