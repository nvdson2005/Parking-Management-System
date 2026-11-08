import { z } from 'zod'
import { db } from '@/server/db'
import { handle, readJsonObject } from '@/server/api'
import { requireRole } from '@/server/auth/rbac'
import { updateLot } from '@/server/services/lots'

const bodySchema = z
  .object({
    name: z.string().min(1).optional(),
    address: z.string().min(1).optional(),
    status: z.enum(['ACTIVE', 'SUSPENDED']).optional(),
  })
  .strict()

export const PATCH = handle<{ params: Promise<{ id: string }> }>(async (req, { params }) => {
  const user = await requireRole('MANAGER')
  const { id } = await params
  const body = bodySchema.parse(await readJsonObject(req))
  return updateLot(db, user.id, id, body)
})
