/**
 * Spec 008 FR-006 (reviews of 12dae51 and ca6867b): the exit form's preview
 * requests go through one controller. A response (success, error or network
 * failure) that arrives after an input changed, or after a newer request, is
 * dropped; a current success carries the plate that was sent, which the form
 * shows and confirms.
 */
import { describe, it, expect } from 'vitest'
import { createExitPreviewController } from '@/lib/exitPreviewController'
import type { PreviewResponse } from '@/lib/exitPreviewController'

type Input = { method: 'PLATE'; identifier: string; observedPlate: string }
const input = (observedPlate: string): Input => ({ method: 'PLATE', identifier: '66F-403.45', observedPlate })

/** A fetch whose answer the test releases by hand, to stage a late response. */
function deferredFetch() {
  const calls: { input: Input; resolve: (r: PreviewResponse) => void; reject: (e: unknown) => void }[] = []
  const fetchPreview = (i: Input) =>
    new Promise<PreviewResponse>((resolve, reject) => {
      calls.push({ input: i, resolve, reject })
    })
  return { fetchPreview, calls }
}

const OK = { ok: true, body: { sessionId: 's1', plateMismatch: true } }
const ERR = { ok: false, body: { error: 'NO_OPEN_SESSION' } }

describe('createExitPreviewController (spec 008, FR-006)', () => {
  it('a current success returns the preview with the plate that was sent', async () => {
    const f = deferredFetch()
    const c = createExitPreviewController(f.fetchPreview)
    const pending = c.request(input('66F-403.46'))
    f.calls[0].resolve(OK)
    expect(await pending).toEqual({ kind: 'ok', preview: OK.body, comparedPlate: '66F-403.46' })
  })

  it('a current error returns its code', async () => {
    const f = deferredFetch()
    const c = createExitPreviewController(f.fetchPreview)
    const pending = c.request(input('66F-403.46'))
    f.calls[0].resolve(ERR)
    expect(await pending).toEqual({ kind: 'error', code: 'NO_OPEN_SESSION' })
  })

  it('review scenario: the plate changes while the request is pending, the late success is dropped', async () => {
    const f = deferredFetch()
    const c = createExitPreviewController(f.fetchPreview)
    const pending = c.request(input('66F-403.46')) // plate A sent
    c.inputChanged() // Staff edit the observed plate to B
    f.calls[0].resolve(OK) // A's answer arrives late
    expect(await pending).toBeNull()
  })

  it('a late error after an input change is dropped (no reset, no toast)', async () => {
    const f = deferredFetch()
    const c = createExitPreviewController(f.fetchPreview)
    const pending = c.request(input('66F-403.46'))
    c.inputChanged()
    f.calls[0].resolve(ERR)
    expect(await pending).toBeNull()
  })

  it('a late network failure after an input change is dropped (no toast)', async () => {
    const f = deferredFetch()
    const c = createExitPreviewController(f.fetchPreview)
    const pending = c.request(input('66F-403.46'))
    c.inputChanged()
    f.calls[0].reject(new Error('offline'))
    expect(await pending).toBeNull()
  })

  it('a current network failure is reported', async () => {
    const f = deferredFetch()
    const c = createExitPreviewController(f.fetchPreview)
    const pending = c.request(input('66F-403.46'))
    f.calls[0].reject(new Error('offline'))
    expect(await pending).toEqual({ kind: 'network' })
  })

  it('a newer request makes the older answer stale', async () => {
    const f = deferredFetch()
    const c = createExitPreviewController(f.fetchPreview)
    const first = c.request(input('66F-403.46'))
    const second = c.request(input('66F-403.45'))
    f.calls[0].resolve(OK)
    f.calls[1].resolve(OK)
    expect(await first).toBeNull()
    expect(await second).toEqual({ kind: 'ok', preview: OK.body, comparedPlate: '66F-403.45' })
  })
})
