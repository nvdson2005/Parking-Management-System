import { describe, it, expect } from 'vitest'
import { db } from '@/server/db'
import { resetDb, makeFixture } from './helpers/db'
import {
  createNotification,
  listNotifications,
  markNotificationsRead,
} from '@/server/services/notifications'

const T0 = new Date(2026, 0, 1, 12, 0, 0, 0)
const at = (minutes: number) => new Date(T0.getTime() + minutes * 60_000)

describe('notifications service', () => {
  it('create then list returns newest first with parsed params and unreadCount', async () => {
    await resetDb()
    const f = await makeFixture()
    await createNotification(db, { userId: f.student.id, type: 'LOT_SUSPENDED', params: { lot: 'Old', arrival: 'a' }, now: at(0) })
    await createNotification(db, { userId: f.student.id, type: 'LOT_SUSPENDED', params: { lot: 'New', arrival: 'b' }, now: at(5) })

    const { items, unreadCount } = await listNotifications(db, f.student.id)

    expect(items.map((n) => n.params.lot)).toEqual(['New', 'Old'])
    expect(items[0]).toMatchObject({ type: 'LOT_SUSPENDED', readAt: null })
    expect(unreadCount).toBe(2)
  })

  it('unreadCount counts beyond the page limit', async () => {
    await resetDb()
    const f = await makeFixture()
    for (let i = 0; i < 3; i++) {
      await createNotification(db, { userId: f.student.id, type: 'LOT_SUSPENDED', now: at(i) })
    }

    const { items, unreadCount } = await listNotifications(db, f.student.id, 2)

    expect(items).toHaveLength(2)
    expect(unreadCount).toBe(3)
  })

  it('markNotificationsRead with no ids marks only that user rows', async () => {
    await resetDb()
    const f = await makeFixture()
    await createNotification(db, { userId: f.student.id, type: 'LOT_SUSPENDED' })
    await createNotification(db, { userId: f.lecturer.id, type: 'LOT_SUSPENDED' })

    const updated = await markNotificationsRead(db, f.student.id)

    expect(updated).toBe(1)
    expect((await listNotifications(db, f.student.id)).unreadCount).toBe(0)
    expect((await listNotifications(db, f.lecturer.id)).unreadCount).toBe(1)
  })

  it('markNotificationsRead ignores ids belonging to another user', async () => {
    await resetDb()
    const f = await makeFixture()
    const others = await createNotification(db, { userId: f.lecturer.id, type: 'LOT_SUSPENDED' })

    const updated = await markNotificationsRead(db, f.student.id, [others.id])

    expect(updated).toBe(0)
    expect((await listNotifications(db, f.lecturer.id)).unreadCount).toBe(1)
  })

  it('markNotificationsRead with ids marks only those, and is idempotent', async () => {
    await resetDb()
    const f = await makeFixture()
    const a = await createNotification(db, { userId: f.student.id, type: 'LOT_SUSPENDED' })
    await createNotification(db, { userId: f.student.id, type: 'LOT_SUSPENDED' })

    expect(await markNotificationsRead(db, f.student.id, [a.id])).toBe(1)
    expect(await markNotificationsRead(db, f.student.id, [a.id])).toBe(0)
    expect((await listNotifications(db, f.student.id)).unreadCount).toBe(1)
  })
})
