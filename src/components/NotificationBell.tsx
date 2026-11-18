'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { useLang, useT } from '@/components/I18nProvider'

type NotificationItem = {
  id: string
  type: string
  params: Record<string, string | number>
  createdAt: string
  readAt: string | null
}

const POLL_MS = 30_000

/**
 * Bell with an unread badge. Polls `/api/notifications` every 30 s (paused
 * while the tab is hidden, refetched when opened). A failed poll keeps the
 * previous items and never throws. Rendered only for signed-in users.
 */
export function NotificationBell() {
  const t = useT()
  const lang = useLang()
  const [items, setItems] = useState<NotificationItem[]>([])
  const [unread, setUnread] = useState(0)
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)

  const load = useCallback(async () => {
    try {
      const res = await fetch('/api/notifications')
      if (!res.ok) return
      const body = (await res.json()) as { items: NotificationItem[]; unreadCount: number }
      setItems(body.items)
      setUnread(body.unreadCount)
    } catch {
      // offline or transient failure: keep what we have
    }
  }, [])

  useEffect(() => {
    void load()
    const timer = setInterval(() => {
      if (!document.hidden) void load()
    }, POLL_MS)
    return () => clearInterval(timer)
  }, [load])

  useEffect(() => {
    if (!open) return
    void load()
    function onClick(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [open, load])

  async function markAllRead() {
    // Only mark what the user actually saw; a notification that arrived after
    // the last poll stays unread.
    const ids = items.filter((item) => !item.readAt).map((item) => item.id)
    if (ids.length === 0) return
    try {
      await fetch('/api/notifications/read', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids }),
      })
    } catch {
      return
    }
    await load()
  }

  function render(item: NotificationItem): string {
    const params = { ...item.params }
    if (typeof params.arrival === 'string') {
      const arrival = new Date(params.arrival)
      if (!Number.isNaN(arrival.getTime())) {
        params.arrival = arrival.toLocaleTimeString(lang, { hour: '2-digit', minute: '2-digit' })
      }
    }
    return t(`notifications.types.${item.type}`, params)
  }

  return (
    <div ref={rootRef} className="relative">
      <Button
        type="button"
        size="sm"
        variant="outline"
        aria-label={t('notifications.title')}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <span aria-hidden>🔔</span>
        {unread > 0 ? (
          <span
            data-testid="notification-badge"
            className="ml-1 rounded-full bg-destructive px-1.5 text-xs text-white"
          >
            {unread}
          </span>
        ) : null}
      </Button>

      {open ? (
        <div
          role="dialog"
          aria-label={t('notifications.title')}
          className="absolute right-0 z-50 mt-2 w-72 rounded-md border bg-background p-3 shadow-md"
        >
          <div className="mb-2 flex items-center justify-between gap-2">
            <span className="text-sm font-medium">{t('notifications.title')}</span>
            {unread > 0 ? (
              <button type="button" className="text-xs underline" onClick={() => void markAllRead()}>
                {t('notifications.markAllRead')}
              </button>
            ) : null}
          </div>
          {items.length === 0 ? (
            <p className="text-sm text-muted-foreground">{t('notifications.empty')}</p>
          ) : (
            <ul className="flex max-h-72 flex-col gap-2 overflow-y-auto">
              {items.map((item) => (
                <li key={item.id} className={item.readAt ? 'text-sm text-muted-foreground' : 'text-sm font-medium'}>
                  {render(item)}
                </li>
              ))}
            </ul>
          )}
        </div>
      ) : null}
    </div>
  )
}
