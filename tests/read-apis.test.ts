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
