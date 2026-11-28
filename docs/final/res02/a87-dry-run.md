# A-87 internal dry run (merged with A-95, CP-07)

| Field | Value |
|---|---|
| Owner | RES-02, Đào Xuân Sơn |
| Date | 26/11/2026 (AT-01..AT-07, AT-100); 27/11/2026 (AT-EX01..AT-EX05) |
| Candidate SHA (pinned) | `ac57507c9c2924d54ed35e3dac31e327deac4573` (`origin/main`, merge of PR #24, committed 26/11/2026 01:04 +0700) |
| Build used for AT-EX (27/11) | Separate D-04 build. Screenshot `AX02-02` shows both labels. The exact checkout SHA was not captured in the available evidence. D-04 merged to main in PR #38 at `4002f37`. |
| Status | **PASS WITH CONDITIONS.** 13 of 13 acceptance scenarios run (AT-01..AT-07 and AT-100 on `ac57507c`; AT-EX01..AT-EX05 on the 27/11 build). 9 evidence gaps in section 5 (items 1 to 6 for AT-01..AT-100, items 7 to 9 for AT-EX). Screenshots attached (`A87/`, 44 files); AT-100 numbers recorded. Open conditions A to C in section 5 |
| Report reference | M3 §3.5, M4 §4.1 |

If `origin/main` moves before the demo, either stay on this SHA for the whole run or re-pin and rerun. Do not mix results from two SHAs.

The AT-EX results below come from a different build (27/11, with the D-04 fix). They are reported separately and are not merged into the `ac57507c` results. Condition A in section 5 says what closes this.

## 1. Build and automated checks on the pinned SHA

| Check | Command | Result | Notes |
|---|---|---|---|
| Install | `npm ci` | OK (dependencies installed) | |
| Lint | `npm run lint` | **Pass**, no findings | Run 26/11 on the pinned SHA |
| Unit and API tests | `npm test` | **Pass: 49 files, 382 tests, 0 failed** (191 s) | Run by RES-02 on Windows, 26/11, 12:29. `tests/simulator.test.ts` 18/18 pass in 52.7 s with the largest tests at 5 to 13 s, so the former 5 s timeout failures no longer occur on this checkout. `git rev-parse HEAD` on the same checkout is `ac57507c` |
| Build | `npm run build` | **Pass**: Next.js 15.5.29, compiled in 36.5 s, types and lint valid, 50/50 pages | The route table lists the API routes and the customer, staff and manager pages |

The checks above ran on `ac57507c`. No automated test result was captured for the historical 27/11 AT-EX checkout.

On 28/11/2026, a fresh worktree pinned to `d9c663805deac7a85fa964d2d3e520427ced7059` (PR #35 with the D-04 fix integrated) passed `npm test` (396/396 in 52 files), `npm run lint`, and `npm run build`. RES-01 confirmed the AT-01/AT-02 smoke checks and the AT-EX02 UI check for CP-07 condition A on 28/11/2026.

## 2. Environment for the acceptance run

```bash
git fetch && git checkout ac57507c9c2924d54ed35e3dac31e327deac4573
npm ci
cp .env.example .env            # set AUTH_SECRET to 32+ random characters
npx prisma migrate reset --force   # clean seeded DB, no hand edits afterwards
npm run build && npm start      # http://localhost:3000
```

Accounts are seeded with password `password123` (Customer `customer01..15`, plus Staff and Manager; see `prisma/seed.ts`). Do not edit the database by hand during the run (PD-P21 criterion 5). Keep the terminal log.

Manual run: screenshots were taken between 13:24 and 14:07 on 26/11/2026, from `localhost:3000` and `192.168.2.8:3000` (same server, LAN address).

AT-EX run: screenshots taken on 27/11/2026 between about 13:08 and 13:27 (first payment in `AX03-02` at 13:08:08, last screenshot `AX01-01` at 13:26:59), on the build with the D-04 fix. The payments list in `AX03-02` holds only three payments, so the DB was fresh or reset on 27/11 before this run (RES-02 to confirm).

Automated HTTP rehearsal (needs a fresh seed, own port):

```bash
DATABASE_URL=file:./e2e.db npx prisma migrate deploy
DATABASE_URL=file:./e2e.db npx tsx prisma/seed.ts
DATABASE_URL=file:./e2e.db AUTH_SECRET=<32+ chars> npx next start -p 3100
BASE_URL=http://localhost:3100 node e2e/round3.e2e.mjs
```

Result: **25/25 checks PASS, "All e2e checks passed"** (RES-02, 26/11, Windows PowerShell, fresh `e2e.db` with 9 migrations applied, server on port 3100, `git rev-parse HEAD` = `ac57507c9c2924d54ed35e3dac31e327deac4573`). Same count as RES-01's 21/11 rehearsal on `a55f6a8`. Covered: second vehicle, one-reservation limit (409 RESERVATION_LIMIT), early arrival with and without confirmation (409 EARLY_ARRIVAL, then admitted and FULFILLED), lot suspension (reservations cancelled with LOT_SUSPENDED, notifications without plates, new reservation and entry refused with 409, a vehicle already inside can still exit), and the report keeping the 24-hour series with per-zone/type slices.

## 3. Acceptance scenarios

Steps follow `docs/final/res05/demo-script-and-viva.md` and `docs/manual-e2e-test-guide.md`. The detailed AT definitions are in P21 (PD-P21 in `docs/m2-report/report.src.md`). Screenshot files are in the `A87/` folder; the number in the name is `A<AT>-<step>`; AT-EX files are named `AX<n>-<step>`.

| ID | Scenario | Objective | Result | Evidence (log, screenshot, file) | Defect ref |
|---|---|---|---|---|---|
| AT-01 | Motorbike entry/exit and availability (plate and QR) | O1 | **Pass, evidence gap 1** (RES-02, 26/11) | Plate path: `A01-01` lot shows A 150/150 before; `A01-02` entry form, plate 29A-01001, zone A, motorbike; `A01-03` A drops to 149 (13:28:08); `A01-04` open session 29A-01001 zone A; `A01-06` A back to 150 after exit (13:30:15); `A01-07` payment 2.000 đ confirmed by Staff 1. QR path: no screenshot (see gap 1) | none |
| AT-02 | Car entry/exit (zone C) | O1 | **Pass, evidence gap 6** (RES-02, 26/11) | `A02-01` entry form, plate 30K-123.45, zone C, car; `A02-02` zone C 29 free / 1 used (13:32:46); `A02-04` zone C back to 30 / 0 (13:34:22); `A02-05` payment 10.000 đ, zone C, 13:34:22. Exit screen not captured (`A02-03` is not in the zip) | none |
| AT-03 | Manager lot and tariff management (suspend/reactivate) | O5 | **Pass, evidence gap 2** (RES-02, 26/11) | `A03-01`/`A03-02` Lot 2 created with zone D (motorbike 10, car 0); `A03-03` staff page shows lot 1 "Tạm ngưng" (suspended) and Lot 2 zone D 10/10 (13:37:41); `A03-04` entry of 29A-01001 refused with "Bãi xe đang tạm ngưng hoạt động"; `A03-05` exit fee preview, fee group Khách, car, 15.000 đ. Reactivation is shown indirectly: `A05-05` shows a successful entry at 13:44:36, after the lot was suspended at 13:37 (`A03-03`), so the lot was active again. No screenshot of the reactivation itself or of the tariff edit (see gap 2). `A03-05` shows the D-04 label problem (see section 4) | D-04 |
| AT-04 | RBAC, plate masking, access log, 12-month purge | O5 | **Pass, evidence gap 3** (RES-02, 26/11) | `A04-01` Customer 02 opening `/staff` lands on `/denied`, message says the attempt is logged; `A04-02` access log row "Customer 02, Access denied, page:/staff" 13:57:53; `A04-03` staff open-sessions list; `A04-04` log row "Staff 1, View full plate" 13:59:32; `A04-05` purge result "Masked 20 sessions and deleted 0 vehicles", log row "Manager 1, Purge, 20 sessions, 0 vehicles" 14:00:41. Staff see full plates on open sessions by design (Q46, FR-42); masking applies to closed sessions, not yet captured (see gap 3) | none |
| AT-05 | Reservation, early arrival, cancel and no-show | O3 | **Pass, evidence gap 4** (RES-02, 26/11) | `A05-01` reservation for 29A-01001, 15:45, status Đang chờ, hold until 16:15; `A05-02` zone A shows 149 free / 1 used while reserved (13:42:09); `A05-03` second reservation refused, "Xe đã được đặt chỗ" (one-reservation limit); `A05-04` early-arrival warning with confirm button; `A05-05` zone A 149 / 1 (13:44:36) after admission; `A05-06` reservation status Đã nhận (fulfilled) and another reservation cancelled by the system because the vehicle parked in zone B. No-show wait not shown (see gap 4) | none |
| AT-06 | Fee calculation and simulated payment | O4 | **Pass** (RES-02, 26/11) | `A01-07` motorbike 2.000 đ; `A02-05` car 10.000 đ; `A06-01` payments list 29A-01001 2.000 đ, 29A-02001 2.000 đ, 30K-123.42 10.000 đ (13:51); `A06-02` customer parking history for 29A-02001: in 13:50:18, out and paid 13:51:23, 2.000 đ. Fee table seen in `A01-01` (student: motorbike 2.000 đ, car 10.000 đ per turn). The car in AT-02 is fee group Khách (`A03-05`) and the seed gives every group the same price, so by hand this shows the per-visit fee and the effect of the tariff edit, not group pricing (automated test: 4 of 6 combinations on `main`; see `quality-evidence-modules.md` §3). `A06-01` shows only the payments of 13:51 and plate `30K-123.42`, a different vehicle from `30K-123.45` (RES-02, 27/11): **[RES-02 to fill: cropped or DB reset between scenarios]** | none |
| AT-07 | Reports: four indicators | O3 | **Pass, evidence gap 5** (RES-02, 26/11) | `A07-01` historical data generated: 7 days, 440 sessions, 55 reservations, 440 payments; `A07-02` report page: hourly occupancy chart, top entry hours (20:00 with 35 entries, 06:00 with 34), revenue total 2.021.000 đ with daily bars, no-show rate 53,7%. The screenshot is cropped; the fourth indicator is not in view (see gap 5) | none |
| AT-100 | 100-session volume scenario | O2 | **Pass, evidence gap 6** (RES-02, 26/11) | `A100-01` simulator, 100 events with "at least N sessions" ticked, seed 68: "100 sessions: 100 entries, 69 exits, 0 rejected"; `A100-02` manager home at 14:07:32. Numbers below | none |

### AT-100 record

| Item | Value |
|---|---|
| Simulator parameters | Number of events 100, "At least N sessions" ticked, seed 68 |
| Sessions with a valid record | 100 of 100 (100 entries, 0 rejected) |
| Exits | 69 |
| Expected vehicles still inside (entries minus exits) | 100 − 69 = 31 |
| Used per zone after the run | A 7, B 12, C 12 = 31 (matches) |
| Free per zone after the run | A 143 of 150, B 138 of 150, C 18 of 30 = 299 free of 330 capacity (matches 330 − 31) |
| Run time | not recorded in the screenshots (see gap 6) |

The availability check is arithmetic (entries minus exits against the used column), not a count of vehicles in the open-sessions list. If a hand count of the staff open-sessions list is wanted, it should total 31 for zones A to C. The earlier simulator run at 13:54 (`A04-03`, `A04-02`) and the 14:00 purge happened before this run, so state the DB state before AT-100 in the report (reset, or not) because 31 = 100 − 69 only holds if no sessions from the 13:54 run were still open in A to C.

**DB state before AT-100:** **[RES-02 to fill from memory: reset / not reset]**. `A100-02` shows a single lot with the fresh seed-68 values and no Lot 2 from AT-03, which suggests a reset before the run (RES-04's review). Do not cite that as fact until RES-02 confirms.

`scripts/a49-at100-latency.mjs` produced the 24/11 timing in `docs/m3/evidence/a49-at100-2026-11-24T05-20-01-689Z.json`; cite it only as earlier evidence, not as this run. Note that 120 events and 100 sessions are different measures (see `docs/m3/A-43-simulator-review.md`): `A07-01` shows the default 120 events, `A100-01` the 100-session run.

### AT-EX01..AT-EX05 (run on 27/11/2026, build with the D-04 fix)

Run by RES-02. These are the five exception scenarios of P21 (objective O4, requirements FR-46..FR-50). The build is not `ac57507c` (see the header and condition A in section 5).

| ID | Scenario | Objective | Result | Evidence (log, screenshot, file) | Defect ref |
|---|---|---|---|---|---|
| AT-EX01 | Zone full: entry refused, availability 0 and never negative | O4 | **Pass, evidence gap 9** (RES-02, 27/11) | `AX01-01` Staff home 13:26:59: zone C car 0 free / 30 used / 30 capacity with badge "Hết chỗ", zones A and B 150 free; `AX01-02` entry form, plate 30K-123.45, zone C, car, toast "Khu vực đã hết chỗ" (ZONE_FULL). How zone C was filled is not shown (see gap 9) | none |
| AT-EX02 | Plate mismatch: warning, manual confirmation, close | O4 | **Pass** (RES-02, 27/11) | `AX02-01` entry form 66F-403.45, zone A, motorbike; `AX02-02` exit preview (entry 13:15:46): "Biển số lúc vào" 66F-403.45 and "Biển số quan sát" 66F-403.46 in red, fee group Khách, 2.000 đ, mismatch warning, "Xác nhận thủ công" unticked and the confirm button greyed out; `AX02-03` access log row 13:17:01, Staff 1, "Xác nhận thủ công"; `AX03-02` payments list: 66F-403.45, zone A, 2.000 đ, 13:17:01, Staff 1 (session closed). `AX02-02` is also the D-04 check: both labels are present | D-04 (fixed, see section 4) |
| AT-EX03 | Lost card: exit by plate, normal fee | O4 | **Pass, evidence gap 8** (RES-02, 27/11) | `AX03-01` exit preview with "Mất thẻ" ticked: 29A-01001 under both plate labels, zone A, motorbike, fee group Sinh viên, entry 13:12:30, 2.000 đ (no surcharge); `AX03-02` payment 29A-01001, 2.000 đ, 13:19:11, Staff 1. The LOST_CARD event and the MANUAL_CONFIRM log row are not captured | none |
| AT-EX04 | Duplicate entry refused | O4 | **Pass** (RES-02, 27/11) | `AX04-01` entry of 29A-01001, zone A, motorbike, toast "Đã có phiên đỗ xe đang mở"; `AX04-02` open-sessions list with one row for 29A-01001 (entry 13:12:30, the same session as `AX03-01`) | none |
| AT-EX05 | Lot suspended: entry refused, exit allowed, reactivation | O4 | **Pass, evidence gap 7** (RES-02, 27/11) | `AX05-01` Staff home (English) 13:22:41: lot "Suspended", all zones 0 used; `AX05-02` entry of 29A-01001, zone A, refused with toast "Bãi xe đang tạm ngưng hoạt động"; `AX05-03` exit form with toast "Đã ghi nhận xe ra và thu phí". Reactivation is not captured (see gap 7) | none |

Notes:

- The order of events in AT-EX05 is not visible in the screenshots: `AX05-03` does not show which plate left or that the lot was still suspended, and `AX05-01` already shows 0 sessions in use. State the order in the AT-EX05 notes (entry, suspend, exit while suspended, reactivate).
- `AX01-02` (13:26:59) is refused for ZONE_FULL, not for suspension, which is consistent with the lot being active again after AT-EX05 (13:22). It does not replace a screenshot of the reactivation.
- `A03-05` (26/11, `ac57507c`) shows the old label and `AX02-02` (27/11) shows the fixed preview, so the two screenshots together document D-04 before and after the fix.

## 4. Defects found

| ID | Description | Severity | Steps to reproduce | Owner | Status |
|---|---|---|---|---|---|
| D-04 | Staff exit preview showed the plate recorded at entry under the label "Biển số quan sát" and never the plate Staff typed. Known from A-68 (`docs/m3/a-68-cp05-test.md`); seen again on the pinned SHA in `A03-05` ("Biển số quan sát: 30K-123.45" is the entry plate) | S2 | Staff exit preview of any open session (`A03-05`) | RES-04 | **Fixed** on branch `fix/d04-exit-plate-labels` (PR #38; RES-04 retest 7/7, independent review approved). Both labels shown in `AX02-02` on the 27/11 build. **Not on the pinned SHA `ac57507c`.** Merge and re-pin state: **[RES-02 to fill]** |
| none | No other defect reported in AT-01..AT-07, AT-100 or AT-EX01..AT-EX05 | | | | |

Observations, not defects (for the demo, nothing to fix unless the owner disagrees):

1. No-show rate shows 53,7% on the simulator's 7-day history (`A07-02`). It is generated data, but a client may ask why it is so high; have the explanation ready (RES-05 for the simulator, RES-03 for the report).
2. `A03-05` shows fee group Khách (guest) at 15.000 đ for a car while `A02-05` shows 10.000 đ for plate 30K-123.45. Explained: the seed gives every fee group the same price (2.000 / 10.000), so 15.000 đ is the guest car price changed on the manager tariffs page during AT-03 (RES-02's own report; `quality-evidence-modules.md` §3). The tariff edit screen was not captured, so the new price is shown only by its effect in `A03-05` (gap 2).

Owner guide: UI and reservation screens RES-04, simulator and monitoring RES-05, reports and data RES-03, lot management RES-01. Send this table to the owners the same day so fixes can land before the 27/11 demo.

## 5. Verdict

**CP-07 status: Pass with conditions** (not yet Pass).

What is shown. On `ac57507c`: automated checks pass (382/382 tests, build, lint), the HTTP rehearsal passes 25/25, and RES-02 ran AT-01..AT-07 and AT-100 by hand, all Pass (the ones with evidence gaps are marked in section 3). On 27/11, RES-02 ran AT-EX01..AT-EX05 by hand on a build that includes the D-04 fix, all Pass (two with evidence gaps). That is 13 of 13 acceptance scenarios run and 13 Pass. D-04 is visible on the pinned SHA (`A03-05`), so "no defect" does not hold for `ac57507c`; D-04 is fixed in PR #38.

A-88 ran internally on 26/11 because the client was unavailable. CP-08 was not obtained and the CP-06 fallback applies. See [F5-03](../res05/objectives-o1-o2.md). CP-07 conditions B and C remain open.

- **A. One build.** Keep the two historical runs separate. The checkpoint log reported a rerun on 27/11, but no pinned checkout or result is available to substantiate it. Condition A is closed based on the fresh automated recheck above and RES-01 confirmation of the AT-01/AT-02 and AT-EX02 UI checks on 28/11/2026.
- **B. Evidence gaps** 1 to 9 below closed or accepted.
- **C. Independent review.** RES-04 reviewed this file on 27/11 and asked for changes; this revision answers them. RES-04 re-checks, and RES-01 takes the demo decision.

Remaining evidence gaps (not defects):

1. AT-01: the QR entry/exit path has no screenshot (`A01-05` is missing from the zip, which may be it).
2. AT-03: no screenshot of reactivating the lot or of the tariff edit. Reactivation is shown indirectly by `A05-05` (entry at 13:44:36 after the 13:37 suspension).
3. AT-04: no screenshot of a masked plate. `A04-03` is the open-sessions list, where Staff see full plates by design; masking (`***-**3.45`, last 3 characters kept) applies to Staff on **closed** sessions. Log in as Staff, open a closed session (e.g. 29A-01001 or 29A-02001 after exit and payment, via vehicle lookup) and capture the masked plate. If it shows in full there, AT-04 fails and goes into section 4 for RES-04.
4. AT-05: the no-show wait (TC-RES-12) is not shown; say whether it was run by hand or left to the automated test. The manual cancel button is also not shown being used.
5. AT-07: crop shows three of the four indicators; add a full-page screenshot of the report.
6. AT-100 run time and response times for TC-EXIT-07 are not recorded. `A02-03` is also missing from the zip.
7. AT-EX05: no screenshot of the lot reactivation, and `AX05-03` does not show which plate exited or that the lot was still suspended (see the notes under the AT-EX table).
8. AT-EX03: the LOST_CARD event and the MANUAL_CONFIRM access-log row are not captured (the log screenshot `AX02-03` is cropped to the 13:17:01 row of AT-EX02).
9. AT-EX01: the screenshots do not show how zone C was filled (simulator EX-01, which fills the whole zone and needs a DB reset afterwards, or capacity set to 1). Say which, and whether the DB was reset after.

The screenshots do not identify the 27/11 checkout. The historical SHA and automated rerun result remain unverified.

## 6. Paste-ready workbook rows (Quality Evidence)

| Test | SHA | Date | Result | Evidence link |
|---|---|---|---|---|
| A-87 / A-95 dry run (AT-01..AT-07, AT-100) | `ac57507c` | 26/11/2026 | Pass with conditions: 382/382 tests, 25/25 e2e, AT-01..AT-07 and AT-100 Pass (AT-100: 100/100 sessions, 69 exits, 31 inside, free A143/B138/C18); evidence gaps 1 to 6 open; D-04 seen in `A03-05` (fixed in PR #38, not on this SHA) | this file and `A87/` screenshots |
| A-87 AT-EX01..AT-EX05 | Unverified historical checkout | 27/11/2026 | Pass with conditions: 5 of 5 Pass; evidence gaps 7 to 9 open; D-04 fix visible in `AX02-02` | this file §3 and `A87/AX*` screenshots |

| Condition A automated recheck | `d9c663805deac7a85fa964d2d3e520427ced7059` | 28/11/2026 | 396/396 tests, lint and production build pass. AT-01/AT-02 and AT-EX02 UI checks confirmed by RES-01 | §1 |

Report reference: M3 §3.5, M4 §4.1.
