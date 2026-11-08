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

  return db.user.create({
    data: {
      email,
      passwordHash,
      name: parsed.name,
      roleCode: 'CUSTOMER',
      userGroup: parsed.userGroup,
    },
  })
}

export async function authenticate(db: Db, email: string, password: string): Promise<User> {
  const user = await db.user.findUnique({ where: { email: email.toLowerCase() } })
  if (!user) throw new DomainError('INVALID_CREDENTIALS', 'Invalid email or password')

  const valid = await verifyPassword(password, user.passwordHash)
  if (!valid) throw new DomainError('INVALID_CREDENTIALS', 'Invalid email or password')

  if (user.locked) throw new DomainError('ACCOUNT_LOCKED', 'Account is locked')

  await logAccess(db, { userId: user.id, action: 'LOGIN' })

  return user
}
