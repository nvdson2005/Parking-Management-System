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
import type { IdMethod, VehicleTypeCode } from '@/lib/types'

export type ZoneOption = { id: string; label: string }

export function EntryForm({ zones }: { zones: ZoneOption[] }) {
  const t = useT()
  const [method, setMethod] = useState<IdMethod>('PLATE')
  const [identifier, setIdentifier] = useState('')
  const [zoneId, setZoneId] = useState(zones[0]?.id ?? '')
  const [vehicleType, setVehicleType] = useState<VehicleTypeCode>('MOTORBIKE')
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    try {
      const res = await fetch('/api/events/entry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          method,
          identifier,
          zoneId,
          vehicleType: method === 'PLATE' ? vehicleType : undefined,
        }),
      })
      const body = await res.json()
      if (!res.ok) {
        toast.error(t(`errors.${body.error ?? 'VALIDATION'}`))
        return
      }
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
            <Tabs value={method} onValueChange={(value) => setMethod(value as IdMethod)}>
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
              onChange={(e) => setIdentifier(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="zone">{t('entry.zone')}</Label>
            <Select value={zoneId} onValueChange={(value) => setZoneId(value ?? '')}>
              <SelectTrigger id="zone">
                <SelectValue />
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

          {method === 'PLATE' ? (
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="vehicleType">{t('entry.vehicleType')}</Label>
              <Select value={vehicleType} onValueChange={(value) => setVehicleType(value as VehicleTypeCode)}>
                <SelectTrigger id="vehicleType" className="w-full sm:w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MOTORBIKE">{t('availability.vehicleTypes.MOTORBIKE')}</SelectItem>
                  <SelectItem value="CAR">{t('availability.vehicleTypes.CAR')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
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
