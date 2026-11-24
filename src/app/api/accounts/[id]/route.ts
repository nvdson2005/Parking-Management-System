import { z } from 'zod'
import { db } from '@/server/db'
import { handle, readJsonObject } from '@/server/api'
import { requireRole } from '@/server/auth/rbac'
import { setLocked, setUserGroup } from '@/server/services/accounts'

// One change per request: lock/unlock, or a customer's fee group (Q38, FR-07).
const bodySchema = z.union([
  z.object({ locked: z.boolean() }).strict(),
  z.object({ userGroup: z.enum(['STUDENT', 'LECTURER_STAFF']) }).strict(),
])

export const PATCH = handle<{ params: Promise<{ id: string }> }>(async (req, { params }) => {
  const user = await requireRole('MANAGER')
  const { id } = await params
  const body = bodySchema.parse(await readJsonObject(req))
  return 'locked' in body ? setLocked(db, user.id, id, body.locked) : setUserGroup(db, user.id, id, body.userGroup)
})
