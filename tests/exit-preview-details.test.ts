/**
 * Spec 008 (A-68 D-04): the Staff exit preview labels the plate recorded at
 * entry as the entry plate, shows the plate Staff typed as the observed plate,
 * and marks the observed plate when the two do not match (EX-02, AT-EX02).
 */
import { describe, it, expect, vi } from 'vitest'

vi.mock('next/navigation', () => ({ useRouter: () => ({ refresh: () => {} }) }))

import { createElement } from 'react'
import type { ComponentType, ReactElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { getDict } from '@/i18n'
import type { Dict } from '@/i18n'
import { I18nProvider } from '@/components/I18nProvider'
import { ExitPreviewDetails } from '@/app/staff/exit/ExitForm'
import type { ExitPreview } from '@/app/staff/exit/ExitForm'

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

function preview(plateMismatch: boolean): ExitPreview {
  return {
    sessionId: 's1',
    plateSnapshot: '66F-403.45',
    zoneName: 'A',
    vehicleType: 'MOTORBIKE',
    feeGroup: 'GUEST',
    entryTime: new Date(2026, 10, 24, 9, 30).toISOString(),
    fee: 2000,
    plateMismatch,
  }
}

/** The text of the <dd> that follows the <dt> with this label. */
function valueAfter(html: string, label: string): { attrs: string; text: string } | null {
  const m = html.match(new RegExp(`<dt[^>]*>${label}</dt><dd([^>]*)>([^<]*)</dd>`))
  return m ? { attrs: m[1], text: m[2] } : null
}

describe('ExitPreviewDetails (spec 008, A-68 D-04)', () => {
  it('vi, plates differ: entry plate and observed plate under their own labels, observed plate marked', () => {
    const html = render('vi', createElement(ExitPreviewDetails, { preview: preview(true), observedPlate: '66F-403.46' }))
    expect(valueAfter(html, 'Biển số lúc vào')?.text).toBe('66F-403.45')
    const observed = valueAfter(html, 'Biển số quan sát')
    expect(observed?.text).toBe('66F-403.46')
    expect(observed?.attrs).toContain('data-mismatch="true"')
  })

  it('vi, plates match: both plates shown, the typed plate trimmed, no mismatch mark', () => {
    const html = render('vi', createElement(ExitPreviewDetails, { preview: preview(false), observedPlate: ' 66F 403 45 ' }))
    expect(valueAfter(html, 'Biển số lúc vào')?.text).toBe('66F-403.45')
    expect(valueAfter(html, 'Biển số quan sát')?.text).toBe('66F 403 45')
    expect(html).not.toContain('data-mismatch')
  })

  it('en: labels are "Plate at entry" and "Observed plate"', () => {
    const html = render('en', createElement(ExitPreviewDetails, { preview: preview(true), observedPlate: '66F-403.46' }))
    expect(valueAfter(html, 'Plate at entry')?.text).toBe('66F-403.45')
    expect(valueAfter(html, 'Observed plate')?.text).toBe('66F-403.46')
  })
})
