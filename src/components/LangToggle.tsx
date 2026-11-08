'use client'

import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'
import { cn } from 'cn'
import { useLang } from '@/components/I18nProvider'
import type { Lang } from '@/i18n'

export function LangToggle() {
  const lang = useLang()
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [isSaving, setIsSaving] = useState(false)

  async function setLang(next: Lang) {
    if (next === lang || isSaving) return
    setIsSaving(true)
    try {
      await fetch('/api/lang', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lang: next }),
      })
      startTransition(() => router.refresh())
    } finally {
      setIsSaving(false)
    }
  }

  const disabled = isSaving || isPending

  return (
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
  )
}
