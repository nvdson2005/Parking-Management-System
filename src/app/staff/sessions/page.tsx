import Link from 'next/link'
import { db } from '@/server/db'
import { getDict, getLang, t } from '@/i18n'
import { requireRole } from '@/server/auth/rbac'
import { listSessions } from '@/server/services/sessions'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

export default async function StaffSessionsPage() {
  const user = await requireRole('STAFF', 'MANAGER')
  const lang = await getLang()
  const dict = getDict(lang)

  // Same data as GET /api/sessions (A-65, KB-15); plates already go through presentPlate.
  const sessions = await listSessions(db, { status: 'OPEN' }, user)

  return (
    <div className="flex flex-col gap-4">
      <h1 className="font-heading text-xl font-semibold">{t(dict, 'sessions.title')}</h1>

      {sessions.length === 0 ? (
        <p className="text-sm text-muted-foreground">{t(dict, 'sessions.empty')}</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t(dict, 'sessions.plate')}</TableHead>
              <TableHead>{t(dict, 'sessions.zone')}</TableHead>
              <TableHead>{t(dict, 'sessions.vehicleType')}</TableHead>
              <TableHead>{t(dict, 'sessions.entryTime')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sessions.map((session) => (
              <TableRow key={session.id} className="cursor-pointer">
                <TableCell className="font-mono">
                  <Link href={`/staff/sessions/${session.id}`} className="block hover:underline">
                    {session.plate}
                  </Link>
                </TableCell>
                <TableCell>
                  <Link href={`/staff/sessions/${session.id}`} className="block">
                    {session.zoneName}
                  </Link>
                </TableCell>
                <TableCell>
                  <Link href={`/staff/sessions/${session.id}`} className="block">
                    {t(dict, `availability.vehicleTypes.${session.vehicleTypeCode}`)}
                  </Link>
                </TableCell>
                <TableCell>
                  <Link href={`/staff/sessions/${session.id}`} className="block">
                    {session.entryTime.toLocaleString()}
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  )
}
