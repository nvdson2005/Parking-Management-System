import type { Notification } from '@prisma/client'
import type { Db } from '@/server/db'
import type { NotificationType } from '@/lib/types'

export type NotificationParams = Record<string, string | number>

export type NotificationView = {
  id: string
  type: string
  params: NotificationParams
  createdAt: Date
  readAt: Date | null
}

const DEFAULT_LIMIT = 20

/**
 * Stores an in-app notification. `type` picks the i18n key and `params` its
 * placeholders; params never carry a plate (privacy).
 */
export async function createNotification(
  db: Db,
  input: { userId: string; type: NotificationType; params?: NotificationParams; now?: Date },
): Promise<Notification> {
  return db.notification.create({
    data: {
      userId: input.userId,
      type: input.type,
      params: JSON.stringify(input.params ?? {}),
      ...(input.now ? { createdAt: input.now } : {}),
    },
  })
}

function parseParams(raw: string): NotificationParams {
  try {
    const value: unknown = JSON.parse(raw)
    return typeof value === 'object' && value !== null ? (value as NotificationParams) : {}
  } catch {
    return {}
  }
}

/** The user's newest notifications plus their total unread count. */
export async function listNotifications(
  db: Db,
  userId: string,
  limit: number = DEFAULT_LIMIT,
): Promise<{ items: NotificationView[]; unreadCount: number }> {
  const [rows, unreadCount] = await Promise.all([
    db.notification.findMany({
      where: { userId },
      orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
      take: limit,
    }),
    db.notification.count({ where: { userId, readAt: null } }),
  ])
  return {
    items: rows.map((r) => ({
      id: r.id,
      type: r.type,
      params: parseParams(r.params),
      createdAt: r.createdAt,
      readAt: r.readAt,
    })),
    unreadCount,
  }
}

/**
 * Marks the user's own unread notifications read: the given ids, or all of
 * theirs when `ids` is omitted. Other users' rows are never touched.
 */
export async function markNotificationsRead(db: Db, userId: string, ids?: string[]): Promise<number> {
  const result = await db.notification.updateMany({
    where: { userId, readAt: null, ...(ids ? { id: { in: ids } } : {}) },
    data: { readAt: new Date() },
  })
  return result.count
}
