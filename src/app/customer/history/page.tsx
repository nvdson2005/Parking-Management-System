import { db } from '@/server/db'
import { getDict, getLang, t } from '@/i18n'
import { requireRole } from '@/server/auth/rbac'
import { customerHistory } from '@/server/services/history'
import { PlateText } from '@/components/PlateText'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

export default async function CustomerHistoryPage() {
  const user = await requireRole('CUSTOMER')
  const lang = await getLang()
  const dict = getDict(lang)

  const history = await customerHistory(db, user.id)

  return (
    <div className="flex flex-col gap-4">
      <h1 className="font-heading text-xl font-semibold">{t(dict, 'history.title')}</h1>

      {history.length === 0 ? (
        <p className="text-sm text-muted-foreground">{t(dict, 'history.empty')}</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t(dict, 'history.plate')}</TableHead>
              <TableHead>{t(dict, 'history.zone')}</TableHead>
              <TableHead>{t(dict, 'history.entryTime')}</TableHead>
              <TableHead>{t(dict, 'history.exitTime')}</TableHead>
              <TableHead>{t(dict, 'history.amount')}</TableHead>
              <TableHead>{t(dict, 'history.paidAt')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {history.map((entry) => (
              <TableRow key={entry.sessionId}>
                <TableCell className="font-mono">
                  {/* Session history is scoped to the customer's own vehicles, so the plate is always shown in full (D-39). */}
                  <PlateText plate={entry.plate} ownerId={user.id} viewer={user} />
                </TableCell>
                <TableCell>{entry.zoneName}</TableCell>
                <TableCell>{entry.entryTime.toLocaleString()}</TableCell>
                <TableCell>{entry.exitTime ? entry.exitTime.toLocaleString() : '—'}</TableCell>
                <TableCell>
                  {entry.amount !== null
                    ? `${new Intl.NumberFormat('vi-VN').format(entry.amount)} ₫`
                    : t(dict, 'history.notPaid')}
                </TableCell>
                <TableCell>{entry.paidAt ? entry.paidAt.toLocaleString() : '—'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  )
}
