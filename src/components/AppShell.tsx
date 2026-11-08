'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import type { ReactNode } from 'react'
import { cn } from 'cn'
import { Button } from '@/components/ui/button'
import { useT } from '@/components/I18nProvider'
import { LangToggle } from '@/components/LangToggle'
import type { Role } from '@/lib/types'
import { ROLE_LINKS } from '@/lib/nav'
import type { CurrentUser } from '@/server/auth/session'

export type NavItem = {
  href: string
  label: string
}

const ROLE_HOME: Record<Role, string> = {
  CUSTOMER: '/customer',
  STAFF: '/staff',
  MANAGER: '/manager',
}

type AppShellUser = Pick<CurrentUser, 'name' | 'role'>

/**
 * Top bar shown on every page, including `/login` and `/register` (D-38):
 * app name, the signed-in user's role home link and every page of that role
 * (`ROLE_LINKS`), plus any page-specific
 * `nav` items, the language toggle, and logout (or login/register links
 * when signed out). Collapses to a menu below `md`.
 */
export function AppShell({
  user,
  nav = [],
  children,
}: {
  user: AppShellUser | null
  nav?: NavItem[]
  children: ReactNode
}) {
  const t = useT()
  const router = useRouter()
  const [menuOpen, setMenuOpen] = useState(false)
  const [loggingOut, setLoggingOut] = useState(false)
  const [logoutError, setLogoutError] = useState<string | null>(null)

  const roleNav: NavItem[] = user
    ? [
        { href: ROLE_HOME[user.role], label: t(`nav.${user.role.toLowerCase()}`) },
        ...ROLE_LINKS[user.role].map((link) => ({ href: link.href, label: t(link.labelKey) })),
      ]
    : []
  const navItems = [...roleNav, ...nav]

  async function handleLogout() {
    setLoggingOut(true)
    setLogoutError(null)
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      setMenuOpen(false)
      router.push('/login')
      router.refresh()
    } catch {
      // fetch rejected (offline, DNS failure, etc.) rather than resolving
      setLogoutError(t('common.networkError'))
    } finally {
      setLoggingOut(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b bg-background">
        <div className="mx-auto flex w-full max-w-5xl flex-wrap items-center justify-between gap-2 px-3 py-2 sm:px-4">
          <div className="flex min-w-0 items-center gap-3">
            <Link href="/" className="truncate font-heading text-base font-semibold">
              {t('app.name')}
            </Link>
          </div>

          <button
            type="button"
            className="rounded px-2 py-1 text-sm md:hidden"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-label={t('nav.menu')}
          >
            {t('nav.menu')}
          </button>

          <nav
            className={cn(
              'w-full flex-col gap-2 md:w-auto md:flex-row md:flex md:items-center md:gap-4',
              menuOpen ? 'flex' : 'hidden',
            )}
          >
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} className="text-sm hover:underline">
                {item.label}
              </Link>
            ))}

            <div className="flex items-center gap-3">
              <LangToggle />
              {user ? (
                <div className="flex flex-col items-end gap-1">
                  <Button size="sm" variant="outline" onClick={handleLogout} disabled={loggingOut}>
                    {t('nav.logout')}
                  </Button>
                  {logoutError ? (
                    <span role="alert" className="text-xs text-destructive">
                      {logoutError}
                    </span>
                  ) : null}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link href="/login" className="text-sm hover:underline">
                    {t('nav.login')}
                  </Link>
                  <Link href="/register" className="text-sm hover:underline">
                    {t('nav.register')}
                  </Link>
                </div>
              )}
            </div>
          </nav>
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl flex-1 px-3 py-4 sm:px-4">{children}</main>
    </div>
  )
}
