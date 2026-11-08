import { db } from '@/server/db'
import { handle } from '@/server/api'
import { requireRole } from '@/server/auth/rbac'
import { cancelReservation } from '@/server/services/reservations'

export const POST = handle<{ params: Promise<{ id: string }> }>(async (_req, { params }) => {
  const user = await requireRole('CUSTOMER')
  const { id } = await params
  return cancelReservation(db, { customerId: user.id, reservationId: id })
})
