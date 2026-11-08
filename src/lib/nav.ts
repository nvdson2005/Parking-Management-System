import type { Role } from '@/lib/types'

export type RoleLink = { href: string; labelKey: string }

/**
 * Pages each role can open, beyond its home page. Shared by the header menu
 * (AppShell, every page) and the quick links on each role's home page, so
 * every screen is reachable without typing a URL. Managers also get the
 * Staff home, since they may run entry/exit (spec §4).
 */
export const ROLE_LINKS: Record<Role, RoleLink[]> = {
  CUSTOMER: [
    { href: '/customer/vehicles', labelKey: 'vehicles.title' },
    { href: '/customer/reservations', labelKey: 'reservations.title' },
    { href: '/customer/history', labelKey: 'history.title' },
  ],
  STAFF: [
    { href: '/staff/entry', labelKey: 'entry.title' },
    { href: '/staff/exit', labelKey: 'exit.title' },
    { href: '/staff/sessions', labelKey: 'sessions.title' },
  ],
  MANAGER: [
    { href: '/staff', labelKey: 'nav.staff' },
    { href: '/manager/lots', labelKey: 'lots.title' },
    { href: '/manager/tariffs', labelKey: 'tariffs.title' },
    { href: '/manager/accounts', labelKey: 'accounts.title' },
    { href: '/manager/payments', labelKey: 'payments.title' },
    { href: '/manager/reports', labelKey: 'reports.title' },
    { href: '/manager/simulator', labelKey: 'simulator.title' },
    { href: '/manager/access-log', labelKey: 'accessLog.title' },
  ],
}
