import { z } from 'zod'
import { db } from '@/server/db'
import { handle, readJsonObject } from '@/server/api'
import { requireRole } from '@/server/auth/rbac'
import { requestGroupChange } from '@/server/services/accounts'

const bodySchema = z.object({ group: z.enum(['STUDENT', 'LECTURER_STAFF']) }).strict()

/** A customer asks a Manager to change their fee group (Q38, FR-08). */
export const POST = handle(async (req) => {
  const user = await requireRole('CUSTOMER')
  const body = bodySchema.parse(await readJsonObject(req))
  const view = await requestGroupChange(db, user.id, body.group)
  return { userGroup: view.userGroup, requestedUserGroup: view.requestedUserGroup }
})
