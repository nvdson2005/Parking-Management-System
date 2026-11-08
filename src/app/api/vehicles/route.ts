import { db } from '@/server/db'
import { handle } from '@/server/api'
import { requireRole } from '@/server/auth/rbac'
import { addVehicle, listVehicles } from '@/server/services/vehicles'

export const GET = handle(async () => {
  const user = await requireRole('CUSTOMER')
  return listVehicles(db, user.id)
})

export const POST = handle(async (req) => {
  const user = await requireRole('CUSTOMER')
  const body = await req.json()
  return addVehicle(db, { ownerId: user.id, plate: body.plate, vehicleType: body.vehicleType })
})
