# Feature Specification: G-06 failed-login and access-denied logging, G-09 gate on parking sessions

**Feature Directory**: `specs/004-g06-g09-auth-log-gate`
**Created**: 23/11/2026
**Owner**: RES-03 (Nguyễn Phạm Mạnh Dũng)
**Status**: Ready for implementation
**Source**: CP-03 review comments on P03 v0.4 by RES-02 (Đào Xuân Sơn, 23/11); SRS v2.0 FR-09 and FR-43 (Must); AT-01 step 3, AT-03 step 7, AT-04 step 2

## Background

P03 v0.4 §11.1 deferred G-06 because it came only from SRS v0.2. The CP-03 review showed that the acceptance tests AT-03 and AT-04 check exactly these log rows, so G-06 is now in scope. The review also found a gap P03 missed: FR-09 requires the entry record to hold the **gate**, and the schema has no gate column, so AT-01 cannot pass. This is recorded as G-09. Both changes go into CR-03.

## User Scenarios & Testing

### User Story 1 - Manager sees failed sign-ins and denied access in the access log (P1)

A Manager reviewing the access log can see every failed sign-in attempt and every time a signed-in user tried to reach something their role does not allow.

**Acceptance Scenarios**:

1. **Given** an existing account, **When** someone signs in with a wrong password, **Then** one `LOGIN_FAILED` row is written for that account with target `reason:BAD_PASSWORD`, and no `LOGIN` row.
2. **Given** no account with that email, **When** someone signs in, **Then** one `LOGIN_FAILED` row is written with no account (`user_id` empty) and target `reason:UNKNOWN_EMAIL`. The email itself is not stored.
3. **Given** a locked account with the correct password, **When** it signs in, **Then** one `LOGIN_FAILED` row with target `reason:LOCKED`.
4. **Given** a signed-in Customer, **When** they call a Manager-only API, **Then** the response is 403 and one `ACCESS_DENIED` row is written for that user with target `roles:MANAGER`.
5. **Given** a signed-in Customer, **When** they open a `/manager` page, **Then** they land on an "access denied" page with a link back to their home, and one `ACCESS_DENIED` row is written with target `page:/manager`.
6. **Given** no session, **When** a page or API needs sign-in, **Then** behaviour is unchanged (redirect to login or 401) and **nothing** is logged.

### User Story 2 - Each parking session records its gate (P1)

Staff record which gate a vehicle came in and went out through; the session detail shows it.

**Acceptance Scenarios**:

1. **Given** an entry with gate `GATE-2`, **When** it is recorded, **Then** the session has `entry_gate = GATE-2`.
2. **Given** an entry without a gate (simulator, old clients), **Then** `entry_gate = GATE-1`.
3. **Given** an open session, **When** the exit is confirmed with gate `GATE-2`, **Then** `exit_gate = GATE-2`; without a gate, `GATE-1`.
4. **Given** an unknown gate value, **Then** the request is rejected with 400 VALIDATION.
5. The Staff entry and exit forms offer a gate choice; the session detail page shows entry and exit gate.

### Edge Cases

- A rejected sign-in must still write its log row even though the request fails.
- `ACCESS_DENIED` is written only for an authenticated user with the wrong role. Unauthenticated requests (401) are not logged: the Edge middleware cannot write to the database, and anonymous traffic would flood the log.
- The access-denied page only logs a `from` value that is one of the protected prefixes (`/customer`, `/staff`, `/manager`), so the URL cannot inject arbitrary text into the log.
- Existing sessions get `entry_gate = GATE-1` from the column default; existing closed sessions keep `exit_gate` empty.

## Requirements

- **FR-A (G-06)**: `authenticate` writes `LOGIN_FAILED` for unknown email, wrong password and locked account, with the reasons above.
- **FR-B (G-06)**: `requireRole` writes `ACCESS_DENIED` when a signed-in user lacks the role, then throws FORBIDDEN as before. `assertRole` stays a pure function.
- **FR-C (G-06)**: the middleware sends a wrong-role page request to `/denied?from=<prefix>`; that page logs `ACCESS_DENIED` and shows a translated message (vi/en).
- **FR-D (G-09)**: `parking_sessions.entry_gate TEXT NOT NULL DEFAULT 'GATE-1'` and `exit_gate TEXT NULL`, added by a new migration. Allowed gates: `GATE-1`, `GATE-2`.
- **FR-E (G-09)**: `recordEntry` and `confirmExit` accept an optional `gate`; the API routes pass it through; the Staff forms send it; the session detail shows both gates.

## Success Criteria

- **SC-001**: each scenario above has an automated test that fails before the change and passes after it (scenario 5 and US2 scenario 5 are UI and are checked by hand).
- **SC-002**: the full test suite, lint and build pass.
- **SC-003**: AT-01 step 3 (6 fields including gate), AT-03 step 7 and AT-04 step 2 can be executed against the app.

## Assumptions

- The pilot lot has two simulated gates. A gate table is not needed (no client requirement to configure gates); the allowed list lives in `src/lib/types.ts`.
- The simulator does not pick gates, so its seeded output and existing simulator tests stay unchanged; its sessions use `GATE-1`.
