# Workbook rows (paste-ready)

Text rows for the tracking workbook (`resources/CO3011_Project_Tracking_Workbook (1).xlsx`). The workbook contains CR-02, A-61, A-67, and the 21/11 Codex AI usage entry. Use these notes to reconcile remaining entries. Unknowns are `TODO`.

## Change Log sheet

The CR-01 and CR-02 rows are in `docs/m3/decision-record.md`, section "Change Log rows". Use them as written.

## Risk Register sheet

```text
R-G5-04 | A-92, A-88, A-116 | Deadline compression: final submission moved to 29/11, no float; any slip moves the submission | Likelihood 70% | Impact: +11.5 h unresolved, 1-3 days | RES-01 | Response: option C cuts, Q22 fallback at M-03 24/11, W14 +2 h per person | Fallback: drop A-72 and A-76 verification, record gap | Status: Open | Raised 19/11
R-G4-02 | W12-W15 | Re-rate: members cannot keep their hours. Now W12-W14 only; likelihood near-certain; effect: W14 +2 h per person already planned | RES-01 | Status: Occurred (change event) | Updated 19/11
R-G5-01 | A-87 | Re-rate: modules not fixed at dry run. A-95 merged into A-87, less time for early detection; likelihood 35% to 45% | RES-02 | Updated 19/11
R-G5-02 | A-87, A-88 | Re-rate: dry run finds more defects than expected. A-95 merged into A-87; likelihood 45% to 55% | RES-02 | Updated 19/11
```

Likelihood values for the re-rates are my judgment. `TODO(RES-01)`: confirm or adjust before pasting.

## Quality Evidence sheet

```text
A-63 / KB-04 | Exit plate match ignores separators and case | tests/exit.test.ts "KB-04 exit plate check ignores separators and case (A-63)"; tests/plate.test.ts plateCompareKey | RES-01 | 19/11 | Verified (suite 181/181)
A-63 / KB-05 | Lost-card exit requires PLATE lookup on the server | tests/exit.test.ts "KB-05 lost card requires PLATE lookup on the server (A-63)" and non-lost-card regression | RES-01 | 19/11 | Verified
A-63 / KB-13 | Known vehicle type wins at entry | tests/entry.test.ts "recordEntry vehicle type (A-63, KB-13)" 2 tests | RES-01 | 19/11 | Verified
A-74 / KB-02 | Fee is the tariff at confirm time | tests/exit.test.ts "KB-02 fee is the tariff at confirm time" | RES-01 | 19/11 | Verified
A-74 / KB-03 | Close and payment are one transaction | tests/exit.test.ts "KB-03 ... payment failure leaves session OPEN"; "one payment per closed session" | RES-01 | 19/11 | Verified
A-74 / FR-28 | Customer and Manager payment history | tests/history.test.ts (existing); review in P18 section 10.3 | RES-01 | 19/11 | Verified, no gap
A-22 | P18 v1.0, KB-01..KB-19 decisions | P18 section 10 and 10.2 | RES-01 | 19/11 | Done; CP-02 review by RES-02 and RES-03 planned 20/11, outcome pending
A-61 | Lot management | docs/m3/quality-evidence-A-61.md | RES-01 | 20/11 | Verified (seven Staff requests returned HTTP 403)
A-67 | Simulator integration | docs/m3/a-67-integration-check.md | RES-01 / RES-05 | 20/11 | Verified (25 HTTP checks passed and 120 simulator events ran with zero rejections)
A-28 / G-05 (Q35) | Automatic 12-month plate purge, daily, logged as a system action | tests/purge.test.ts "system run (null actor) ..."; tests/purge-schedule.test.ts (4 tests: 60 s first run then every 24 h, single registration, failure does not stop the timer, stop/reset) | RES-03 | 23/11 | Verified (commit bc172ce)
A-28 / KB-07 | Registration logs one LOGIN; failed registration logs none | tests/auth.test.ts "logs exactly one LOGIN ..." and "logs no LOGIN when registration fails" | RES-03 | 23/11 | Verified (commit 38c7e20)
A-28 / KB-14 | Malformed bodies return 400 VALIDATION on login, register, lang, POST /api/vehicles | tests/malformed-body.test.ts (19 tests: 4 routes x non-JSON, array, number, empty; no rows written; role check first) | RES-03 | 23/11 | Verified (commit 2992cb0)
A-28 | Full gate | npm test 234/235 (1 pre-existing timeout in tests/simulator.test.ts "live events use QR and RFID", also failing on main 4c8fde2); lint 0 errors; build passes | RES-03 | 23/11 | Verified with known pre-existing failure
A-65 / G-08 (Q34) | Staff lookup by plate/QR/RFID (vehicle, open session, active reservation), active-reservation list, /staff/lookup page | tests/lookup.test.ts (8 tests incl. VIEW_FULL_PLATE once, NOT_FOUND logs nothing, expired hold not active); tests/read-apis.test.ts lookup and reservations (STAFF/MANAGER 200, CUSTOMER 403, signed-out 401, 404, 400) | RES-03 | 23/11 | Verified (commit 49299ac)
A-65 / KB-15 | Read endpoints GET /api/access-logs, /api/sessions, /api/payments with role and query validation | tests/read-apis.test.ts (6 tests: ordering, limit 1-500, status OPEN/CLOSED, from/to, customer own history, 403 for wrong roles) | RES-03 | 23/11 | Verified (commit 5882e49)
A-65 / G-07 | Indexes reservations(customer_id,status), parking_sessions(entry_time), access_logs(created_at), access_logs(user_id) | tests/indexes.test.ts (4 tests); prisma migrate diff from migrations to schema: no difference | RES-03 | 23/11 | Verified (commit d64e95f)
A-65 | Full gate | npm test 253/257: 4 failures all in tests/simulator.test.ts, caused by the pre-existing 5 s timeout (minSessions 8.2 s and QR/RFID 15.0 s on main as well; with --testTimeout=60000 all 17 simulator tests pass on both main and this branch, similar times); lint 0 errors; build passes | RES-03 | 23/11 | Verified with known pre-existing timeout
A-28 / G-06 (FR-43, CP-03 review) | LOGIN_FAILED on unknown email (no account, email not stored), wrong password, locked account; ACCESS_DENIED for a signed-in user with the wrong role on APIs (requireRole) and pages (middleware to /denied); 401 not logged | tests/auth-log.test.ts (8 tests) | RES-03 | 23/11 | Verified (commit 6ef8862)
A-65 / G-09 (FR-09, CP-03 review) | parking_sessions.entry_gate (NOT NULL, default GATE-1) and exit_gate; gate on entry/exit API and Staff forms; shown on session detail; unknown gate is 400 VALIDATION | tests/gate.test.ts (4 tests); prisma migrate diff from migrations to schema: no difference | RES-03 | 23/11 | Verified (commit 6ef8862)
G-06, G-09 | Full gate | npm test 269/269 with --testTimeout=60000 (31 files); lint 0 errors; build passes | RES-03 | 23/11 | Verified
```

## Planned vs Actual sheet

Use `docs/m3/a-90-planned-vs-actual.md`.

## Task Log (A-100)

Use the [RES-01 weekly effort estimates](a-90-planned-vs-actual.md#res-01-weekly-effort-estimates). Mark each row as estimated. W12 totals 8 h and W13 totals 10 h.
