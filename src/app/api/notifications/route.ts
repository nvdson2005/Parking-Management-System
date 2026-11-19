import { db } from '@/server/db'
import { handle } from '@/server/api'
import { requireRole } from '@/server/auth/rbac'
import { listNotifications } from '@/server/services/notifications'

export const GET = handle(async () => {
  const user = await requireRole('CUSTOMER', 'STAFF', 'MANAGER')
  return listNotifications(db, user.id)
})
