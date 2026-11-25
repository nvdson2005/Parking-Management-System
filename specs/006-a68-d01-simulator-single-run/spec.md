# Feature Specification: One simulator run at a time (A-68 D-01)

**Feature Branch**: `fix/a68-d01-simulator-busy`

**Created**: 2026-11-25

**Status**: Implemented

**Input**: CP-05 condition C6 / ISS-11: fix D-01 before CP-07. A second simulator request while a run is in progress must not start a second, overlapping run.

**Sources**: `docs/m3/a-68-cp05-test.md` (D-01, sections 3.3 and C6); design `docs/superpowers/specs/2026-11-25-a68-d01-simulator-single-run-design.md`.

## User Scenarios & Testing

### User Story 1 - A second run is refused while one is running (Priority: P1)

A manager starts a 100-session run. The page reloads (or a second tab is open) and the run button is clicked again. The second request is refused with a clear message, and only the first run writes sessions.

**Independent Test**: start a live run through the API and, while it runs, send a second live, exception or history request. The second gets 409 `SIMULATOR_BUSY`; the first finishes normally; the DB holds only the first run's sessions.

**Acceptance Scenarios**:

1. **Given** a live run in progress, **When** a second live run is requested, **Then** it is refused with 409 `SIMULATOR_BUSY` and creates no session.
2. **Given** a live run in progress, **When** an exception or history action is requested, **Then** it is refused the same way.
3. **Given** a finished run, **When** a new run is requested, **Then** it runs.
4. **Given** an action that fails, **Then** the busy state is cleared and the next run is accepted.
5. **Given** invalid input, **Then** the answer is 400 `VALIDATION`, as before.
6. **Given** the refusal, **Then** the simulator panel shows the message in Vietnamese or English.

## Requirements

- **FR-001**: The server MUST run at most one simulator action (live, exception, history) at a time per process.
- **FR-002**: A request that arrives while an action runs MUST fail with `SIMULATOR_BUSY` (HTTP 409) and MUST NOT write data.
- **FR-003**: The busy state MUST be cleared when the action ends, also on error, and MUST survive HMR (`globalThis`).
- **FR-004**: Input validation MUST run before the busy check.
- **FR-005**: `SIMULATOR_BUSY` MUST have Vietnamese and English messages (i18n parity).

## Success Criteria

- **SC-001**: The C5 scenario (two clicks on a 100-session run) produces one run: about 100 sessions, 0 rejected, second request 409.
- **SC-002**: `npm test`, `npm run lint`, `npm run build` pass.
