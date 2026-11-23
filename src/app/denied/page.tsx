import Link from 'next/link'
import { redirect } from 'next/navigation'
import { db } from '@/server/db'
import { getDict, getLang, t } from '@/i18n'
import { getCurrentUser } from '@/server/auth/session'
import { logPageDenied } from '@/server/services/accessLog'
import type { Role } from '@/lib/types'

const ROLE_HOME: Record<Role, string> = {
  CUSTOMER: '/customer',
  STAFF: '/staff',
  MANAGER: '/manager',
}

/**
 * Landing page for a page the middleware refused for the user's role
 * (G-06, FR-43, NFR-09). It runs on Node, so it can write the ACCESS_DENIED
 * row the Edge middleware cannot.
 */
export default async function DeniedPage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string }>
}) {
  const user = await getCurrentUser()
  if (!user) redirect('/login')

  const { from } = await searchParams
  await logPageDenied(db, user.id, from)

  const dict = getDict(await getLang())

  return (
    <div className="flex flex-col gap-4">
      <h1 className="font-heading text-xl font-semibold">{t(dict, 'denied.title')}</h1>
      <p className="text-sm">{t(dict, 'denied.body')}</p>
      <Link href={ROLE_HOME[user.role]} className="text-sm hover:underline">
        {t(dict, 'denied.back')}
      </Link>
    </div>
  )
}
