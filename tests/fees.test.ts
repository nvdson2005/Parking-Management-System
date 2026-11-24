import { describe, it, expect } from 'vitest'
import { db } from '@/server/db'
import { resetDb, makeFixture } from './helpers/db'
import { computeFee } from '@/server/services/fees'

describe('computeFee', () => {
  // All six prices differ, so a fee taken from the wrong type or group cannot pass (FR-34, O4 6/6, RT-05, A-76).
  it('returns the tariff price for each of the 6 vehicle type and fee group combinations', async () => {
    await resetDb()
    await makeFixture({
      tariffs: {
        MOTORBIKE_STUDENT: 3000,
        MOTORBIKE_LECTURER_STAFF: 5000,
        MOTORBIKE_GUEST: 7000,
        CAR_STUDENT: 12000,
        CAR_LECTURER_STAFF: 15000,
        CAR_GUEST: 20000,
      },
    })

    expect(await computeFee(db, 'MOTORBIKE', 'STUDENT')).toBe(3000)
    expect(await computeFee(db, 'MOTORBIKE', 'LECTURER_STAFF')).toBe(5000)
    expect(await computeFee(db, 'MOTORBIKE', 'GUEST')).toBe(7000)
    expect(await computeFee(db, 'CAR', 'STUDENT')).toBe(12000)
    expect(await computeFee(db, 'CAR', 'LECTURER_STAFF')).toBe(15000)
    expect(await computeFee(db, 'CAR', 'GUEST')).toBe(20000)
  })

  it('throws NOT_FOUND when the tariff is missing', async () => {
    await resetDb()
    await makeFixture()
    await db.tariff.deleteMany()

    await expect(computeFee(db, 'CAR', 'STUDENT')).rejects.toMatchObject({ code: 'NOT_FOUND' })
  })
})
