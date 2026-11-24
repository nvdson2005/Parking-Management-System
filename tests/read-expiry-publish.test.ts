import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { db } from '@/server/db'
import { resetDb, makeFixture, type Fixture } from './helpers/db'
import { onAvailabilityChanged } from '@/server/bus'
import { staffLookup } from '@/server/services/lookup'
import { listActiveReservations } from '@/server/services/reservations'
import { addMinutes } from '@/lib/time'

// Review of PR #11 (A-65, G-08): reads that expire a hold publish availability.

let f: Fixture
let events = 0
let stop: () => void

beforeEach(async () => {
  await resetDb()
  f = await makeFixture()
  events = 0
  stop = onAvailabilityChanged(() => events++)
})
afterEach(() => stop())

async function lapsedHold(plate: string) {
  const now = new Date()
  const v = await db.vehicle.create({
    data: { plate, qrCode: `QR-${plate}`, rfidCode: `RFID-${plate}`, vehicleTypeCode: 'MOTORBIKE', ownerId: f.student.id },
  })
  const r = await db.reservation.create({
    data: {
      customerId: f.student.id,
      vehicleId: v.id,
      zoneId: f.zoneA.id,
      vehicleTypeCode: 'MOTORBIKE',
      arrivalTime: addMinutes(now, -60),
      holdUntil: addMinutes(now, -30),
      status: 'PENDING',
    },
  })
  return { v, r }
}

describe('read paths that expire a hold tell live viewers', () => {
  it('staffLookup publishes once when it expires a hold', async () => {
    const { v, r } = await lapsedHold('59A-111.11')
    await staffLookup(db, { method: 'PLATE', identifier: v.plate, viewerId: f.staff.id })
    expect((await db.reservation.findUnique({ where: { id: r.id } }))!.status).toBe('NO_SHOW')
    expect(events).toBe(1)
  })

  it('staffLookup publishes even when the identifier is then NOT_FOUND', async () => {
    await lapsedHold('59A-222.22')
    await expect(
      staffLookup(db, { method: 'PLATE', identifier: 'NOPE-000', viewerId: f.staff.id }),
    ).rejects.toMatchObject({ code: 'NOT_FOUND' })
    expect(events).toBe(1)
  })

  it('listActiveReservations publishes when it expires a hold', async () => {
    await lapsedHold('59A-333.33')
    await listActiveReservations(db)
    expect(events).toBe(1)
  })

  it('neither publishes when nothing expired', async () => {
    await listActiveReservations(db)
    await expect(
      staffLookup(db, { method: 'PLATE', identifier: 'NOPE-000', viewerId: f.staff.id }),
    ).rejects.toMatchObject({ code: 'NOT_FOUND' })
    expect(events).toBe(0)
  })
})
