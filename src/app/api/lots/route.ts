import { db } from '@/server/db'
import { handle, readJsonObject } from '@/server/api'
import { requireRole } from '@/server/auth/rbac'
import { createLot, listLots } from '@/server/services/lots'

export const GET = handle(async () => {
  await requireRole('MANAGER')
  return listLots(db)
})

export const POST = handle(async (req) => {
  const user = await requireRole('MANAGER')
  const body = await readJsonObject(req)
  // createLot re-validates these untrusted fields with its own Zod schema.
  return createLot(db, user.id, {
    name: body.name as string,
    address: body.address as string,
  })
})
