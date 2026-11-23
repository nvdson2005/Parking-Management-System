import { getDict, t } from '@/i18n'
import type { Lang } from '@/i18n'
import type { LotInfo } from '@/server/services/lots'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

/**
 * Lot information for customers (FR-26): address, status and opening hours
 * (G-01, Q37; shown for information only).
 */
export function LotInfoCard({ lot, lang }: { lot: LotInfo; lang: Lang }) {
  const dict = getDict(lang)
  const hours = lot.openTime && lot.closeTime ? `${lot.openTime}–${lot.closeTime}` : t(dict, 'lotInfo.hoursUnset')
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {t(dict, 'lotInfo.title')}: {lot.name}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-sm">
          <dt className="text-muted-foreground">{t(dict, 'lotInfo.address')}</dt>
          <dd>{lot.address}</dd>
          <dt className="text-muted-foreground">{t(dict, 'lotInfo.status')}</dt>
          <dd>{t(dict, lot.status === 'ACTIVE' ? 'lots.active' : 'lots.suspended')}</dd>
          <dt className="text-muted-foreground">{t(dict, 'lotInfo.hours')}</dt>
          <dd>{hours}</dd>
        </dl>
      </CardContent>
    </Card>
  )
}
