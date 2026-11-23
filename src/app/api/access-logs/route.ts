import { db } from '@/server/db'
import { handle } from '@/server/api'
import { requireRole } from '@/server/auth/rbac'
import { accessLogQuerySchema, listAccessLogs } from '@/server/services/accounts'

// A-65, KB-15: the access log for managers, newest first.
export const GET = handle(async (req) => {
  await requireRole('MANAGER')
  const limit = new URL(req.url).searchParams.get('limit') ?? undefined
  return listAccessLogs(db, accessLogQuerySchema.parse({ limit }))
})
