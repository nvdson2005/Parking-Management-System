// A-68 D-01 (ISS-11): one simulator action at a time.
// On 24/11 a page reload re-enabled the run button and a second 100-session run
// started while the first was still running (21 rejected, 200 sessions). The
// server must refuse the second request with 409 SIMULATOR_BUSY.
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import type { CurrentUser } from '@/server/auth/session'

let currentUser: CurrentUser | null = null
vi.mock('@/server/auth/session', async (orig) => ({
  ...(await orig<typeof import('@/server/auth/session')>()),
  getCurrentUser: async () => currentUser,
}))

import { db } from '@/server/db'
import { DomainError } from '@/server/errors'
import { resetDb, makeFixture, type Fixture } from './helpers/db'
import { POST as simPOST } from '@/app/api/simulator/route'
import { isSimulatorBusy, runSimulatorExclusive } from '@/server/services/simulator'

const call = async (body: unknown) => {
  const req = new Request('http://test.local/api/simulator', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  const res = await simPOST(req, {})
  return { status: res.status, body: await res.json() }
}

async function waitUntilBusy() {
  for (let i = 0; i < 200 && !isSimulatorBusy(); i++) {
    await new Promise((r) => setTimeout(r, 5))
  }
  expect(isSimulatorBusy()).toBe(true)
}

let f: Fixture
beforeEach(async () => {
  await resetDb()
  f = await makeFixture()
  currentUser = {
    id: f.manager.id,
    role: 'MANAGER',
    name: f.manager.name,
    userGroup: f.manager.userGroup ?? null,
  } as CurrentUser
})
afterEach(() => {
  expect(isSimulatorBusy()).toBe(false)
})

describe('simulator runs one action at a time (A-68 D-01)', () => {
  it('a second live run while one is running gets 409 SIMULATOR_BUSY and writes nothing', async () => {
    const first = call({ action: 'live', n: 20, seed: 68 })
    await waitUntilBusy()

    const second = await call({ action: 'live', n: 20, seed: 7 })
    expect(second).toEqual({ status: 409, body: { error: 'SIMULATOR_BUSY' } })

    const done = await first
    expect(done.status).toBe(200)
    const { entries, exits, rejected } = done.body as { entries: number; exits: number; rejected: number }
    expect(entries + exits + rejected).toBe(20)
    // Only the first run created sessions.
    expect(await db.parkingSession.count()).toBe(entries)
  }, 30_000)

  it('exception and history requests are also refused while a live run is running', async () => {
    const first = call({ action: 'live', n: 20, seed: 68 })
    await waitUntilBusy()

    expect(await call({ action: 'exception', ex: 'EX04' })).toEqual({ status: 409, body: { error: 'SIMULATOR_BUSY' } })
    expect(await call({ action: 'history', days: 1 })).toEqual({ status: 409, body: { error: 'SIMULATOR_BUSY' } })

    expect((await first).status).toBe(200)
  }, 30_000)

  it('a new run is accepted after the previous one finished', async () => {
    expect((await call({ action: 'live', n: 5, seed: 1 })).status).toBe(200)
    expect((await call({ action: 'live', n: 5, seed: 2 })).status).toBe(200)
  }, 30_000)

  it('invalid input is still 400 VALIDATION, not SIMULATOR_BUSY', async () => {
    expect(await call({ action: 'live', n: 'abc' })).toEqual({ status: 400, body: { error: 'VALIDATION' } })
  })

  it('the busy flag is cleared when the action throws', async () => {
    await expect(
      runSimulatorExclusive(async () => {
        throw new DomainError('ZONE_FULL', 'boom')
      }),
    ).rejects.toMatchObject({ code: 'ZONE_FULL' })
    expect(isSimulatorBusy()).toBe(false)
    expect(await runSimulatorExclusive(async () => 'ok')).toBe('ok')
  })

  it('SIMULATOR_BUSY maps to HTTP 409', () => {
    expect(new DomainError('SIMULATOR_BUSY', 'busy').status).toBe(409)
  })
})
