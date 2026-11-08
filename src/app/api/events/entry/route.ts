import { db } from '@/server/db'
import { handle, readJsonObject } from '@/server/api'
import { requireRole } from '@/server/auth/rbac'
import { recordEntry } from '@/server/services/entry'
import type { IdMethod, VehicleTypeCode } from '@/lib/types'

export const POST = handle(async (req) => {
  const user = await requireRole('STAFF', 'MANAGER')
  const body = await readJsonObject(req)
  // recordEntry re-validates these untrusted fields with its own Zod schema.
  return recordEntry(db, {
    method: body.method as IdMethod,
    identifier: body.identifier as string,
    zoneId: body.zoneId as string,
    vehicleType: body.vehicleType as VehicleTypeCode | undefined,
    staffId: user.id,
  })
})
