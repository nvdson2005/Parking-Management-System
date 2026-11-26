'use client'

import type { FormEvent } from 'react'
import { Button } from '@/components/ui/button'
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
import type { VehicleTypeCode } from '@/lib/types'

export type VehicleOption = { id: string; plate: string; vehicleTypeCode: VehicleTypeCode }
export type ZoneChoice = { zoneId: string; label: string }

/**
 * The reservation form fields, without data loading (spec 006). The selects
 * show the label of the current choice, not its id (FR-009); when no valid
 * arrival time remains today the form says so and blocks submit (FR-008).
 */
export function ReservationForm({
  vehicles,
  vehicleId,
  onVehicleChange,
  zones,
  zoneId,
  onZoneChange,
  arrivalTime,
  minArrival,
  maxArrival,
  onArrivalChange,
  closedToday,
  submitting,
  onSubmit,
}: {
  vehicles: VehicleOption[]
  vehicleId: string
  onVehicleChange: (id: string) => void
  /** Zones with a free spot for the selected vehicle's type. */
  zones: ZoneChoice[]
  zoneId: string
  onZoneChange: (id: string) => void
  arrivalTime: string
  minArrival?: string
  maxArrival: string
  onArrivalChange: (value: string) => void
  closedToday: boolean
  submitting: boolean
  onSubmit: (e: FormEvent) => void
}) {
  const t = useT()
  const vehicleLabel = (v: VehicleOption) => `${v.plate} · ${t(`availability.vehicleTypes.${v.vehicleTypeCode}`)}`
  const selectedVehicle = vehicles.find((v) => v.id === vehicleId) ?? null
  const canSubmit = vehicleId !== '' && zoneId !== '' && arrivalTime !== '' && !closedToday && !submitting

  return (
    <form className="flex flex-col gap-4" onSubmit={onSubmit}>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="vehicle">{t('reservations.vehicle')}</Label>
        <Select value={vehicleId} onValueChange={(value) => onVehicleChange(value ?? '')}>
          <SelectTrigger id="vehicle" className="w-full">
            <SelectValue placeholder={t('reservations.selectVehicle')}>
              {(value: string | null) => {
                const v = vehicles.find((x) => x.id === value)
                return v ? vehicleLabel(v) : t('reservations.selectVehicle')
              }}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {vehicles.map((v) => (
              <SelectItem key={v.id} value={v.id}>
                {vehicleLabel(v)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="zone">{t('reservations.zone')}</Label>
        {selectedVehicle && zones.length === 0 ? (
          <p className="text-sm text-muted-foreground">{t('reservations.noZones')}</p>
        ) : (
          <Select value={zoneId} onValueChange={(value) => onZoneChange(value ?? '')} disabled={!selectedVehicle}>
            <SelectTrigger id="zone" className="w-full">
              <SelectValue placeholder={t('reservations.selectZone')}>
                {(value: string | null) => zones.find((z) => z.zoneId === value)?.label ?? t('reservations.selectZone')}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {zones.map((z) => (
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
          min={minArrival}
          max={maxArrival}
          disabled={closedToday}
          onChange={(e) => onArrivalChange(e.target.value)}
        />
        {closedToday ? (
          <p role="status" className="text-sm text-muted-foreground">
            {t('reservations.closedToday')}
          </p>
        ) : null}
      </div>

      <Button type="submit" disabled={!canSubmit} className="self-start">
        {submitting ? t('reservations.submitting') : t('reservations.submit')}
      </Button>
    </form>
  )
}
