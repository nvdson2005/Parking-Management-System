/**
 * CR-03 group B (P05): after a choice the Staff entry selects showed the raw
 * value (zone id, `CAR`, gate code) instead of its label. Rendered to static HTML.
 */
import { describe, it, expect, vi } from 'vitest'

vi.mock('next/navigation', () => ({ useRouter: () => ({ refresh: () => {} }) }))

import { createElement } from 'react'
import type { ComponentType } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { getDict } from '@/i18n'
import type { Dict } from '@/i18n'
import { I18nProvider } from '@/components/I18nProvider'
import { EntryForm } from '@/app/staff/entry/EntryForm'

// vitest compiles JSX with the classic runtime, which needs React in scope.
vi.stubGlobal('React', await import('react'))

function render(lang: 'vi' | 'en'): string {
  return renderToStaticMarkup(
    createElement(
      I18nProvider as ComponentType<{ lang: 'vi' | 'en'; dict: Dict }>,
      { lang, dict: getDict(lang) },
      createElement(EntryForm, { zones: [{ id: 'zone-id-123', label: 'Khu A' }] }),
    ),
  )
}

// Text of the three select triggers (the `data-slot="select-value"` spans).
function selectValues(html: string): string[] {
  return [...html.matchAll(/data-slot="select-value"[^>]*>(.*?)<\/span>/g)].map((m) =>
    m[1].replace(/<[^>]+>/g, ''),
  )
}

describe('EntryForm selects show labels (spec 006, US3)', () => {
  it('vi: zone name, gate name and "Xe máy", not the raw values', () => {
    const values = selectValues(render('vi'))
    expect(values).toEqual(['Khu A', 'Cổng 1', 'Xe máy'])
  })

  it('en: labels follow the language', () => {
    const values = selectValues(render('en'))
    expect(values).toEqual(['Khu A', 'Gate 1', 'Motorbike'])
  })
})
