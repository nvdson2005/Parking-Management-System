import { db } from '@/server/db'
import { getDict, getLang, t } from '@/i18n'
import { requireRole } from '@/server/auth/rbac'
import { listAccessLogs } from '@/server/services/accounts'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { PurgeButton } from './PurgeButton'

export default async function ManagerAccessLogPage() {
  await requireRole('MANAGER')
  const lang = await getLang()
  const dict = getDict(lang)

  const logs = await listAccessLogs(db, { limit: 200 })

  return (
    <div className="flex flex-col gap-4">
      <h1 className="font-heading text-xl font-semibold">{t(dict, 'accessLog.title')}</h1>

      <PurgeButton />

      {logs.length === 0 ? (
        <p className="text-sm text-muted-foreground">{t(dict, 'accessLog.empty')}</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t(dict, 'accessLog.time')}</TableHead>
              <TableHead>{t(dict, 'accessLog.user')}</TableHead>
              <TableHead>{t(dict, 'accessLog.action')}</TableHead>
              <TableHead>{t(dict, 'accessLog.target')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {logs.map((log) => (
              <TableRow key={log.id}>
                <TableCell>{log.createdAt.toLocaleString()}</TableCell>
                <TableCell>{log.userName ?? '—'}</TableCell>
                <TableCell>{t(dict, `accessLog.actions.${log.action}`)}</TableCell>
                <TableCell>{log.target ?? '—'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  )
}
