import type { Db } from '@/server/db'
import { DomainError } from '@/server/errors'
import type { FeeGroup, VehicleTypeCode } from '@/lib/types'

/**
 * Looks up the flat tariff price for a vehicle type + fee group (FR-27).
 * A missing tariff is a configuration gap, surfaced as `NOT_FOUND` rather
 * than a raw 500. This is a focused read helper: it takes no lock and owns
 * no transaction, so it is safe to call from inside `confirmExit`'s
 * `withLock`/transaction without nesting another lock.
 */
export async function computeFee(db: Db, vehicleType: VehicleTypeCode, feeGroup: FeeGroup): Promise<number> {
  const tariff = await db.tariff.findUnique({
    where: { vehicleTypeCode_feeGroup: { vehicleTypeCode: vehicleType, feeGroup } },
  })
  if (!tariff) throw new DomainError('NOT_FOUND', 'Tariff not found')
  return tariff.price
}
