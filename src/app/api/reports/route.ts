import { db } from '@/server/db'
import { handle } from '@/server/api'
import { requireRole } from '@/server/auth/rbac'
import { DomainError } from '@/server/errors'
import { startOfLocalDay } from '@/lib/time'
import { buildReport } from '@/server/services/reports'

// Parses a `YYYY-MM-DD` query value as a local calendar date. Absent/empty
// values fall back to today; a present-but-malformed value is a VALIDATION
// error so a bad query string stays on the 400 contract.
function parseDateParam(value: string | null): Date {
  if (!value) return startOfLocalDay(new Date())
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value)
  if (!match) throw new DomainError('VALIDATION', 'Date must be YYYY-MM-DD')
  const date = new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]))
  if (Number.isNaN(date.getTime())) throw new DomainError('VALIDATION', 'Invalid date')
  return date
}

export const GET = handle(async (req) => {
  await requireRole('MANAGER')
  const url = new URL(req.url)
  const from = parseDateParam(url.searchParams.get('from'))
  const to = parseDateParam(url.searchParams.get('to'))
  return buildReport(db, { from, to })
})
