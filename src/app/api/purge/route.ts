import { db } from '@/server/db'
import { handle } from '@/server/api'
import { requireRole } from '@/server/auth/rbac'
import { purgeOldData } from '@/server/services/purge'

export const POST = handle(async () => {
  const user = await requireRole('MANAGER')
  return purgeOldData(db, user.id)
})
