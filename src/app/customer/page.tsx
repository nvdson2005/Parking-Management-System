import Link from 'next/link'
import { db } from '@/server/db'
import { getDict, getLang, t } from '@/i18n'
import { getAvailability } from '@/server/services/availability'
import { LiveAvailability } from '@/components/LiveAvailability'
import { LotInfoCard } from '@/components/LotInfoCard'
import { listLotInfo } from '@/server/services/lots'
import { MyTariffCard } from '@/components/MyTariffCard'
import { tariffsForGroup } from '@/server/services/tariffs'
import { getCurrentUser } from '@/server/auth/session'
import { GroupRequestForm } from '@/components/GroupRequestForm'
import { getGroupRequest } from '@/server/services/accounts'
import { ROLE_LINKS } from '@/lib/nav'

export default async function CustomerPage() {
  const lang = await getLang()
  const dict = getDict(lang)
  const initial = await getAvailability(db)
  const lots = await listLotInfo(db)
  // Fees for the customer's own group (Q45); the section layout guarantees a customer.
  const user = await getCurrentUser()
  const group = user?.userGroup ?? null
  const tariffs = group ? await tariffsForGroup(db, group) : []
  const requested = user ? await getGroupRequest(db, user.id) : null

  return (
    <div className="flex flex-col gap-4">
      <h1 className="font-heading text-xl font-semibold">{t(dict, 'home.customerTitle')}</h1>
      <nav className="flex flex-wrap gap-4 text-sm">
        {ROLE_LINKS.CUSTOMER.map((link) => (
          <Link key={link.href} href={link.href} className="hover:underline">
            {t(dict, link.labelKey)}
          </Link>
        ))}
      </nav>
      {lots.map((lot) => (
        <LotInfoCard key={lot.id} lot={lot} lang={lang} />
      ))}
      {group ? <MyTariffCard group={group} tariffs={tariffs} lang={lang} /> : null}
      {group ? <GroupRequestForm current={group} requested={requested} /> : null}
      <LiveAvailability initial={initial} role="CUSTOMER" renderedAt={new Date().toISOString()} />
    </div>
  )
}
