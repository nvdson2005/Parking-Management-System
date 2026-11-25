'use client'

import { useState } from 'react'
import type { FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useT } from '@/components/I18nProvider'
import type { UserGroup } from '@/lib/types'

const GROUPS: UserGroup[] = ['STUDENT', 'LECTURER_STAFF']

/**
 * A customer's fee group and a request to change it (Q38, FR-08). The change
 * itself is made by a Manager on the accounts page.
 */
export function GroupRequestForm({ current, requested }: { current: UserGroup; requested: UserGroup | null }) {
  const t = useT()
  const router = useRouter()
  const other = GROUPS.find((g) => g !== current)!
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function submit(e: FormEvent) {
    e.preventDefault()
    setBusy(true)
    setError(null)
    try {
      const res = await fetch('/api/account/group-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ group: other }),
      })
      if (!res.ok) {
        const body = await res.json()
        setError(t(`errors.${body.error ?? 'UNKNOWN_CODE'}`))
        return
      }
      router.refresh()
    } catch {
      setError(t('common.networkError'))
    } finally {
      setBusy(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('groupRequest.title')}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-2 text-sm">
        <p>
          {t('groupRequest.current')}: {t(`exit.feeGroups.${current}`)}
        </p>
        {requested ? (
          <p className="text-muted-foreground">
            {t('groupRequest.pending', { group: t(`exit.feeGroups.${requested}`) })}
          </p>
        ) : (
          <form onSubmit={submit}>
            <Button type="submit" variant="outline" size="sm" disabled={busy}>
              {t('groupRequest.ask', { group: t(`exit.feeGroups.${other}`) })}
            </Button>
          </form>
        )}
        {error ? (
          <p role="alert" className="text-destructive">
            {error}
          </p>
        ) : null}
      </CardContent>
    </Card>
  )
}
