import { cookies } from 'next/headers'
import { db } from '@/server/db'
import { handle } from '@/server/api'
import { registerCustomer } from '@/server/services/auth'
import { signSession } from '@/server/auth/session'
import type { Role, UserGroup } from '@/lib/types'

const SESSION_MAX_AGE = 60 * 60 * 24 * 7

export const POST = handle(async (req) => {
  const body = await req.json()
  const user = await registerCustomer(db, body)

  const token = await signSession({
    id: user.id,
    role: user.roleCode as Role,
    name: user.name,
    userGroup: (user.userGroup as UserGroup | null) ?? null,
  })

  const store = await cookies()
  store.set('session', token, {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_MAX_AGE,
  })

  return { id: user.id, email: user.email, name: user.name, role: user.roleCode }
})
