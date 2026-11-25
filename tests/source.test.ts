import { describe, it, expect, beforeEach } from 'vitest'
import { db } from '@/server/db'
import { resetDb, makeFixture, type Fixture } from './helpers/db'
import { recordEntry } from '@/server/services/entry'
import { confirmExit } from '@/server/services/exit'
import type { SessionSource } from '@/lib/types'

let f: Fixture

beforeEach(async () => {
  await resetDb()
  f = await makeFixture()
})

function enter(source?: SessionSource | string) {
  return recordEntry(db, {
    method: 'PLATE',
    identifier: '99Z-00000',
    zoneId: f.zoneA.id,
    vehicleType: 'MOTORBIKE',
    staffId: f.staff.id,
    source: source as SessionSource | undefined,
  })
}

function leave(sessionId: string, source?: SessionSource) {
  return confirmExit(db, {
    sessionId,
    observedPlate: '99Z-00000',
    confirmMismatch: false,
    lostCard: false,
    staffId: f.staff.id,
    source,
  })
}

describe('G-04 entry and exit source (FR-10)', () => {
  it('records a manual entry, and leaves exit_source empty while the session is open', async () => {
    const session = await enter('MANUAL')
    expect(session.entrySource).toBe('MANUAL')
    expect(session.exitSource).toBeNull()
  })

  it('defaults the entry source to DEVICE (simulator, device events)', async () => {
    const session = await enter()
    expect(session.entrySource).toBe('DEVICE')
  })

  it('records the exit source, defaulting to DEVICE', async () => {
    const a = await enter('DEVICE')
    const { session: closedA } = await leave(a.id, 'MANUAL')
    expect(closedA.exitSource).toBe('MANUAL')
    expect(closedA.entrySource).toBe('DEVICE')

    const b = await enter()
    const { session: closedB } = await leave(b.id)
    expect(closedB.exitSource).toBe('DEVICE')
  })

  it('rejects an unknown source with VALIDATION', async () => {
    await expect(enter('ROBOT')).rejects.toMatchObject({ code: 'VALIDATION' })
    expect(await db.parkingSession.count()).toBe(0)
  })
})
