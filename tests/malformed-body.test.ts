/**
 * A-28, KB-14: routes that read a JSON body must answer a body that is not a
 * JSON object with 400 VALIDATION, never 500, and must write nothing.
 * Route handlers are called directly, as in tests/contract-inout.test.ts.
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
import { POST as loginPOST } from '@/app/api/auth/login/route'
import { POST as registerPOST } from '@/app/api/auth/register/route'
import { POST as langPOST } from '@/app/api/lang/route'
import { POST as vehiclesPOST } from '@/app/api/vehicles/route'

type Handler = (r: Request, c: unknown) => Promise<Response>

const send = async (handler: Handler, body: string) => {
  const req = new Request('http://test.local/api', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body,
  })
  const res = await handler(req, {})
  return { status: res.status, body: await res.json() }
}

const MALFORMED = [
  ['not JSON', 'not json'],
  ['an array', '[1,2]'],
  ['a number', '42'],
  ['empty', ''],
] as const

const ROUTES: Array<[string, Handler]> = [
  ['POST /api/auth/login', loginPOST as Handler],
  ['POST /api/auth/register', registerPOST as Handler],
  ['POST /api/lang', langPOST as Handler],
  ['POST /api/vehicles', vehiclesPOST as Handler],
]

describe('malformed request bodies return 400 VALIDATION (A-28, KB-14)', () => {
  let f: Fixture

  beforeEach(async () => {
    await resetDb()
    f = await makeFixture()
    currentUser = {
      id: f.student.id,
      role: 'CUSTOMER',
      name: f.student.name,
      userGroup: f.student.userGroup ?? null,
    } as CurrentUser
  })

  for (const [route, handler] of ROUTES) {
    for (const [label, body] of MALFORMED) {
      it(`${route} with ${label} body`, async () => {
        const res = await send(handler, body)
        expect(res.status).toBe(400)
        expect(res.body).toEqual({ error: 'VALIDATION' })
      })
    }
  }

  it('a rejected registration creates no account and no log row', async () => {
    const users = await db.user.count()
    const logs = await db.accessLog.count()
    for (const [, body] of MALFORMED) await send(registerPOST as Handler, body)
    expect(await db.user.count()).toBe(users)
    expect(await db.accessLog.count()).toBe(logs)
  })

  it('a rejected vehicle POST creates no vehicle', async () => {
    const vehicles = await db.vehicle.count()
    for (const [, body] of MALFORMED) await send(vehiclesPOST as Handler, body)
    expect(await db.vehicle.count()).toBe(vehicles)
  })

  it('POST /api/vehicles still checks the role before the body', async () => {
    currentUser = null
    const res = await send(vehiclesPOST as Handler, 'not json')
    expect(res.status).toBe(401)
  })
})
