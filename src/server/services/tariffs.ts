import type { Tariff } from '@prisma/client'
import { z } from 'zod'
import type { Db } from '@/server/db'
import { DomainError } from '@/server/errors'
import { logAccess } from '@/server/services/accessLog'
import { publishAvailabilityChanged } from '@/server/bus'

const setTariffSchema = z.object({
  vehicleType: z.enum(['MOTORBIKE', 'CAR']),
  feeGroup: z.enum(['STUDENT', 'LECTURER_STAFF', 'GUEST']),
  price: z.number().int().min(0),
})

/**
 * Returns every configured tariff, ordered for the 2×3 manager grid
 * (vehicle type, then fee group).
 */
export async function listTariffs(db: Db): Promise<Tariff[]> {
  return db.tariff.findMany({ orderBy: [{ vehicleTypeCode: 'asc' }, { feeGroup: 'asc' }] })
}

/**
 * Upserts the flat price for a vehicle type + fee group (integer ≥ 0,
 * FR-09, MANAGER only). The write targets the `(vehicleTypeCode, feeGroup)`
 * composite key `computeFee` reads, so the new price applies to the very
 * next fee calculation. Logs `TARIFF_CHANGE` and broadcasts availability.
 */
export async function setTariff(
  db: Db,
  actorId: string,
  input: { vehicleType: 'MOTORBIKE' | 'CAR'; feeGroup: 'STUDENT' | 'LECTURER_STAFF' | 'GUEST'; price: number },
): Promise<Tariff> {
  const parsed = setTariffSchema.safeParse(input)
  if (!parsed.success) throw new DomainError('VALIDATION', 'Invalid tariff input')
  const { vehicleType, feeGroup, price } = parsed.data

  const tariff = await db.tariff.upsert({
    where: { vehicleTypeCode_feeGroup: { vehicleTypeCode: vehicleType, feeGroup } },
    update: { price },
    create: { vehicleTypeCode: vehicleType, feeGroup, price },
  })

  await logAccess(db, { userId: actorId, action: 'TARIFF_CHANGE', target: `${vehicleType}_${feeGroup}` })
  publishAvailabilityChanged()
  return tariff
}
