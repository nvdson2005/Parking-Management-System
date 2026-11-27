/**
 * Spec 008 FR-006 (review of 12dae51): a preview response for an outdated
 * request must not be shown. The exit form takes a token per preview request
 * and invalidates it on every input change; only the latest valid token may
 * set the preview.
 */
import { describe, it, expect } from 'vitest'
import { createRequestGuard } from '@/lib/requestGuard'

describe('createRequestGuard (spec 008, FR-006)', () => {
  it('a token is current until something newer happens', () => {
    const guard = createRequestGuard()
    const token = guard.begin()
    expect(guard.isCurrent(token)).toBe(true)
  })

  it('an input change after the request invalidates its token (late response is discarded)', () => {
    const guard = createRequestGuard()
    const token = guard.begin() // Staff press "Xem phí" with plate A
    guard.invalidate() // Staff edit the observed plate to B while A is in flight
    expect(guard.isCurrent(token)).toBe(false)
  })

  it('a second request makes the first one outdated', () => {
    const guard = createRequestGuard()
    const first = guard.begin()
    const second = guard.begin()
    expect(guard.isCurrent(first)).toBe(false)
    expect(guard.isCurrent(second)).toBe(true)
  })
})
