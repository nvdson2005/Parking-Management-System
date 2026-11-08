'use client'

import { useState } from 'react'
import type { FormEvent } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Toaster } from '@/components/ui/sonner'
import { useT } from '@/components/I18nProvider'
import type { FeeGroup, IdMethod, VehicleTypeCode } from '@/lib/types'

type ExitPreview = {
  sessionId: string
  plateSnapshot: string
  zoneName: string
  vehicleType: VehicleTypeCode
  feeGroup: FeeGroup
  entryTime: string
  fee: number
  plateMismatch: boolean
}

function formatFee(fee: number): string {
  return new Intl.NumberFormat('vi-VN').format(fee)
}

export function ExitForm() {
  const t = useT()
  const [method, setMethod] = useState<IdMethod>('PLATE')
  const [identifier, setIdentifier] = useState('')
  const [observedPlate, setObservedPlate] = useState('')
  const [lostCard, setLostCard] = useState(false)
  const [note, setNote] = useState('')
  const [preview, setPreview] = useState<ExitPreview | null>(null)
  const [confirmMismatch, setConfirmMismatch] = useState(false)
  const [previewing, setPreviewing] = useState(false)
  const [confirming, setConfirming] = useState(false)

  // A lost card is handled off the plate (there is no card/code to scan).
  const effectiveMethod: IdMethod = lostCard ? 'PLATE' : method

  function resetPreview() {
    setPreview(null)
    setConfirmMismatch(false)
  }

  async function handlePreview(e: FormEvent) {
    e.preventDefault()
    setPreviewing(true)
    try {
      const res = await fetch('/api/events/exit/preview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ method: effectiveMethod, identifier, observedPlate }),
      })
      const body = await res.json()
      if (!res.ok) {
        resetPreview()
        toast.error(t(`errors.${body.error ?? 'VALIDATION'}`))
        return
      }
      setConfirmMismatch(false)
      setPreview(body as ExitPreview)
    } catch {
      toast.error(t('common.networkError'))
    } finally {
      setPreviewing(false)
    }
  }

  async function handleConfirm() {
    if (!preview) return
    setConfirming(true)
    try {
      const res = await fetch('/api/events/exit/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: preview.sessionId,
          observedPlate,
          confirmMismatch,
          lostCard,
          note: note.trim() ? note.trim() : undefined,
        }),
      })
      const body = await res.json()
      if (!res.ok) {
        toast.error(t(`errors.${body.error ?? 'VALIDATION'}`))
        return
      }
      toast.success(t('exit.success'))
      setIdentifier('')
      setObservedPlate('')
      setNote('')
      setLostCard(false)
      resetPreview()
    } catch {
      toast.error(t('common.networkError'))
    } finally {
      setConfirming(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('exit.title')}</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="flex flex-col gap-4" onSubmit={handlePreview}>
          <div className="flex flex-col gap-1.5">
            <Label>{t('exit.method')}</Label>
            <Tabs
              value={effectiveMethod}
              onValueChange={(value) => {
                setMethod(value as IdMethod)
                resetPreview()
              }}
            >
              <TabsList>
                <TabsTrigger value="PLATE" disabled={lostCard}>
                  {t('exit.methodPlate')}
                </TabsTrigger>
                <TabsTrigger value="QR" disabled={lostCard}>
                  {t('exit.methodQr')}
                </TabsTrigger>
                <TabsTrigger value="RFID" disabled={lostCard}>
                  {t('exit.methodRfid')}
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="identifier">{t('exit.identifier')}</Label>
            <Input
              id="identifier"
              required
              value={identifier}
              placeholder={effectiveMethod === 'PLATE' ? t('exit.identifierPlateHint') : t('exit.identifierCodeHint')}
              onChange={(e) => {
                setIdentifier(e.target.value)
                resetPreview()
              }}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="observedPlate">{t('exit.observedPlate')}</Label>
            <Input
              id="observedPlate"
              required
              value={observedPlate}
              placeholder={t('exit.observedPlateHint')}
              onChange={(e) => {
                setObservedPlate(e.target.value)
                resetPreview()
              }}
            />
          </div>

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              className="size-4"
              checked={lostCard}
              onChange={(e) => {
                setLostCard(e.target.checked)
                resetPreview()
              }}
            />
            {t('exit.lostCard')}
          </label>

          {lostCard ? (
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="note">{t('exit.note')}</Label>
              <Textarea id="note" value={note} onChange={(e) => setNote(e.target.value)} />
            </div>
          ) : null}

          <Button type="submit" variant="outline" disabled={previewing}>
            {previewing ? t('exit.previewing') : t('exit.preview')}
          </Button>
        </form>

        {preview ? (
          <div className="mt-4 flex flex-col gap-3 rounded-md border p-4">
            <dl className="grid grid-cols-2 gap-2 text-sm">
              <dt className="text-muted-foreground">{t('exit.observedPlate')}</dt>
              <dd className="font-mono">{preview.plateSnapshot}</dd>
              <dt className="text-muted-foreground">{t('exit.zone')}</dt>
              <dd>{preview.zoneName}</dd>
              <dt className="text-muted-foreground">{t('exit.vehicleType')}</dt>
              <dd>{t(`availability.vehicleTypes.${preview.vehicleType}`)}</dd>
              <dt className="text-muted-foreground">{t('exit.feeGroup')}</dt>
              <dd>{t(`exit.feeGroups.${preview.feeGroup}`)}</dd>
              <dt className="text-muted-foreground">{t('exit.entryTime')}</dt>
              <dd>{new Date(preview.entryTime).toLocaleString()}</dd>
              <dt className="text-muted-foreground">{t('exit.fee')}</dt>
              <dd className="font-semibold">{formatFee(preview.fee)} ₫</dd>
            </dl>

            {preview.plateMismatch ? (
              <div className="flex flex-col gap-2 rounded-md border border-destructive/50 bg-destructive/10 p-3">
                <p role="alert" className="text-sm text-destructive">
                  {t('exit.mismatchWarning')}
                </p>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    className="size-4"
                    checked={confirmMismatch}
                    onChange={(e) => setConfirmMismatch(e.target.checked)}
                  />
                  {t('exit.confirmManually')}
                </label>
              </div>
            ) : null}

            <Button
              type="button"
              disabled={confirming || (preview.plateMismatch && !confirmMismatch)}
              onClick={handleConfirm}
            >
              {confirming ? t('exit.confirming') : t('exit.confirm')}
            </Button>
          </div>
        ) : null}
      </CardContent>
      <Toaster />
    </Card>
  )
}
