import { expect, it } from 'vitest'
import { db } from '@/server/db'
import { resetDb, makeFixture } from './helpers/db'

it('enforces unique plate', async () => {
  await resetDb()
  await makeFixture()
  await db.vehicle.create({
    data: { plate: '51F-123.45', qrCode: 'Q1', rfidCode: 'R1', vehicleTypeCode: 'MOTORBIKE' },
  })
  await expect(
    db.vehicle.create({
      data: { plate: '51F-123.45', qrCode: 'Q2', rfidCode: 'R2', vehicleTypeCode: 'MOTORBIKE' },
    })
  ).rejects.toThrow()
})

it('fixture has 3 zones with capacities', async () => {
  await resetDb()
  await makeFixture()
  expect(await db.zoneCapacity.count()).toBe(3)
})
