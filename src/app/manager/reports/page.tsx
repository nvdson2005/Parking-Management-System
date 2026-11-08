import { db } from '@/server/db'
import { getDict, getLang, t } from '@/i18n'
import { requireRole } from '@/server/auth/rbac'
import { buildReport } from '@/server/services/reports'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { UtilisationChart, RevenueChart } from '@/components/ReportsCharts'

function localDateKey(d: Date): string {
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

// `<input type="date">` posts `YYYY-MM-DD`; parse it as a local calendar
// date. Absent/malformed values fall back to today so the dashboard always
// renders a range.
function parseDate(value: string | undefined): Date {
  const match = value ? /^(\d{4})-(\d{2})-(\d{2})$/.exec(value) : null
  if (!match) return new Date()
  return new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]))
}

export default async function ManagerReportsPage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string; to?: string }>
}) {
  await requireRole('MANAGER')
  const lang = await getLang()
  const dict = getDict(lang)
  const { from, to } = await searchParams

  const fromDate = parseDate(from)
  const toDate = parseDate(to)
  const fromValue = localDateKey(fromDate)
  const toValue = localDateKey(toDate)

  const report =
    fromDate <= toDate ? await buildReport(db, { from: fromDate, to: toDate }) : null

  const currency = new Intl.NumberFormat('vi-VN')

  return (
    <div className="flex flex-col gap-4">
      <h1 className="font-heading text-xl font-semibold">{t(dict, 'reports.title')}</h1>

      <form className="flex flex-wrap items-end gap-4" method="get">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="from">{t(dict, 'reports.from')}</Label>
          <Input id="from" name="from" type="date" defaultValue={fromValue} />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="to">{t(dict, 'reports.to')}</Label>
          <Input id="to" name="to" type="date" defaultValue={toValue} />
        </div>
        <Button type="submit">{t(dict, 'reports.apply')}</Button>
      </form>

      {report && (
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>{t(dict, 'reports.utilisationTitle')}</CardTitle>
            </CardHeader>
            <CardContent>
              <UtilisationChart data={report.utilisationByHour} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t(dict, 'reports.peakTitle')}</CardTitle>
            </CardHeader>
            <CardContent>
              {report.peakHours.length === 0 ? (
                <p className="text-sm text-muted-foreground">{t(dict, 'reports.peakEmpty')}</p>
              ) : (
                <ol className="flex flex-col gap-2">
                  {report.peakHours.map((peak) => (
                    <li key={peak.hour} className="flex items-center justify-between text-sm">
                      <span className="font-mono">{`${String(peak.hour).padStart(2, '0')}:00`}</span>
                      <span className="text-muted-foreground">
                        {`${peak.entries} ${t(dict, 'reports.peakEntries')}`}
                      </span>
                    </li>
                  ))}
                </ol>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t(dict, 'reports.revenueTitle')}</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              <p className="text-sm">
                <span className="text-muted-foreground">{t(dict, 'reports.revenueTotal')}: </span>
                <span className="font-semibold">{`${currency.format(report.revenue.total)} ₫`}</span>
              </p>
              {report.revenue.byDate.length === 0 ? (
                <p className="text-sm text-muted-foreground">{t(dict, 'reports.revenueEmpty')}</p>
              ) : (
                <RevenueChart data={report.revenue.byDate} />
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t(dict, 'reports.noShowTitle')}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold">
                {report.noShowRate === null
                  ? '—'
                  : `${(Math.round(report.noShowRate * 1000) / 10).toLocaleString('vi-VN')}%`}
              </p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
