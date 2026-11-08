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
