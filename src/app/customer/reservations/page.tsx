'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import type { FormEvent } from 'react'
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
import { useT } from '@/components/I18nProvider'
import type { ReservationStatus, VehicleTypeCode } from '@/lib/types'

type Vehicle = {
  id: string
  plate: string
  vehicleTypeCode: VehicleTypeCode
}

type TypeAvailability = {
  vehicleType: VehicleTypeCode
  free: number
}

type ZoneAvailability = {
  zoneId: string
  zoneName: string
  byType: TypeAvailability[]
}

type LotAvailability = {
  lotName: string
  zones: ZoneAvailability[]
}

type Reservation = {
  id: string
  zoneId: string
  vehicleTypeCode: VehicleTypeCode
  arrivalTime: string
  holdUntil: string
  status: ReservationStatus
}

function toLocalDateTimeInput(d: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(
    d.getMinutes(),
  )}`
}

export default function ReservationsPage() {
  const t = useT()
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [lots, setLots] = useState<LotAvailability[]>([])
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [loading, setLoading] = useState(true)
  const [vehicleId, setVehicleId] = useState('')
  const [zoneId, setZoneId] = useState('')
  const [arrivalTime, setArrivalTime] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [cancellingId, setCancellingId] = useState<string | null>(null)

  const loadAll = useCallback(async () => {
    const [vehiclesRes, availabilityRes, reservationsRes] = await Promise.all([
      fetch('/api/vehicles'),
      fetch('/api/availability'),
      fetch('/api/reservations'),
    ])
    const [vehiclesBody, availabilityBody, reservationsBody] = await Promise.all([
      vehiclesRes.json(),
      availabilityRes.json(),
      reservationsRes.json(),
    ])
    setVehicles(vehiclesRes.ok ? (vehiclesBody as Vehicle[]) : [])
    setLots(availabilityRes.ok ? (availabilityBody as LotAvailability[]) : [])
    setReservations(reservationsRes.ok ? (reservationsBody as Reservation[]) : [])
    setLoading(false)
  }, [])

  useEffect(() => {
    loadAll().catch(() => setLoading(false))
  }, [loadAll])

  useEffect(() => {
    if (!arrivalTime) setArrivalTime(toLocalDateTimeInput(new Date()))
  }, [arrivalTime])

  const selectedVehicle = vehicles.find((v) => v.id === vehicleId) ?? null

  // Zones that currently have a free spot for the selected vehicle's type.
  const availableZones = useMemo(() => {
    if (!selectedVehicle) return [] as { zoneId: string; label: string }[]
    const type = selectedVehicle.vehicleTypeCode
    const zones: { zoneId: string; label: string }[] = []
    for (const lot of lots) {
      for (const zone of lot.zones) {
        const typeInfo = zone.byType.find((bt) => bt.vehicleType === type)
        if (typeInfo && typeInfo.free > 0) {
          zones.push({ zoneId: zone.zoneId, label: `${lot.lotName} · ${zone.zoneName}` })
        }
      }
    }
    return zones
  }, [lots, selectedVehicle])

  useEffect(() => {
    if (zoneId && !availableZones.some((z) => z.zoneId === zoneId)) setZoneId('')
  }, [availableZones, zoneId])

  // Latest day's final minute, matching the server reservation window.
  const maxArrival = useMemo(() => {
    const end = new Date()
    end.setHours(23, 59, 0, 0)
    return toLocalDateTimeInput(end)
  }, [])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setSubmitting(true)
    try {
      const res = await fetch('/api/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vehicleId,
          zoneId,
          arrivalTime: arrivalTime ? new Date(arrivalTime).toISOString() : '',
        }),
      })
      const body = await res.json()
      if (!res.ok) {
        setError(t(`errors.${body.error ?? 'VALIDATION'}`))
        return
      }
      setZoneId('')
      await loadAll()
    } catch {
      setError(t('common.networkError'))
    } finally {
      setSubmitting(false)
    }
  }

  async function handleCancel(id: string) {
    setError(null)
    setCancellingId(id)
    try {
      const res = await fetch(`/api/reservations/${id}/cancel`, { method: 'POST' })
      if (!res.ok) {
        const body = await res.json()
        setError(t(`errors.${body.error ?? 'VALIDATION'}`))
        return
      }
      await loadAll()
    } catch {
      setError(t('common.networkError'))
    } finally {
      setCancellingId(null)
    }
  }

  const canSubmit = vehicleId !== '' && zoneId !== '' && arrivalTime !== '' && !submitting

  return (
    <div className="flex flex-col gap-4">
      <h1 className="font-heading text-xl font-semibold">{t('reservations.title')}</h1>

      <Card>
        <CardHeader>
          <CardTitle>{t('reservations.createTitle')}</CardTitle>
        </CardHeader>
        <CardContent>
          {vehicles.length === 0 ? (
            <p className="text-sm text-muted-foreground">{t('reservations.noVehicles')}</p>
          ) : (
            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="vehicle">{t('reservations.vehicle')}</Label>
                <Select value={vehicleId} onValueChange={(value) => setVehicleId(value ?? '')}>
                  <SelectTrigger id="vehicle" className="w-full">
                    <SelectValue placeholder={t('reservations.selectVehicle')} />
                  </SelectTrigger>
                  <SelectContent>
                    {vehicles.map((v) => (
                      <SelectItem key={v.id} value={v.id}>
                        {v.plate} · {t(`availability.vehicleTypes.${v.vehicleTypeCode}`)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="zone">{t('reservations.zone')}</Label>
                {selectedVehicle && availableZones.length === 0 ? (
                  <p className="text-sm text-muted-foreground">{t('reservations.noZones')}</p>
                ) : (
                  <Select value={zoneId} onValueChange={(value) => setZoneId(value ?? '')} disabled={!selectedVehicle}>
                    <SelectTrigger id="zone" className="w-full">
                      <SelectValue placeholder={t('reservations.selectZone')} />
                    </SelectTrigger>
                    <SelectContent>
                      {availableZones.map((z) => (
                        <SelectItem key={z.zoneId} value={z.zoneId}>
                          {z.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="arrivalTime">{t('reservations.arrivalTime')}</Label>
                <Input
                  id="arrivalTime"
                  type="datetime-local"
                  required
                  value={arrivalTime}
                  max={maxArrival}
                  onChange={(e) => setArrivalTime(e.target.value)}
                />
              </div>

              <Button type="submit" disabled={!canSubmit} className="self-start">
                {submitting ? t('reservations.submitting') : t('reservations.submit')}
              </Button>
            </form>
          )}
          {error ? (
            <p role="alert" className="mt-2 text-sm text-destructive">
              {error}
            </p>
          ) : null}
        </CardContent>
      </Card>

      {loading ? (
        <p className="text-sm text-muted-foreground">{t('common.loading')}</p>
      ) : reservations.length === 0 ? (
        <p className="text-sm text-muted-foreground">{t('reservations.empty')}</p>
      ) : (
        <div className="flex flex-col gap-3">
          {reservations.map((r) => {
            const cancellable = r.status === 'PENDING' && new Date() < new Date(r.arrivalTime)
            return (
              <Card key={r.id}>
                <CardContent className="flex flex-col gap-2 pt-6 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex flex-col gap-1 text-sm">
                    <span className="font-medium">
                      {t('reservations.status')}: {t(`reservations.statuses.${r.status}`)}
                    </span>
                    <span className="text-muted-foreground">
                      {t('reservations.arrivalTime')}: {new Date(r.arrivalTime).toLocaleString()}
                    </span>
                    <span className="text-muted-foreground">
                      {t('reservations.holdUntil')}: {new Date(r.holdUntil).toLocaleString()}
                    </span>
                  </div>
                  {cancellable ? (
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={cancellingId === r.id}
                      onClick={() => handleCancel(r.id)}
                    >
                      {cancellingId === r.id ? t('reservations.cancelling') : t('reservations.cancel')}
                    </Button>
                  ) : null}
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
