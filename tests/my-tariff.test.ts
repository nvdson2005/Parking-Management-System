import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderToStaticMarkup } from 'react-dom/server'
import { db } from '@/server/db'
import { resetDb, makeFixture } from './helpers/db'
import { setTariff, tariffsForGroup } from '@/server/services/tariffs'
import { MyTariffCard } from '@/components/MyTariffCard'

// FR-26, Q45 (23/11): a customer sees the per-entry fees of their own group.

// vitest compiles JSX with the classic runtime, which needs React in scope.
vi.stubGlobal('React', await import('react'))

let managerId: string

beforeEach(async () => {
  await resetDb()
  managerId = (await makeFixture()).manager.id
  await setTariff(db, managerId, { vehicleType: 'MOTORBIKE', feeGroup: 'STUDENT', price: 2000 })
  await setTariff(db, managerId, { vehicleType: 'MOTORBIKE', feeGroup: 'LECTURER_STAFF', price: 3000 })
  await setTariff(db, managerId, { vehicleType: 'CAR', feeGroup: 'STUDENT', price: 15000 })
  await setTariff(db, managerId, { vehicleType: 'CAR', feeGroup: 'LECTURER_STAFF', price: 20000 })
})

describe('tariffsForGroup (Q45)', () => {
  it('returns only the given group, one row per vehicle type', async () => {
    expect(await tariffsForGroup(db, 'STUDENT')).toEqual([
      { vehicleTypeCode: 'MOTORBIKE', price: 2000 },
      { vehicleTypeCode: 'CAR', price: 15000 },
    ])
    expect(await tariffsForGroup(db, 'LECTURER_STAFF')).toEqual([
      { vehicleTypeCode: 'MOTORBIKE', price: 3000 },
      { vehicleTypeCode: 'CAR', price: 20000 },
    ])
  })

  it('reports a missing tariff as null and follows a Manager change at once', async () => {
    await db.tariff.delete({ where: { vehicleTypeCode_feeGroup: { vehicleTypeCode: 'CAR', feeGroup: 'STUDENT' } } })
    await setTariff(db, managerId, { vehicleType: 'MOTORBIKE', feeGroup: 'STUDENT', price: 2500 })
    expect(await tariffsForGroup(db, 'STUDENT')).toEqual([
      { vehicleTypeCode: 'MOTORBIKE', price: 2500 },
      { vehicleTypeCode: 'CAR', price: null },
    ])
  })
})

describe('MyTariffCard', () => {
  it("shows the customer's group and its prices, not another group's", async () => {
    const html = renderToStaticMarkup(
      MyTariffCard({ group: 'STUDENT', tariffs: await tariffsForGroup(db, 'STUDENT'), lang: 'vi' }),
    )
    expect(html).toContain('Mức phí của bạn')
    expect(html).toContain('2.000')
    expect(html).toContain('15.000')
    expect(html).not.toContain('3.000')
    expect(html).not.toContain('20.000')
  })
})
