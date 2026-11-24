# A-68 Entry/Exit Module Test (CP-05)

| Field | Value |
|---|---|
| Activity | A-68, test the entry/exit module on the simulator (100-session scenario), T05–T13 (RES-05 with RES-02) |
| Checkpoint | CP-05: T05–T13 pass; 100 simulated sessions have valid records (O2); availability matches an independent count (O1) |
| Tested by | Nguyễn Tuấn Thành (RES-05) |
| Gate decision | Đào Xuân Sơn (RES-02, QA): ___ |
| Date | 2026-11-24 (planned 23/11) |
| Code | `main` at `8472986` |
| Environment | Windows, `next dev`, disposable SQLite DB `a68.db` (`prisma migrate deploy` + seed, reset with `npm run db:reset` before the counted run); Manager in a normal window, Staff and Customer in a private window |
| Check script | `scripts/a68-check.ts` (read only). Counts open sessions per zone and vehicle type straight from `parking_sessions`, independent of the simulator counters and of the availability service; checks every session record; lists session events and `MANUAL_CONFIRM` access-log entries |
| Evidence | `docs/m3/evidence/a68/` |
| Inputs | A-67 (`a-67-integration-check.md`), test plan P15 section 6.1, A-43 scenario catalogue |

## 1. Results by criterion

| Code | Criterion | What was done | Result | Evidence |
|---|---|---|---|---|
| T05 / O1 | Availability = capacity − open sessions after every event | One clean run of ≥ 100 sessions (seed 68), then independent DB count. Re-counted after all manual steps | **Pass**. After the run: open A 7, B 12, C 12 = 31 = 100 − 69; expected free 143 / 138 / 18 = UI. After step 6: open 8 / 12 / 11, expected free 142 / 138 / 19 = UI | `b1-check.txt`, `b1-ui-availability.png`, `b6-check.txt`, `b6-ui-availability.png` |
| T06 | Entry refused when the zone is full (EX-01) | Covered by A-67 SC-02 in the UI and by automated tests | **Pass** (A-67) | `a-67-integration-check.md` |
| T07 | Plate mismatch warns and needs manual confirmation (EX-02) | Staff exit for `66F-403.45` observed as `66F-403.46`: warning shown; confirm button disabled until "Confirm manually" is ticked; closed after ticking. Second EX-02 session (`22U-829.38` / `22U-829.39`): `POST /api/events/exit/confirm` with `confirmMismatch:false` returned **409 `PLATE_MISMATCH`** (server-side guard); then closed through the UI | **Pass**. Both sessions CLOSED, fee 2,000 ₫, event `PLATE_MISMATCH_CONFIRMED` with the observed plate in the note, access-log `MANUAL_CONFIRM` | `b2-warning.png`, `b2-closed.png`, `b2-api-rejected.png`, `b6-check.txt` |
| T08 | Lost QR/card: look up by plate, confirm manually (EX-03) | Staff exit for `29A-01001` (motorbike, Student) with "Lost card", method PLATE | **Pass**. Fee 2,000 ₫ = tariff for motorbike/Student, no penalty; event `LOST_CARD`; access-log `MANUAL_CONFIRM` | `b3-preview.png`, `b3-lost-card.png`, `b3-tariffs.png`, `b6-check.txt` |
| T09 | No second open session for the same vehicle (EX-04) | Covered by A-67 SC-05 in the UI and by automated tests | **Pass** (A-67) | `a-67-integration-check.md` |
| T10 | Entry refused while the lot is suspended, exit still allowed (EX-05) | Suspended the lot; Staff entry `99Z-999.99` refused ("lot suspended"); Staff exit of open session `15Q-688.38` succeeded; lot reactivated | **Pass** | `b4-entry-rejected.png`, `b4-exit-suspended.png`, `b4-reactivated.png` |
| T11 / O2 | Every session stores a complete record | Script checks plate, zone, vehicle type, fee group, method, entry time, entry staff, status; for CLOSED also exit time ≥ entry time, exit staff, payment | **Pass**. `incomplete: 0` on 100 sessions after the run and on 104 sessions at the end. Session detail screen shows plate, zone, type, fee group, entry time, status (see D-05 for method) | `b1-check.txt`, `b6-check.txt`, `b5-session-detail.png` |
| T12 | Only Staff and Manager can operate | Tested in A-31 on 24/11: page access by role and API matrix (3 roles × 5 function groups); Customer refused (403) on all entry/exit routes, logged-out requests 401 | **Pass** ([A-31](a-31-auth-test.md) checks 2–3) | `evidence/a31/a31-b2-*.png`, `a31-b3-api-*.png` |
| T13 | Entry in ≤ 3 inputs and ≤ 2 s | QR entry for `29A-01001`: 3 inputs (method, code, zone; vehicle type comes from the vehicle). HTTP times: `events/entry` 1.47 s, `exit/preview` 1.08 s, `exit/confirm` 1.17 s | **Pass**. Per-operation time inside the 100-session simulator run was not measured in the UI (the whole run took about 1 minute on `next dev`); service-level evidence is the automated FR-16 test (max per call < 2 s over `simulateLive(100)`, 209/209 on 23/11) | `b5-entry.png`, Network screenshots |

**100-session run (SC-07):** one `POST /api/simulator` returned `{"entries":100,"exits":69,"rejected":0,"sessions":100,"seed":68}`.

**Summary:** T05–T13 pass (T12 via A-31). O1 and O2 hold for the 100-session run and after the manual exception steps.

## 2. Defects and observations

| ID | Finding | Severity | Owner / next step |
|---|---|---|---|
| D-01 | During the first 100-session run the page reloaded itself (RSC request `simulator?_rsc=…` returned 500) and the run button was enabled again, so a second run was sent while the first was still running. The two runs competed for the same sessions and vehicles: 21 rejected, 200 sessions in the DB. Records stayed complete (`incomplete: 0` on 200). Run discarded; DB reset and the counted run repeated with a single click | Medium (demo risk) | RES-05 to raise with RES-01. A-31 O-01 found the likely cause: under `next dev`, DB writes trigger rebuilds that re-render the page; not seen on the production build. Run A-87/A-88 on `npm run build` + `npm run start`, and click once |
| D-02 | A session cookie that outlived `npm run db:reset` points to a deleted user. Middleware accepts the JWT, then `requireRole` throws `UNAUTHENTICATED` and `/staff/exit` shows a 500 instead of redirecting to `/login` (`src/app/staff/exit/page.tsx:6`) | Low | Fixed by A-28 (`fix/res03-a28-a65` @ `36b1c91`): retest in A-31 check 9 redirects to `/login`, API 401. Closes when PR #11 is merged |
| D-03 | Staff entry form: "Zone" lists internal IDs (e.g. `cmwu0ta1w0002ujkw24gjksgv` for zone A) instead of zone names; "Vehicle type" shows `MOTORBIKE` instead of the localised label | Medium (usability, T13) | RES-04 (UI) |
| D-04 | Staff exit preview: the field labelled "Observed plate" shows the plate recorded at entry (`66F-403.45` when `66F-403.46` was typed) | Low | RES-04 (UI) |
| D-05 | Session detail screen does not show the identification method (TC-ENT-05 expects it). The value is stored (`idMethod`, checked by the script) | Low | RES-04 (UI) |
| D-06 | From A-67: `live events use QR and RFID as well as PLATE` times out at the default 5 s on slower machines | Low | RES-01 (test timeout) |

None of D-01..D-06 changes a T05–T13 outcome.

## 3. Verdict

A-68 executed on 24/11 (planned 23/11, one day late). Proposed CP-05 outcome: **pass** (T12 passed in A-31 on 24/11). RES-02 records the gate decision. The A-67 rows that were pending on A-68 are updated in `a-67-integration-check.md`.

Effort RES-05: 1 h.
