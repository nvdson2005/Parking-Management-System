import { getDict, t } from '@/i18n'
import type { Lang } from '@/i18n'
import type { GroupTariff } from '@/server/services/tariffs'
import type { FeeGroup } from '@/lib/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

/** The per-entry fees for the signed-in customer's group (FR-26, Q45). */
export function MyTariffCard({ group, tariffs, lang }: { group: FeeGroup; tariffs: GroupTariff[]; lang: Lang }) {
  const dict = getDict(lang)
  const money = new Intl.NumberFormat('vi-VN')
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {t(dict, 'lotInfo.myFees')} ({t(dict, `exit.feeGroups.${group}`)})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-sm">
          {tariffs.map((row) => (
            <div key={row.vehicleTypeCode} className="contents">
              <dt className="text-muted-foreground">{t(dict, `availability.vehicleTypes.${row.vehicleTypeCode}`)}</dt>
              <dd>
                {row.price === null
                  ? t(dict, 'lotInfo.feeUnset')
                  : `${money.format(row.price)} đ ${t(dict, 'lotInfo.perEntry')}`}
              </dd>
            </div>
          ))}
        </dl>
      </CardContent>
    </Card>
  )
}
