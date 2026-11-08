import { db } from '@/server/db'
import { handle, readJsonObject } from '@/server/api'
import { requireRole } from '@/server/auth/rbac'
import { DomainError } from '@/server/errors'
import {
  simulateLive,
  triggerException,
  generateHistory,
  type ExceptionCode,
} from '@/server/services/simulator'

const EXCEPTIONS: ExceptionCode[] = ['EX01', 'EX02', 'EX03', 'EX04', 'EX05']

function asInt(value: unknown): number {
  if (typeof value !== 'number' || !Number.isInteger(value)) {
    throw new DomainError('VALIDATION', 'Expected an integer')
  }
  return value
}

export const POST = handle(async (req) => {
  const user = await requireRole('MANAGER')
  const body = await readJsonObject(req)
  const action = body.action

  if (action === 'live') {
    return simulateLive(db, user.id, asInt(body.n))
  }
  if (action === 'exception') {
    const ex = body.ex
    if (typeof ex !== 'string' || !EXCEPTIONS.includes(ex as ExceptionCode)) {
      throw new DomainError('VALIDATION', 'Unknown exception')
    }
    return triggerException(db, user.id, ex as ExceptionCode)
  }
  if (action === 'history') {
    return generateHistory(db, user.id, asInt(body.days))
  }

  throw new DomainError('VALIDATION', 'Unknown action')
})
