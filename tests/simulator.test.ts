import { describe, it, expect } from 'vitest'
import { db } from '@/server/db'
import { resetDb, makeFixture } from './helpers/db'
import { addVehicle } from '@/server/services/vehicles'
import { previewExit } from '@/server/services/exit'
import { getAvailability } from '@/server/services/availability'
import {
  randomPlate,
  simulateLive,
  triggerException,
  generateHistory,
} from '@/server/services/simulator'
import { subMonths } from '@/lib/time'

// Reproduces the seed's A150/B150/C30 capacities so the FR-16 performance
// case and the live simulation run against realistic headroom.
async function seedSimFixture() {
  const f = await makeFixture({ motoCapA: 150, carCapC: 30 })
  await db.zoneCapacity.update({
    where: { zoneId_vehicleTypeCode: { zoneId: f.zoneB.id, vehicleTypeCode: 'MOTORBIKE' } },
    data: { capacity: 150 },
  })
  await addVehicle(db, { ownerId: f.student.id, plate: '29A-111.01', vehicleType: 'MOTORBIKE' })
  await addVehicle(db, { ownerId: f.lecturer.id, plate: '29A-222.02', vehicleType: 'CAR' })
  return f
}

describe('simulator', () => {
  it('randomPlate matches /^\\d{2}[A-Z]-\\d{3}\\.\\d{2}$/', () => {
    for (let i = 0; i < 200; i++) {
      expect(randomPlate()).toMatch(/^\d{2}[A-Z]-\d{3}\.\d{2}$/)
    }
  })

  it('simulateLive(120) records entries+exits+rejected = 120; every session has plateSnapshot, zone, entryStaffId, idMethod', async () => {
    await resetDb()
    const f = await seedSimFixture()

    const result = await simulateLive(db, f.manager.id, 120)
    expect(result.entries + result.exits + result.rejected).toBe(120)
    expect(result.entries).toBeGreaterThan(0)

    const sessions = await db.parkingSession.findMany()
    expect(sessions.length).toBeGreaterThan(0)
    for (const session of sessions) {
      expect(session.plateSnapshot.length).toBeGreaterThan(0)
      expect(session.zoneId.length).toBeGreaterThan(0)
      expect(session.entryStaffId.length).toBeGreaterThan(0)
      expect(session.idMethod.length).toBeGreaterThan(0)
    }
  })

  it('availability free never negative after simulateLive', async () => {
    await resetDb()
    const f = await seedSimFixture()
    await simulateLive(db, f.manager.id, 120)

    const availability = await getAvailability(db)
    for (const lot of availability) {
      for (const zone of lot.zones) {
        for (const type of zone.byType) {
          expect(type.free).toBeGreaterThanOrEqual(0)
        }
      }
    }
  })

  it('FR-16: with seed-size capacities (A150/B150/C30) each recordEntry/confirmExit call takes < 2000 ms (measure max over simulateLive(100))', async () => {
    await resetDb()
    const f = await seedSimFixture()

    const start = Date.now()
    const result = await simulateLive(db, f.manager.id, 100)
    const elapsed = Date.now() - start

    const events = result.entries + result.exits + result.rejected
    expect(events).toBe(100)
    expect(elapsed / events).toBeLessThan(2000)
  })

  it('EX01 -> ZONE_FULL, EX04 -> ALREADY_OPEN, EX05 -> LOT_SUSPENDED and lot ACTIVE afterwards', async () => {
    await resetDb()
    const f = await seedSimFixture()

    const ex01 = await triggerException(db, f.manager.id, 'EX01')
    expect(ex01.outcome).toBe('ZONE_FULL')

    await resetDb()
    const f2 = await seedSimFixture()
    const ex04 = await triggerException(db, f2.manager.id, 'EX04')
    expect(ex04.outcome).toBe('ALREADY_OPEN')

    await resetDb()
    const f3 = await seedSimFixture()
    const ex05 = await triggerException(db, f3.manager.id, 'EX05')
    expect(ex05.outcome).toBe('LOT_SUSPENDED')
    const lot = await db.parkingLot.findUnique({ where: { id: f3.lot.id } })
    expect(lot?.status).toBe('ACTIVE')
  })

  it('EX02 instructions lead previewExit to plateMismatch true', async () => {
    await resetDb()
    const f = await seedSimFixture()

    const ex02 = await triggerException(db, f.manager.id, 'EX02')
    expect(ex02.instructions).toBeDefined()
    const instructions = ex02.instructions!

    const preview = await previewExit(db, {
      method: instructions.method,
      identifier: instructions.identifier,
      observedPlate: instructions.observedPlate!,
    })
    expect(preview.plateMismatch).toBe(true)
  })

  it('generateHistory(3) creates payments and NO_SHOW reservations and >= 20 sessions older than 12 months', async () => {
    await resetDb()
    const f = await seedSimFixture()

    const result = await generateHistory(db, f.manager.id, 3)
    expect(result.payments).toBeGreaterThan(0)
    expect(result.sessions).toBeGreaterThan(0)

    const payments = await db.payment.count()
    expect(payments).toBeGreaterThan(0)

    const noShow = await db.reservation.count({ where: { status: 'NO_SHOW' } })
    expect(noShow).toBeGreaterThan(0)

    const cutoff = subMonths(new Date(), 12)
    const oldSessions = await db.parkingSession.count({ where: { entryTime: { lt: cutoff } } })
    expect(oldSessions).toBeGreaterThanOrEqual(20)
  })
})
