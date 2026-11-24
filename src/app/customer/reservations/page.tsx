'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useT } from '@/components/I18nProvider'
import { defaultArrival, minArrivalInput, toLocalDateTimeInput } from '@/lib/arrival'
import { ReservationForm } from './ReservationForm'
import type { VehicleOption, ZoneChoice } from './ReservationForm'
import type { ReservationStatus, VehicleTypeCode } from '@/lib/types'

type Vehicle = VehicleOption

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
  cancelReason: 'CUSTOMER' | 'ENTERED_OTHER_ZONE' | 'LOT_SUSPENDED' | null
  cancelZoneName: string | null
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
  // Set on the client only, so the server render and hydration agree.
  const [minArrival, setMinArrival] = useState<string | undefined>(undefined)
  const [closedToday, setClosedToday] = useState(false)
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

  // Pre-fill a valid arrival time (spec 006 US2): the current minute is already
  // past and would fail with RESERVATION_WINDOW. No valid time left: say so.
  useEffect(() => {
    if (arrivalTime) return
    const now = new Date()
    setMinArrival(minArrivalInput(now))
    const next = defaultArrival(now)
    if (next) {
      setClosedToday(false)
      setArrivalTime(toLocalDateTimeInput(next))
    } else {
      setClosedToday(true)
    }
  }, [arrivalTime])

  const selectedVehicle = vehicles.find((v) => v.id === vehicleId) ?? null

  // Zones that currently have a free spot for the selected vehicle's type.
  const availableZones = useMemo(() => {
    if (!selectedVehicle) return [] as ZoneChoice[]
    const type = selectedVehicle.vehicleTypeCode
    const zones: ZoneChoice[] = []
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
            <ReservationForm
              vehicles={vehicles}
              vehicleId={vehicleId}
              onVehicleChange={setVehicleId}
              zones={availableZones}
              zoneId={zoneId}
              onZoneChange={setZoneId}
              arrivalTime={arrivalTime}
              minArrival={minArrival}
              maxArrival={maxArrival}
              onArrivalChange={setArrivalTime}
              closedToday={closedToday}
              submitting={submitting}
              onSubmit={handleSubmit}
            />
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
                    {r.status === 'CANCELLED' && r.cancelReason ? (
                      <span className="text-muted-foreground">
                        {t(`reservations.cancelReason.${r.cancelReason}`).replace('{zone}', r.cancelZoneName ?? '')}
                      </span>
                    ) : null}
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
