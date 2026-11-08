import { db } from '@/server/db'
import { handle } from '@/server/api'
import { requireRole } from '@/server/auth/rbac'
import { removeVehicle } from '@/server/services/vehicles'

export const DELETE = handle<{ params: Promise<{ id: string }> }>(async (_req, { params }) => {
  const user = await requireRole('CUSTOMER')
  const { id } = await params
  await removeVehicle(db, user.id, id)
})
