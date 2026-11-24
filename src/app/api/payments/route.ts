import { db } from '@/server/db'
import { handle } from '@/server/api'
import { requireRole } from '@/server/auth/rbac'
import { allPayments, customerHistory, paymentsQuerySchema } from '@/server/services/history'

// A-65, KB-15: payment history. Managers get all confirmed payments (optional
// from/to); customers get their own parking history (owner at entry).
export const GET = handle(async (req) => {
  const user = await requireRole('MANAGER', 'CUSTOMER')
  if (user.role === 'CUSTOMER') return customerHistory(db, user.id)
  const q = new URL(req.url).searchParams
  return allPayments(db, paymentsQuerySchema.parse({ from: q.get('from') ?? undefined, to: q.get('to') ?? undefined }))
})
