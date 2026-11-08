import { z } from 'zod'
import { db } from '@/server/db'
import { handle, readJsonObject } from '@/server/api'
import { requireRole } from '@/server/auth/rbac'
import { listTariffs, setTariff } from '@/server/services/tariffs'

const bodySchema = z.object({
  vehicleType: z.enum(['MOTORBIKE', 'CAR']),
  feeGroup: z.enum(['STUDENT', 'LECTURER_STAFF', 'GUEST']),
  price: z.number().int().min(0),
})

export const GET = handle(async () => {
  await requireRole('MANAGER')
  return listTariffs(db)
})

export const PUT = handle(async (req) => {
  const user = await requireRole('MANAGER')
  const body = bodySchema.parse(await readJsonObject(req))
  return setTariff(db, user.id, body)
})
