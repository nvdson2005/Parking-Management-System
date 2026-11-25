# A-68 Entry/Exit Module Test (CP-05)

| Field | Value |
|---|---|
| Activity | A-68, test the entry/exit module on the simulator (100-session scenario), T05–T13 (RES-05 with RES-02) |
| Checkpoint | CP-05: T05–T13 pass; 100 simulated sessions have valid records (O2); availability matches an independent count (O1) |
| Tested by | Nguyễn Tuấn Thành (RES-05) |
| Gate decision | Đào Xuân Sơn (RES-02, QA), 2026-11-24: **Pass with conditions**. T05–T13 all pass (T12 passed in A-31). Valid once each condition C1–C6 has an ISS-xx with owner, due date and PM approval (P20 v1.2, QC-15); see section 3 |
| Date | 2026-11-24 (planned 23/11) |
| Code | `main` at `8472986` |
| Environment | Windows, `next dev`, disposable SQLite DB `a68.db` (`prisma migrate deploy` + seed, reset with `npm run db:reset` before the counted run); Manager in a normal window, Staff and Customer in a private window |
| Check script | `scripts/a68-check.ts` (read only). Counts open sessions per zone and vehicle type straight from `parking_sessions`, independent of the simulator counters and of the availability service; checks every session record; lists session events and `MANUAL_CONFIRM` access-log entries |
| Evidence | `docs/m3/evidence/a68/` |
| Inputs | A-67 (`a-67-integration-check.md`), test plan P15 section 6.1, A-43 scenario catalogue |

## 1. Results by criterion

| Code | Criterion | What was done | Result | Evidence |
|---|---|---|---|---|
| T05 / O1 | Availability = capacity − open sessions after every event | One clean run of ≥ 100 sessions (seed 68), then independent DB count. Re-counted after all manual steps. Pending reservations were 0 in both snapshots, so this run exercises the open-session term; the reservation term and near-simultaneous entries are covered by automated tests (P20 v0.1 section 6.1: `availability.test.ts`, `entry.test.ts` "20 concurrent entries…"). The hand-count photo that CP-05 asks for (O1) is not in this PR (C1) | **Pass**. After the run: open A 7, B 12, C 12 = 31 = 100 − 69; expected free 143 / 138 / 18 = UI. After step 6: open 8 / 12 / 11, expected free 142 / 138 / 19 = UI | `b1-check.txt`, `b1-ui-availability.png`, `b6-check.txt`, `b6-ui-availability.png` |
| T06 | Entry refused when the zone is full (EX-01) | Covered by A-67 SC-02 in the UI and by automated tests | **Pass** (A-67) | `a-67-integration-check.md` |
| T07 | Plate mismatch warns and needs manual confirmation (EX-02) | Staff exit for `66F-403.45` observed as `66F-403.46`: warning shown; confirm button disabled until "Confirm manually" is ticked; closed after ticking. Second EX-02 session (`22U-829.38` / `22U-829.39`): `POST /api/events/exit/confirm` with `confirmMismatch:false` returned **409 `PLATE_MISMATCH`** (server-side guard); then closed through the UI | **Pass**. Both sessions CLOSED, fee 2,000 ₫, event `PLATE_MISMATCH_CONFIRMED` with the observed plate in the note, access-log `MANUAL_CONFIRM` | `b2-warning.png`, `b2-closed.png`, `b2-api-rejected.png`, `b6-check.txt` |
| T08 | Lost QR/card: look up by plate, confirm manually (EX-03) | Staff exit for `29A-01001` (motorbike, Student) with "Lost card", method PLATE | **Pass**. Fee 2,000 ₫ = tariff for motorbike/Student, no penalty; event `LOST_CARD`; access-log `MANUAL_CONFIRM` | `b3-preview.png`, `b3-lost-card.png`, `b3-tariffs.png`, `b6-check.txt` |
| T09 | No second open session for the same vehicle (EX-04) | Covered by A-67 SC-05 in the UI and by automated tests | **Pass** (A-67) | `a-67-integration-check.md` |
| T10 | Entry refused while the lot is suspended, exit still allowed (EX-05) | Suspended the lot; Staff entry `99Z-999.99` refused ("lot suspended"); Staff exit of open session `15Q-688.38` succeeded; lot reactivated | **Pass** | `b4-entry-rejected.png`, `b4-exit-suspended.png`, `b4-reactivated.png` |
| T11 / O2 | Every session stores a complete record | Script checks plate, zone, vehicle type, fee group, method, entry time, entry staff, status; for CLOSED also exit time ≥ entry time, exit staff, payment | **Pass**. `incomplete: 0` on 100 sessions after the run and on 104 sessions at the end. Session detail screen shows plate, zone, type, fee group, entry time, status (see D-05 for method and entry staff). Session count: 104 = 100 + `66F-403.45` and `22U-829.38` (EX-02 setups) + `29A-01001` (T08) + `29A-01001` (T13 QR entry, still open); closed 73 = 69 + 4, open 31 | `b1-check.txt`, `b6-check.txt`, `b5-session-detail.png` |
| T12 | Only Staff and Manager can operate | Tested in A-31 on 24/11: page access by role and API matrix (3 roles × 5 function groups); Customer refused (403) on all entry/exit routes, logged-out requests 401 | **Pass** ([A-31](a-31-auth-test.md) checks 2–3) | `evidence/a31/a31-b2-*.png`, `a31-b3-api-*.png` |
| T13 | Entry in ≤ 3 inputs and ≤ 2 s (PD-P05; NFR-04 in P20 v1.2: ≤ 3 s) | QR entry for `29A-01001`: 3 inputs (method, code, zone; vehicle type comes from the vehicle); under the A-82 definition (clicks after entering the plate or code) it is 1 click, zone preselected. HTTP times: `events/entry` 1.47 s, `exit/preview` 1.08 s, `exit/confirm` 1.17 s | **Pass**. Per-operation time inside the 100-session simulator run was not measured in the UI (the whole run took about 1 minute on `next dev`); service-level evidence is the automated FR-16 test (max per call < 2 s over `simulateLive(100)`, 209/209 on 23/11) | `b5-entry.png` (3 inputs). The three timings were read in DevTools; Network screenshots are not in `evidence/a68/` (condition C3) |

**100-session run (SC-07):** one `POST /api/simulator` returned `{"entries":100,"exits":69,"rejected":0,"sessions":100,"seed":68}`.

**Summary:** T05–T13 pass (T12 via A-31). O1 and O2 hold for the 100-session run and after the manual exception steps.

## 2. Defects and observations

| ID | Finding | Severity (P20 v1.2, section 4) | Owner / next step |
|---|---|---|---|
| D-01 | During the first 100-session run the page reloaded itself (RSC request `simulator?_rsc=…` returned 500) and the run button was enabled again, so a second run was sent while the first was still running. The two runs competed for the same sessions and vehicles: 21 rejected, 200 sessions in the DB. Records stayed complete (`incomplete: 0` on 200). Run discarded; DB reset and the counted run repeated with a single click | S2 (was Medium, confirmed) | RES-05 to raise with RES-01. A-31 O-01 found the likely cause (`next dev` rebuilds on DB writes; not seen on the production build). For A-87/A-88 use `npm run build` + `npm run start` and click once, or disable the button server-side while a run is active |
| D-02 | A session cookie that outlived `npm run db:reset` points to a deleted user. Middleware accepts the JWT, then `requireRole` throws `UNAUTHENTICATED` and `/staff/exit` shows a 500 instead of redirecting to `/login` (`src/app/staff/exit/page.tsx:6`) | S2 (was Low, **raised** on 24/11: a Must auth flow answers a stale session with a 500; workaround is to open `/login`; a rehearsal cookie plus `db:reset` hits it at the demo) | **Closed 24/11**: fixed by A-28 (`36b1c91`), retest in [A-31](a-31-auth-test.md) check 9 (`/login`, API 401); PR #11 merged (`755caf6`); `npm test` 310/310 on `4f2089f` |
| D-03 | Staff entry form: "Zone" lists internal IDs (e.g. `cmwu0ta1w0002ujkw24gjksgv` for zone A) instead of zone names; "Vehicle type" shows `MOTORBIKE` instead of the localised label | S2 (was Medium, confirmed: AT-01 and AT-02 name zones, the dropdown shows IDs) | RES-04 (UI); fix before CP-07 |
| D-04 | Staff exit preview: the field labelled "Observed plate" shows the plate recorded at entry (`66F-403.45` when `66F-403.46` was typed) | S2 (was Low, **raised** on 24/11) | RES-04 (UI); fix before CP-07. AT-EX02 expects both plates shown. Warning, confirm and logging work, so not S1 |
| D-05 | Session detail screen does not show the identification method (TC-ENT-05 expects it). Entry staff is not shown either. Both values are stored (`idMethod`, `entryStaffId`, checked by the script) | S3 (was Low, confirmed) | RES-04 (UI) |
| D-06 | From A-67: `live events use QR and RFID as well as PLATE` times out at the default 5 s on slower machines. Same cause as the A-96 open defect (7 simulator tests time out at 5 s, QE-A96) | S3 (was Low, confirmed; A-96 proposed Nhỏ) | RES-01 (test timeout) |

None of D-01..D-06 changes a T05–T13 outcome. No S1 known; D-01 needs the check in C5. D-01, D-03 and D-04 are S2 on Must flows and must be fixed before CP-07; D-02 is closed. D-05 and D-06 are S3, which the PM may accept open in P14 (P20 v1.2, DoD-I). DEF-xx IDs are to be allocated in the defect log.

## 3. Verdict

A-68 executed on 24/11 (planned 23/11, one day late). The A-67 rows that were pending on A-68 are updated in `a-67-integration-check.md`.

**Gate decision (RES-02, 2026-11-24): Pass with conditions.** Against the CP-05 row of P20 v1.2 (section 7.1):

| CP-05 criterion | Status |
|---|---|
| T05–T13 pass | Met (T12 in A-31) |
| 100 simulated sessions have valid records (O2) | Met: `incomplete: 0` on 100 and on 104 sessions |
| Availability matches the hand count (O1) | Partly: the independent DB count equals the UI in two snapshots; no hand-count photo (C1) |
| T13 ≤ 3 s (NFR-04) | Met: 1.47 / 1.08 / 1.17 s; Network screenshots missing (C3) |
| Automated suite not above the A-96 baseline of 9 failing tests | Met: 181/181 on 19/11, 209/209 on 23/11, 310/310 on 24/11 after PR #11 |
| Evidence: QE rows T05–T13, hand-count photo, demo video (Q23) | Rows prepared; photo and video missing (C1, C2) |

No criterion failed, and no S1 defect is known. A conditional pass needs an ISS-xx per condition with owner, due date and PM approval (P20 v1.2 section 2.3 and QC-15). Until RES-02 allocates the ISS-xx and RES-01 (PM) approves them, the gate stays open.

| ID | Condition | Owner | Due (proposed) | ISS-xx |
|---|---|---|---|---|
| C1 | Hand-count photo (O1): count open sessions per zone and vehicle type by hand in the open-sessions list; photograph the count next to the system availability | RES-05; RES-02 verifies | 26/11, before A-87 | ISS-06 |
| C2 | Demo video for CP-05 sent to the client by email (Q23); record date and recipient | RES-01 sends (to confirm); RES-02 records; RES-05 records the video | 26/11, before A-87 | ISS-07 |
| C3 | Add DevTools Network screenshots (or re-measure) for `events/entry`, `exit/preview`, `exit/confirm` to `evidence/a68/` | RES-05 | 26/11, before A-87 | ISS-08 |
| C4 | QE rows carry the tested commit and an independent verifier (P20 v1.2 section 5: no commit, not counted). A-68 rows use `8472986`. T06 and T09 (A-67, code `5182b97`, re-run 23/11) and T12 (A-31, `36b1c91`) need their commit hash on the rows | RES-05 | 26/11, before A-87 | ISS-09 (done 25/11, see 3.2) |
| C5 | Re-run D-01 on a scratch DB (two clicks on the 100-session run) and run `a68-check`. If expected free differs from the UI, D-01 is S1 and CP-05 becomes Không đạt | RES-05 | 26/11, before A-87 | ISS-10 |
| C6 | Fix and retest D-01, D-03, D-04 (S2; D-02 closed 24/11). The PM may accept D-05 and D-06 (S3) open in P14 | D-01 RES-05 with RES-01; D-03, D-04 RES-04 | CP-07 (27/11) | ISS-11 |

CP-05 is approved by RES-02. RES-01 (owner of P05) is informed, not an approver (P20 v1.2 section 7.2).

ISS-06..ISS-11 are proposed by RES-05 on 25/11 (next free numbers after ISS-05 on `main`), pending allocation by RES-02 and approval by RES-01 (PM). The gate stays open until both are recorded here:

| Allocation (RES-02) | PM approval (RES-01) |
|---|---|
| ___ | ___ |

### 3.1 Issue log rows (paste-ready for RES-03 on 28/11)

Shared files are not edited directly (`m3-m4-final-work-division.md` rule 2). RES-03 pastes these rows into the Issue Log.

| ISS | Description | Owner | Due | Status | Link |
|---|---|---|---|---|---|
| ISS-06 | CP-05 C1: hand-count photo of open sessions per zone and vehicle type next to the system availability (O1) | RES-05; RES-02 verifies | 26/11 | Open | PR #18, `a-68-cp05-test.md` section 3 |
| ISS-07 | CP-05 C2: CP-05 demo video sent to the client by email (Q23); date and recipient recorded | RES-01 sends; RES-05 records the video; RES-02 records | 26/11 | Open | PR #18 |
| ISS-08 | CP-05 C3: DevTools Network screenshots for `events/entry`, `exit/preview`, `exit/confirm` in `evidence/a68/` | RES-05 | 26/11 | Open | PR #18 |
| ISS-09 | CP-05 C4: tested commit and independent verifier on every T05–T13 QE row | RES-05 | 26/11 | Done 25/11, verifier sign-off pending | `a-68-cp05-test.md` 3.2 |
| ISS-10 | CP-05 C5: re-run D-01 on a scratch DB with two clicks, check with `a68-check`; mismatch makes D-01 S1 and CP-05 fail | RES-05 | 26/11 | Open | PR #18 |
| ISS-11 | CP-05 C6: fix and retest D-01 (RES-05 with RES-01), D-03 and D-04 (RES-04) before CP-07 | RES-05, RES-04 | 27/11 | Open | PR #18; fix PRs to follow |

### 3.2 Quality Evidence rows with commit and verifier (C4, paste-ready)

A row counts only with its tested commit and an independent verifier (P20 v1.2 section 5). The verifier is someone other than the tester who checked the evidence or repeated the test.

| QE row | Test | Tested commit | Tester, date | Independent verifier | Evidence |
|---|---|---|---|---|---|
| T05 / O1 | Availability = capacity − open sessions | `8472986` | RES-05, 24/11 | RES-02 (to sign); hand count: ISS-06 | `evidence/a68/b1-*`, `b6-*` |
| T06 | Zone full refused (EX-01) | `5182b97` (HTTP), `4c8fde2` (UI) | RES-01 HTTP 20/11; RES-05 UI 23/11 | RES-01 and RES-05 tested independently of each other | `a-67-integration-check.md`, `evidence/a67/` |
| T07 | Plate mismatch (EX-02) | `8472986` | RES-05, 24/11 | RES-02 (to sign) | `evidence/a68/b2-*` |
| T08 | Lost card (EX-03) | `8472986` | RES-05, 24/11 | RES-02 (to sign) | `evidence/a68/b3-*` |
| T09 | Duplicate entry refused (EX-04) | `5182b97` (HTTP), `4c8fde2` (UI) | RES-01 HTTP 20/11; RES-05 UI 23/11 | RES-01 and RES-05 tested independently of each other | `a-67-integration-check.md`, `evidence/a67/` |
| T10 | Lot suspended: entry refused, exit allowed (EX-05) | `8472986` | RES-05, 24/11 | RES-02 (to sign) | `evidence/a68/b4-*` |
| T11 / O2 | Complete records | `8472986` | RES-05, 24/11 | RES-02 (to sign) | `evidence/a68/b1-check.txt`, `b6-check.txt` |
| T12 | Only Staff and Manager operate | `36b1c91` (A-28 branch); suite re-run on `4f2089f` after PR #11 | RES-05, 24/11 | RES-02 (to sign) | `a-31-auth-test.md`, `evidence/a31/` |
| T13 | ≤ 3 inputs, ≤ 3 s | `8472986` | RES-05, 24/11 | RES-02 (to sign); screenshots: ISS-08 | `evidence/a68/b5-entry.png` |

Effort RES-05: 1 h.
