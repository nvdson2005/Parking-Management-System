'use client'

import { useRef, useState, useSyncExternalStore } from 'react'
import type { FormEvent } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Toaster } from '@/components/ui/sonner'
import { useT } from '@/components/I18nProvider'
import { createExitFormModel } from '@/lib/exitFormModel'
import type { ApiResponse } from '@/lib/exitFormModel'
import { DEFAULT_GATE, GATES } from '@/lib/types'
import type { FeeGroup, GateCode, IdMethod, VehicleTypeCode } from '@/lib/types'

export type ExitPreview = {
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

/**
 * The exit preview details (A-68 D-04, spec 008): the plate recorded at entry
 * and the plate Staff typed, each under its own label, with the typed plate
 * marked when `previewExit` reports a mismatch (EX-02, AT-EX02). The typed
 * plate is the one sent with the preview request (FR-006), not the live input.
 */
export function ExitPreviewDetails({ preview, observedPlate }: { preview: ExitPreview; observedPlate: string }) {
  const t = useT()
  return (
    <dl className="grid grid-cols-2 gap-2 text-sm">
      <dt className="text-muted-foreground">{t('exit.entryPlate')}</dt>
      <dd className="font-mono">{preview.plateSnapshot}</dd>
      <dt className="text-muted-foreground">{t('exit.observedPlate')}</dt>
      {preview.plateMismatch ? (
        <dd className="font-mono font-semibold text-destructive" data-mismatch="true">
          {observedPlate.trim()}
        </dd>
      ) : (
        <dd className="font-mono">{observedPlate.trim()}</dd>
      )}
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
  )
}

async function postJson(url: string, body: unknown): Promise<ApiResponse> {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  return { ok: res.ok, body: await res.json() }
}

function newExitFormModel() {
  return createExitFormModel<ExitPreview>({
    preview: (body) => postJson('/api/events/exit/preview', body),
    confirm: (body) => postJson('/api/events/exit/confirm', body),
  })
}

export function ExitForm() {
  const t = useT()
  // Inputs, preview requests, loading state and confirm live in the model
  // (spec 008 FR-006, tested in tests/exit-form-model.test.ts); this component
  // only renders them. Gate and note do not affect the preview.
  const modelRef = useRef<ReturnType<typeof newExitFormModel> | null>(null)
  if (!modelRef.current) modelRef.current = newExitFormModel()
  const model = modelRef.current
  const state = useSyncExternalStore(model.subscribe, model.getState, model.getState)
  const { inputs, previewing, confirming, confirmMismatch } = state
  const preview = state.shown?.preview ?? null
  const [note, setNote] = useState('')
  const [gate, setGate] = useState<GateCode>(DEFAULT_GATE)
  const effectiveMethod = model.effectiveMethod()

  async function handlePreview(e: FormEvent) {
    e.preventDefault()
    const outcome = await model.preview()
    // null: the answer is stale (an input changed or a newer request started).
    if (!outcome || outcome.kind === 'ok') return
    toast.error(outcome.kind === 'network' ? t('common.networkError') : t(`errors.${outcome.code}`))
  }

  async function handleConfirm() {
    const outcome = await model.confirm({ gate, note: note.trim() ? note.trim() : undefined })
    if (!outcome) return
    if (outcome.kind === 'ok') {
      toast.success(t('exit.success'))
      setNote('')
      return
    }
    toast.error(outcome.kind === 'network' ? t('common.networkError') : t(`errors.${outcome.code}`))
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
              onValueChange={(value) => model.setInput({ method: value as IdMethod })}
            >
              <TabsList>
                <TabsTrigger value="PLATE" disabled={inputs.lostCard}>
                  {t('exit.methodPlate')}
                </TabsTrigger>
                <TabsTrigger value="QR" disabled={inputs.lostCard}>
                  {t('exit.methodQr')}
                </TabsTrigger>
                <TabsTrigger value="RFID" disabled={inputs.lostCard}>
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
              value={inputs.identifier}
              placeholder={effectiveMethod === 'PLATE' ? t('exit.identifierPlateHint') : t('exit.identifierCodeHint')}
              onChange={(e) => model.setInput({ identifier: e.target.value })}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="observedPlate">{t('exit.observedPlate')}</Label>
            <Input
              id="observedPlate"
              required
              value={inputs.observedPlate}
              placeholder={t('exit.observedPlateHint')}
              onChange={(e) => model.setInput({ observedPlate: e.target.value })}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="gate">{t('exit.gate')}</Label>
            <Select value={gate} onValueChange={(value) => setGate((value as GateCode) ?? DEFAULT_GATE)}>
              <SelectTrigger id="gate">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {GATES.map((g) => (
                  <SelectItem key={g} value={g}>
                    {t(`gates.${g}`)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              className="size-4"
              checked={inputs.lostCard}
              onChange={(e) => model.setInput({ lostCard: e.target.checked })}
            />
            {t('exit.lostCard')}
          </label>

          {inputs.lostCard ? (
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
            <ExitPreviewDetails preview={preview} observedPlate={state.shown?.comparedPlate ?? ''} />

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
                    onChange={(e) => model.setConfirmMismatch(e.target.checked)}
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
