'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useT } from '@/components/I18nProvider'

type LiveResult = { entries: number; exits: number; rejected: number }
type HistoryResult = { sessions: number; reservations: number; payments: number }
type ExceptionResult = {
  exception: string
  outcome: string
  instructions?: { identifier: string; method: string; observedPlate?: string }
}

const EXCEPTIONS = ['EX01', 'EX02', 'EX03', 'EX04', 'EX05'] as const

function fill(template: string, values: Record<string, string | number>): string {
  return Object.entries(values).reduce(
    (acc, [key, value]) => acc.replace(`{${key}}`, String(value)),
    template,
  )
}

async function post(body: unknown): Promise<{ ok: boolean; data: unknown }> {
  const res = await fetch('/api/simulator', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  return { ok: res.ok, data: await res.json() }
}

export function SimulatorPanels({ defaultCount }: { defaultCount: number }) {
  const t = useT()

  const [count, setCount] = useState(defaultCount)
  const [liveBusy, setLiveBusy] = useState(false)
  const [liveResult, setLiveResult] = useState<LiveResult | null>(null)
  const [liveError, setLiveError] = useState<string | null>(null)

  const [exBusy, setExBusy] = useState<string | null>(null)
  const [exResult, setExResult] = useState<ExceptionResult | null>(null)
  const [exError, setExError] = useState<string | null>(null)

  const [days, setDays] = useState(7)
  const [historyBusy, setHistoryBusy] = useState(false)
  const [historyResult, setHistoryResult] = useState<HistoryResult | null>(null)
  const [historyError, setHistoryError] = useState<string | null>(null)

  async function fireLive() {
    setLiveBusy(true)
    setLiveError(null)
    try {
      const { ok, data } = await post({ action: 'live', n: count })
      if (!ok) {
        setLiveError(t(`errors.${(data as { error?: string }).error ?? 'VALIDATION'}`))
        return
      }
      setLiveResult(data as LiveResult)
    } catch {
      setLiveError(t('common.networkError'))
    } finally {
      setLiveBusy(false)
    }
  }

  async function fireException(ex: string) {
    setExBusy(ex)
    setExError(null)
    setExResult(null)
    try {
      const { ok, data } = await post({ action: 'exception', ex })
      if (!ok) {
        setExError(t(`errors.${(data as { error?: string }).error ?? 'VALIDATION'}`))
        return
      }
      setExResult(data as ExceptionResult)
    } catch {
      setExError(t('common.networkError'))
    } finally {
      setExBusy(null)
    }
  }

  async function generate() {
    setHistoryBusy(true)
    setHistoryError(null)
    try {
      const { ok, data } = await post({ action: 'history', days })
      if (!ok) {
        setHistoryError(t(`errors.${(data as { error?: string }).error ?? 'VALIDATION'}`))
        return
      }
      setHistoryResult(data as HistoryResult)
    } catch {
      setHistoryError(t('common.networkError'))
    } finally {
      setHistoryBusy(false)
    }
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>{t('simulator.liveTitle')}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <div className="flex flex-wrap items-end gap-3">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="live-count">{t('simulator.liveCountLabel')}</Label>
              <Input
                id="live-count"
                type="number"
                min={1}
                max={500}
                value={count}
                onChange={(e) => setCount(Number(e.target.value))}
                className="w-32"
              />
            </div>
            <Button onClick={fireLive} disabled={liveBusy}>
              {liveBusy ? t('simulator.firing') : t('simulator.fire')}
            </Button>
          </div>
          {liveError ? (
            <p role="alert" className="text-sm text-destructive">
              {liveError}
            </p>
          ) : null}
          {liveResult ? (
            <p role="status" className="text-sm text-muted-foreground">
              {fill(t('simulator.liveResult'), liveResult)}
            </p>
          ) : null}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t('simulator.exceptionsTitle')}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <div className="flex flex-wrap gap-2">
            {EXCEPTIONS.map((ex) => (
              <Button
                key={ex}
                variant="outline"
                size="sm"
                disabled={exBusy !== null}
                onClick={() => fireException(ex)}
              >
                {t(`simulator.exceptions.${ex}`)}
              </Button>
            ))}
          </div>
          {exError ? (
            <p role="alert" className="text-sm text-destructive">
              {exError}
            </p>
          ) : null}
          {exResult ? (
            <div role="status" className="flex flex-col gap-1 text-sm">
              <p>
                <span className="text-muted-foreground">{t('simulator.outcomeLabel')}: </span>
                {t(`simulator.outcomes.${exResult.outcome}`)}
              </p>
              {exResult.instructions ? (
                <div className="rounded border p-2 text-muted-foreground">
                  <p className="font-medium text-foreground">{t('simulator.instructionsLabel')}</p>
                  <p>
                    {t('simulator.instructionsMethod')}: {exResult.instructions.method}
                  </p>
                  <p>
                    {t('simulator.instructionsIdentifier')}:{' '}
                    <span className="font-mono">{exResult.instructions.identifier}</span>
                  </p>
                  {exResult.instructions.observedPlate ? (
                    <p>
                      {t('simulator.instructionsObservedPlate')}:{' '}
                      <span className="font-mono">{exResult.instructions.observedPlate}</span>
                    </p>
                  ) : null}
                </div>
              ) : null}
            </div>
          ) : null}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t('simulator.historyTitle')}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <div className="flex flex-wrap items-end gap-3">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="history-days">{t('simulator.daysLabel')}</Label>
              <Input
                id="history-days"
                type="number"
                min={1}
                max={60}
                value={days}
                onChange={(e) => setDays(Number(e.target.value))}
                className="w-32"
              />
            </div>
            <Button onClick={generate} disabled={historyBusy}>
              {historyBusy ? t('simulator.generating') : t('simulator.generate')}
            </Button>
          </div>
          {historyError ? (
            <p role="alert" className="text-sm text-destructive">
              {historyError}
            </p>
          ) : null}
          {historyResult ? (
            <p role="status" className="text-sm text-muted-foreground">
              {fill(t('simulator.historyResult'), historyResult)}
            </p>
          ) : null}
        </CardContent>
      </Card>
    </div>
  )
}
