import { db } from '@/server/db'
import { handle } from '@/server/api'
import { requireRole } from '@/server/auth/rbac'
import { recordEntry } from '@/server/services/entry'

export const POST = handle(async (req) => {
  const user = await requireRole('STAFF', 'MANAGER')
  const body = await req.json()
  return recordEntry(db, {
    method: body.method,
    identifier: body.identifier,
    zoneId: body.zoneId,
    vehicleType: body.vehicleType,
    staffId: user.id,
  })
})
