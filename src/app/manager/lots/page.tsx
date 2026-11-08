'use client'

import { useCallback, useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useT } from '@/components/I18nProvider'
import type { VehicleTypeCode } from '@/lib/types'

const VEHICLE_TYPES: VehicleTypeCode[] = ['MOTORBIKE', 'CAR']

type ZoneCapacity = { vehicleTypeCode: string; capacity: number }
type Zone = { id: string; name: string; capacities: ZoneCapacity[] }
type Lot = { id: string; name: string; address: string; status: 'ACTIVE' | 'SUSPENDED'; zones: Zone[] }

function capacityOf(zone: Zone, type: VehicleTypeCode): number {
  return zone.capacities.find((c) => c.vehicleTypeCode === type)?.capacity ?? 0
}

export default function ManagerLotsPage() {
  const t = useT()
  const [lots, setLots] = useState<Lot[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState<string | null>(null)

  const [lotName, setLotName] = useState('')
  const [lotAddress, setLotAddress] = useState('')

  const [zoneDrafts, setZoneDrafts] = useState<Record<string, { name: string; MOTORBIKE: string; CAR: string }>>({})
  const [capDrafts, setCapDrafts] = useState<Record<string, string>>({})
  const [lotEdits, setLotEdits] = useState<Record<string, { name: string; address: string }>>({})
  const [zoneNameDrafts, setZoneNameDrafts] = useState<Record<string, string>>({})

  const load = useCallback(async () => {
    const res = await fetch('/api/lots')
    const body = await res.json()
    setLots(res.ok ? (body as Lot[]) : [])
    setLoading(false)
  }, [])

  useEffect(() => {
    load().catch(() => setLoading(false))
  }, [load])

  async function send(url: string, method: string, payload: unknown, key: string): Promise<boolean> {
    setError(null)
    setBusy(key)
    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) {
        const body = await res.json()
        setError(t(`errors.${body.error ?? 'UNKNOWN_CODE'}`))
        return false
      }
      await load()
      return true
    } catch {
      setError(t('common.networkError'))
      return false
    } finally {
      setBusy(null)
    }
  }

  async function handleAddLot(e: FormEvent) {
    e.preventDefault()
    const ok = await send('/api/lots', 'POST', { name: lotName, address: lotAddress }, 'add-lot')
    if (ok) {
      setLotName('')
      setLotAddress('')
    }
  }

  async function handleToggleStatus(lot: Lot) {
    const status = lot.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE'
    await send(`/api/lots/${lot.id}`, 'PATCH', { status }, `status-${lot.id}`)
  }

  async function handleSaveLotDetails(e: FormEvent, lot: Lot) {
    e.preventDefault()
    const draft = lotEdits[lot.id] ?? { name: lot.name, address: lot.address }
    const ok = await send(
      `/api/lots/${lot.id}`,
      'PATCH',
      { name: draft.name, address: draft.address },
      `details-${lot.id}`,
    )
    if (ok) {
      setLotEdits((prev) => {
        const next = { ...prev }
        delete next[lot.id]
        return next
      })
    }
  }

  async function handleSaveZoneName(e: FormEvent, zone: Zone) {
    e.preventDefault()
    const name = zoneNameDrafts[zone.id] ?? zone.name
    const ok = await send(`/api/zones/${zone.id}`, 'PATCH', { name }, `zone-name-${zone.id}`)
    if (ok) {
      setZoneNameDrafts((prev) => {
        const next = { ...prev }
        delete next[zone.id]
        return next
      })
    }
  }

  async function handleAddZone(e: FormEvent, lotId: string) {
    e.preventDefault()
    const draft = zoneDrafts[lotId] ?? { name: '', MOTORBIKE: '', CAR: '' }
    const capacities: Partial<Record<VehicleTypeCode, number>> = {}
    for (const type of VEHICLE_TYPES) {
      if (draft[type] !== '') capacities[type] = Number(draft[type])
    }
    const ok = await send('/api/zones', 'POST', { lotId, name: draft.name, capacities }, `add-zone-${lotId}`)
    if (ok) setZoneDrafts((prev) => ({ ...prev, [lotId]: { name: '', MOTORBIKE: '', CAR: '' } }))
  }

  async function handleSaveCapacity(zone: Zone, type: VehicleTypeCode) {
    const key = `${zone.id}:${type}`
    const draft = capDrafts[key]
    const value = draft === undefined ? capacityOf(zone, type) : Number(draft)
    await send(`/api/zones/${zone.id}`, 'PATCH', { capacities: { [type]: value } }, `cap-${key}`)
  }

  return (
    <div className="flex flex-col gap-4">
      <h1 className="font-heading text-xl font-semibold">{t('lots.title')}</h1>

      <Card>
        <CardHeader>
          <CardTitle>{t('lots.addLotTitle')}</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="flex flex-col gap-4 sm:flex-row sm:items-end" onSubmit={handleAddLot}>
            <div className="flex flex-1 flex-col gap-1.5">
              <Label htmlFor="lotName">{t('lots.name')}</Label>
              <Input id="lotName" required value={lotName} onChange={(e) => setLotName(e.target.value)} />
            </div>
            <div className="flex flex-1 flex-col gap-1.5">
              <Label htmlFor="lotAddress">{t('lots.address')}</Label>
              <Input
                id="lotAddress"
                required
                value={lotAddress}
                onChange={(e) => setLotAddress(e.target.value)}
              />
            </div>
            <Button type="submit" disabled={busy === 'add-lot'}>
              {busy === 'add-lot' ? t('lots.addingLot') : t('lots.addLot')}
            </Button>
          </form>
        </CardContent>
      </Card>

      {error ? (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      ) : null}

      {loading ? (
        <p className="text-sm text-muted-foreground">{t('common.loading')}</p>
      ) : lots.length === 0 ? (
        <p className="text-sm text-muted-foreground">{t('lots.empty')}</p>
      ) : (
        lots.map((lot) => (
          <Card key={lot.id}>
            <CardHeader>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <CardTitle>{lot.name}</CardTitle>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-muted-foreground">
                    {t('lots.status')}: {lot.status === 'ACTIVE' ? t('lots.active') : t('lots.suspended')}
                  </span>
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={busy === `status-${lot.id}`}
                    onClick={() => handleToggleStatus(lot)}
                  >
                    {lot.status === 'ACTIVE' ? t('lots.suspend') : t('lots.reactivate')}
                  </Button>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">{lot.address}</p>
              <form
                className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-end"
                onSubmit={(e) => handleSaveLotDetails(e, lot)}
              >
                <div className="flex flex-1 flex-col gap-1.5">
                  <Label htmlFor={`editLotName-${lot.id}`}>{t('lots.name')}</Label>
                  <Input
                    id={`editLotName-${lot.id}`}
                    required
                    value={lotEdits[lot.id]?.name ?? lot.name}
                    onChange={(e) =>
                      setLotEdits((prev) => ({
                        ...prev,
                        [lot.id]: { name: e.target.value, address: prev[lot.id]?.address ?? lot.address },
                      }))
                    }
                  />
                </div>
                <div className="flex flex-1 flex-col gap-1.5">
                  <Label htmlFor={`editLotAddress-${lot.id}`}>{t('lots.address')}</Label>
                  <Input
                    id={`editLotAddress-${lot.id}`}
                    required
                    value={lotEdits[lot.id]?.address ?? lot.address}
                    onChange={(e) =>
                      setLotEdits((prev) => ({
                        ...prev,
                        [lot.id]: { name: prev[lot.id]?.name ?? lot.name, address: e.target.value },
                      }))
                    }
                  />
                </div>
                <Button type="submit" variant="outline" disabled={busy === `details-${lot.id}`}>
                  {busy === `details-${lot.id}` ? t('lots.saving') : t('lots.save')}
                </Button>
              </form>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="flex flex-col gap-3">
                <h3 className="text-sm font-semibold">{t('lots.zones')}</h3>
                {lot.zones.length === 0 ? (
                  <p className="text-sm text-muted-foreground">{t('lots.zonesEmpty')}</p>
                ) : (
                  lot.zones.map((zone) => (
                    <div key={zone.id} className="flex flex-wrap items-end gap-4 rounded border p-3">
                      <form className="flex items-end gap-2" onSubmit={(e) => handleSaveZoneName(e, zone)}>
                        <div className="flex flex-col gap-1.5">
                          <Label htmlFor={`zoneEditName-${zone.id}`}>{t('lots.zoneName')}</Label>
                          <Input
                            id={`zoneEditName-${zone.id}`}
                            required
                            className="w-32"
                            value={zoneNameDrafts[zone.id] ?? zone.name}
                            onChange={(e) => setZoneNameDrafts((prev) => ({ ...prev, [zone.id]: e.target.value }))}
                          />
                        </div>
                        <Button
                          type="submit"
                          size="sm"
                          variant="outline"
                          disabled={busy === `zone-name-${zone.id}`}
                        >
                          {busy === `zone-name-${zone.id}` ? t('lots.saving') : t('lots.save')}
                        </Button>
                      </form>
                      {VEHICLE_TYPES.map((type) => {
                        const key = `${zone.id}:${type}`
                        return (
                          <div key={type} className="flex items-end gap-2">
                            <div className="flex flex-col gap-1.5">
                              <Label htmlFor={`cap-${key}`}>
                                {t(`availability.vehicleTypes.${type}`)} · {t('lots.capacity')}
                              </Label>
                              <Input
                                id={`cap-${key}`}
                                type="number"
                                min={0}
                                className="w-24"
                                value={capDrafts[key] ?? String(capacityOf(zone, type))}
                                onChange={(e) => setCapDrafts((prev) => ({ ...prev, [key]: e.target.value }))}
                              />
                            </div>
                            <Button
                              size="sm"
                              variant="outline"
                              disabled={busy === `cap-${key}`}
                              onClick={() => handleSaveCapacity(zone, type)}
                            >
                              {busy === `cap-${key}` ? t('lots.saving') : t('lots.save')}
                            </Button>
                          </div>
                        )
                      })}
                    </div>
                  ))
                )}
              </div>

              <form
                className="flex flex-wrap items-end gap-3 border-t pt-4"
                onSubmit={(e) => handleAddZone(e, lot.id)}
              >
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor={`zoneName-${lot.id}`}>{t('lots.zoneName')}</Label>
                  <Input
                    id={`zoneName-${lot.id}`}
                    required
                    className="w-40"
                    value={zoneDrafts[lot.id]?.name ?? ''}
                    onChange={(e) =>
                      setZoneDrafts((prev) => ({
                        ...prev,
                        [lot.id]: {
                          name: e.target.value,
                          MOTORBIKE: prev[lot.id]?.MOTORBIKE ?? '',
                          CAR: prev[lot.id]?.CAR ?? '',
                        },
                      }))
                    }
                  />
                </div>
                {VEHICLE_TYPES.map((type) => (
                  <div key={type} className="flex flex-col gap-1.5">
                    <Label htmlFor={`zoneCap-${lot.id}-${type}`}>
                      {t(`availability.vehicleTypes.${type}`)} · {t('lots.capacity')}
                    </Label>
                    <Input
                      id={`zoneCap-${lot.id}-${type}`}
                      type="number"
                      min={0}
                      className="w-24"
                      value={zoneDrafts[lot.id]?.[type] ?? ''}
                      onChange={(e) =>
                        setZoneDrafts((prev) => ({
                          ...prev,
                          [lot.id]: {
                            name: prev[lot.id]?.name ?? '',
                            MOTORBIKE: prev[lot.id]?.MOTORBIKE ?? '',
                            CAR: prev[lot.id]?.CAR ?? '',
                            [type]: e.target.value,
                          },
                        }))
                      }
                    />
                  </div>
                ))}
                <Button type="submit" disabled={busy === `add-zone-${lot.id}`}>
                  {busy === `add-zone-${lot.id}` ? t('lots.addingZone') : t('lots.addZone')}
                </Button>
              </form>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  )
}
