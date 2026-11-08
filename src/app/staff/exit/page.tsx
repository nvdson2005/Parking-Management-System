import { getDict, getLang, t } from '@/i18n'
import { requireRole } from '@/server/auth/rbac'
import { ExitForm } from './ExitForm'

export default async function StaffExitPage() {
  await requireRole('STAFF', 'MANAGER')
  const lang = await getLang()
  const dict = getDict(lang)

  return (
    <div className="flex flex-col gap-4">
      <h1 className="font-heading text-xl font-semibold">{t(dict, 'exit.title')}</h1>
      <ExitForm />
    </div>
  )
}
