'use client'

import { useState } from 'react'
import type { FormEvent } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
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
import { DEFAULT_GATE, GATES } from '@/lib/types'
import type { GateCode, IdMethod, VehicleTypeCode } from '@/lib/types'

export type ZoneOption = { id: string; label: string }

/** `details` of a 409 `EARLY_ARRIVAL` (contract: specs/006-cr03-ui-fixes/contracts/early-arrival-error.md). */
export type EarlyDetails = { arrivalTime: string; zoneName: string }

function hhmm(iso: string): string {
  const d = new Date(iso)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${pad(d.getHours())}:${pad(d.getMinutes())}`
}

function readEarlyDetails(value: unknown): EarlyDetails | null {
  if (typeof value !== 'object' || value === null) return null
  const { arrivalTime, zoneName } = value as Record<string, unknown>
  return typeof arrivalTime === 'string' && typeof zoneName === 'string' ? { arrivalTime, zoneName } : null
}

/**
 * Early-arrival confirmation (FR-51): shows the booked time and zone so Staff
 * can decide. Without `details` it keeps the generic warning only.
 */
export function EarlyArrivalPrompt({
  details,
  submitting,
  onConfirm,
  onCancel,
}: {
  details: EarlyDetails | null
  submitting: boolean
  onConfirm: () => void
  onCancel: () => void
}) {
  const t = useT()
  return (
    <div className="flex flex-col gap-2 rounded-md border border-destructive/50 bg-destructive/10 p-3">
      <p role="alert" className="text-sm font-medium">
        {t('entry.earlyTitle')}
      </p>
      <p className="text-sm">{t('entry.earlyWarning')}</p>
      {details ? (
        <p className="text-sm font-medium">
          {t('entry.earlyBooked', { time: hhmm(details.arrivalTime), zone: details.zoneName })}
        </p>
      ) : null}
      <div className="flex gap-2">
        <Button type="button" disabled={submitting} onClick={onConfirm}>
          {t('entry.earlyConfirm')}
        </Button>
        <Button type="button" variant="outline" disabled={submitting} onClick={onCancel}>
          {t('entry.earlyCancel')}
        </Button>
      </div>
    </div>
  )
}

export function EntryForm({ zones }: { zones: ZoneOption[] }) {
  const t = useT()
  const [method, setMethod] = useState<IdMethod>('PLATE')
  const [identifier, setIdentifier] = useState('')
  const [zoneId, setZoneId] = useState(zones[0]?.id ?? '')
  const [vehicleType, setVehicleType] = useState<VehicleTypeCode>('MOTORBIKE')
  const [gate, setGate] = useState<GateCode>(DEFAULT_GATE)
  const [submitting, setSubmitting] = useState(false)
  const [earlyPrompt, setEarlyPrompt] = useState(false)
  const [earlyDetails, setEarlyDetails] = useState<EarlyDetails | null>(null)

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    void submit(false)
  }

  async function submit(confirmEarly: boolean) {
    setSubmitting(true)
    try {
      const res = await fetch('/api/events/entry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          method,
          identifier,
          zoneId,
          gate,
          source: 'MANUAL',
          vehicleType: method === 'PLATE' ? vehicleType : undefined,
          confirmEarly: confirmEarly || undefined,
        }),
      })
      const body = await res.json()
      if (!res.ok) {
        if (body.error === 'EARLY_ARRIVAL') {
          setEarlyDetails(readEarlyDetails(body.details))
          setEarlyPrompt(true)
          return
        }
        setEarlyPrompt(false)
        toast.error(t(`errors.${body.error ?? 'VALIDATION'}`))
        return
      }
      setEarlyPrompt(false)
      toast.success(t('entry.success'))
      setIdentifier('')
    } catch {
      toast.error(t('common.networkError'))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('entry.title')}</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-1.5">
            <Label>{t('entry.method')}</Label>
            <Tabs value={method} onValueChange={(value) => {
              setMethod(value as IdMethod)
              setEarlyPrompt(false)
            }}>
              <TabsList>
                <TabsTrigger value="PLATE">{t('entry.methodPlate')}</TabsTrigger>
                <TabsTrigger value="QR">{t('entry.methodQr')}</TabsTrigger>
                <TabsTrigger value="RFID">{t('entry.methodRfid')}</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="identifier">{t('entry.identifier')}</Label>
            <Input
              id="identifier"
              required
              value={identifier}
              placeholder={method === 'PLATE' ? t('entry.identifierPlateHint') : t('entry.identifierCodeHint')}
              onChange={(e) => {
                setIdentifier(e.target.value)
                setEarlyPrompt(false)
              }}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="zone">{t('entry.zone')}</Label>
            <Select value={zoneId} onValueChange={(value) => {
                setZoneId(value ?? '')
                setEarlyPrompt(false)
              }}>
              <SelectTrigger id="zone">
                {/* base-ui shows the raw value unless given a label (spec 006, US3). */}
                <SelectValue>{(value: string) => zones.find((z) => z.id === value)?.label ?? ''}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                {zones.map((zone) => (
                  <SelectItem key={zone.id} value={zone.id}>
                    {zone.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="gate">{t('entry.gate')}</Label>
            <Select value={gate} onValueChange={(value) => setGate((value as GateCode) ?? DEFAULT_GATE)}>
              <SelectTrigger id="gate">
                <SelectValue>{(value: GateCode) => t(`gates.${value}`)}</SelectValue>
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

          {method === 'PLATE' ? (
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="vehicleType">{t('entry.vehicleType')}</Label>
              <Select value={vehicleType} onValueChange={(value) => {
                setVehicleType(value as VehicleTypeCode)
                setEarlyPrompt(false)
              }}>
                <SelectTrigger id="vehicleType" className="w-full sm:w-40">
                  <SelectValue>{(value: VehicleTypeCode) => t(`availability.vehicleTypes.${value}`)}</SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MOTORBIKE">{t('availability.vehicleTypes.MOTORBIKE')}</SelectItem>
                  <SelectItem value="CAR">{t('availability.vehicleTypes.CAR')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          ) : null}

          {earlyPrompt ? (
            <EarlyArrivalPrompt
              details={earlyDetails}
              submitting={submitting}
              onConfirm={() => void submit(true)}
              onCancel={() => setEarlyPrompt(false)}
            />
          ) : null}

          <Button type="submit" disabled={submitting || !zoneId}>
            {submitting ? t('entry.submitting') : t('entry.submit')}
          </Button>
        </form>
      </CardContent>
      <Toaster />
    </Card>
  )
}
