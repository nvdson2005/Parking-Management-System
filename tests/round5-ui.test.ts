/**
 * UI of client round 5: the customer's fee-group card (Q38, FR-08) and the
 * lot information card (Q37, FR-26). Rendered to static HTML.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('next/navigation', () => ({ useRouter: () => ({ refresh: () => {} }) }))

import { createElement } from 'react'
import type { ComponentType } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { getDict } from '@/i18n'
import type { Dict } from '@/i18n'
import { I18nProvider } from '@/components/I18nProvider'
import { GroupRequestForm } from '@/components/GroupRequestForm'
import { LotInfoCard } from '@/components/LotInfoCard'
import { db } from '@/server/db'
import { resetDb, makeFixture, type Fixture } from './helpers/db'
import { getGroupRequest, requestGroupChange } from '@/server/services/accounts'
import type { UserGroup } from '@/lib/types'

// vitest compiles JSX with the classic runtime, which needs React in scope.
vi.stubGlobal('React', await import('react'))

function groupCard(current: UserGroup, requested: UserGroup | null): string {
  return renderToStaticMarkup(
    createElement(
      I18nProvider as ComponentType<{ lang: 'vi'; dict: Dict }>,
      { lang: 'vi', dict: getDict('vi') },
      createElement(GroupRequestForm, { current, requested }),
    ),
  )
}

describe('GroupRequestForm (Q38)', () => {
  it('without a request: shows the group and a button to ask for the other group', () => {
    const html = groupCard('STUDENT', null)
    expect(html).toContain('Nhóm của bạn')
    expect(html).toContain('Sinh viên')
    expect(html).toContain('Yêu cầu đổi sang Giảng viên / Nhân viên')
    expect(html).not.toContain('Đang chờ quản lý')
  })

  it('with a pending request: shows it and hides the button', () => {
    const html = groupCard('STUDENT', 'LECTURER_STAFF')
    expect(html).toContain('Đang chờ quản lý chuyển bạn sang: Giảng viên / Nhân viên')
    expect(html).not.toContain('<button')
  })
})

describe('getGroupRequest (what the customer home reads)', () => {
  let f: Fixture
  beforeEach(async () => {
    await resetDb()
    f = await makeFixture()
  })

  it('is null until the customer asks, then the requested group; the request and its log row are written together', async () => {
    expect(await getGroupRequest(db, f.student.id)).toBeNull()
    await requestGroupChange(db, f.student.id, 'LECTURER_STAFF')
    expect(await getGroupRequest(db, f.student.id)).toBe('LECTURER_STAFF')
    expect(await db.accessLog.count({ where: { userId: f.student.id, action: 'ACCOUNT_CHANGE' } })).toBe(1)
  })
})

describe('LotInfoCard (Q37)', () => {
  const lot = { id: 'l', name: 'Bãi A', address: '268 Lý Thường Kiệt', status: 'ACTIVE' as const }

  it('shows the hours when both are set', () => {
    const html = renderToStaticMarkup(LotInfoCard({ lot: { ...lot, openTime: '06:00', closeTime: '22:00' }, lang: 'vi' }))
    expect(html).toContain('06:00–22:00')
    expect(html).toContain('268 Lý Thường Kiệt')
  })

  it('says the hours are not set when they are empty', () => {
    const html = renderToStaticMarkup(LotInfoCard({ lot: { ...lot, openTime: null, closeTime: null }, lang: 'en' }))
    expect(html).toContain('Not set')
  })
})
