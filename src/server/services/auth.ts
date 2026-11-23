import { z } from 'zod'
import type { User } from '@prisma/client'
import type { Db } from '@/server/db'
import { DomainError } from '@/server/errors'
import { hashPassword, verifyPassword } from '@/server/auth/password'
import { logAccess } from '@/server/services/accessLog'
import type { UserGroup } from '@/lib/types'

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(1).max(100),
  userGroup: z.enum(['STUDENT', 'LECTURER_STAFF']),
})

export async function registerCustomer(
  db: Db,
  input: { email: string; password: string; name: string; userGroup: UserGroup },
): Promise<User> {
  const parsed = registerSchema.parse(input)
  const email = parsed.email.toLowerCase()

  const existing = await db.user.findUnique({ where: { email } })
  if (existing) throw new DomainError('EMAIL_TAKEN', 'Email already registered')

  const passwordHash = await hashPassword(parsed.password)

  const user = await db.user.create({
    data: {
      email,
      passwordHash,
      name: parsed.name,
      roleCode: 'CUSTOMER',
      userGroup: parsed.userGroup,
    },
  })

  // The register route signs the new user in straight away, so registration
  // is also a login and belongs in the access log (KB-07, D-23).
  await logAccess(db, { userId: user.id, action: 'LOGIN' })

  return user
}

export async function authenticate(db: Db, email: string, password: string): Promise<User> {
  // Failed attempts are logged before throwing (G-06, FR-43). An unknown email
  // is logged without an account and without the email itself (privacy).
  const user = await db.user.findUnique({ where: { email: email.toLowerCase() } })
  if (!user) {
    await logAccess(db, { userId: null, action: 'LOGIN_FAILED', target: 'reason:UNKNOWN_EMAIL' })
    throw new DomainError('INVALID_CREDENTIALS', 'Invalid email or password')
  }

  const valid = await verifyPassword(password, user.passwordHash)
  if (!valid) {
    await logAccess(db, { userId: user.id, action: 'LOGIN_FAILED', target: 'reason:BAD_PASSWORD' })
    throw new DomainError('INVALID_CREDENTIALS', 'Invalid email or password')
  }

  if (user.locked) {
    await logAccess(db, { userId: user.id, action: 'LOGIN_FAILED', target: 'reason:LOCKED' })
    throw new DomainError('ACCOUNT_LOCKED', 'Account is locked')
  }

  await logAccess(db, { userId: user.id, action: 'LOGIN' })

  return user
}
