import type { Db } from '@/server/db'
import type { AccessAction } from '@/lib/types'

export async function logAccess(
  db: Db,
  entry: { userId: string | null; action: AccessAction; target?: string },
): Promise<void> {
  await db.accessLog.create({
    data: {
      userId: entry.userId,
      action: entry.action,
      target: entry.target,
    },
  })
}

/** Protected page prefixes the middleware guards (src/middleware.ts). */
export const PROTECTED_PREFIXES = ['/customer', '/staff', '/manager'] as const

/**
 * Logs a page the middleware refused for the user's role (G-06, FR-43).
 * Only a known prefix is written, so the `from` query value cannot put
 * arbitrary text into the log.
 */
export async function logPageDenied(db: Db, userId: string, from: string | undefined): Promise<void> {
  const prefix = PROTECTED_PREFIXES.find((p) => p === from)
  if (!prefix) return
  await logAccess(db, { userId, action: 'ACCESS_DENIED', target: `page:${prefix}` })
}
