import { db } from '@/server/db'
import { handle, readJsonObject } from '@/server/api'
import { requireRole } from '@/server/auth/rbac'
import type { GateCode, IdMethod, SessionSource } from '@/lib/types'
import { confirmExit } from '@/server/services/exit'
import { presentPlate } from '@/lib/plate'

export const POST = handle(async (req) => {
  const user = await requireRole('STAFF', 'MANAGER')
  const body = await readJsonObject(req)
  // confirmExit re-validates these untrusted fields with its own Zod schema.
  const result = await confirmExit(db, {
    sessionId: body.sessionId as string,
    observedPlate: body.observedPlate as string,
    confirmMismatch: body.confirmMismatch as boolean,
    lostCard: body.lostCard as boolean,
    method: body.method as IdMethod | undefined,
    note: body.note as string | undefined,
    gate: body.gate as GateCode | undefined,
    source: body.source as SessionSource | undefined,
    staffId: user.id,
  })
  // The session is now CLOSED, so its plate follows Q46 like every other
  // screen: masked for Staff, full for a Manager. The shape stays as in P18.
  return {
    ...result,
    session: {
      ...result.session,
      plateSnapshot: presentPlate(result.session.plateSnapshot, user, result.session.ownerId, true),
    },
  }
})
