import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'
import { db } from '@/server/db'
import type { Db } from '@/server/db'
import type { Role, UserGroup } from '@/lib/types'

const SESSION_COOKIE = 'session'
const SESSION_EXPIRY = '7d'

function getSecretKey(): Uint8Array {
  const secret = process.env.AUTH_SECRET
  if (!secret) throw new Error('AUTH_SECRET is not set')
  return new TextEncoder().encode(secret)
}

export type CurrentUser = {
  id: string
  role: Role
  name: string
  userGroup: UserGroup | null
}

export async function signSession(user: CurrentUser): Promise<string> {
  return new SignJWT({ role: user.role })
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(user.id)
    .setIssuedAt()
    .setExpirationTime(SESSION_EXPIRY)
    .sign(getSecretKey())
}

export async function verifySession(token: string): Promise<{ userId: string; role: Role } | null> {
  try {
    const { payload } = await jwtVerify(token, getSecretKey())
    if (typeof payload.sub !== 'string' || typeof payload.role !== 'string') return null
    return { userId: payload.sub, role: payload.role as Role }
  } catch {
    return null
  }
}

export async function resolveSessionUser(db: Db, token: string | undefined): Promise<CurrentUser | null> {
  if (!token) return null

  const session = await verifySession(token)
  if (!session) return null

  const user = await db.user.findUnique({ where: { id: session.userId } })
  if (!user || user.locked) return null

  return {
    id: user.id,
    role: user.roleCode as Role,
    name: user.name,
    userGroup: (user.userGroup as UserGroup | null) ?? null,
  }
}

export async function getCurrentUser(): Promise<CurrentUser | null> {
  const store = await cookies()
  const token = store.get(SESSION_COOKIE)?.value
  return resolveSessionUser(db, token)
}
