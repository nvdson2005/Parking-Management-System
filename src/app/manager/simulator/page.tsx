import { getDict, getLang, t } from '@/i18n'
import { requireRole } from '@/server/auth/rbac'
import { SimulatorPanels } from './SimulatorPanels'

// O2 demo needs enough live events to move availability perceptibly, so the
// live count defaults to 120 (≥ 100).
const DEFAULT_LIVE_COUNT = 120

export default async function ManagerSimulatorPage() {
  await requireRole('MANAGER')
  const lang = await getLang()
  const dict = getDict(lang)

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <h1 className="font-heading text-xl font-semibold">{t(dict, 'simulator.title')}</h1>
        <p className="text-sm text-muted-foreground">{t(dict, 'simulator.description')}</p>
      </div>
      <SimulatorPanels defaultCount={DEFAULT_LIVE_COUNT} />
    </div>
  )
}
