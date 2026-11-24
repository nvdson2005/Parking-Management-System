# A-31 Authentication and Authorization Module Test (P07)

| Field | Value |
|---|---|
| Activity | A-31, test the authentication and authorization module: role matrix for 3 roles × 5 function groups; plate masking and access log (P07) |
| Baseline effort | 2 h (matrix 1 h; masking and log 0.5 h; Quality Evidence 0.5 h) |
| Tested by | Nguyễn Tuấn Thành (RES-05) |
| Date | 2026-11-24 (planned 24/11) |
| Predecessor | A-28 (RES-03). Tested on `fix/res03-a28-a65` at `36b1c91` (PR #11); PR #11 merged 24/11 (`755caf6`), suite re-run on `4f2089f`: 310/310 |
| Environment | Windows. `next dev` for steps 1–6, production build (`npm run build` + `npm run start`) for steps 6h–8. DB `a31.db` (migrate deploy + seed); `a31-d02.db` for the D-02 retest |
| Feeds | T12 of CP-05 ([A-68](a-68-cp05-test.md)); Quality Evidence |
| Evidence | `docs/m3/evidence/a31/` |

## 1. Function groups used for the matrix

The baseline sets "3 roles × 5 function groups" without naming the groups. They are defined here from the client's role split (round 3, Q8) and the API routes:

| Group | Functions | API routes checked | Customer | Staff | Manager |
|---|---|---|---|---|---|
| G1 Customer self-service | own vehicles, reservations, history/payments | `/api/vehicles`, `/api/reservations`, `/api/payments` | ✓ | ✗ | payments only |
| G2 Entry/exit operations | record entry/exit, open sessions, lookup | `/api/events/entry`, `/api/events/exit/preview`, `/api/sessions`, `/api/staff/lookup` | ✗ | ✓ | ✓ |
| G3 Lot and tariff management | lots, zones, capacity, tariffs | `/api/lots`, `/api/tariffs` | ✗ | ✗ | ✓ |
| G4 Accounts and data protection | accounts, access log, purge | `/api/accounts`, `/api/access-logs`, `/api/purge` | ✗ | ✗ | ✓ |
| G5 Reports and simulator | reports, simulator | `/api/reports`, `/api/simulator` | ✗ | ✗ | ✓ |
| (shared) | availability | `/api/availability` | ✓ | ✓ | ✓ |

## 2. Results

| # | Check | Method | Result | Evidence |
|---|---|---|---|---|
| 1 | Automated suite on the A-28 branch, then after the PR #11 merge | `npm test -- --testTimeout=30000` on `36b1c91`; after merge `npm run db:reset` + `npm test -- --testTimeout=60000` on `4f2089f` | **Pass**: on `36b1c91` 37 files / 302 tests, auth subset 12 / 92 (incl. `malformed-body`, `register-atomic`, `auth-log`, `plate-q46`, `purge-schedule`); after merge on `4f2089f` 38 files / 310 tests | `a31-b1-tests.txt` (302), `a31-b1-tests-post-merge.txt` (310) |
| 2 | Page access by role (TC-AUTH-06..08, 14) | Typed URLs as each role | **Pass**. Customer → `/staff`, `/staff/entry`, `/manager` go to `/denied`; Staff → `/manager/lots`, `/customer` go to `/denied`; Manager → `/staff/entry` allowed, `/customer` denied. Each refusal wrote one `ACCESS_DENIED` row (6 rows, targets `page:/staff`, `page:/manager`, `page:/customer`). Customer header has no Staff/Manager links | `a31-b2-*.png` |
| 3 | API access, 3 roles × 5 groups (TC-AUTH-09, 10) | Console script, 15 routes per role | **Pass**: `FAIL: 0` for Customer, Manager and logged out (all 401). Staff: 14/15 first run; `GET /api/accounts` returned 500 once. Retried 3 × 3 requests under `next dev`: 8 × 403, 1 × 500. Both 500s are the same `next dev` manifest read during a rebuild (`Unexpected end of JSON input` in `load-manifest`), not an authorization result; see O-01. Staff never received 200 on a Manager route. Staff/Manager-only operations (G2) refused for Customer (403 on all 4) | `a31-b3-api-*.png`, `a31-b3-accounts-retest.txt`, `a31-b3-dev-rebuild-500.png` |
| 4 | Register, login, logout, lock (TC-AUTH-01..05, 11; KB-07, KB-16, G-06) | UI with Customer and Manager windows | **Pass**. Registration signs in and writes exactly one `LOGIN` (KB-07); duplicate email refused with no log row; empty field blocked; wrong password → `LOGIN_FAILED reason:BAD_PASSWORD` (G-06); logout then `/customer` → `/login`; locking a signed-in customer ends the session on reload (→ `/login`); login while locked refused, `LOGIN_FAILED reason:LOCKED`; lock and unlock each write `ACCOUNT_CHANGE`; login works after unlock | `a31-b4-*.png` |
| 5 | Malformed JSON body (KB-14) | Console script, 8 cases on login, register, lang, vehicles | **Pass**: 8/8 → 400 `VALIDATION` | `a31-b5-malformed.png` |
| 6 | Plate masking (FR-30, Q46; TC-DP-01, 02) | Simulator data + one EX-02 closed by Staff (`90J-390.47` / `90J-390.48`) | **Pass**. Staff: open sessions in full, closed sessions masked (`90J-***.47`), EX-02 note masked (`90J-***.48`). Manager: same session and note in full; payments in full. Customer: own plate in full | `a31-b6-*.png` |
| 7 | Access log for full-plate views (FR-31; TC-DP-04, 05) | Production build: list page, then one detail page | **Pass**: one `VIEW_FULL_PLATE` per detail view (Staff open session, Manager closed session); none for the list page or for Staff on a closed (masked) session. Log also records exit (`EXIT`), purge, account change, login, failed login. Under `next dev` one Staff view produced about 17 rows, see O-01 | `a31-b6h-prod-log.png`, `a31-b6-dev-log-repeat.png` |
| 8 | Purge (FR-32, G-05; TC-DP-06..09) | Production build; history generated for 7 days | **Pass**. Automatic run 60 s after start, user "—", `0 sessions, 0 vehicles` (G-05, FR-006); Manager purge masked 20 sessions, 0 vehicles, logged as Manager 1; payments of 24/10/2025 show `[purged]` with amount, time and zone kept; second purge 0; a parked vehicle still exited | `a31-b7-*.png` |
| 9 | D-02 retest (stale session after DB reset) | Server switched to a fresh DB while Staff kept the old cookie | **Fixed on the A-28 branch**: `/staff/exit` → `/login`; `GET /api/sessions` → 401 | `a31-b8-*.png` |

**T12 (CP-05): Pass.** Only Staff and Manager can operate entry/exit, at page level (check 2) and API level (check 3).

## 3. Observations

| ID | Finding | Severity | Owner / next step |
|---|---|---|---|
| O-01 | Under `next dev`, writes to the SQLite file are followed by unrequested rebuilds (`Compiled in … (773 modules)`). Requests during a rebuild can fail with a manifest read error (500), and an open page re-renders repeatedly: one Staff detail view wrote about 17 `VIEW_FULL_PLATE` rows. Not reproduced on the production build (exactly one row). This is the likely cause of A-68 D-01 | Medium (environment, demo risk) | RES-01: run the acceptance demo (A-88) and acceptance run (A-87) on `npm run build` + `npm run start` |
| O-02 | Logout is written to the access log (`LOGOUT`), while the manual E2E guide TC-DP-04 and D-23 say it is not | Low (doc vs code) | RES-03: align the guide or the code |
| O-03 | Untranslated codes in forms: register "User group" shows `LECTURER_STAFF`; add-vehicle type shows `MOTORBIKE`; Staff entry still shows zone IDs and `MOTORBIKE` (A-68 D-03 persists on the A-28 branch) | Low–Medium (UI) | RES-04 |
| O-04 | TC-AUTH-06/07 in the manual E2E guide expect a redirect to `/`; since G-06 the target is `/denied` with an `ACCESS_DENIED` row | Low (doc) | RES-02 / RES-03: update the guide |

No observation changes an A-31 outcome.

## 4. Verdict

A-31 passes on the A-28 branch (`36b1c91`). T12 of CP-05 passes. A-68 D-02 is fixed by A-28. Re-run after PR #11 merge (24/11, `4f2089f`): `npm run db:reset` + `npm test -- --testTimeout=60000` → 310/310 (38 files).

Effort RES-05: 1.5 h.
