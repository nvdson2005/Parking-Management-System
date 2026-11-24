import { db } from '@/server/db'
import { handle } from '@/server/api'
import { requireRole } from '@/server/auth/rbac'
import { listActiveReservations } from '@/server/services/reservations'

// A-65, G-08 (Q34): staff see the active reservations, optionally for one zone.
export const GET = handle(async (req) => {
  await requireRole('STAFF', 'MANAGER')
  const zoneId = new URL(req.url).searchParams.get('zoneId') || undefined
  return listActiveReservations(db, { zoneId })
})
