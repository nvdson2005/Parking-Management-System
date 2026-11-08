import { z } from 'zod'
import { cookies } from 'next/headers'
import { db } from '@/server/db'
import { handle } from '@/server/api'
import { authenticate } from '@/server/services/auth'
import { signSession } from '@/server/auth/session'
import type { Role, UserGroup } from '@/lib/types'

const SESSION_MAX_AGE = 60 * 60 * 24 * 7

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

export const POST = handle(async (req) => {
  const body = await req.json()
  const { email, password } = loginSchema.parse(body)

  const user = await authenticate(db, email, password)

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
