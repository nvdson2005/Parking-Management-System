'use client'

import { useEffect, useRef, useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle, CardAction, CardDescription } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useT } from '@/components/I18nProvider'
import type { Role } from '@/lib/types'
import type { LotAvailability } from '@/server/services/availability'

/** `HH:mm:ss` in local time; the same text on the server render and in the browser. */
function clock(d: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
}

/**
 * Opens an `EventSource` on `/api/availability/stream` and renders the
 * latest `LotAvailability[]` it receives, seeded with `initial` (the
 * server-rendered snapshot) until the first SSE message arrives.
 *
 * Spec 006 (CR-03, A-49 gaps G1-G3): shows when the data was last updated
 * (FR-19), the used spots per zone for Staff and Manager (FR-20), and a
 * "full" mark when no spot is free (FR-21).
 */
export function LiveAvailability({
  initial,
  role,
  renderedAt,
}: {
  initial: LotAvailability[]
  role: Role
  /** ISO time of the server snapshot in `initial`. */
  renderedAt: string
}) {
  const t = useT()
  const [lots, setLots] = useState<LotAvailability[]>(initial)
  const [updatedAt, setUpdatedAt] = useState<Date>(() => new Date(renderedAt))
  const sourceRef = useRef<EventSource | null>(null)
  const showUsed = role === 'STAFF' || role === 'MANAGER'

  useEffect(() => {
    const source = new EventSource('/api/availability/stream')
    sourceRef.current = source

    source.onmessage = (event) => {
      try {
        setLots(JSON.parse(event.data) as LotAvailability[])
        setUpdatedAt(new Date())
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
            <CardDescription>
              {t('availability.updatedAt')} {clock(updatedAt)}
            </CardDescription>
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
                  {showUsed ? <TableHead>{t('availability.used')}</TableHead> : null}
                  <TableHead>{t('availability.capacity')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {lot.zones.flatMap((zone) =>
                  zone.byType.map((type) => (
                    <TableRow key={`${zone.zoneId}-${type.vehicleType}`}>
                      <TableCell>{zone.zoneName}</TableCell>
                      <TableCell>{t(`availability.vehicleTypes.${type.vehicleType}`)}</TableCell>
                      <TableCell>
                        <span className="inline-flex items-center gap-2">
                          {type.free}
                          {type.free === 0 ? <Badge variant="destructive">{t('availability.full')}</Badge> : null}
                        </span>
                      </TableCell>
                      {showUsed ? <TableCell>{type.open + type.reserved}</TableCell> : null}
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
