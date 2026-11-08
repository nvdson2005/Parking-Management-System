import { z } from 'zod'
import { db } from '@/server/db'
import { handle, readJsonObject } from '@/server/api'
import { requireRole } from '@/server/auth/rbac'
import { createStaffAccount, listUsers } from '@/server/services/accounts'

const bodySchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(1).max(100),
  role: z.enum(['STAFF', 'MANAGER']),
})

export const GET = handle(async () => {
  await requireRole('MANAGER')
  return listUsers(db)
})

export const POST = handle(async (req) => {
  const user = await requireRole('MANAGER')
  const body = bodySchema.parse(await readJsonObject(req))
  return createStaffAccount(db, user.id, body)
})
