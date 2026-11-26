/**
 * CR-03 group A, A-49 gaps G1-G3: the availability screen shows the last
 * update time (FR-19), used spots for Staff and Manager (FR-20) and a "full"
 * mark when free is 0 (FR-21). Rendered to static HTML.
 */
import { describe, it, expect, vi } from 'vitest'
import { createElement } from 'react'
import type { ComponentType } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { getDict } from '@/i18n'
import type { Dict } from '@/i18n'
import { I18nProvider } from '@/components/I18nProvider'
import { LiveAvailability } from '@/components/LiveAvailability'
import type { LotAvailability } from '@/server/services/availability'

// vitest compiles JSX with the classic runtime, which needs React in scope.
vi.stubGlobal('React', await import('react'))

const lots: LotAvailability[] = [
  {
    lotId: 'lot-1',
    lotName: 'Bãi thí điểm',
    status: 'ACTIVE',
    zones: [
      {
        zoneId: 'z-a',
        zoneName: 'A',
        byType: [{ vehicleType: 'MOTORBIKE', capacity: 10, open: 3, reserved: 1, free: 6 }],
      },
      {
        zoneId: 'z-c',
        zoneName: 'C',
        byType: [{ vehicleType: 'CAR', capacity: 2, open: 2, reserved: 0, free: 0 }],
      },
    ],
  },
] as LotAvailability[]

// A local time, so the expected clock text does not depend on the machine's time zone.
const RENDERED_AT = new Date(2026, 10, 24, 9, 5, 7).toISOString()

function render(role: 'CUSTOMER' | 'STAFF' | 'MANAGER', lang: 'vi' | 'en' = 'vi'): string {
  return renderToStaticMarkup(
    createElement(
      I18nProvider as ComponentType<{ lang: 'vi' | 'en'; dict: Dict }>,
      { lang, dict: getDict(lang) },
      createElement(LiveAvailability, { initial: lots, role, renderedAt: RENDERED_AT }),
    ),
  )
}

// Cell texts of each body row, e.g. ['A', 'Xe máy', '6', '4', '10'].
function rows(html: string): string[][] {
  const body = html.slice(html.indexOf('<tbody'))
  return [...body.matchAll(/<tr[^>]*>(.*?)<\/tr>/g)].map((row) =>
    [...row[1].matchAll(/<td[^>]*>(.*?)<\/td>/g)].map((cell) =>
      cell[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim(),
    ),
  )
}

describe('LiveAvailability (spec 006, US1)', () => {
  it('Customer: free and capacity, no used column (FR-19, FR-20 Staff/Manager only)', () => {
    const html = render('CUSTOMER')
    expect(html).not.toContain('Đã dùng')
    expect(rows(html)).toEqual([
      ['A', 'Xe máy', '6', '10'],
      ['C', 'Ô tô', '0 Hết chỗ', '2'],
    ])
  })

  it.each(['STAFF', 'MANAGER'] as const)('%s: used = open + reserved, free + used = capacity (FR-20)', (role) => {
    const html = render(role)
    expect(html).toContain('Đã dùng')
    expect(rows(html)).toEqual([
      ['A', 'Xe máy', '6', '4', '10'],
      ['C', 'Ô tô', '0 Hết chỗ', '2', '2'],
    ])
  })

  it('marks only the full row (FR-21), in both languages', () => {
    const vi = render('STAFF', 'vi')
    expect(vi.match(/Hết chỗ/g)).toHaveLength(1)
    const en = render('STAFF', 'en')
    expect(en.match(/>Full</g)).toHaveLength(1)
    expect(rows(en)[1][2]).toBe('0 Full')
  })

  it('shows the time of the data it holds (FR-19)', () => {
    expect(render('CUSTOMER', 'vi')).toContain('Cập nhật lúc 09:05:07')
    expect(render('MANAGER', 'en')).toContain('Updated at 09:05:07')
  })
})
