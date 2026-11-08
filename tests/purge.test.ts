import { describe, it, expect } from 'vitest'
import { db } from '@/server/db'
import { resetDb, makeFixture } from './helpers/db'
import { purgeOldData } from '@/server/services/purge'
import { subMonths } from '@/lib/time'

const NOW = new Date('2026-06-15T10:00:00.000Z')
const OLD = subMonths(NOW, 13)
const RECENT = subMonths(NOW, 11)

async function makeVehicle(plate: string, ownerId: string | null) {
  return db.vehicle.create({
    data: {
      plate,
      qrCode: `qr-${plate}`,
      rfidCode: `rfid-${plate}`,
      vehicleTypeCode: 'MOTORBIKE',
      ownerId,
    },
  })
}

async function makeSession(vehicleId: string, plate: string, zoneId: string, staffId: string, entryTime: Date) {
  return db.parkingSession.create({
    data: {
      vehicleId,
      plateSnapshot: plate,
      zoneId,
      vehicleTypeCode: 'MOTORBIKE',
      feeGroup: 'GUEST',
      idMethod: 'PLATE',
      entryTime,
      exitTime: entryTime,
      entryStaffId: staffId,
      status: 'CLOSED',
    },
  })
}

describe('purge service', () => {
  it('masks sessions older than 12 months, keeps newer ones', async () => {
    await resetDb()
    const f = await makeFixture()
    const v = await makeVehicle('51F-10001', f.student.id)
    const oldSession = await makeSession(v.id, '51F-10001', f.zoneA.id, f.staff.id, OLD)
    const recentSession = await makeSession(v.id, '51F-10001', f.zoneA.id, f.staff.id, RECENT)

    const result = await purgeOldData(db, f.manager.id, NOW)
    expect(result.sessionsMasked).toBe(1)

    const refreshedOld = await db.parkingSession.findUnique({ where: { id: oldSession.id } })
    const refreshedRecent = await db.parkingSession.findUnique({ where: { id: recentSession.id } })
    expect(refreshedOld?.plateSnapshot).toBe('[purged]')
    expect(refreshedRecent?.plateSnapshot).toBe('51F-10001')
  })

  it('deletes unowned vehicle with only old sessions; keeps owned and unowned-with-recent', async () => {
    await resetDb()
    const f = await makeFixture()

    const unownedOld = await makeVehicle('51F-20001', null)
    await makeSession(unownedOld.id, '51F-20001', f.zoneA.id, f.staff.id, OLD)

    const ownedOld = await makeVehicle('51F-20002', f.student.id)
    await makeSession(ownedOld.id, '51F-20002', f.zoneA.id, f.staff.id, OLD)

    const unownedRecent = await makeVehicle('51F-20003', null)
    await makeSession(unownedRecent.id, '51F-20003', f.zoneA.id, f.staff.id, RECENT)

    const result = await purgeOldData(db, f.manager.id, NOW)
    expect(result.vehiclesDeleted).toBe(1)

    expect(await db.vehicle.findUnique({ where: { id: unownedOld.id } })).toBeNull()
    expect(await db.vehicle.findUnique({ where: { id: ownedOld.id } })).not.toBeNull()
    expect(await db.vehicle.findUnique({ where: { id: unownedRecent.id } })).not.toBeNull()

    // old session's vehicleId nulled before deletion
    const orphan = await db.parkingSession.findFirst({ where: { plateSnapshot: '[purged]', zoneId: f.zoneA.id } })
    expect(orphan?.vehicleId).toBeNull()
  })

  it('keeps an unowned vehicle whose old session is still OPEN, so it can still exit', async () => {
    await resetDb()
    const f = await makeFixture()
    const v = await makeVehicle('51F-50001', null)
    const open = await db.parkingSession.create({
      data: {
        vehicleId: v.id,
        plateSnapshot: '51F-50001',
        zoneId: f.zoneA.id,
        vehicleTypeCode: 'MOTORBIKE',
        feeGroup: 'GUEST',
        idMethod: 'PLATE',
        entryTime: OLD,
        entryStaffId: f.staff.id,
        status: 'OPEN',
      },
    })

    const result = await purgeOldData(db, f.manager.id, NOW)
    expect(result.vehiclesDeleted).toBe(0)
    expect(result.sessionsMasked).toBe(0)

    expect(await db.vehicle.findUnique({ where: { id: v.id } })).not.toBeNull()
    const refreshed = await db.parkingSession.findUnique({ where: { id: open.id } })
    expect(refreshed?.vehicleId).toBe(v.id)
    expect(refreshed?.plateSnapshot).toBe('51F-50001')
  })

  it('logs PURGE with counts', async () => {
    await resetDb()
    const f = await makeFixture()
    const v = await makeVehicle('51F-30001', null)
    await makeSession(v.id, '51F-30001', f.zoneA.id, f.staff.id, OLD)

    const result = await purgeOldData(db, f.manager.id, NOW)

    const log = await db.accessLog.findFirst({ where: { action: 'PURGE' }, orderBy: { createdAt: 'desc' } })
    expect(log).not.toBeNull()
    expect(log?.target).toBe(`${result.sessionsMasked} sessions, ${result.vehiclesDeleted} vehicles`)
  })

  it('second purge reports 0 sessionsMasked', async () => {
    await resetDb()
    const f = await makeFixture()
    const v = await makeVehicle('51F-40001', f.student.id)
    await makeSession(v.id, '51F-40001', f.zoneA.id, f.staff.id, OLD)

    await purgeOldData(db, f.manager.id, NOW)
    const second = await purgeOldData(db, f.manager.id, NOW)
    expect(second.sessionsMasked).toBe(0)
  })
})
