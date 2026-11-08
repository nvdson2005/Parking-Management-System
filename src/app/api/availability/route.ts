import { db } from '@/server/db'
import { handle } from '@/server/api'
import { requireRole } from '@/server/auth/rbac'
import { getAvailability } from '@/server/services/availability'

export const GET = handle(async () => {
  await requireRole('CUSTOMER', 'STAFF', 'MANAGER')
  return getAvailability(db)
})
