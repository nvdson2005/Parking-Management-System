# Feature Specification: A-28 Auth and Access-Log Fixes, Automatic Data Purge

**Feature Branch**: `fix/a28-auth-log-purge`

**Created**: 2026-11-23

**Status**: Draft

**Input**: User description: "A-28 (RES-03): sửa xác thực và nhật ký truy cập theo review P18 v1.0 mục 10, cộng G-05 của P03 v0.4 mục 11.1 (CR-03). Phạm vi: (1) KB-07: đăng ký tự đăng nhập nhưng không ghi LOGIN. (2) KB-14: auth/login, auth/register, lang, POST /api/vehicles trả 500 với body không phải JSON; phải trả 400 VALIDATION. (3) G-05 / Q35: xóa hoặc ẩn biển số trên lượt đã kết thúc sau 12 tháng phải chạy tự động hằng ngày, người thực hiện là hệ thống; giữ nút của Manager. Ngoài phạm vi: KB-16, FR-03, G-06."

**Sources**: P18 v1.0 §10 (KB-07, KB-14, KB-16 decisions), P03 v0.4 §6 and §11.1 (G-05), client answer Q35 (round 3, 15/11/2026), CR-03 (pending RES-01 approval, `docs/m3/risk-register.md` §6). The design is already decided in these documents, so no separate brainstorming round was run.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Old plates disappear automatically after 12 months (Priority: P1)

The client (Q35) requires that, 12 months after a parking session has ended, the system itself removes or hides the plate on that session while keeping the statistics (number of sessions, parking time, revenue). Today this only happens when a Manager presses the purge button, so a forgotten click leaves personal data stored longer than agreed.

**Why this priority**: It is a client-confirmed requirement (Q35), a Must requirement (FR-45) and part of personal-data protection (CN4). It is the only item in A-28 that the client explicitly asked for.

**Independent Test**: Seed a closed session that exited more than 12 months ago, run the scheduled job once, and check that its plate is masked, that the job is recorded in the access log as a system action, and that report totals are unchanged.

**Acceptance Scenarios**:

1. **Given** a closed session that exited more than 12 months ago with its plate still visible, **When** the daily automatic purge runs, **Then** the session's plate is masked and its time, zone, fee group and payment remain.
2. **Given** an open session (vehicle still parked) that entered more than 12 months ago, **When** the automatic purge runs, **Then** its plate is not masked.
3. **Given** the automatic purge runs, **When** it finishes, **Then** one access-log entry with action PURGE is recorded with no user attached (a system action) and a target describing how many sessions and vehicles were affected.
4. **Given** a Manager, **When** they press the existing purge button, **Then** it still works as before and the log entry names that Manager.
5. **Given** the server process restarts or reloads during development, **When** it comes back, **Then** exactly one automatic purge schedule is active (no duplicates).

---

### User Story 2 - Registration is recorded as a login (Priority: P2)

A new customer who registers is signed in straight away. That sign-in must appear in the access log as a LOGIN, the same as a normal login, so the access log is complete for audit (D-23, FR-43).

**Why this priority**: It is a review finding (KB-07) with a small fix. It closes a gap in the audit trail but does not block any user flow.

**Independent Test**: Register a new account and check that exactly one LOGIN entry exists for that new user.

**Acceptance Scenarios**:

1. **Given** a visitor with a new email, **When** they register successfully, **Then** one LOGIN entry is recorded for the new account.
2. **Given** a visitor with an email that is already taken, **When** registration fails, **Then** no LOGIN entry is recorded.

---

### User Story 3 - Malformed request bodies get a clear validation error (Priority: P2)

When a client sends a body that is not valid JSON (or not a JSON object) to the login, registration, language or add-vehicle endpoints, the system must answer with a validation error (400 VALIDATION) instead of an internal server error (500), as every other endpoint already does (API convention, P18 §6).

**Why this priority**: It is a review finding (KB-14). A 500 on bad input is inconsistent and shows up as a failure in contract tests, but real users of the web screens never send malformed JSON.

**Independent Test**: Send a non-JSON body to each of the four endpoints and check that each returns 400 with error code VALIDATION and writes nothing.

**Acceptance Scenarios**:

1. **Given** any of the four endpoints, **When** the body is not valid JSON, **Then** the response is 400 with code VALIDATION.
2. **Given** any of the four endpoints, **When** the body is valid JSON but not an object (for example an array or a number), **Then** the response is 400 with code VALIDATION.
3. **Given** any of the four endpoints, **When** the body is valid, **Then** behaviour is unchanged.
4. **Given** a rejected malformed login or registration, **Then** no account, session cookie or access-log entry is created.

---

### Edge Cases

- The automatic purge runs while nothing is older than 12 months: it still records a PURGE entry with zero counts (FR-006).
- The automatic purge fails (for example the database is busy): the failure must not crash the server, and the next scheduled run tries again.
- The Manager presses the button on the same day the automatic purge already ran: the second run finds nothing new and changes nothing.
- A session that entered more than 12 months ago but exited recently: kept until 12 months after its exit. Q44 (23/11) set the start of the period to the exit, when the session closes; the first version counted from the entry, which was the team's assumption.
- Plates already masked are not counted again.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST run the 12-month retention purge automatically at least once every 24 hours while the server is running, without any user action (Q35, FR-45, G-05).
- **FR-002**: The automatic purge MUST apply exactly the same rules as the Manager purge: mask plates only on sessions that are not open and entered before the 12-month cutoff; delete only ownerless vehicles with no newer session, no open session and no reservation; keep counts, times and payments.
- **FR-003**: The automatic purge MUST be recorded in the access log with action PURGE, no user attached, and a target giving the number of sessions masked and vehicles deleted.
- **FR-004**: The Manager purge button MUST keep working and keep recording the Manager as the actor.
- **FR-005**: The automatic purge schedule MUST be registered only once per server process, including after development reloads, and a failed run MUST NOT stop later runs or crash the server.
- **FR-006**: The automatic purge MUST also run once shortly after the server starts, so a server that is restarted often still purges. A run that changes nothing MUST still be logged, so the log shows the job ran.
- **FR-007**: A successful registration MUST record exactly one LOGIN access-log entry for the new account (KB-07). A failed registration MUST record none.
- **FR-008**: The login, registration, language and add-vehicle endpoints MUST answer a body that is not valid JSON, or not a JSON object, with 400 and error code VALIDATION, and MUST NOT write anything (KB-14).
- **FR-009**: All existing behaviour of these endpoints for valid input MUST stay unchanged.

### Out of Scope

- KB-16 (token revocation on logout, locked-account check in the Edge middleware): accepted without change (P03 §11.1).
- FR-03 (30-minute inactivity timeout): deferred (P03 §11.1, CR-03).
- G-06 (logging failed logins and access denials): deferred.
- Changing the retention period itself (12 months from the exit, Q35 and Q44).

### Key Entities

- **Parking session**: carries the plate copy that is masked after 12 months; time, zone, fee group and link to payment are kept.
- **Guest vehicle**: an ownerless vehicle that may be deleted by the purge under the existing conditions.
- **Access-log entry**: who did what and when; the user is empty only for system actions such as the automatic purge (P03 §10 #3).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: With no Manager action at all, every eligible plate older than 12 months is masked within 24 hours of becoming eligible while the server runs.
- **SC-002**: 100% of automatic purge runs leave an access-log entry marked as a system action.
- **SC-003**: Report totals (sessions, parking time, revenue) are identical before and after a purge run on the same data.
- **SC-004**: 100% of successful registrations produce exactly one login record; 0 failed registrations produce one.
- **SC-005**: For each of the 4 affected endpoints, a malformed body returns a validation error in 100% of tried cases (non-JSON text, array, number, empty body) and never an internal error.
- **SC-006**: The full automated test suite, lint and production build pass after the change.

## Assumptions

- "Daily" means a fixed 24-hour interval from server start plus one run shortly after start; an exact clock time (for example 02:00) is not required by the client.
- The deployment is a single long-running server process (pilot, D-16), so an in-process timer is enough; no external scheduler is needed.
- A purge run that changes nothing is still logged; at one entry per day this does not flood the log.
- The existing purge rules (P03 §6, KB-10) are correct and are reused unchanged.
- The constitution's delivery-workflow rule 4 (no code fix before CP-02 is recorded) is handled as a recorded deviation: the CP-02 decisions exist in P18 v1.0 and the minutes are being written in parallel (ISS-M3-01). See the plan's complexity section.
