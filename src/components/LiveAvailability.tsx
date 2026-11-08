'use client'

import { useEffect, useRef, useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle, CardAction } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useT } from '@/components/I18nProvider'
import type { LotAvailability } from '@/server/services/availability'

/**
 * Opens an `EventSource` on `/api/availability/stream` and renders the
 * latest `LotAvailability[]` it receives, seeded with `initial` (the
 * server-rendered snapshot) until the first SSE message arrives.
 */
export function LiveAvailability({ initial }: { initial: LotAvailability[] }) {
  const t = useT()
  const [lots, setLots] = useState<LotAvailability[]>(initial)
  const sourceRef = useRef<EventSource | null>(null)

  useEffect(() => {
    const source = new EventSource('/api/availability/stream')
    sourceRef.current = source

    source.onmessage = (event) => {
      try {
        setLots(JSON.parse(event.data) as LotAvailability[])
      } catch {
        // ignore malformed payloads (e.g. ping comments never reach onmessage)
      }
    }

    return () => {
      source.close()
      sourceRef.current = null
    }
  }, [])

  return (
    <div className="flex flex-col gap-4">
      {lots.map((lot) => (
        <Card key={lot.lotId}>
          <CardHeader>
            <CardTitle>{lot.lotName}</CardTitle>
            {lot.status === 'SUSPENDED' ? (
              <CardAction>
                <Badge variant="destructive">{t('availability.suspended')}</Badge>
              </CardAction>
            ) : null}
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('availability.zone')}</TableHead>
                  <TableHead>{t('availability.vehicleType')}</TableHead>
                  <TableHead>{t('availability.free')}</TableHead>
                  <TableHead>{t('availability.capacity')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {lot.zones.flatMap((zone) =>
                  zone.byType.map((type) => (
                    <TableRow key={`${zone.zoneId}-${type.vehicleType}`}>
                      <TableCell>{zone.zoneName}</TableCell>
                      <TableCell>{type.vehicleType}</TableCell>
                      <TableCell>{type.free}</TableCell>
                      <TableCell>{type.capacity}</TableCell>
                    </TableRow>
                  )),
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
