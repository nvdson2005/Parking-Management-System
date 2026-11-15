'use client'

import { useState } from 'react'
import { useT } from '@/components/I18nProvider'
import { UtilisationChart } from '@/components/ReportsCharts'
import type { UtilisationSlice } from '@/server/services/reports'

const OVERALL = 'overall'

/**
 * Hourly utilisation chart with a scope selector: the overall series, or one
 * zone and vehicle-type slice (lecturer R3).
 */
export function UtilisationPanel({
  overall,
  slices,
}: {
  overall: Array<{ hour: number; rate: number }>
  slices: UtilisationSlice[]
}) {
  const t = useT()
  const [scope, setScope] = useState(OVERALL)

  const selected = slices.find((s) => `${s.zoneId}:${s.vehicleTypeCode}` === scope)
  const data = selected ? selected.byHour : overall

  return (
    <div className="flex flex-col gap-3">
      <label className="flex items-center gap-2 text-sm">
        {t('reports.utilisationScope')}
        <select
          className="rounded-md border bg-background px-2 py-1 text-sm"
          value={scope}
          onChange={(e) => setScope(e.target.value)}
        >
          <option value={OVERALL}>{t('reports.utilisationOverall')}</option>
          {slices.map((s) => (
            <option key={`${s.zoneId}:${s.vehicleTypeCode}`} value={`${s.zoneId}:${s.vehicleTypeCode}`}>
              {s.zoneName} · {t(`availability.vehicleTypes.${s.vehicleTypeCode}`)}
            </option>
          ))}
        </select>
      </label>
      <UtilisationChart data={data} />
    </div>
  )
}
