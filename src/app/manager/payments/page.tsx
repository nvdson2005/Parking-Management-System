import { db } from '@/server/db'
import { getDict, getLang, t } from '@/i18n'
import { requireRole } from '@/server/auth/rbac'
import { allPayments } from '@/server/services/history'
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

// `datetime-local` inputs post `YYYY-MM-DDTHH:mm`, which `new Date(...)`
// parses as local time; invalid/empty values fall back to `undefined` so the
// range side is left open rather than throwing.
function parseFilterDate(value: string | undefined): Date | undefined {
  if (!value) return undefined
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? undefined : date
}

export default async function ManagerPaymentsPage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string; to?: string }>
}) {
  await requireRole('MANAGER')
  const lang = await getLang()
  const dict = getDict(lang)
  const { from, to } = await searchParams

  const payments = await allPayments(db, {
    from: parseFilterDate(from),
    to: parseFilterDate(to),
  })

  return (
    <div className="flex flex-col gap-4">
      <h1 className="font-heading text-xl font-semibold">{t(dict, 'payments.title')}</h1>

      <form className="flex flex-wrap items-end gap-4" method="get">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="from">{t(dict, 'payments.from')}</Label>
          <Input id="from" name="from" type="datetime-local" defaultValue={from ?? ''} />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="to">{t(dict, 'payments.to')}</Label>
          <Input id="to" name="to" type="datetime-local" defaultValue={to ?? ''} />
        </div>
        <Button type="submit">{t(dict, 'payments.filter')}</Button>
      </form>

      {payments.length === 0 ? (
        <p className="text-sm text-muted-foreground">{t(dict, 'payments.empty')}</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t(dict, 'payments.plate')}</TableHead>
              <TableHead>{t(dict, 'payments.zone')}</TableHead>
              <TableHead>{t(dict, 'payments.amount')}</TableHead>
              <TableHead>{t(dict, 'payments.paidAt')}</TableHead>
              <TableHead>{t(dict, 'payments.confirmedBy')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payments.map((payment) => (
              <TableRow key={payment.paymentId}>
                {/* Managers always see the full (or `[purged]`) plate; no masking applies here. */}
                <TableCell className="font-mono">{payment.plateSnapshot}</TableCell>
                <TableCell>{payment.zoneName}</TableCell>
                <TableCell>{`${new Intl.NumberFormat('vi-VN').format(payment.amount)} ₫`}</TableCell>
                <TableCell>{payment.paidAt.toLocaleString()}</TableCell>
                <TableCell>{payment.confirmedByName}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  )
}
