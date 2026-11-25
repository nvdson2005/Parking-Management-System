import { db } from '@/server/db'
import { handle } from '@/server/api'
import { requireRole } from '@/server/auth/rbac'
import { staffLookup } from '@/server/services/lookup'
import type { IdMethod } from '@/lib/types'

// A-65, G-08 (Q34): staff look up a vehicle by plate, QR or RFID.
export const GET = handle(async (req) => {
  const user = await requireRole('STAFF', 'MANAGER')
  const q = new URL(req.url).searchParams
  // staffLookup validates method and identifier with its own Zod schema.
  return staffLookup(db, {
    method: q.get('method') as IdMethod,
    identifier: q.get('identifier') ?? '',
    viewerId: user.id,
  })
})
