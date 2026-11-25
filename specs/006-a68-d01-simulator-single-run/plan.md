# Implementation Plan: One simulator run at a time (A-68 D-01)

**Branch**: `fix/a68-d01-simulator-busy` | **Spec**: `spec.md` | **Design**: `docs/superpowers/specs/2026-11-25-a68-d01-simulator-single-run-design.md`

## Technical approach

- `src/server/services/simulator.ts`: add `isSimulatorBusy()` and `runSimulatorExclusive(fn)` using a `globalThis.__simulatorBusy` flag, cleared in `finally`.
- `src/app/api/simulator/route.ts`: keep validation as is; wrap `simulateLive`, `triggerException` and `generateHistory` in `runSimulatorExclusive`.
- `src/server/errors.ts`: add `SIMULATOR_BUSY` to `ErrorCode` and `STATUS_MAP` (409).
- `src/i18n/en.ts`, `src/i18n/vi.ts`: add `errors.SIMULATOR_BUSY`; add the code to the list in `tests/i18n.test.ts`.
- `tests/simulator-busy.test.ts`: route-level tests with a mocked session (same pattern as `tests/contract-inout.test.ts`).

## Constitution check

| Principle | Check |
|---|---|
| I. Layered architecture | Logic in the service; the route only wraps; new code in `ErrorCode` and `STATUS_MAP` |
| II. Concurrency safety | Uses a `globalThis` singleton; does not nest `withLock` (the simulator still calls `recordEntry`, which takes the lock itself) |
| III. Edge and access | No change to middleware or RBAC; route still requires MANAGER |
| IV. Test-backed | `tests/simulator-busy.test.ts` fails without the change (the helper and the 409 do not exist); i18n parity test updated |
| V. Traceable delivery | Commits reference A-68, D-01, ISS-11; `docs/m2-report/` untouched |
| VI. Shared entry/exit service | Unchanged: the simulator still calls the entry/exit services in-process |

## Complexity

None. The flag is per process, which matches the single-process SQLite deployment.

## Analyze (speckit-analyze)

- Every FR maps to a task and a test: FR-001/002 → T001 tests 1–2; FR-003 → test 5; FR-004 → test 4; FR-005 → i18n test.
- No conflict with open work: RES-04 F4-01 touches availability and reservation UI only; F5-01 (test timeout) touches `vitest.config.ts` and `tests/simulator.test.ts`, not these files.
