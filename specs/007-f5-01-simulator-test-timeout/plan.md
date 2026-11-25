# Implementation Plan: Simulator tests pass without a timeout flag (F5-01)

**Branch**: `fix/f5-01-simulator-test-timeout` | **Spec**: `spec.md` | **Design**: `docs/superpowers/specs/2026-11-25-f5-01-simulator-test-timeout-design.md`

## Approach

Add `const SIMULATOR_SUITE_TIMEOUT_MS = 60_000` and pass `{ timeout: SIMULATOR_SUITE_TIMEOUT_MS }` to `describe('simulator', …)` in `tests/simulator.test.ts`. No production code changes.

## Constitution check

| Principle | Check |
|---|---|
| I–III, VI | Not affected (tests only) |
| IV. Test-backed | No assertion removed; event counts unchanged; FR-16 still checks < 2 s per call |
| V. Traceable delivery | Commit references F5-01, A-68 D-06 |

## Analyze

- FR-001 → T001; FR-002 → diff limited to one test file; FR-003 → no test body changed.
- No overlap with PR #26 (`tests/simulator-busy.test.ts` has its own per-test 30 s timeouts) or RES-04's F4-01 files.
