/**
 * Audit rows that FR-43 requires commit with the change they record (fresh
 * review of PR #11, same defect kind as RES-01's registration finding). A
 * SQLite trigger makes every access-log insert fail; each change must then
 * leave nothing behind.
 */
import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { db } from '@/server/db'
import { resetDb, makeFixture, type Fixture } from './helpers/db'
import { createLot, createZone, updateLot, updateZone } from '@/server/services/lots'
import { createStaffAccount, setLocked } from '@/server/services/accounts'
import { setTariff } from '@/server/services/tariffs'
import { purgeOldData } from '@/server/services/purge'
import { recordEntry } from '@/server/services/entry'
import { confirmExit } from '@/server/services/exit'
import { subMonths } from '@/lib/time'

let f: Fixture

const failLogs = () =>
  db.$executeRawUnsafe("CREATE TRIGGER fail_log BEFORE INSERT ON access_logs BEGIN SELECT RAISE(ABORT, 'log down'); END;")

beforeEach(async () => {
  await resetDb()
  f = await makeFixture()
})
afterEach(async () => {
  await db.$executeRawUnsafe('DROP TRIGGER IF EXISTS fail_log;')
})

describe('lots, zones and tariffs', () => {
  it('createLot and createZone leave no lot or zone', async () => {
    await failLogs()
    await expect(createLot(db, f.manager.id, { name: 'X', address: 'y' })).rejects.toThrow()
    await expect(createZone(db, f.manager.id, { lotId: f.lot.id, name: 'Z', capacities: { MOTORBIKE: 1 } })).rejects.toThrow()
    expect(await db.parkingLot.count()).toBe(1)
    expect(await db.zone.count({ where: { name: 'Z' } })).toBe(0)
  })

  it('updateLot (manager and simulator paths, suspend too) and updateZone change nothing', async () => {
    await failLogs()
    await expect(updateLot(db, f.manager.id, f.lot.id, { name: 'Renamed' })).rejects.toThrow()
    await expect(updateLot(db, f.manager.id, f.lot.id, { status: 'SUSPENDED' })).rejects.toThrow()
    await expect(
      updateLot(db, f.manager.id, f.lot.id, { status: 'SUSPENDED' }, { cancelPendingReservations: false }),
    ).rejects.toThrow()
    await expect(updateZone(db, f.manager.id, f.zoneA.id, { name: 'Renamed' })).rejects.toThrow()
    expect(await db.parkingLot.findUniqueOrThrow({ where: { id: f.lot.id } })).toMatchObject({ name: 'Test Lot', status: 'ACTIVE' })
    expect((await db.zone.findUniqueOrThrow({ where: { id: f.zoneA.id } })).name).toBe('A')
  })

  it('setTariff keeps the old price', async () => {
    const before = await db.tariff.findUniqueOrThrow({
      where: { vehicleTypeCode_feeGroup: { vehicleTypeCode: 'MOTORBIKE', feeGroup: 'STUDENT' } },
    })
    await failLogs()
    await expect(setTariff(db, f.manager.id, { vehicleType: 'MOTORBIKE', feeGroup: 'STUDENT', price: before.price + 1 })).rejects.toThrow()
    expect(
      (await db.tariff.findUniqueOrThrow({ where: { vehicleTypeCode_feeGroup: { vehicleTypeCode: 'MOTORBIKE', feeGroup: 'STUDENT' } } })).price,
    ).toBe(before.price)
  })
})

describe('accounts', () => {
  it('createStaffAccount leaves no account and setLocked leaves the account unlocked', async () => {
    await failLogs()
    await expect(
      createStaffAccount(db, f.manager.id, { email: 'n@test.local', password: 'password123', name: 'N', role: 'STAFF' }),
    ).rejects.toThrow()
    await expect(setLocked(db, f.manager.id, f.staff.id, true)).rejects.toThrow()
    expect(await db.user.count({ where: { email: 'n@test.local' } })).toBe(0)
    expect((await db.user.findUniqueOrThrow({ where: { id: f.staff.id } })).locked).toBe(false)
  })
})

describe('purge and exit', () => {
  it('purgeOldData masks nothing when its PURGE row cannot be written', async () => {
    const old = subMonths(new Date(), 13)
    const s = await db.parkingSession.create({
      data: {
        plateSnapshot: '51F-900.01', zoneId: f.zoneA.id, vehicleTypeCode: 'MOTORBIKE', feeGroup: 'GUEST',
        idMethod: 'PLATE', entryTime: old, exitTime: old, entryStaffId: f.staff.id, status: 'CLOSED',
      },
    })
    await failLogs()
    await expect(purgeOldData(db, null)).rejects.toThrow()
    expect((await db.parkingSession.findUniqueOrThrow({ where: { id: s.id } })).plateSnapshot).toBe('51F-900.01')
  })

  it('confirmExit leaves the session open and unpaid when its EXIT row cannot be written', async () => {
    const s = await recordEntry(db, { method: 'PLATE', identifier: '51F-900.02', zoneId: f.zoneA.id, staffId: f.staff.id, vehicleType: 'MOTORBIKE' })
    await failLogs()
    await expect(
      confirmExit(db, { sessionId: s.id, observedPlate: '51F-900.02', confirmMismatch: false, lostCard: false, staffId: f.staff.id }),
    ).rejects.toThrow()
    expect((await db.parkingSession.findUniqueOrThrow({ where: { id: s.id } })).status).toBe('OPEN')
    expect(await db.payment.count({ where: { sessionId: s.id } })).toBe(0)
  })
})
