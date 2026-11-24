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
A-67 | Simulator integration | docs/m3/a-67-integration-check.md | RES-01 / RES-05 | 23/11 (actual finish) | Done, integration only. Initial HTTP verification 20/11 (RES-01): 25 HTTP checks, 120 events 0 rejected. RES-05 23/11: 209/209 tests, simulator setup for SC-01..SC-07 in UI, seed reproducible, A-44 closed. Pending in A-68: SC-03/SC-04 staff exit outcomes; SC-07 record completeness, independent count, ≤ 2 s per operation
A-28 / G-05 (Q35) | Automatic 12-month plate purge, daily, logged as a system action | tests/purge.test.ts "system run (null actor) ..."; tests/purge-schedule.test.ts (4 tests: 60 s first run then every 24 h, single registration, failure does not stop the timer, stop/reset) | RES-03 | 23/11 | Verified (commit bc172ce)
A-28 / KB-07 | Registration logs one LOGIN; failed registration logs none | tests/auth.test.ts "logs exactly one LOGIN ..." and "logs no LOGIN when registration fails" | RES-03 | 23/11 | Verified (commit 38c7e20)
A-28 / KB-14 | Malformed bodies return 400 VALIDATION on login, register, lang, POST /api/vehicles | tests/malformed-body.test.ts (19 tests: 4 routes x non-JSON, array, number, empty; no rows written; role check first) | RES-03 | 23/11 | Verified (commit 2992cb0)
A-28 | Full gate | npm test 234/235 (1 pre-existing timeout in tests/simulator.test.ts "live events use QR and RFID", also failing on main 4c8fde2); lint 0 errors; build passes | RES-03 | 23/11 | Verified with known pre-existing failure
A-65 / G-08 (Q34) | Staff lookup by plate/QR/RFID (vehicle, open session, active reservation), active-reservation list, /staff/lookup page | tests/lookup.test.ts (8 tests incl. VIEW_FULL_PLATE once, NOT_FOUND logs nothing, expired hold not active); tests/read-apis.test.ts lookup and reservations (STAFF/MANAGER 200, CUSTOMER 403, signed-out 401, 404, 400) | RES-03 | 23/11 | Verified (commit 49299ac)
A-65 / KB-15 | Read endpoints GET /api/access-logs, /api/sessions, /api/payments with role and query validation | tests/read-apis.test.ts (6 tests: ordering, limit 1-500, status OPEN/CLOSED, from/to, customer own history, 403 for wrong roles) | RES-03 | 23/11 | Verified (commit 5882e49)
A-65 / G-07 | Indexes reservations(customer_id,status), parking_sessions(entry_time), access_logs(created_at), access_logs(user_id) | tests/indexes.test.ts (4 tests); prisma migrate diff from migrations to schema: no difference | RES-03 | 23/11 | Verified (commit d64e95f)
A-65 | Full gate | npm test 253/257: 4 failures all in tests/simulator.test.ts, caused by the pre-existing 5 s timeout (minSessions 8.2 s and QR/RFID 15.0 s on main as well; with --testTimeout=60000 all 17 simulator tests pass on both main and this branch, similar times); lint 0 errors; build passes | RES-03 | 23/11 | Verified with known pre-existing timeout
A-28 / G-06 (FR-43, CP-03 review) | LOGIN_FAILED on unknown email (no account, email not stored), wrong password, locked account; ACCESS_DENIED for a signed-in user with the wrong role on APIs (requireRole) and pages (first version: middleware to /denied, replaced after RES-01's review by the section-layout check, see the review-of-PR-#11 row); 401 not logged | tests/auth-log.test.ts (8 tests) | RES-03 | 23/11 | Verified (commit 6ef8862)
A-65 / G-09 (FR-09, CP-03 review) | parking_sessions.entry_gate (NOT NULL, default GATE-1) and exit_gate; gate on entry/exit API and Staff forms; shown on session detail; unknown gate is 400 VALIDATION | tests/gate.test.ts (4 tests); prisma migrate diff from migrations to schema: no difference | RES-03 | 23/11 | Verified (commit 6ef8862)
A-65 / G-04 (FR-10, CP-03 review round 2) | parking_sessions.entry_source (NOT NULL, default DEVICE) and exit_source (NULL while open); Staff forms send MANUAL, simulator and device events DEVICE; shown on session detail; unknown source is 400 VALIDATION | tests/source.test.ts (4 tests); prisma migrate diff: no difference | RES-03 | 23/11 | Verified (commit 68abc69)
A-28, A-65 / review of PR #11 (RES-01, 23/11) | (1) page ACCESS_DENIED written once at the section layout (requireSection), /denied read-only; (2) lookup and active-reservation reads publish availability when they expire a hold; (3) simulator history sets gate and source; (4) lookup query parsed as untrusted; (5) registration and its LOGIN row in one write | tests/auth-log.test.ts (12), tests/auth-guard-render.test.ts (5), tests/read-expiry-publish.test.ts (4), tests/simulator.test.ts (+1), tests/lookup-query.test.ts (3), tests/register-atomic.test.ts (1); each new test fails on the previous code; production build run on a scratch DB: 1 row per refused request, 0 for /denied refresh or a forged from; independent review (review-implementation): all 5 findings met | RES-03 | 23/11 | Verified (commits a239fec, 69c9931, 178289c, 57d5d33, 64d0a0d)
A-28 / G-05 (Q44, 23/11) | Plate retention counted from the exit: CLOSED sessions with exit_time older than 12 months are masked; a guest vehicle is kept while any session exited after the cutoff | tests/purge.test.ts (+1: long stay entered 13 months ago, exited 11 months ago, kept; masked 2 months later); fails on the previous code | RES-03 | 24/11 | Verified (commit a755fae)
A-65 / FR-42 (Q46, 23/11) | Staff see a masked plate on ended sessions, Manager in full, the owner in full; sessions list, GET /api/sessions and session detail; VIEW_FULL_PLATE only when the full plate is shown | tests/plate.test.ts (+1), tests/plate-q46.test.ts (5), tests/read-apis.test.ts (updated to Q46); fail on the previous code | RES-03 | 24/11 | Verified (commit 8b59333); superseded: RES-01's second review found short plates unmasked and the exit response unmasked (fixed in 977a46b), and the mask format now follows SRS FR-42 (5fabb1f)
A-28, A-65 / FR-42, FR-45 (Q44, Q46, independent review) | The plate observed at the exit in EX-02 notes is masked for viewers who may not see the full plate and purged with the session after 12 months from the exit; the staff note is kept | tests/plate.test.ts (+1), tests/plate-q46.test.ts (+2), tests/purge.test.ts (+1); fail on the previous code | RES-03 | 24/11 | Verified (commit e19f356)
A-28, A-65 / FR-42, FR-45 (second review of PR #11 by RES-01, 24/11) | Short plates are masked too (at least one character hidden); the exit-confirm response presents the closed session's plate by role; only PLATE_MISMATCH_CONFIRMED notes are masked or purged, LOST_CARD notes stay as written; specs/002 FR-002 counts from the exit | tests/plate.test.ts (short plates, note by event type), tests/contract-inout.test.ts (CT-05 Staff masked, CT-05b Manager full), tests/purge.test.ts (LOST_CARD kept); fail on the previous code except the CT-05b guard | RES-03 | 24/11 | Verified (commit 977a46b)
A-28, A-65 | Full gate after the second review of PR #11 | npm test 304/304 with --testTimeout=60000 (37 files); lint 0 errors; build passes (with a freshly generated Prisma client) | RES-03 | 24/11 | Verified at 977a46b
A-28, A-65 / FR-42 mask format (SRS v2.0/v2.1, spec 002 of RES-01, AT-04 step 7) | maskPlate shows only the last 3 letters or digits, keeps separators, counts letters and digits so separators cannot hide masking (51F-.12 was returned unmasked); short plates still masked | tests/plate.test.ts (format, short and separator cases, 2000 seeded plates), tests updated in plate-q46, contract-inout, read-apis; 7 fail on the previous code | RES-03 | 24/11 | Verified at 5fabb1f
A-28 / FR-43 atomic audit (independent review) | PURGE, EXIT, MANUAL_CONFIRM, LOT_CHANGE, TARIFF_CHANGE, ACCOUNT_CHANGE rows commit with their change (inTransaction) | tests/audit-atomic.test.ts (6, trigger makes access-log inserts fail; all fail on the previous code); npm test 310/310 (38 files); lint 0 errors; npm run build exit 0 | RES-03 | 24/11 | Verified at 2ad2170
A-28, A-65 / build gate (RES-01 on PR #17) | `npm run build` and `npm test` regenerate the Prisma client first (prebuild, pretest). Reproduced RES-01's type error at sessions/[id]/page.tsx:76 with a client generated from main's schema; with the change, `npm run build` passes from that stale client and `npm test` 4/4 on tests/gate.test.ts (direct vitest: 3/4 fail) | npm test 304/304 with --testTimeout=60000 (37 files); lint 0 errors; npm run build exit 0 | RES-03 | 24/11 | Verified at 3c89637
A-28, A-65 | Full gate after Q44, Q46 | npm test 302/302 with --testTimeout=60000 (37 files); lint 0 errors; build passes | RES-03 | 24/11 | Verified
A-28, A-65 | Full gate after review fixes | npm test 291/291 with --testTimeout=60000 (36 files); lint 0 errors; build passes | RES-03 | 23/11 | Verified
G-04, G-06, G-09 | Full gate after G-04 | npm test 273/273 with --testTimeout=60000 (32 files); lint 0 errors; build passes | RES-03 | 23/11 | Verified
G-06, G-09 | Full gate | npm test 269/269 with --testTimeout=60000 (31 files); lint 0 errors; build passes | RES-03 | 23/11 | Verified
```

## Planned vs Actual sheet

Use `docs/m3/a-90-planned-vs-actual.md`.

## Task Log (A-100)

Use the [RES-01 weekly effort estimates](a-90-planned-vs-actual.md#res-01-weekly-effort-estimates). Mark each row as estimated. W12 totals 8 h and W13 totals 10 h.
