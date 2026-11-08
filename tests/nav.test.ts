import { describe, it, expect } from 'vitest'
import { existsSync } from 'fs'
import { ROLE_LINKS } from '@/lib/nav'
import { getDict, t } from '@/i18n'

const ROLES = ['CUSTOMER', 'STAFF', 'MANAGER'] as const

describe('role navigation links', () => {
  it('every role reaches all of its pages', () => {
    expect(ROLE_LINKS.CUSTOMER.map((l) => l.href)).toEqual([
      '/customer/vehicles',
      '/customer/reservations',
      '/customer/history',
    ])
    expect(ROLE_LINKS.STAFF.map((l) => l.href)).toEqual(['/staff/entry', '/staff/exit', '/staff/sessions'])
    expect(ROLE_LINKS.MANAGER.map((l) => l.href)).toEqual([
      '/staff',
      '/manager/lots',
      '/manager/tariffs',
      '/manager/accounts',
      '/manager/payments',
      '/manager/reports',
      '/manager/simulator',
      '/manager/access-log',
    ])
  })

  it('every link points at an existing page and has a label in both languages', () => {
    for (const role of ROLES) {
      for (const link of ROLE_LINKS[role]) {
        expect(existsSync(`src/app${link.href}/page.tsx`), link.href).toBe(true)
        for (const lang of ['vi', 'en'] as const) {
          expect(t(getDict(lang), link.labelKey), `${lang}:${link.labelKey}`).not.toBe(link.labelKey)
        }
      }
    }
  })
})
