import { cookies } from 'next/headers'
import { db } from '@/server/db'
import { handle, readJsonObject } from '@/server/api'
import { registerCustomer } from '@/server/services/auth'
import { signSession } from '@/server/auth/session'
import type { Role, UserGroup } from '@/lib/types'

const SESSION_MAX_AGE = 60 * 60 * 24 * 7

export const POST = handle(async (req) => {
  const body = await readJsonObject(req)
  // registerCustomer re-validates these untrusted fields with its own Zod schema.
  const user = await registerCustomer(db, {
    email: body.email as string,
    password: body.password as string,
    name: body.name as string,
    userGroup: body.userGroup as UserGroup,
  })

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
