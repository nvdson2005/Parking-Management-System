import { z } from 'zod'
import { db } from '@/server/db'
import { handle, readJsonObject } from '@/server/api'
import { requireRole } from '@/server/auth/rbac'
import { createZone } from '@/server/services/lots'

const capacitiesSchema = z
  .object({
    MOTORBIKE: z.number().int().min(0).optional(),
    CAR: z.number().int().min(0).optional(),
  })
  .strict()

const bodySchema = z.object({
  lotId: z.string().min(1),
  name: z.string().min(1),
  capacities: capacitiesSchema,
})

export const POST = handle(async (req) => {
  const user = await requireRole('MANAGER')
  const body = bodySchema.parse(await readJsonObject(req))
  return createZone(db, user.id, body)
})
