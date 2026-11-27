import { createRequestGuard } from '@/lib/requestGuard'
import type { IdMethod } from '@/lib/types'

/** What an endpoint answered: HTTP ok flag and the parsed JSON body. */
export type ApiResponse = { ok: boolean; body: unknown }

export type ExitFormInputs = {
  method: IdMethod
  identifier: string
  observedPlate: string
  lostCard: boolean
}

export type ExitFormState<T> = {
  inputs: ExitFormInputs
  /** True only while the current preview request is in flight. */
  previewing: boolean
  confirming: boolean
  /** The preview and the plate it was computed for, always set together (FR-006). */
  shown: { preview: T; comparedPlate: string } | null
  confirmMismatch: boolean
}

export type RequestOutcome<T> = { kind: 'ok'; value: T } | { kind: 'error'; code: string } | { kind: 'network' }

export type PreviewBody = { method: IdMethod; identifier: string; observedPlate: string }
export type ConfirmBody = {
  sessionId: string
  observedPlate: string
  confirmMismatch: boolean
  lostCard: boolean
  method: IdMethod
  gate: string
  source: 'MANUAL'
  note?: string
}

const EMPTY_INPUTS: ExitFormInputs = { method: 'PLATE', identifier: '', observedPlate: '', lostCard: false }

function errorCode(body: unknown): string {
  return (body as { error?: string } | null)?.error ?? 'VALIDATION'
}

/**
 * State of the Staff exit form (A-68 D-04, spec 008 FR-006), kept outside
 * React so the whole flow can be tested without a DOM:
 * - every input change goes through `setInput`, which makes the request in
 *   flight stale, hides the preview and releases the preview button;
 * - an answer to a stale request changes nothing (no preview, no reset, no
 *   loading change, no outcome for a toast);
 * - only the current request clears the loading state;
 * - confirm sends the plate the shown preview was computed for.
 * `ExitForm` renders this state with `useSyncExternalStore`.
 */
export function createExitFormModel<T extends { sessionId: string }>(api: {
  preview: (body: PreviewBody) => Promise<ApiResponse>
  confirm: (body: ConfirmBody) => Promise<ApiResponse>
}) {
  const guard = createRequestGuard()
  const listeners = new Set<() => void>()
  let state: ExitFormState<T> = {
    inputs: EMPTY_INPUTS,
    previewing: false,
    confirming: false,
    shown: null,
    confirmMismatch: false,
  }

  function set(patch: Partial<ExitFormState<T>>) {
    state = { ...state, ...patch }
    for (const listener of listeners) listener()
  }

  /** A lost card is looked up by plate (there is no card or code to scan). */
  function effectiveMethod(inputs: ExitFormInputs): IdMethod {
    return inputs.lostCard ? 'PLATE' : inputs.method
  }

  return {
    getState: (): ExitFormState<T> => state,
    subscribe(listener: () => void): () => void {
      listeners.add(listener)
      return () => listeners.delete(listener)
    },
    effectiveMethod: (): IdMethod => effectiveMethod(state.inputs),

    /** Any change to what the preview depends on. */
    setInput(patch: Partial<ExitFormInputs>): void {
      guard.invalidate()
      set({ inputs: { ...state.inputs, ...patch }, previewing: false, shown: null, confirmMismatch: false })
    },

    setConfirmMismatch(value: boolean): void {
      set({ confirmMismatch: value })
    },

    /** Returns `null` when the answer is stale; the caller shows a toast only for a non-null error. */
    async preview(): Promise<RequestOutcome<T> | null> {
      const token = guard.begin()
      const body: PreviewBody = {
        method: effectiveMethod(state.inputs),
        identifier: state.inputs.identifier,
        observedPlate: state.inputs.observedPlate,
      }
      set({ previewing: true })
      let outcome: RequestOutcome<T>
      try {
        const res = await api.preview(body)
        if (!guard.isCurrent(token)) return null
        outcome = res.ok ? { kind: 'ok', value: res.body as T } : { kind: 'error', code: errorCode(res.body) }
      } catch {
        if (!guard.isCurrent(token)) return null
        outcome = { kind: 'network' }
      }
      if (outcome.kind === 'ok') {
        set({ previewing: false, shown: { preview: outcome.value, comparedPlate: body.observedPlate }, confirmMismatch: false })
      } else if (outcome.kind === 'error') {
        set({ previewing: false, shown: null, confirmMismatch: false })
      } else {
        set({ previewing: false })
      }
      return outcome
    },

    /** Confirms the shown preview with the plate it was computed for. */
    async confirm(extra: { gate: string; note?: string }): Promise<RequestOutcome<unknown> | null> {
      const shown = state.shown
      if (!shown) return null
      const body: ConfirmBody = {
        sessionId: shown.preview.sessionId,
        observedPlate: shown.comparedPlate,
        confirmMismatch: state.confirmMismatch,
        lostCard: state.inputs.lostCard,
        method: effectiveMethod(state.inputs),
        gate: extra.gate,
        source: 'MANUAL',
        note: extra.note,
      }
      set({ confirming: true })
      try {
        const res = await api.confirm(body)
        if (!res.ok) {
          set({ confirming: false })
          return { kind: 'error', code: errorCode(res.body) }
        }
        guard.invalidate()
        set({
          confirming: false,
          previewing: false,
          inputs: { ...state.inputs, identifier: '', observedPlate: '', lostCard: false },
          shown: null,
          confirmMismatch: false,
        })
        return { kind: 'ok', value: res.body }
      } catch {
        set({ confirming: false })
        return { kind: 'network' }
      }
    },
  }
}
