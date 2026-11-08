import { db } from '@/server/db'
import { handle, readJsonObject } from '@/server/api'
import { requireRole } from '@/server/auth/rbac'
import { confirmExit } from '@/server/services/exit'

export const POST = handle(async (req) => {
  const user = await requireRole('STAFF', 'MANAGER')
  const body = await readJsonObject(req)
  // confirmExit re-validates these untrusted fields with its own Zod schema.
  return confirmExit(db, {
    sessionId: body.sessionId as string,
    observedPlate: body.observedPlate as string,
    confirmMismatch: body.confirmMismatch as boolean,
    lostCard: body.lostCard as boolean,
    note: body.note as string | undefined,
    staffId: user.id,
  })
})
