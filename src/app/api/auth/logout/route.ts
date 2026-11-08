import { cookies } from 'next/headers'
import { db } from '@/server/db'
import { handle } from '@/server/api'
import { getCurrentUser } from '@/server/auth/session'
import { logAccess } from '@/server/services/accessLog'

export const POST = handle(async () => {
  const user = await getCurrentUser()
  if (user) {
    await logAccess(db, { userId: user.id, action: 'LOGOUT' })
  }

  const store = await cookies()
  store.delete('session')

  return { ok: true }
})
