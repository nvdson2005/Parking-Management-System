import { describe, it, expect, vi } from 'vitest'
import { db } from '@/server/db'
import { resetDb, makeFixture } from './helpers/db'
import { addVehicle } from '@/server/services/vehicles'
import * as entryModule from '@/server/services/entry'
import * as exitModule from '@/server/services/exit'
import { previewExit } from '@/server/services/exit'
import { getAvailability } from '@/server/services/availability'
import {
  randomPlate,
  makeRng,
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

    // Instrument each entry/exit service call so we can assert the *maximum*
    // individual latency, not just the average, per FR-16.
    const durations: number[] = []
    const origEntry = entryModule.recordEntry
    const origConfirm = exitModule.confirmExit
    const entrySpy = vi
      .spyOn(entryModule, 'recordEntry')
      .mockImplementation(async (...args: Parameters<typeof origEntry>) => {
        const start = performance.now()
        try {
          return await origEntry(...args)
        } finally {
          durations.push(performance.now() - start)
        }
      })
    const confirmSpy = vi
      .spyOn(exitModule, 'confirmExit')
      .mockImplementation(async (...args: Parameters<typeof origConfirm>) => {
        const start = performance.now()
        try {
          return await origConfirm(...args)
        } finally {
          durations.push(performance.now() - start)
        }
      })

    try {
      const result = await simulateLive(db, f.manager.id, 100)
      const events = result.entries + result.exits + result.rejected
      expect(events).toBe(100)
      expect(durations.length).toBeGreaterThan(0)
      const maxDuration = Math.max(...durations)
      expect(maxDuration).toBeLessThan(2000)
    } finally {
      entrySpy.mockRestore()
      confirmSpy.mockRestore()
    }
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

  it('EX05 on a lot the manager already suspended keeps it SUSPENDED', async () => {
    await resetDb()
    const f = await seedSimFixture()
    await db.parkingLot.update({ where: { id: f.lot.id }, data: { status: 'SUSPENDED' } })

    const ex05 = await triggerException(db, f.manager.id, 'EX05')
    expect(ex05.outcome).toBe('LOT_SUSPENDED')
    const lot = await db.parkingLot.findUnique({ where: { id: f.lot.id } })
    expect(lot?.status).toBe('SUSPENDED')
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

  it('EX03 opens a session and returns lost-card instructions', async () => {
    await resetDb()
    const f = await seedSimFixture()

    const ex03 = await triggerException(db, f.manager.id, 'EX03')
    expect(ex03.outcome).toBe('SESSION_OPEN')
    expect(ex03.instructions).toBeDefined()
    expect(ex03.instructions!.method).toBe('PLATE')
    expect(ex03.instructions!.lostCard).toBe(true)

    const open = await db.parkingSession.findFirst({
      where: { status: 'OPEN', plateSnapshot: ex03.instructions!.identifier },
    })
    expect(open).not.toBeNull()
  })

  it('EX03 opens a session even when one zone for the vehicle type is full (no ZONE_FULL crash)', async () => {
    await resetDb()
    const f = await seedSimFixture()

    // Exhaust zone A/MOTORBIKE; zone B/MOTORBIKE still has free capacity, so
    // EX03 must route the seeded motorbike there instead of crashing.
    const capA = await db.zoneCapacity.findUniqueOrThrow({
      where: { zoneId_vehicleTypeCode: { zoneId: f.zoneA.id, vehicleTypeCode: 'MOTORBIKE' } },
    })
    await db.parkingSession.createMany({
      data: Array.from({ length: capA.capacity }, () => ({
        plateSnapshot: randomPlate(),
        zoneId: f.zoneA.id,
        vehicleTypeCode: 'MOTORBIKE',
        feeGroup: 'GUEST',
        idMethod: 'PLATE',
        entryTime: new Date(),
        entryStaffId: f.manager.id,
        status: 'OPEN',
      })),
    })

    const ex03 = await triggerException(db, f.manager.id, 'EX03')
    expect(ex03.outcome).toBe('SESSION_OPEN')
    expect(ex03.instructions!.lostCard).toBe(true)

    const open = await db.parkingSession.findFirst({
      where: { status: 'OPEN', plateSnapshot: ex03.instructions!.identifier },
      include: { zone: true },
    })
    expect(open).not.toBeNull()
    expect(open!.zoneId).toBe(f.zoneB.id)
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

  it('makeRng: same seed gives the same stream, ints stay in range and cover the span', () => {
    const a = makeRng(42)
    const b = makeRng(42)
    expect(Array.from({ length: 20 }, () => a.next())).toEqual(Array.from({ length: 20 }, () => b.next()))
    const r = makeRng(7)
    const seen = new Set<number>()
    for (let i = 0; i < 2000; i++) {
      const v = r.int(0, 999) // span > 256: the old randomBytes(1) % span could not reach this
      expect(v).toBeGreaterThanOrEqual(0)
      expect(v).toBeLessThanOrEqual(999)
      seen.add(v)
    }
    expect(Math.max(...seen)).toBeGreaterThan(256)
  })

  it('same seed on a fresh DB reproduces the same guest plates', async () => {
    const run = async () => {
      await resetDb()
      const f = await seedSimFixture()
      const res = await simulateLive(db, f.manager.id, 40, { seed: 1234 })
      const plates = (await db.parkingSession.findMany({ orderBy: { plateSnapshot: 'asc' } })).map(
        (x) => x.plateSnapshot,
      )
      return { res, plates }
    }
    const first = await run()
    const second = await run()
    expect(second.res).toEqual(first.res)
    expect(second.plates).toEqual(first.plates)
    expect(first.res.seed).toBe(1234)
  })

  it('minSessions mode opens >= 100 sessions (SC-07)', async () => {
    await resetDb()
    const f = await seedSimFixture()
    const result = await simulateLive(db, f.manager.id, 0, { minSessions: 100, seed: 99 })
    expect(result.sessions).toBeGreaterThanOrEqual(100)
    expect(result.sessions).toBe(result.entries)
    expect(await db.parkingSession.count()).toBeGreaterThanOrEqual(100)
  })

  it('live events use QR and RFID as well as PLATE', async () => {
    await resetDb()
    const f = await seedSimFixture()
    await simulateLive(db, f.manager.id, 300, { seed: 5 })
    const methods = new Set((await db.parkingSession.findMany()).map((x) => x.idMethod))
    expect(methods.has('PLATE')).toBe(true)
    expect(methods.has('QR') || methods.has('RFID')).toBe(true)
  })

  it('EX05 writes LOT_CHANGE audit entries; EX01 flags needsReset', async () => {
    await resetDb()
    const f = await seedSimFixture()
    const before = await db.accessLog.count({ where: { action: 'LOT_CHANGE' } })
    await triggerException(db, f.manager.id, 'EX05')
    expect(await db.accessLog.count({ where: { action: 'LOT_CHANGE' } })).toBe(before + 2)

    const ex01 = await triggerException(db, f.manager.id, 'EX01')
    expect(ex01.needsReset).toBe(true)
  })

  it('rejects invalid seed, minSessions and exitRatio', async () => {
    await resetDb()
    const f = await seedSimFixture()
    await expect(simulateLive(db, f.manager.id, 5, { seed: -1 })).rejects.toThrow()
    await expect(simulateLive(db, f.manager.id, 0, { minSessions: 0 })).rejects.toThrow()
    await expect(simulateLive(db, f.manager.id, 5, { exitRatio: 2 })).rejects.toThrow()
  })
})
