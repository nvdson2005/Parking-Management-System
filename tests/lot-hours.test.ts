import { describe, it, expect, beforeEach } from 'vitest'
import { db } from '@/server/db'
import { resetDb, makeFixture, type Fixture } from './helpers/db'
import { createLot, listLotInfo, updateLot } from '@/server/services/lots'
import { recordEntry } from '@/server/services/entry'

// G-01 (FR-22, FR-26, Q37 on 23/11): opening hours, for information only.

let f: Fixture

beforeEach(async () => {
  await resetDb()
  f = await makeFixture()
})

describe('lot opening hours (G-01)', () => {
  it('a Manager sets, changes and clears the hours; customers see them in the lot information', async () => {
    await updateLot(db, f.manager.id, f.lot.id, { openTime: '06:00', closeTime: '22:00' })
    expect((await listLotInfo(db))[0]).toMatchObject({ name: 'Test Lot', openTime: '06:00', closeTime: '22:00' })

    await updateLot(db, f.manager.id, f.lot.id, { openTime: '05:30', closeTime: '23:00' })
    expect((await listLotInfo(db))[0]).toMatchObject({ openTime: '05:30', closeTime: '23:00' })

    await updateLot(db, f.manager.id, f.lot.id, { openTime: null, closeTime: null })
    expect((await listLotInfo(db))[0]).toMatchObject({ openTime: null, closeTime: null })
  })

  it('other lot fields can be changed without touching the hours', async () => {
    await updateLot(db, f.manager.id, f.lot.id, { openTime: '06:00', closeTime: '22:00' })
    await updateLot(db, f.manager.id, f.lot.id, { name: 'Renamed' })
    expect((await listLotInfo(db))[0]).toMatchObject({ name: 'Renamed', openTime: '06:00', closeTime: '22:00' })
  })

  it('a new lot can be created with or without hours', async () => {
    const withHours = await createLot(db, f.manager.id, { name: 'B', address: 'x', openTime: '07:00', closeTime: '21:00' })
    const without = await createLot(db, f.manager.id, { name: 'C', address: 'y' })
    expect(withHours).toMatchObject({ openTime: '07:00', closeTime: '21:00' })
    expect(without).toMatchObject({ openTime: null, closeTime: null })
  })

  it('rejects a malformed time or a time without its pair (400 VALIDATION)', async () => {
    for (const bad of [
      { openTime: '6:00', closeTime: '22:00' },
      { openTime: '24:00', closeTime: '22:00' },
      { openTime: '06:00' },
      { openTime: '06:00', closeTime: null },
    ]) {
      await expect(updateLot(db, f.manager.id, f.lot.id, bad)).rejects.toMatchObject({ code: 'VALIDATION' })
    }
  })

  it('does not block an entry outside the hours (information only)', async () => {
    const now = new Date()
    const closedNow = `${String((now.getHours() + 2) % 24).padStart(2, '0')}:00`
    const opensLater = `${String((now.getHours() + 1) % 24).padStart(2, '0')}:00`
    await updateLot(db, f.manager.id, f.lot.id, { openTime: opensLater, closeTime: closedNow })

    const session = await recordEntry(db, {
      method: 'PLATE',
      identifier: '59A-999.01',
      zoneId: f.zoneA.id,
      staffId: f.staff.id,
      vehicleType: 'MOTORBIKE',
    })
    expect(session.status).toBe('OPEN')
  })
})
