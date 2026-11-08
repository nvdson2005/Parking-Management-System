import { z } from 'zod'
import { db } from '@/server/db'
import { handle, readJsonObject } from '@/server/api'
import { requireRole } from '@/server/auth/rbac'
import { updateZone } from '@/server/services/lots'

const capacitiesSchema = z
  .object({
    MOTORBIKE: z.number().int().min(0).optional(),
    CAR: z.number().int().min(0).optional(),
  })
  .strict()

const bodySchema = z
  .object({
    name: z.string().min(1).optional(),
    capacities: capacitiesSchema.optional(),
  })
  .strict()

export const PATCH = handle<{ params: Promise<{ id: string }> }>(async (req, { params }) => {
  const user = await requireRole('MANAGER')
  const { id } = await params
  const body = bodySchema.parse(await readJsonObject(req))
  return updateZone(db, user.id, id, body)
})
