import { db } from '@/server/db'
import { handle, readJsonObject } from '@/server/api'
import { requireRole } from '@/server/auth/rbac'
import { previewExit } from '@/server/services/exit'
import type { IdMethod } from '@/lib/types'

export const POST = handle(async (req) => {
  await requireRole('STAFF', 'MANAGER')
  const body = await readJsonObject(req)
  // previewExit re-validates these untrusted fields with its own Zod schema.
  return previewExit(db, {
    method: body.method as IdMethod,
    identifier: body.identifier as string,
    observedPlate: body.observedPlate as string,
  })
})
