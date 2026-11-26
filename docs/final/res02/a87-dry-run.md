# A-87 internal dry run (merged with A-95, CP-07)

| Field | Value |
|---|---|
| Owner | RES-02, Đào Xuân Sơn |
| Date | 26/11/2026 |
| Candidate SHA (pinned) | `ac57507c9c2924d54ed35e3dac31e327deac4573` (`origin/main`, merge of PR #24, committed 26/11/2026 01:04 +0700) |
| Status | **COMPLETE, with 4 minor evidence gaps listed in section 5.** Sections 1 to 5 filled; screenshots attached (`A87/`, 32 files); AT-100 numbers recorded |
| Report reference | M3 §3.5, M4 §4.1 |

If `origin/main` moves before the demo, either stay on this SHA for the whole run or re-pin and rerun. Do not mix results from two SHAs.

## 1. Build and automated checks on the pinned SHA

| Check | Command | Result | Notes |
|---|---|---|---|
| Install | `npm ci` | OK (dependencies installed) | |
| Lint | `npm run lint` | **Pass**, no findings | Run 26/11 on the pinned SHA |
| Unit and API tests | `npm test` | **Pass: 49 files, 382 tests, 0 failed** (191 s) | Run by RES-02 on Windows, 26/11, 12:29. `tests/simulator.test.ts` 18/18 pass in 52.7 s with the largest tests at 5 to 13 s, so the former 5 s timeout failures no longer occur on this checkout. `git rev-parse HEAD` on the same checkout is `ac57507c` |
| Build | `npm run build` | **Pass**: Next.js 15.5.29, compiled in 36.5 s, types and lint valid, 50/50 pages | The route table lists the API routes and the customer, staff and manager pages |

## 2. Environment for the acceptance run

```bash
git fetch && git checkout ac57507c9c2924d54ed35e3dac31e327deac4573
npm ci
cp .env.example .env            # set AUTH_SECRET to 32+ random characters
npx prisma migrate reset --force   # clean seeded DB, no hand edits afterwards
npm run build && npm start      # http://localhost:3000
```

Accounts are seeded with password `password123` (Customer `customer01..04`, plus Staff and Manager; see `prisma/seed.ts`). Do not edit the database by hand during the run (PD-P21 criterion 5). Keep the terminal log.

Manual run: screenshots were taken between 13:24 and 14:07 on 26/11/2026, from `localhost:3000` and `192.168.2.8:3000` (same server, LAN address).

Automated HTTP rehearsal (needs a fresh seed, own port):

```bash
DATABASE_URL=file:./e2e.db npx prisma migrate deploy
DATABASE_URL=file:./e2e.db npx tsx prisma/seed.ts
DATABASE_URL=file:./e2e.db AUTH_SECRET=<32+ chars> npx next start -p 3100
BASE_URL=http://localhost:3100 node e2e/round3.e2e.mjs
```

Result: **25/25 checks PASS, "All e2e checks passed"** (RES-02, 26/11, Windows PowerShell, fresh `e2e.db` with 9 migrations applied, server on port 3100, `git rev-parse HEAD` = `ac57507c9c2924d54ed35e3dac31e327deac4573`). Same count as RES-01's 21/11 rehearsal on `a55f6a8`. Covered: second vehicle, one-reservation limit (409 RESERVATION_LIMIT), early arrival with and without confirmation (409 EARLY_ARRIVAL, then admitted and FULFILLED), lot suspension (reservations cancelled with LOT_SUSPENDED, notifications without plates, new reservation and entry refused with 409, a vehicle already inside can still exit), and the report keeping the 24-hour series with per-zone/type slices.

## 3. Acceptance scenarios

Steps follow `docs/final/res05/demo-script-and-viva.md` and `docs/manual-e2e-test-guide.md`. The detailed AT definitions are in P21 (PD-P21 in `docs/m2-report/report.src.md`). Screenshot files are in the `A87/` folder; the number in the name is `A<AT>-<step>`.

| ID | Scenario | Objective | Result | Evidence (log, screenshot, file) | Defect ref |
|---|---|---|---|---|---|
| AT-01 | Motorbike entry/exit and availability (plate and QR) | O1 | **Pass** (RES-02, 26/11) | Plate path: `A01-01` lot shows A 150/150 before; `A01-02` entry form, plate 29A-01001, zone A, motorbike; `A01-03` A drops to 149 (13:28:08); `A01-04` open session 29A-01001 zone A; `A01-06` A back to 150 after exit (13:30:15); `A01-07` payment 2.000 đ confirmed by Staff 1. QR path: no screenshot (see gap 1) | none |
| AT-02 | Car entry/exit (zone C) | O1 | **Pass** (RES-02, 26/11) | `A02-01` entry form, plate 30K-123.45, zone C, car; `A02-02` zone C 29 free / 1 used (13:32:46); `A02-04` zone C back to 30 / 0 (13:34:22); `A02-05` payment 10.000 đ, zone C, 13:34:22. Exit screen not captured (`A02-03` is not in the zip) | none |
| AT-03 | Manager lot and tariff management (suspend/reactivate) | | **Pass** (RES-02, 26/11) | `A03-01`/`A03-02` Lot 2 created with zone D (motorbike 10, car 0); `A03-03` staff page shows lot 1 "Tạm ngưng" (suspended) and Lot 2 zone D 10/10 (13:37:41); `A03-04` entry of 29A-01001 refused with "Bãi xe đang tạm ngưng hoạt động"; `A03-05` exit fee preview, fee group Khách, car, 15.000 đ. No screenshot of reactivation or of the tariff edit (see gap 2) | none |
| AT-04 | RBAC, plate masking, access log, 12-month purge | O5 | **Pass** (RES-02, 26/11) | `A04-01` Customer 02 opening `/staff` lands on `/denied`, message says the attempt is logged; `A04-02` access log row "Customer 02, Access denied, page:/staff" 13:57:53; `A04-03` staff open-sessions list; `A04-04` log row "Staff 1, View full plate" 13:59:32; `A04-05` purge result "Masked 20 sessions and deleted 0 vehicles", log row "Manager 1, Purge, 20 sessions, 0 vehicles" 14:00:41. Staff see full plates on open sessions by design (Q46, FR-42); masking applies to closed sessions, not yet captured (see gap 3) | none |
| AT-05 | Reservation, early arrival, cancel and no-show | O3 | **Pass** (RES-02, 26/11) | `A05-01` reservation for 29A-01001, 15:45, status Đang chờ, hold until 16:15; `A05-02` zone A shows 149 free / 1 used while reserved (13:42:09); `A05-03` second reservation refused, "Xe đã được đặt chỗ" (one-reservation limit); `A05-04` early-arrival warning with confirm button; `A05-05` zone A 149 / 1 (13:44:36) after admission; `A05-06` reservation status Đã nhận (fulfilled) and another reservation cancelled by the system because the vehicle parked in zone B. No-show wait not shown (see gap 4) | none |
| AT-06 | Fee calculation and simulated payment | O4 | **Pass** (RES-02, 26/11) | `A01-07` motorbike 2.000 đ; `A02-05` car 10.000 đ; `A06-01` payments list 29A-01001 2.000 đ, 29A-02001 2.000 đ, 30K-123.42 10.000 đ (13:51); `A06-02` customer parking history for 29A-02001: in 13:50:18, out and paid 13:51:23, 2.000 đ. Fee table seen in `A01-01` (student: motorbike 2.000 đ, car 10.000 đ per turn) | none |
| AT-07 | Reports: four indicators | O3 | **Pass** (RES-02, 26/11) | `A07-01` historical data generated: 7 days, 440 sessions, 55 reservations, 440 payments; `A07-02` report page: hourly occupancy chart, top entry hours (20:00 with 35 entries, 06:00 with 34), revenue total 2.021.000 đ with daily bars, no-show rate 53,7%. The screenshot is cropped; the fourth indicator is not in view (see gap 5) | none |
| AT-100 | 100-session volume scenario | | **Pass** (RES-02, 26/11) | `A100-01` simulator, 100 events with "at least N sessions" ticked, seed 68: "100 sessions: 100 entries, 69 exits, 0 rejected"; `A100-02` manager home at 14:07:32. Numbers below | none |

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

`scripts/a49-at100-latency.mjs` produced the 24/11 timing in `docs/m3/evidence/a49-at100-2026-11-24T05-20-01-689Z.json`; cite it only as earlier evidence, not as this run. Note that 120 events and 100 sessions are different measures (see `docs/m3/A-43-simulator-review.md`): `A07-01` shows the default 120 events, `A100-01` the 100-session run.

Exception scenarios AT-EX01..AT-EX05 are outside the scope assigned to F2-04. Record them here only if time allows.

## 4. Defects found

| ID | Description | Severity | Steps to reproduce | Owner | Status |
|---|---|---|---|---|---|
| none | No defect reported in the manual run of AT-01..AT-07 and AT-100 | | | | |

Observations, not defects (for the demo, nothing to fix unless the owner disagrees):

1. No-show rate shows 53,7% on the simulator's 7-day history (`A07-02`). It is generated data, but a client may ask why it is so high; have the explanation ready (RES-05 for the simulator, RES-03 for the report).
2. `A03-05` shows fee group Khách (guest) at 15.000 đ for a car while `A02-05` shows 10.000 đ for plate 30K-123.45. This is consistent if the guest tariff was edited in AT-03 or the plate was registered in between, since tariffs are editable on the manager tariffs page; the seed only sets 2.000 / 10.000. Confirm which, and say so in the AT-03 notes.

Owner guide: UI and reservation screens RES-04, simulator and monitoring RES-05, reports and data RES-03, lot management RES-01. Send this table to the owners the same day so fixes can land before the 27/11 demo.

## 5. Verdict

On the pinned SHA `ac57507c`: automated checks pass (382/382 tests, build, lint), the HTTP rehearsal passes 25/25, and RES-02 reports every acceptance scenario AT-01..AT-07 and AT-100 as Pass with no defect. Screenshots are attached for all eight scenarios and AT-100 is recorded at 100/100 valid sessions with availability matching entries minus exits. The SHA is **ready for the 27/11 client demo**, subject to the remaining gaps below being closed or accepted.

Remaining evidence gaps (not defects):

1. AT-01: the QR entry/exit path has no screenshot (`A01-05` is missing from the zip, which may be it).
2. AT-03: no screenshot of reactivating the lot or of the tariff edit.
3. AT-04: no screenshot of a masked plate. `A04-03` is the open-sessions list, where Staff see full plates by design; masking (`***-**3.45`, last 3 characters kept) applies to Staff on **closed** sessions. Log in as Staff, open a closed session (e.g. 29A-01001 or 29A-02001 after exit and payment, via vehicle lookup) and capture the masked plate. If it shows in full there, AT-04 fails and goes into section 4 for RES-04.
4. AT-05: the no-show wait (TC-RES-12) is not shown; say whether it was run by hand or left to the automated test. The manual cancel button is also not shown being used.
5. AT-07: crop shows three of the four indicators; add a full-page screenshot of the report.
6. AT-100 run time and response times for TC-EXIT-07 are not recorded. `A02-03` is also missing from the zip.

The screenshots do not show the commit; the SHA claim rests on RES-02's `git rev-parse HEAD` in section 1 and 2, so keep the terminal log.

## 6. Paste-ready workbook rows (Quality Evidence)

| Test | SHA | Date | Result | Evidence link |
|---|---|---|---|---|
| A-87 / A-95 dry run | `ac57507c` | 26/11/2026 | Pass: 382/382 tests, 25/25 e2e, AT-01..AT-07 and AT-100 Pass (AT-100: 100/100 sessions, 69 exits, 31 inside, free A143/B138/C18), 0 defects | this file and `A87/` screenshots |

Report reference: M3 §3.5, M4 §4.1.
