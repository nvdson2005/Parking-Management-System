'use client'

import { useCallback, useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useT } from '@/components/I18nProvider'
import type { FeeGroup, VehicleTypeCode } from '@/lib/types'

const VEHICLE_TYPES: VehicleTypeCode[] = ['MOTORBIKE', 'CAR']
const FEE_GROUPS: FeeGroup[] = ['STUDENT', 'LECTURER_STAFF', 'GUEST']

type Tariff = { vehicleTypeCode: string; feeGroup: string; price: number }

function keyOf(type: VehicleTypeCode, group: FeeGroup): string {
  return `${type}:${group}`
}

export default function ManagerTariffsPage() {
  const t = useT()
  const [prices, setPrices] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState<string | null>(null)

  const load = useCallback(async () => {
    const res = await fetch('/api/tariffs')
    const body = await res.json()
    const map: Record<string, string> = {}
    if (res.ok) {
      for (const tariff of body as Tariff[]) {
        map[`${tariff.vehicleTypeCode}:${tariff.feeGroup}`] = String(tariff.price)
      }
    }
    setPrices(map)
    setLoading(false)
  }, [])

  useEffect(() => {
    load().catch(() => setLoading(false))
  }, [load])

  async function handleSave(type: VehicleTypeCode, group: FeeGroup) {
    const key = keyOf(type, group)
    setError(null)
    setBusy(key)
    try {
      const res = await fetch('/api/tariffs', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vehicleType: type, feeGroup: group, price: Number(prices[key] ?? '0') }),
      })
      if (!res.ok) {
        const body = await res.json()
        setError(t(`errors.${body.error ?? 'UNKNOWN_CODE'}`))
        return
      }
      await load()
    } catch {
      setError(t('common.networkError'))
    } finally {
      setBusy(null)
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <h1 className="font-heading text-xl font-semibold">{t('tariffs.title')}</h1>

      {error ? (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      ) : null}

      {loading ? (
        <p className="text-sm text-muted-foreground">{t('common.loading')}</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t('tariffs.vehicleType')}</TableHead>
              {FEE_GROUPS.map((group) => (
                <TableHead key={group}>{t(`tariffs.feeGroups.${group}`)}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {VEHICLE_TYPES.map((type) => (
              <TableRow key={type}>
                <TableCell className="font-medium">{t(`availability.vehicleTypes.${type}`)}</TableCell>
                {FEE_GROUPS.map((group) => {
                  const key = keyOf(type, group)
                  return (
                    <TableCell key={group}>
                      <div className="flex items-center gap-2">
                        <Input
                          aria-label={`${t(`availability.vehicleTypes.${type}`)} ${t(`tariffs.feeGroups.${group}`)}`}
                          type="number"
                          min={0}
                          className="w-28"
                          value={prices[key] ?? ''}
                          onChange={(e) => setPrices((prev) => ({ ...prev, [key]: e.target.value }))}
                        />
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={busy === key}
                          onClick={() => handleSave(type, group)}
                        >
                          {busy === key ? t('tariffs.saving') : t('tariffs.save')}
                        </Button>
                      </div>
                    </TableCell>
                  )
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  )
}
