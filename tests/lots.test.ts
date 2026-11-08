import { describe, it, expect } from 'vitest'
import { db } from '@/server/db'
import { resetDb, makeFixture } from './helpers/db'
import { createLot, updateLot, createZone, updateZone } from '@/server/services/lots'
import { listTariffs, setTariff } from '@/server/services/tariffs'
import { getAvailability, getFree } from '@/server/services/availability'
import { computeFee } from '@/server/services/fees'
import { recordEntry } from '@/server/services/entry'

describe('lots/zones service', () => {
  it('creates second lot and zone; getAvailability returns 2 lots', async () => {
    await resetDb()
    const f = await makeFixture()

    const lot = await createLot(db, f.manager.id, { name: 'North Lot', address: '1 North St' })
    await createZone(db, f.manager.id, {
      lotId: lot.id,
      name: 'N1',
      capacities: { MOTORBIKE: 5, CAR: 3 },
    })

    const availability = await getAvailability(db)
    expect(availability).toHaveLength(2)

    const north = availability.find((a) => a.lotId === lot.id)
    expect(north?.lotName).toBe('North Lot')
    expect(north?.zones).toHaveLength(1)
    const byType = north?.zones[0].byType ?? []
    expect(byType.find((b) => b.vehicleType === 'MOTORBIKE')?.capacity).toBe(5)
    expect(byType.find((b) => b.vehicleType === 'CAR')?.capacity).toBe(3)
  })

  it('updating capacity changes free count and logs LOT_CHANGE', async () => {
    await resetDb()
    const f = await makeFixture()

    expect(await getFree(db, f.zoneA.id, 'MOTORBIKE')).toBe(2)

    const before = await db.accessLog.count({ where: { action: 'LOT_CHANGE' } })
    await updateZone(db, f.manager.id, f.zoneA.id, { capacities: { MOTORBIKE: 7 } })

    expect(await getFree(db, f.zoneA.id, 'MOTORBIKE')).toBe(7)
    const after = await db.accessLog.count({ where: { action: 'LOT_CHANGE' } })
    expect(after).toBe(before + 1)
  })

  it('suspend then reactivate lot toggles status; entry allowed again after reactivation', async () => {
    await resetDb()
    const f = await makeFixture()

    const suspended = await updateLot(db, f.manager.id, f.lot.id, { status: 'SUSPENDED' })
    expect(suspended.status).toBe('SUSPENDED')

    await expect(
      recordEntry(db, { method: 'PLATE', identifier: '51F-00001', zoneId: f.zoneA.id, vehicleType: 'MOTORBIKE', staffId: f.staff.id }),
    ).rejects.toMatchObject({ code: 'LOT_SUSPENDED' })

    const reactivated = await updateLot(db, f.manager.id, f.lot.id, { status: 'ACTIVE' })
    expect(reactivated.status).toBe('ACTIVE')

    const session = await recordEntry(db, {
      method: 'PLATE',
      identifier: '51F-00001',
      zoneId: f.zoneA.id,
      vehicleType: 'MOTORBIKE',
      staffId: f.staff.id,
    })
    expect(session.status).toBe('OPEN')
  })

  it('createLot logs LOT_CHANGE', async () => {
    await resetDb()
    const f = await makeFixture()

    const before = await db.accessLog.count({ where: { action: 'LOT_CHANGE' } })
    await createLot(db, f.manager.id, { name: 'East Lot', address: '2 East St' })
    const after = await db.accessLog.count({ where: { action: 'LOT_CHANGE' } })
    expect(after).toBe(before + 1)
  })
})

describe('tariffs service', () => {
  it('setTariff changes computeFee result and logs TARIFF_CHANGE', async () => {
    await resetDb()
    const f = await makeFixture()

    expect(await computeFee(db, 'MOTORBIKE', 'STUDENT')).toBe(2000)

    const before = await db.accessLog.count({ where: { action: 'TARIFF_CHANGE' } })
    const updated = await setTariff(db, f.manager.id, {
      vehicleType: 'MOTORBIKE',
      feeGroup: 'STUDENT',
      price: 4500,
    })
    expect(updated.price).toBe(4500)

    expect(await computeFee(db, 'MOTORBIKE', 'STUDENT')).toBe(4500)
    const after = await db.accessLog.count({ where: { action: 'TARIFF_CHANGE' } })
    expect(after).toBe(before + 1)
  })

  it('listTariffs returns all configured tariffs', async () => {
    await resetDb()
    const f = await makeFixture()

    const tariffs = await listTariffs(db)
    expect(tariffs).toHaveLength(6)
    expect(tariffs.every((tf) => typeof tf.price === 'number')).toBe(true)
    expect(f.manager.id).toBeTruthy()
  })
})

describe('validation', () => {
  it('rejects negative capacity/price with VALIDATION', async () => {
    await resetDb()
    const f = await makeFixture()

    await expect(
      createZone(db, f.manager.id, { lotId: f.lot.id, name: 'Bad', capacities: { MOTORBIKE: -1 } }),
    ).rejects.toMatchObject({ code: 'VALIDATION' })

    await expect(
      updateZone(db, f.manager.id, f.zoneA.id, { capacities: { CAR: -5 } }),
    ).rejects.toMatchObject({ code: 'VALIDATION' })

    await expect(
      setTariff(db, f.manager.id, { vehicleType: 'CAR', feeGroup: 'GUEST', price: -1 }),
    ).rejects.toMatchObject({ code: 'VALIDATION' })
  })

  it('rejects non-integer capacity/price with VALIDATION', async () => {
    await resetDb()
    const f = await makeFixture()

    await expect(
      createZone(db, f.manager.id, { lotId: f.lot.id, name: 'Bad', capacities: { MOTORBIKE: 1.5 } }),
    ).rejects.toMatchObject({ code: 'VALIDATION' })

    await expect(
      setTariff(db, f.manager.id, { vehicleType: 'CAR', feeGroup: 'GUEST', price: 2.5 }),
    ).rejects.toMatchObject({ code: 'VALIDATION' })
  })
})
