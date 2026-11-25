# Feature Specification: Simulator tests pass without a timeout flag (F5-01)

**Feature Branch**: `fix/f5-01-simulator-test-timeout`

**Created**: 2026-11-25

**Status**: Implemented

**Input**: `docs/m3-m4-final-work-division.md` F5-01: the simulator tests fail on the default 5 s timeout; fix the tests or the timeout so `npm test` is green without flags (`vitest.config.ts`, `tests/simulator.test.ts`). Closes A-68 D-06.

## User Scenarios & Testing

### User Story 1 - `npm test` is green without flags (Priority: P1)

A team member runs `npm test` on a Windows laptop. All tests pass without `--testTimeout`.

**Acceptance Scenarios**:

1. **Given** the full suite, **When** `npm test` runs with no flags, **Then** all files pass.
2. **Given** any test file other than `tests/simulator.test.ts`, **Then** its timeout stays at the 5 s default.
3. **Given** the FR-16 case, **Then** it still asserts each entry/exit call takes < 2 s.

## Requirements

- **FR-001**: The simulator suite MUST allow up to 60 s per test.
- **FR-002**: The change MUST be limited to `tests/simulator.test.ts`; `vitest.config.ts` keeps the default.
- **FR-003**: No simulator test may lose an assertion or reduce its event count.

## Success Criteria

- **SC-001**: `npm test` (no flags) passes twice in a row on RES-05's Windows machine.
- **SC-002**: `npm run lint` and `npm run build` pass.
