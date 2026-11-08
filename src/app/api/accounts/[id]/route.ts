import { z } from 'zod'
import { db } from '@/server/db'
import { handle, readJsonObject } from '@/server/api'
import { requireRole } from '@/server/auth/rbac'
import { setLocked } from '@/server/services/accounts'

const bodySchema = z.object({ locked: z.boolean() }).strict()

export const PATCH = handle<{ params: Promise<{ id: string }> }>(async (req, { params }) => {
  const user = await requireRole('MANAGER')
  const { id } = await params
  const body = bodySchema.parse(await readJsonObject(req))
  return setLocked(db, user.id, id, body.locked)
})
