import { describe, it, expect, vi, beforeEach } from 'vitest'
import type { CurrentUser } from '@/server/auth/session'

// Review of PR #11 (G-06, FR-43): the ACCESS_DENIED row is written once, at
// the decision point, never by the /denied page.

let currentUser: CurrentUser | null = null
vi.mock('@/server/auth/session', async (orig) => ({
  ...(await orig<typeof import('@/server/auth/session')>()),
  getCurrentUser: async () => currentUser,
}))
vi.mock('@/i18n', async (orig) => ({
  ...(await orig<typeof import('@/i18n')>()),
  getLang: async () => 'en' as const,
}))
// Outside a server render React's cache does not memoize. Stand in for one
// render: every cached function returns the same value until `newRender()`.
let render = 0
vi.mock('react', async (orig) => {
  const react = await orig<typeof import('react')>()
  return {
    ...react,
    cache: <T,>(fn: () => T) => {
      let seen = -1
      let value: T
      return () => {
        if (seen !== render) {
          seen = render
          value = fn()
        }
        return value
      }
    },
  }
})
function newRender() {
  render++
}

import { NextRequest } from 'next/server'
import { SignJWT } from 'jose'
import { db } from '@/server/db'
import { resetDb, makeFixture, type Fixture } from './helpers/db'
import { requireRole, requireSection } from '@/server/auth/rbac'
import DeniedPage from '@/app/denied/page'
import { middleware } from '@/middleware'

// vitest compiles JSX with the classic runtime, which needs React in scope.
vi.stubGlobal('React', await import('react'))

let f: Fixture

beforeEach(async () => {
  await resetDb()
  f = await makeFixture()
  currentUser = null
  newRender()
})

const denied = () => db.accessLog.count({ where: { action: 'ACCESS_DENIED' } })

describe('one ACCESS_DENIED row per refused render', () => {
  it('a section layout and its page refusing the same request write one row', async () => {
    currentUser = { id: f.student.id, role: 'CUSTOMER', name: 'S', userGroup: 'STUDENT' }

    await expect(requireSection('/manager')).rejects.toThrow()
    await expect(requireRole('MANAGER')).rejects.toMatchObject({ code: 'FORBIDDEN' })

    expect(await denied()).toBe(1)
  })

  it('a second request (new render) is logged again', async () => {
    currentUser = { id: f.student.id, role: 'CUSTOMER', name: 'S', userGroup: 'STUDENT' }
    await expect(requireSection('/manager')).rejects.toThrow()
    newRender()
    await expect(requireSection('/manager')).rejects.toThrow()
    expect(await denied()).toBe(2)
  })
})

describe('/denied is read-only', () => {
  it('rendering it, refreshing it or opening it directly writes nothing', async () => {
    currentUser = { id: f.student.id, role: 'CUSTOMER', name: 'S', userGroup: 'STUDENT' }

    await DeniedPage()
    newRender()
    await DeniedPage()

    expect(await db.accessLog.count()).toBe(0)
  })
})

describe('middleware only checks the session', () => {
  async function token(role: string) {
    return new SignJWT({ role })
      .setProtectedHeader({ alg: 'HS256' })
      .setSubject(f.student.id)
      .setExpirationTime('1h')
      .sign(new TextEncoder().encode(process.env.AUTH_SECRET))
  }
  function request(path: string, session?: string) {
    const req = new NextRequest(new URL(path, 'http://localhost:3000'))
    if (session) req.cookies.set('session', session)
    return req
  }

  it('lets a signed-in user with the wrong role through, so the section layout decides and logs', async () => {
    const res = await middleware(request('/manager/accounts', await token('CUSTOMER')))
    expect(res.headers.get('location')).toBeNull()
    expect(res.headers.get('x-middleware-next')).toBe('1')
  })

  it('sends a request without a valid session to /login', async () => {
    for (const session of [undefined, 'not-a-jwt']) {
      const res = await middleware(request('/staff', session))
      expect(new URL(res.headers.get('location')!).pathname).toBe('/login')
    }
  })
})
