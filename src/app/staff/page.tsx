import Link from 'next/link'
import { db } from '@/server/db'
import { getDict, getLang, t } from '@/i18n'
import { getAvailability } from '@/server/services/availability'
import { LiveAvailability } from '@/components/LiveAvailability'
import { ROLE_LINKS } from '@/lib/nav'

export default async function StaffPage() {
  const lang = await getLang()
  const dict = getDict(lang)
  const initial = await getAvailability(db)

  return (
    <div className="flex flex-col gap-4">
      <h1 className="font-heading text-xl font-semibold">{t(dict, 'home.staffTitle')}</h1>
      <nav className="flex flex-wrap gap-4 text-sm">
        {ROLE_LINKS.STAFF.map((link) => (
          <Link key={link.href} href={link.href} className="hover:underline">
            {t(dict, link.labelKey)}
          </Link>
        ))}
      </nav>
      <LiveAvailability initial={initial} />
    </div>
  )
}
