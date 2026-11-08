'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { useT } from '@/components/I18nProvider'

type PurgeResult = { sessionsMasked: number; vehiclesDeleted: number }

export function PurgeButton() {
  const t = useT()
  const [confirming, setConfirming] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<PurgeResult | null>(null)

  async function handlePurge() {
    setBusy(true)
    setError(null)
    try {
      const res = await fetch('/api/purge', { method: 'POST' })
      const body = await res.json()
      if (!res.ok) {
        setError(t(`errors.${body.error ?? 'UNKNOWN_CODE'}`))
        return
      }
      setResult(body as PurgeResult)
      setConfirming(false)
    } catch {
      setError(t('common.networkError'))
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="flex flex-col gap-2">
      {confirming ? (
        <div className="flex flex-wrap items-center gap-3 rounded border border-destructive/40 p-3">
          <span className="text-sm">{t('accessLog.purgeConfirm')}</span>
          <Button variant="destructive" size="sm" disabled={busy} onClick={handlePurge}>
            {busy ? t('accessLog.purging') : t('accessLog.purgeConfirmYes')}
          </Button>
          <Button variant="outline" size="sm" disabled={busy} onClick={() => setConfirming(false)}>
            {t('accessLog.purgeCancel')}
          </Button>
        </div>
      ) : (
        <Button variant="outline" size="sm" className="self-start" onClick={() => setConfirming(true)}>
          {t('accessLog.purge')}
        </Button>
      )}

      {error ? (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      ) : null}

      {result ? (
        <p role="status" className="text-sm text-muted-foreground">
          {t('accessLog.purgeResult')
            .replace('{sessions}', String(result.sessionsMasked))
            .replace('{vehicles}', String(result.vehiclesDeleted))}
        </p>
      ) : null}
    </div>
  )
}
