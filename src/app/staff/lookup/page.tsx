import { db } from '@/server/db'
import { getDict, getLang, t } from '@/i18n'
import { requireRole } from '@/server/auth/rbac'
import { DomainError } from '@/server/errors'
import { staffLookup, type LookupResult } from '@/server/services/lookup'
import { listActiveReservations } from '@/server/services/reservations'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import type { IdMethod } from '@/lib/types'

const METHODS: IdMethod[] = ['PLATE', 'QR', 'RFID']
const METHOD_LABEL: Record<IdMethod, string> = { PLATE: 'entry.methodPlate', QR: 'entry.methodQr', RFID: 'entry.methodRfid' }

/**
 * Staff vehicle lookup (A-65, G-08, Q34): vehicle, open session and active
 * reservation for one plate, QR or RFID, plus the list of active reservations.
 * A successful lookup logs VIEW_FULL_PLATE (inside staffLookup).
 */
export default async function StaffLookupPage({
  searchParams,
}: {
  searchParams: Promise<{ method?: string; identifier?: string }>
}) {
  const user = await requireRole('STAFF', 'MANAGER')
  const lang = await getLang()
  const dict = getDict(lang)
  const { method: rawMethod, identifier } = await searchParams
  const method: IdMethod = METHODS.includes(rawMethod as IdMethod) ? (rawMethod as IdMethod) : 'PLATE'

  let result: LookupResult | null = null
  let notFound = false
  if (identifier?.trim()) {
    try {
      result = await staffLookup(db, { method, identifier, viewerId: user.id })
    } catch (err) {
      if (err instanceof DomainError && err.code === 'NOT_FOUND') notFound = true
      else throw err
    }
  }

  const active = await listActiveReservations(db)

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-heading text-xl font-semibold">{t(dict, 'lookup.title')}</h1>

      <form className="flex flex-wrap items-end gap-4" method="get">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="method">{t(dict, 'lookup.method')}</Label>
          <select
            id="method"
            name="method"
            defaultValue={method}
            className="h-9 rounded-md border border-input bg-transparent px-2 text-sm"
          >
            {METHODS.map((m) => (
              <option key={m} value={m}>
                {t(dict, METHOD_LABEL[m])}
              </option>
            ))}
          </select>
        </div>
        <div className="flex min-w-56 flex-1 flex-col gap-1.5">
          <Label htmlFor="identifier">{t(dict, 'lookup.identifier')}</Label>
          <Input id="identifier" name="identifier" defaultValue={identifier ?? ''} required />
        </div>
        <Button type="submit">{t(dict, 'lookup.search')}</Button>
      </form>

      {notFound && <p className="text-sm text-destructive">{t(dict, 'lookup.notFound')}</p>}

      {result && (
        <div className="grid gap-4 sm:grid-cols-3">
          <section className="flex flex-col gap-1 rounded-md border p-4">
            <h2 className="font-medium">{t(dict, 'lookup.vehicle')}</h2>
            <p className="font-mono text-lg">{result.vehicle.plate}</p>
            <p className="text-sm">{t(dict, `availability.vehicleTypes.${result.vehicle.vehicleTypeCode}`)}</p>
            <p className="text-sm text-muted-foreground">
              {t(dict, result.vehicle.hasOwner ? 'lookup.registered' : 'lookup.guest')}
            </p>
          </section>
          <section className="flex flex-col gap-1 rounded-md border p-4">
            <h2 className="font-medium">{t(dict, result.openSession ? 'lookup.parked' : 'lookup.notParked')}</h2>
            {result.openSession && (
              <>
                <p className="text-sm">
                  {t(dict, 'lookup.zone')}: {result.openSession.zoneName}
                </p>
                <p className="text-sm">
                  {t(dict, 'lookup.entryTime')}: {result.openSession.entryTime.toLocaleString()}
                </p>
              </>
            )}
          </section>
          <section className="flex flex-col gap-1 rounded-md border p-4">
            <h2 className="font-medium">
              {t(dict, result.activeReservation ? 'lookup.reservation' : 'lookup.noReservation')}
            </h2>
            {result.activeReservation && (
              <>
                <p className="text-sm">
                  {t(dict, 'lookup.zone')}: {result.activeReservation.zoneName}
                </p>
                <p className="text-sm">
                  {t(dict, 'lookup.arrival')}: {result.activeReservation.arrivalTime.toLocaleString()}
                </p>
                <p className="text-sm">
                  {t(dict, 'lookup.holdUntil')}: {result.activeReservation.holdUntil.toLocaleString()}
                </p>
              </>
            )}
          </section>
        </div>
      )}

      <section className="flex flex-col gap-2">
        <h2 className="font-medium">{t(dict, 'lookup.activeReservations')}</h2>
        {active.length === 0 ? (
          <p className="text-sm text-muted-foreground">{t(dict, 'lookup.noActiveReservations')}</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t(dict, 'sessions.plate')}</TableHead>
                <TableHead>{t(dict, 'lookup.zone')}</TableHead>
                <TableHead>{t(dict, 'sessions.vehicleType')}</TableHead>
                <TableHead>{t(dict, 'lookup.arrival')}</TableHead>
                <TableHead>{t(dict, 'lookup.holdUntil')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {active.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="font-mono">{r.plate}</TableCell>
                  <TableCell>{r.zoneName}</TableCell>
                  <TableCell>{t(dict, `availability.vehicleTypes.${r.vehicleTypeCode}`)}</TableCell>
                  <TableCell>{r.arrivalTime.toLocaleString()}</TableCell>
                  <TableCell>{r.holdUntil.toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </section>
    </div>
  )
}
