'use client'

import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'
import { cn } from 'cn'
import { useLang, useT } from '@/components/I18nProvider'
import type { Lang } from '@/i18n'

export function LangToggle() {
  const lang = useLang()
  const t = useT()
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function setLang(next: Lang) {
    if (next === lang || isSaving) return
    setIsSaving(true)
    setError(null)
    try {
      const res = await fetch('/api/lang', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lang: next }),
      })
      if (!res.ok) throw new Error('lang update failed')
      startTransition(() => router.refresh())
    } catch {
      // fetch rejected (offline, DNS failure, etc.) rather than resolving
      setError(t('common.networkError'))
    } finally {
      setIsSaving(false)
    }
  }

  const disabled = isSaving || isPending

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-1 text-sm" role="group" aria-label="Language">
        <button
          type="button"
          onClick={() => setLang('vi')}
          disabled={disabled}
          aria-pressed={lang === 'vi'}
          className={cn(
            'rounded px-1.5 py-0.5 transition-colors disabled:opacity-50',
            lang === 'vi' ? 'font-semibold text-foreground' : 'text-muted-foreground hover:text-foreground',
          )}
        >
          VI
        </button>
        <span aria-hidden className="text-muted-foreground">
          |
        </span>
        <button
          type="button"
          onClick={() => setLang('en')}
          disabled={disabled}
          aria-pressed={lang === 'en'}
          className={cn(
            'rounded px-1.5 py-0.5 transition-colors disabled:opacity-50',
            lang === 'en' ? 'font-semibold text-foreground' : 'text-muted-foreground hover:text-foreground',
          )}
        >
          EN
        </button>
      </div>
      {error ? (
        <span role="alert" className="text-xs text-destructive">
          {error}
        </span>
      ) : null}
    </div>
  )
}
