import { db } from '@/server/db'
import { handle } from '@/server/api'
import { requireRole } from '@/server/auth/rbac'
import { listSessions } from '@/server/services/sessions'

// A-65, KB-15: parking sessions by status (OPEN by default) for staff and managers.
export const GET = handle(async (req) => {
  const user = await requireRole('STAFF', 'MANAGER')
  const status = new URL(req.url).searchParams.get('status') ?? undefined
  return listSessions(db, { status }, user)
})
