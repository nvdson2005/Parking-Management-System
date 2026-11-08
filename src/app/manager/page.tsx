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
      <LiveAvailability initial={initial} />
    </div>
  )
}
