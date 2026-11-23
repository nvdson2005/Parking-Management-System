import { describe, it, expect, beforeEach } from 'vitest'
import { db } from '@/server/db'
import { resetDb, makeFixture, type Fixture } from './helpers/db'
import { recordEntry } from '@/server/services/entry'
import { confirmExit } from '@/server/services/exit'
import type { GateCode } from '@/lib/types'

let f: Fixture

beforeEach(async () => {
  await resetDb()
  f = await makeFixture()
})

function enter(gate?: GateCode | string) {
  return recordEntry(db, {
    method: 'PLATE',
    identifier: '99Z-00000',
    zoneId: f.zoneA.id,
    vehicleType: 'MOTORBIKE',
    staffId: f.staff.id,
    gate: gate as GateCode | undefined,
  })
}

describe('G-09 gate on parking sessions (FR-09)', () => {
  it('records the entry gate', async () => {
    const session = await enter('GATE-2')
    expect(session.entryGate).toBe('GATE-2')
    expect(session.exitGate).toBeNull()
  })

  it('defaults the entry gate to GATE-1', async () => {
    const session = await enter()
    expect(session.entryGate).toBe('GATE-1')
  })

  it('records the exit gate, defaulting to GATE-1', async () => {
    const a = await enter('GATE-1')
    const { session: closedA } = await confirmExit(db, {
      sessionId: a.id,
      observedPlate: '99Z-00000',
      confirmMismatch: false,
      lostCard: false,
      staffId: f.staff.id,
      gate: 'GATE-2',
    })
    expect(closedA.exitGate).toBe('GATE-2')

    const b = await enter()
    const { session: closedB } = await confirmExit(db, {
      sessionId: b.id,
      observedPlate: '99Z-00000',
      confirmMismatch: false,
      lostCard: false,
      staffId: f.staff.id,
    })
    expect(closedB.exitGate).toBe('GATE-1')
  })

  it('rejects an unknown gate with VALIDATION', async () => {
    await expect(enter('GATE-9')).rejects.toMatchObject({ code: 'VALIDATION' })
    expect(await db.parkingSession.count()).toBe(0)
  })
})
