/**
 * A-65: read endpoints. G-08 (Q34) staff lookup and active reservations;
 * KB-15 access log, sessions and payments. Route handlers are called directly
 * with getCurrentUser mocked, as in tests/contract-inout.test.ts.
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
import { addMinutes } from '@/lib/time'
import { GET as lookupGET } from '@/app/api/staff/lookup/route'
import { GET as activeGET } from '@/app/api/staff/reservations/route'
import { GET as accessLogsGET } from '@/app/api/access-logs/route'
import { GET as sessionsGET } from '@/app/api/sessions/route'
import { GET as paymentsGET } from '@/app/api/payments/route'

type Handler = (r: Request, c: unknown) => Promise<Response>
type Role = 'STAFF' | 'MANAGER' | 'CUSTOMER'

const get = async (handler: Handler, query = '') => {
  const res = await handler(new Request(`http://test.local/api${query}`), {})
  return { status: res.status, body: await res.json() }
}

let f: Fixture
const as = (role: Role | null) => {
  if (!role) {
    currentUser = null
    return
  }
  const u = role === 'STAFF' ? f.staff : role === 'MANAGER' ? f.manager : f.student
  currentUser = { id: u.id, role, name: u.name, userGroup: u.userGroup ?? null } as CurrentUser
}

beforeEach(async () => {
  await resetDb()
  f = await makeFixture()
})

describe('GET /api/staff/lookup (A-65, G-08)', () => {
  beforeEach(async () => {
    const v = await db.vehicle.create({
      data: { plate: '51F-700.01', qrCode: 'QR-700', rfidCode: 'RF-700', vehicleTypeCode: 'MOTORBIKE', ownerId: f.student.id },
    })
    const now = new Date()
    await db.reservation.create({
      data: {
        customerId: f.student.id,
        vehicleId: v.id,
        zoneId: f.zoneA.id,
        vehicleTypeCode: 'MOTORBIKE',
        arrivalTime: addMinutes(now, 15),
        holdUntil: addMinutes(now, 45),
        status: 'PENDING',
      },
    })
  })

  it('returns vehicle, session and reservation to STAFF and MANAGER', async () => {
    for (const role of ['STAFF', 'MANAGER'] as const) {
      as(role)
      const res = await get(lookupGET as Handler, '?method=PLATE&identifier=51F70001')
      expect(res.status).toBe(200)
      expect(res.body.vehicle).toMatchObject({ plate: '51F-700.01', hasOwner: true })
      expect(res.body.openSession).toBeNull()
      expect(res.body.activeReservation).toMatchObject({ zoneName: 'A' })
    }
  })

  it('refuses CUSTOMER (403) and signed-out visitors (401)', async () => {
    as('CUSTOMER')
    expect((await get(lookupGET as Handler, '?method=PLATE&identifier=51F70001')).status).toBe(403)
    as(null)
    expect((await get(lookupGET as Handler, '?method=PLATE&identifier=51F70001')).status).toBe(401)
  })

  it('returns 404 NOT_FOUND for an unknown plate and 400 VALIDATION for a missing identifier', async () => {
    as('STAFF')
    expect(await get(lookupGET as Handler, '?method=PLATE&identifier=00A00000')).toEqual({
      status: 404,
      body: { error: 'NOT_FOUND' },
    })
    expect(await get(lookupGET as Handler, '?method=PLATE')).toEqual({ status: 400, body: { error: 'VALIDATION' } })
    expect(await get(lookupGET as Handler, '?identifier=x')).toEqual({ status: 400, body: { error: 'VALIDATION' } })
  })
})

describe('GET /api/staff/reservations (A-65, G-08)', () => {
  it('lists active reservations for STAFF and refuses CUSTOMER', async () => {
    const v = await db.vehicle.create({
      data: { plate: '51F-710.01', qrCode: 'QR-710', rfidCode: 'RF-710', vehicleTypeCode: 'MOTORBIKE', ownerId: f.student.id },
    })
    const now = new Date()
    await db.reservation.create({
      data: {
        customerId: f.student.id,
        vehicleId: v.id,
        zoneId: f.zoneB.id,
        vehicleTypeCode: 'MOTORBIKE',
        arrivalTime: addMinutes(now, 15),
        holdUntil: addMinutes(now, 45),
        status: 'PENDING',
      },
    })

    as('STAFF')
    const all = await get(activeGET as Handler)
    expect(all.status).toBe(200)
    expect(all.body).toHaveLength(1)
    expect(all.body[0]).toMatchObject({ plate: '51F-710.01', zoneName: 'B' })
    expect((await get(activeGET as Handler, `?zoneId=${f.zoneA.id}`)).body).toEqual([])

    as('CUSTOMER')
    expect((await get(activeGET as Handler)).status).toBe(403)
  })
})

// ---- KB-15: read endpoints for the access log, sessions and payments ----

async function closedSession(plate: string, ownerId: string | null, entryTime: Date, amount?: number, paidAt?: Date) {
  const s = await db.parkingSession.create({
    data: {
      plateSnapshot: plate,
      zoneId: f.zoneA.id,
      vehicleTypeCode: 'MOTORBIKE',
      feeGroup: ownerId ? 'STUDENT' : 'GUEST',
      idMethod: 'PLATE',
      entryTime,
      exitTime: entryTime,
      entryStaffId: f.staff.id,
      status: 'CLOSED',
      ownerId,
    },
  })
  if (amount !== undefined) {
    await db.payment.create({ data: { sessionId: s.id, amount, paidAt: paidAt ?? entryTime, confirmedById: f.staff.id } })
  }
  return s
}

describe('GET /api/access-logs (A-65, KB-15)', () => {
  it('returns the newest entries first to MANAGER, honours limit, validates it', async () => {
    await db.accessLog.create({ data: { userId: f.staff.id, action: 'LOGIN', createdAt: new Date('2026-11-20T08:00:00Z') } })
    await db.accessLog.create({ data: { userId: null, action: 'PURGE', target: '0 sessions, 0 vehicles', createdAt: new Date('2026-11-21T08:00:00Z') } })

    as('MANAGER')
    const all = await get(accessLogsGET as Handler)
    expect(all.status).toBe(200)
    expect(all.body.map((l: { action: string }) => l.action)).toEqual(['PURGE', 'LOGIN'])
    expect(all.body[0].userName).toBeNull()
    expect(all.body[1].userName).toBe(f.staff.name)

    expect((await get(accessLogsGET as Handler, '?limit=1')).body).toHaveLength(1)
    expect((await get(accessLogsGET as Handler, '?limit=0')).status).toBe(400)
    expect((await get(accessLogsGET as Handler, '?limit=501')).status).toBe(400)
    expect((await get(accessLogsGET as Handler, '?limit=abc')).status).toBe(400)
  })

  it('refuses STAFF and CUSTOMER', async () => {
    as('STAFF')
    expect((await get(accessLogsGET as Handler)).status).toBe(403)
    as('CUSTOMER')
    expect((await get(accessLogsGET as Handler)).status).toBe(403)
  })
})

describe('GET /api/sessions (A-65, KB-15)', () => {
  it('returns OPEN sessions by default and CLOSED on request, newest first', async () => {
    await closedSession('51F-800.01', null, new Date('2026-11-20T08:00:00Z'))
    const open = await db.parkingSession.create({
      data: {
        plateSnapshot: '51F-800.02',
        zoneId: f.zoneB.id,
        vehicleTypeCode: 'MOTORBIKE',
        feeGroup: 'GUEST',
        idMethod: 'QR',
        entryTime: new Date('2026-11-23T08:00:00Z'),
        entryStaffId: f.staff.id,
        status: 'OPEN',
      },
    })

    as('STAFF')
    const res = await get(sessionsGET as Handler)
    expect(res.status).toBe(200)
    expect(res.body).toHaveLength(1)
    expect(res.body[0]).toMatchObject({ id: open.id, plate: '51F-800.02', zoneName: 'B', status: 'OPEN' })

    // Q46: Staff see an ended session's plate masked; a Manager sees it in full.
    const closed = await get(sessionsGET as Handler, '?status=CLOSED')
    expect(closed.body.map((s: { plate: string }) => s.plate)).toEqual(['51F-***.01'])
    as('MANAGER')
    const closedForManager = await get(sessionsGET as Handler, '?status=CLOSED')
    expect(closedForManager.body.map((s: { plate: string }) => s.plate)).toEqual(['51F-800.01'])
    expect((await get(sessionsGET as Handler, '?status=X')).status).toBe(400)
  })

  it('refuses CUSTOMER', async () => {
    as('CUSTOMER')
    expect((await get(sessionsGET as Handler)).status).toBe(403)
  })
})

describe('GET /api/payments (A-65, KB-15)', () => {
  it('MANAGER sees all confirmed payments and can filter by time', async () => {
    await closedSession('51F-900.01', f.student.id, new Date('2026-11-10T08:00:00Z'), 2000)
    await closedSession('51F-900.02', null, new Date('2026-11-20T08:00:00Z'), 5000)

    as('MANAGER')
    const all = await get(paymentsGET as Handler)
    expect(all.status).toBe(200)
    expect(all.body.map((p: { amount: number }) => p.amount)).toEqual([5000, 2000])

    const ranged = await get(paymentsGET as Handler, '?from=2026-11-15T00:00:00Z&to=2026-11-25T00:00:00Z')
    expect(ranged.body.map((p: { amount: number }) => p.amount)).toEqual([5000])
    expect((await get(paymentsGET as Handler, '?from=notadate')).status).toBe(400)
  })

  it('CUSTOMER sees only their own history; STAFF is refused', async () => {
    await closedSession('51F-910.01', f.student.id, new Date('2026-11-10T08:00:00Z'), 2000)
    await closedSession('51F-910.02', f.lecturer.id, new Date('2026-11-11T08:00:00Z'), 2000)

    as('CUSTOMER')
    const mine = await get(paymentsGET as Handler)
    expect(mine.status).toBe(200)
    expect(mine.body.map((h: { plate: string }) => h.plate)).toEqual(['51F-910.01'])

    as('STAFF')
    expect((await get(paymentsGET as Handler)).status).toBe(403)
  })
})
