import { z } from 'zod'
import { db } from '@/server/db'
import { handle, readJsonObject } from '@/server/api'
import { requireRole } from '@/server/auth/rbac'
import { markNotificationsRead } from '@/server/services/notifications'

const bodySchema = z.object({ ids: z.array(z.string().min(1)).optional() })

export const POST = handle(async (req) => {
  const user = await requireRole('CUSTOMER', 'STAFF', 'MANAGER')
  const body = bodySchema.parse(await readJsonObject(req))
  return { updated: await markNotificationsRead(db, user.id, body.ids) }
})
