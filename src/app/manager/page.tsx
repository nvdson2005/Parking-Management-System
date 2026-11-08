import Link from 'next/link'
import { db } from '@/server/db'
import { getDict, getLang, t } from '@/i18n'
import { getAvailability } from '@/server/services/availability'
import { LiveAvailability } from '@/components/LiveAvailability'

export default async function ManagerPage() {
  const lang = await getLang()
  const dict = getDict(lang)
  const initial = await getAvailability(db)

  return (
    <div className="flex flex-col gap-4">
      <h1 className="font-heading text-xl font-semibold">{t(dict, 'home.managerTitle')}</h1>
      <nav className="flex flex-wrap gap-4 text-sm">
        <Link href="/manager/lots" className="hover:underline">
          {t(dict, 'lots.title')}
        </Link>
        <Link href="/manager/tariffs" className="hover:underline">
          {t(dict, 'tariffs.title')}
        </Link>
        <Link href="/manager/payments" className="hover:underline">
          {t(dict, 'payments.title')}
        </Link>
        <Link href="/manager/reports" className="hover:underline">
          {t(dict, 'reports.title')}
        </Link>
        <Link href="/manager/accounts" className="hover:underline">
          {t(dict, 'accounts.title')}
        </Link>
        <Link href="/manager/access-log" className="hover:underline">
          {t(dict, 'accessLog.title')}
        </Link>
      </nav>
      <LiveAvailability initial={initial} />
    </div>
  )
}
