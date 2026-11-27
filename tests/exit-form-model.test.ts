/**
 * Spec 008 FR-006, form level (reviews of 12dae51, ca6867b and e18e574): the
 * Staff exit form's whole flow — inputs, preview requests, loading state and
 * confirm — runs in `createExitFormModel`, which `ExitForm` only renders. The
 * cases stage late answers with deferred requests.
 */
import { describe, it, expect } from 'vitest'
import { createExitFormModel } from '@/lib/exitFormModel'
import type { ApiResponse, ConfirmBody, PreviewBody } from '@/lib/exitFormModel'

type Preview = { sessionId: string; plateMismatch: boolean }
type Call<B> = { body: B; resolve: (r: ApiResponse) => void; reject: (e: unknown) => void }

/** An API whose answers the test releases by hand. */
function deferredApi() {
  const previews: Call<PreviewBody>[] = []
  const confirms: Call<ConfirmBody>[] = []
  const api = {
    preview: (body: PreviewBody) =>
      new Promise<ApiResponse>((resolve, reject) => previews.push({ body, resolve, reject })),
    confirm: (body: ConfirmBody) =>
      new Promise<ApiResponse>((resolve, reject) => confirms.push({ body, resolve, reject })),
  }
  return { api, previews, confirms }
}

const MISMATCH = { ok: true, body: { sessionId: 's1', plateMismatch: true } }
const MATCH = { ok: true, body: { sessionId: 's1', plateMismatch: false } }

function setup() {
  const d = deferredApi()
  const form = createExitFormModel<Preview>(d.api)
  form.setInput({ identifier: '66F-403.45', observedPlate: '66F-403.46' })
  return { ...d, form }
}

describe('Staff exit form model (spec 008, FR-006)', () => {
  it('a current preview is shown with the plate that was sent, and the button is released', async () => {
    const { form, previews } = setup()
    const pending = form.preview()
    expect(form.getState().previewing).toBe(true)
    expect(previews[0].body.observedPlate).toBe('66F-403.46')
    previews[0].resolve(MISMATCH)
    expect(await pending).toEqual({ kind: 'ok', value: MISMATCH.body })
    expect(form.getState().shown).toEqual({ preview: MISMATCH.body, comparedPlate: '66F-403.46' })
    expect(form.getState().previewing).toBe(false)
  })

  it('review scenario: editing the plate during a pending request releases the button and the late preview stays hidden', async () => {
    const { form, previews } = setup()
    const pending = form.preview() // plate A (66F-403.46) sent
    form.setInput({ observedPlate: '66F-403.45' }) // Staff edit to plate B
    expect(form.getState().previewing).toBe(false) // Preview button usable again at once
    previews[0].resolve(MISMATCH) // A's answer arrives late
    expect(await pending).toBeNull()
    expect(form.getState().shown).toBeNull()
    expect(form.getState().previewing).toBe(false)
  })

  it('a late error or network failure after an edit changes nothing and gives no outcome to toast', async () => {
    const { form, previews } = setup()
    const first = form.preview()
    form.setInput({ observedPlate: '66F-403.45' })
    previews[0].resolve({ ok: false, body: { error: 'NO_OPEN_SESSION' } })
    expect(await first).toBeNull()

    const second = form.preview()
    form.setInput({ observedPlate: '66F-403.47' })
    previews[1].reject(new Error('offline'))
    expect(await second).toBeNull()
    expect(form.getState().shown).toBeNull()
  })

  it('overlapping requests: the older answer cannot clear the newer loading state or set the preview', async () => {
    const { form, previews } = setup()
    const older = form.preview() // plate A
    form.setInput({ observedPlate: '66F-403.45' }) // edit to B
    const newer = form.preview() // plate B, now in flight
    previews[0].resolve(MISMATCH) // A answers first
    expect(await older).toBeNull()
    expect(form.getState().previewing).toBe(true) // still loading B
    expect(form.getState().shown).toBeNull()
    previews[1].resolve(MATCH)
    await newer
    expect(form.getState().previewing).toBe(false)
    expect(form.getState().shown).toEqual({ preview: MATCH.body, comparedPlate: '66F-403.45' })
  })

  it('confirm sends the plate of the current preview, after an edit and a new preview', async () => {
    const { form, previews, confirms } = setup()
    const older = form.preview() // A in flight
    form.setInput({ observedPlate: '66F-403.45' }) // edit to B
    const newer = form.preview()
    previews[1].resolve(MATCH)
    await newer
    previews[0].resolve(MISMATCH) // late A, dropped
    await older
    const done = form.confirm({ gate: 'GATE-1' })
    expect(confirms[0].body).toMatchObject({ sessionId: 's1', observedPlate: '66F-403.45', confirmMismatch: false, source: 'MANUAL' })
    confirms[0].resolve({ ok: true, body: {} })
    expect(await done).toEqual({ kind: 'ok', value: {} })
    expect(form.getState().shown).toBeNull()
    expect(form.getState().inputs.observedPlate).toBe('')
  })

  it('a current error hides the preview and is returned for a toast; confirm is refused without a preview', async () => {
    const { form, previews } = setup()
    const pending = form.preview()
    previews[0].resolve({ ok: false, body: { error: 'NO_OPEN_SESSION' } })
    expect(await pending).toEqual({ kind: 'error', code: 'NO_OPEN_SESSION' })
    expect(form.getState().shown).toBeNull()
    expect(await form.confirm({ gate: 'GATE-1' })).toBeNull()
  })

  it('a lost card is looked up by plate', async () => {
    const { form, previews } = setup()
    form.setInput({ method: 'QR', lostCard: true })
    void form.preview()
    expect(previews[0].body.method).toBe('PLATE')
  })
})
