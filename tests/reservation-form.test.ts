/**
 * Spec 006 review findings C1 and I1. The reservation form's vehicle and zone
 * selects showed raw ids after a choice (FR-009), and the "closed for today"
 * state (FR-008) had no test. Rendered to static HTML, like entry-form.test.ts.
 */
import { describe, it, expect, vi } from 'vitest'

vi.mock('next/navigation', () => ({ useRouter: () => ({ refresh: () => {} }) }))

import { createElement } from 'react'
import type { ComponentProps, ComponentType } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { getDict } from '@/i18n'
import type { Dict } from '@/i18n'
import { I18nProvider } from '@/components/I18nProvider'
import { ReservationForm } from '@/app/customer/reservations/ReservationForm'

// vitest compiles JSX with the classic runtime, which needs React in scope.
vi.stubGlobal('React', await import('react'))

const noop = () => {}

type Props = ComponentProps<typeof ReservationForm>

const base: Props = {
  vehicles: [{ id: 'veh-id-1', plate: '29A-01001', vehicleTypeCode: 'MOTORBIKE' }],
  vehicleId: 'veh-id-1',
  onVehicleChange: noop,
  zones: [{ zoneId: 'zone-id-9', label: 'Bãi xe thí điểm · A' }],
  zoneId: 'zone-id-9',
  onZoneChange: noop,
  arrivalTime: '2026-11-24T10:05',
  minArrival: '2026-11-24T10:04',
  maxArrival: '2026-11-24T23:59',
  onArrivalChange: noop,
  closedToday: false,
  submitting: false,
  onSubmit: noop,
}

function render(lang: 'vi' | 'en', props: Partial<Props> = {}): string {
  return renderToStaticMarkup(
    createElement(
      I18nProvider as ComponentType<{ lang: 'vi' | 'en'; dict: Dict }>,
      { lang, dict: getDict(lang) },
      createElement(ReservationForm, { ...base, ...props }),
    ),
  )
}

// Text of the select triggers (the `data-slot="select-value"` spans).
function selectValues(html: string): string[] {
  return [...html.matchAll(/data-slot="select-value"[^>]*>(.*?)<\/span>/g)].map((m) =>
    m[1].replace(/<[^>]+>/g, ''),
  )
}

// The `disabled` attribute, not the `disabled:` Tailwind variants in the class.
const DISABLED_ATTR = /\sdisabled(?=[\s=/>])/

function submitButton(html: string): string {
  return html.match(/<button[^>]*type="submit"[^>]*>/)?.[0] ?? ''
}

function arrivalInput(html: string): string {
  return html.match(/<input[^>]*id="arrivalTime"[^>]*>/)?.[0] ?? ''
}

describe('ReservationForm selects show labels (FR-009, review C1)', () => {
  it('vi: vehicle plate and type, zone label, not the raw ids', () => {
    expect(selectValues(render('vi'))).toEqual(['29A-01001 · Xe máy', 'Bãi xe thí điểm · A'])
  })

  it('en: the vehicle type follows the language', () => {
    expect(selectValues(render('en'))).toEqual(['29A-01001 · Motorbike', 'Bãi xe thí điểm · A'])
  })

  it('nothing chosen: shows the placeholders', () => {
    expect(selectValues(render('vi', { vehicleId: '', zoneId: '' }))).toEqual(['Chọn xe', 'Chọn khu vực'])
  })
})

describe('ReservationForm closed for today (FR-008, review I1)', () => {
  it('open: no closed message, arrival input enabled, submit enabled when complete', () => {
    const html = render('vi')
    expect(html).not.toContain('Đã hết giờ đặt chỗ cho hôm nay')
    expect(arrivalInput(html)).not.toMatch(DISABLED_ATTR)
    expect(arrivalInput(html)).toContain('min="2026-11-24T10:04"')
    expect(submitButton(html)).not.toMatch(DISABLED_ATTR)
  })

  it('closed: shows the message, disables the arrival input and blocks submit', () => {
    const html = render('vi', { closedToday: true })
    expect(html).toContain('Đã hết giờ đặt chỗ cho hôm nay')
    expect(arrivalInput(html)).toMatch(DISABLED_ATTR)
    expect(submitButton(html)).toMatch(DISABLED_ATTR)
  })

  it('incomplete form: submit stays blocked', () => {
    expect(submitButton(render('vi', { zoneId: '' }))).toMatch(DISABLED_ATTR)
  })
})
