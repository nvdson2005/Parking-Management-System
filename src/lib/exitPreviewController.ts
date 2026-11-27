import { createRequestGuard } from '@/lib/requestGuard'

/** What the preview endpoint answered: HTTP ok flag and the parsed JSON body. */
export type PreviewResponse = { ok: boolean; body: unknown }

export type PreviewOutcome<T> =
  | { kind: 'ok'; preview: T; comparedPlate: string }
  | { kind: 'error'; code: string }
  | { kind: 'network' }

/**
 * Runs the Staff exit-preview requests (spec 008 FR-006). `request()` returns
 * `null` when its answer is stale: an input changed (`inputChanged()`) or a
 * newer request started while it was in flight. A stale answer must not change
 * the screen: no preview, no reset, no toast. A current success carries the
 * plate that was sent, which the form shows and confirms.
 */
export function createExitPreviewController<I extends { observedPlate: string }, T = unknown>(
  fetchPreview: (input: I) => Promise<PreviewResponse>,
) {
  const guard = createRequestGuard()
  return {
    inputChanged(): void {
      guard.invalidate()
    },
    async request(input: I): Promise<PreviewOutcome<T> | null> {
      const token = guard.begin()
      try {
        const res = await fetchPreview(input)
        if (!guard.isCurrent(token)) return null
        if (!res.ok) {
          const code = (res.body as { error?: string } | null)?.error ?? 'VALIDATION'
          return { kind: 'error', code }
        }
        return { kind: 'ok', preview: res.body as T, comparedPlate: input.observedPlate }
      } catch {
        return guard.isCurrent(token) ? { kind: 'network' } : null
      }
    },
  }
}
