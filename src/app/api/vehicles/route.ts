import { db } from '@/server/db'
import { handle, readJsonObject } from '@/server/api'
import { requireRole } from '@/server/auth/rbac'
import { addVehicle, listVehicles } from '@/server/services/vehicles'
import type { VehicleTypeCode } from '@/lib/types'

export const GET = handle(async () => {
  const user = await requireRole('CUSTOMER')
  return listVehicles(db, user.id)
})

export const POST = handle(async (req) => {
  const user = await requireRole('CUSTOMER')
  const body = await readJsonObject(req)
  // addVehicle re-validates these untrusted fields with its own Zod schema.
  return addVehicle(db, {
    ownerId: user.id,
    plate: body.plate as string,
    vehicleType: body.vehicleType as VehicleTypeCode,
  })
})
