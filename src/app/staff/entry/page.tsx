import { db } from '@/server/db'
import { getDict, getLang, t } from '@/i18n'
import { requireRole } from '@/server/auth/rbac'
import { getAvailability } from '@/server/services/availability'
import { EntryForm, type ZoneOption } from './EntryForm'

export default async function StaffEntryPage() {
  await requireRole('STAFF', 'MANAGER')
  const lang = await getLang()
  const dict = getDict(lang)
  const availability = await getAvailability(db)

  const zones: ZoneOption[] = availability.flatMap((lot) =>
    lot.zones.map((zone) => ({ id: zone.zoneId, label: `${lot.lotName} - ${zone.zoneName}` })),
  )

  return (
    <div className="flex flex-col gap-4">
      <h1 className="font-heading text-xl font-semibold">{t(dict, 'entry.title')}</h1>
      <EntryForm zones={zones} />
    </div>
  )
}
