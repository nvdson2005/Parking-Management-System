import Link from 'next/link'
import { db } from '@/server/db'
import { getDict, getLang, t } from '@/i18n'
import { requireRole } from '@/server/auth/rbac'
import { logAccess } from '@/server/services/accessLog'
import { presentPlate } from '@/lib/plate'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default async function StaffSessionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const user = await requireRole('STAFF', 'MANAGER')
  const { id } = await params
  const lang = await getLang()
  const dict = getDict(lang)

  const session = await db.parkingSession.findUnique({
    where: { id },
    include: {
      zone: true,
      vehicle: true,
      events: { orderBy: { createdAt: 'asc' } },
      payment: true,
    },
  })

  if (!session) {
    return (
      <div className="flex flex-col gap-4">
        <Link href="/staff/sessions" className="text-sm hover:underline">
          ← {t(dict, 'sessions.back')}
        </Link>
        <p className="text-sm text-muted-foreground">{t(dict, 'sessions.notFound')}</p>
      </div>
    )
  }

  // Viewing a session's detail reveals the full plate (D-31).
  await logAccess(db, { userId: user.id, action: 'VIEW_FULL_PLATE', target: session.id })

  const fee = session.payment ? new Intl.NumberFormat('vi-VN').format(session.payment.amount) : null

  return (
    <div className="flex flex-col gap-4">
      <Link href="/staff/sessions" className="text-sm hover:underline">
        ← {t(dict, 'sessions.back')}
      </Link>
      <h1 className="font-heading text-xl font-semibold">{t(dict, 'sessions.detailTitle')}</h1>

      <Card>
        <CardHeader>
          <CardTitle>{t(dict, 'sessions.vehicleInfo')}</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-2 gap-2 text-sm">
            <dt className="text-muted-foreground">{t(dict, 'sessions.plate')}</dt>
            <dd className="font-mono">
              {presentPlate(session.plateSnapshot, user, session.ownerId)}
            </dd>
            <dt className="text-muted-foreground">{t(dict, 'sessions.zone')}</dt>
            <dd>{session.zone.name}</dd>
            <dt className="text-muted-foreground">{t(dict, 'sessions.vehicleType')}</dt>
            <dd>{t(dict, `availability.vehicleTypes.${session.vehicleTypeCode}`)}</dd>
            <dt className="text-muted-foreground">{t(dict, 'sessions.feeGroup')}</dt>
            <dd>{t(dict, `exit.feeGroups.${session.feeGroup}`)}</dd>
            <dt className="text-muted-foreground">{t(dict, 'sessions.entryTime')}</dt>
            <dd>{session.entryTime.toLocaleString()}</dd>
            <dt className="text-muted-foreground">{t(dict, 'sessions.status')}</dt>
            <dd>{session.status}</dd>
          </dl>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t(dict, 'sessions.events')}</CardTitle>
        </CardHeader>
        <CardContent>
          {session.events.length === 0 ? (
            <p className="text-sm text-muted-foreground">{t(dict, 'sessions.noEvents')}</p>
          ) : (
            <ul className="flex flex-col gap-2 text-sm">
              {session.events.map((event) => (
                <li key={event.id} className="flex flex-col gap-0.5">
                  <span className="font-medium">{t(dict, `sessions.eventTypes.${event.type}`)}</span>
                  <span className="text-xs text-muted-foreground">{event.createdAt.toLocaleString()}</span>
                  {event.note ? <span className="text-muted-foreground">{event.note}</span> : null}
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t(dict, 'sessions.payment')}</CardTitle>
        </CardHeader>
        <CardContent>
          {session.payment ? (
            <dl className="grid grid-cols-2 gap-2 text-sm">
              <dt className="text-muted-foreground">{t(dict, 'sessions.amount')}</dt>
              <dd className="font-semibold">{fee} ₫</dd>
              <dt className="text-muted-foreground">{t(dict, 'sessions.status')}</dt>
              <dd>{session.payment.status}</dd>
              <dt className="text-muted-foreground">{t(dict, 'sessions.paidAt')}</dt>
              <dd>{session.payment.paidAt.toLocaleString()}</dd>
            </dl>
          ) : (
            <p className="text-sm text-muted-foreground">{t(dict, 'sessions.noPayment')}</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
