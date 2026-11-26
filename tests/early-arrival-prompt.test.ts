/**
 * Spec 006 US4 (FR-51): the early-arrival prompt on the Staff entry form shows
 * the booked arrival time and zone, not only a generic warning.
 */
import { describe, it, expect, vi } from 'vitest'

vi.mock('next/navigation', () => ({ useRouter: () => ({ refresh: () => {} }) }))

import { createElement } from 'react'
import type { ComponentType, ReactElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { getDict } from '@/i18n'
import type { Dict } from '@/i18n'
import { I18nProvider } from '@/components/I18nProvider'
import { EarlyArrivalPrompt } from '@/app/staff/entry/EntryForm'

// vitest compiles JSX with the classic runtime, which needs React in scope.
vi.stubGlobal('React', await import('react'))

function render(lang: 'vi' | 'en', child: ReactElement): string {
  return renderToStaticMarkup(
    createElement(
      I18nProvider as ComponentType<{ lang: 'vi' | 'en'; dict: Dict }>,
      { lang, dict: getDict(lang) },
      child,
    ),
  )
}

// Local 09:30 today, so the expected text does not depend on the time zone.
const ARRIVAL = new Date(2026, 10, 24, 9, 30, 0, 0)
const noop = () => {}

describe('EarlyArrivalPrompt (spec 006, US4)', () => {
  it('vi: shows the booked time (local HH:mm) and the zone', () => {
    const html = render(
      'vi',
      createElement(EarlyArrivalPrompt, {
        details: { arrivalTime: ARRIVAL.toISOString(), zoneName: 'A' },
        submitting: false,
        onConfirm: noop,
        onCancel: noop,
      }),
    )
    expect(html).toContain('Xe đến sớm')
    expect(html).toContain('Giờ hẹn: 09:30 · Khu: A')
  })

  it('en: the booking line follows the language', () => {
    const html = render(
      'en',
      createElement(EarlyArrivalPrompt, {
        details: { arrivalTime: ARRIVAL.toISOString(), zoneName: 'A' },
        submitting: false,
        onConfirm: noop,
        onCancel: noop,
      }),
    )
    expect(html).toContain('Booked: 09:30 · Zone: A')
  })

  it('without details (older server): keeps the generic warning and no booking line', () => {
    const html = render(
      'vi',
      createElement(EarlyArrivalPrompt, { details: null, submitting: false, onConfirm: noop, onCancel: noop }),
    )
    expect(html).toContain('Xe này có đặt chỗ vào giờ muộn hơn')
    expect(html).not.toContain('Giờ hẹn:')
  })
})
