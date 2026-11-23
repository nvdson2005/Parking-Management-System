import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getDict, getLang, t } from '@/i18n'
import { getCurrentUser } from '@/server/auth/session'
import type { Role } from '@/lib/types'

const ROLE_HOME: Record<Role, string> = {
  CUSTOMER: '/customer',
  STAFF: '/staff',
  MANAGER: '/manager',
}

/**
 * Shown after a section layout refused the user's role. Read-only: the
 * ACCESS_DENIED row was written by requireSection at the decision point
 * (G-06, FR-43), so refreshing or opening this page directly logs nothing.
 */
export default async function DeniedPage() {
  const user = await getCurrentUser()
  if (!user) redirect('/login')

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
