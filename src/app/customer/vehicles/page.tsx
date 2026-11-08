'use client'

import { useCallback, useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import QRCode from 'qrcode'
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
import { PlateText } from '@/components/PlateText'
import { useT } from '@/components/I18nProvider'
import type { VehicleTypeCode } from '@/lib/types'

type Vehicle = {
  id: string
  plate: string
  qrCode: string
  rfidCode: string
  vehicleTypeCode: VehicleTypeCode
  ownerId: string | null
}

export default function VehiclesPage() {
  const t = useT()
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [qrImages, setQrImages] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const [plate, setPlate] = useState('')
  const [vehicleType, setVehicleType] = useState<VehicleTypeCode>('MOTORBIKE')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [removingId, setRemovingId] = useState<string | null>(null)

  const loadVehicles = useCallback(async () => {
    const res = await fetch('/api/vehicles')
    const body = await res.json()
    setVehicles(res.ok ? (body as Vehicle[]) : [])
    setLoading(false)
  }, [])

  useEffect(() => {
    loadVehicles().catch(() => setLoading(false))
  }, [loadVehicles])

  useEffect(() => {
    let cancelled = false
    async function render() {
      const entries = await Promise.all(
        vehicles.map(async (v) => [v.id, await QRCode.toDataURL(v.qrCode)] as const),
      )
      if (!cancelled) setQrImages(Object.fromEntries(entries))
    }
    render().catch(() => {
      // QR rendering is a visual convenience; leave the text codes visible.
    })
    return () => {
      cancelled = true
    }
  }, [vehicles])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setSubmitting(true)
    try {
      const res = await fetch('/api/vehicles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plate, vehicleType }),
      })
      const body = await res.json()
      if (!res.ok) {
        setError(t(`errors.${body.error ?? 'UNKNOWN_CODE'}`))
        return
      }
      setPlate('')
      await loadVehicles()
    } catch {
      // fetch rejected (offline, DNS failure, etc.) rather than resolving
      setError(t('common.networkError'))
    } finally {
      setSubmitting(false)
    }
  }

  async function handleRemove(id: string) {
    setError(null)
    setRemovingId(id)
    try {
      const res = await fetch(`/api/vehicles/${id}`, { method: 'DELETE' })
      if (!res.ok) {
        const body = await res.json()
        setError(t(`errors.${body.error ?? 'UNKNOWN_CODE'}`))
        return
      }
      await loadVehicles()
    } catch {
      setError(t('common.networkError'))
    } finally {
      setRemovingId(null)
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <h1 className="font-heading text-xl font-semibold">{t('vehicles.title')}</h1>

      <Card>
        <CardHeader>
          <CardTitle>{t('vehicles.addTitle')}</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="flex flex-col gap-4 sm:flex-row sm:items-end" onSubmit={handleSubmit}>
            <div className="flex flex-1 flex-col gap-1.5">
              <Label htmlFor="plate">{t('vehicles.plate')}</Label>
              <Input id="plate" required value={plate} onChange={(e) => setPlate(e.target.value)} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="vehicleType">{t('vehicles.vehicleType')}</Label>
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
            <Button type="submit" disabled={submitting}>
              {submitting ? t('vehicles.submitting') : t('vehicles.submit')}
            </Button>
          </form>
          {error ? (
            <p role="alert" className="mt-2 text-sm text-destructive">
              {error}
            </p>
          ) : null}
        </CardContent>
      </Card>

      {loading ? (
        <p className="text-sm text-muted-foreground">{t('common.loading')}</p>
      ) : vehicles.length === 0 ? (
        <p className="text-sm text-muted-foreground">{t('vehicles.empty')}</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {vehicles.map((v) => (
            <Card key={v.id}>
              <CardContent className="flex flex-col gap-2 pt-6">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold">
                    <PlateText plate={v.plate} ownerId={v.ownerId} viewer={{ id: v.ownerId ?? '', role: 'CUSTOMER' }} />
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {t(`availability.vehicleTypes.${v.vehicleTypeCode}`)}
                  </span>
                </div>
                {qrImages[v.id] ? (
                  // eslint-disable-next-line @next/next/no-img-element -- data: URL, not an optimizable remote image
                  <img src={qrImages[v.id]} alt={t('vehicles.qrAlt')} width={160} height={160} />
                ) : null}
                <p className="font-mono text-xs text-muted-foreground">
                  {t('vehicles.qrCode')}: {v.qrCode}
                </p>
                <p className="font-mono text-xs text-muted-foreground">
                  {t('vehicles.rfidCode')}: {v.rfidCode}
                </p>
                <Button
                  size="sm"
                  variant="outline"
                  disabled={removingId === v.id}
                  onClick={() => handleRemove(v.id)}
                >
                  {removingId === v.id ? t('vehicles.removing') : t('vehicles.remove')}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
