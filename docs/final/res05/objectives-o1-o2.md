# F5-03 · Measures of effectiveness for O1 and O2

| Field | Value |
|---|---|
| Task | F5-03 in `docs/m3-m4-final-work-division.md` |
| Owner | Nguyễn Tuấn Thành (RES-05). Review: RES-02 (O3–O5, F2-05), RES-04 (traceability P24, F4-03) |
| Report section | M4 §4.3 (objectives and measures of effectiveness), §4.3.1 (product completion versus objective achievement) |
| Objectives and measures | M1 report section 1.4.3 (O1, O2) |
| Evidence used | Demo run 26/11 `docs/final/res05/evidence/f5-03/` (RES-05); A-68 / CP-05 `docs/m3/a-68-cp05-test.md` (RES-05); A-49 `docs/m3/quality-evidence-A-49.md` and CR-03 retest `docs/final/res04/a49-retest.md` (RES-04); A-31 `docs/m3/a-31-auth-test.md` (RES-05); automated suite |
| Status | Final 26/11. A-88 is an internal demo (team lead, 26/11): RES-05 ran the demo segments for O1/O2 alone on the production build; the record below comes from that run |

## 1. Objectives as baselined (M1 section 1.4.3)

| ID | Objective (outcome) | Measures of effectiveness | Target | How measured |
|---|---|---|---|---|
| O1 | Drivers know free spaces in advance, to reduce the time spent looking for a space | (a) Delay of the free-space figure after an entry or exit event; (b) accuracy of the displayed figure against the simulated reality | Users see free spaces per vehicle type before arriving, with reliable data | Integration tests; manual count compared with the system |
| O2 | Entry and exit are digital, so monitoring no longer depends on manual notes | (a) % of entries and exits with a valid electronic record; (b) system time to process one entry or exit | Every entry and exit has a complete, traceable electronic record | Simulation run (≥ 100 visits); acceptance tests; logs during demo and tests |

Thresholds used for "reliable" and "processing time" come from the SRS and the test plan: entry/exit recorded within 3 s (NFR-04, P20 v1.2), display updated within 5 s (NFR-05).

## 2. Results (report template table, M4 §4.3)

| Objective | Measure | Target | Actual / assessed | Achieved? | Comment |
|---|---|---|---|---|---|
| O1 | (a) Display delay after an event | ≤ 5 s (NFR-05) | **200/200 updates ≤ 5 s**; mean 35 ms, p95 47 ms, max 155 ms from the request (A-49 AT-100 timing run, 100 visits, SSE stream). Full zone cleared on the Staff screen 1.1–2.1 s after a freed spot, no reload (CR-03 retest, run 2) | Yes | Measured on `next dev` at the SSE stream (browser repaint not included); a production build is not slower (A-68 C3) |
| O1 | (b) Accuracy against an independent count | Displayed free = capacity − open sessions − held reservations, in every check | **All checks match.** Hand count on paper = UI = DB on the production build: open 7 / 12 / 12, free 143 / 138 / 18 (A-68 C1). DB count = UI in 2 snapshots after 100 sessions and manual exceptions (A-68 T05). A-49: 6/6 count rows match the hand count. TC-AV-01: 5/5 steps match, free + used = capacity. Two overlapping runs (220 sessions): DB = UI (A-68 C5). Demo run 26/11 (production, `2c5a587`): hand count = UI = DB, free 143 / 138 / 18 | Yes | Reservation term exercised in TC-AV-01 (reserve and cancel) and `availability.test.ts` (12 tests); the 100-session runs had no pending reservations |
| O1 | Free spaces per vehicle type visible before arriving | Customer sees free spaces per zone and vehicle type | Customer screen shows free spaces per zone and type with "Cập nhật lúc HH:mm:ss" (A-49 retest A1–A3) | Yes | Customer sees free only; Staff and Manager also see used (FR-19, FR-20) |
| O2 | (a) % entries and exits with a valid electronic record | 100 % | **100 %** in every run: 100/100 and 104/104 sessions (A-68, `incomplete: 0`); 100/100 (A-68 C1, production); 220/220 under overlapping runs (A-68 C5); 100/100 closed sessions (A-49 AT-100). Automated: every simulated session has plate, zone, entry staff and identification method (`simulateLive(120)`); contract test CT-11 | Yes | "Valid" = plate, zone, vehicle type, fee group, method, entry time and staff; for closed sessions also exit time ≥ entry time, exit staff and payment (`scripts/a68-check.ts`) |
| O2 | (b) System time per entry or exit | ≤ 3 s (NFR-04) | **200/200 ≤ 3 s**: entry mean 32 ms (max 153 ms), exit preview + confirm mean 55 ms (max 93 ms) (A-49 AT-100). Production build: entry 31 ms, exit preview 14 ms, confirm 23 ms (A-68 C3). Service level: each call < 2 s over `simulateLive(100)` (FR-16 test) | Yes | `next dev` single requests measured 1.08–1.47 s because of on-demand compilation (A-68 T13); still within 3 s |
| O2 | Traceable | Who, when, where and how for every event | Each session stores entry and exit staff, time, gate and source (G-09, G-04); exceptions write session events (`PLATE_MISMATCH_CONFIRMED`, `LOST_CARD`) and access-log rows (`MANUAL_CONFIRM`); full-plate views are logged (`VIEW_FULL_PLATE`) (A-68 T07/T08, A-31 checks 6–7) | Yes | Plates of sessions older than 12 months are masked while counts and revenue stay (A-31 check 8), as agreed with the client (round 3, Q9) |
| O2 | Logs during the demo | Demo log kept | **Kept.** Demo run 26/11, production build `2c5a587`, fresh DB, AT-100 segment (≥ N sessions, N = 100, seed 68, one click): 100 entries, 69 exits, 0 rejected; `a68-check` sessions 100 (open 31, closed 69), `incomplete: 0`. Evidence: `docs/final/res05/evidence/f5-03/a-check.txt` (DB count); the simulator result, UI table and hand count were checked on screen and match it (not saved as images) | Yes | Solo run by RES-05 (A-88 internal, no group session). Entry/exit timings were not re-measured in this run; the production timings are from A-68 C3 |

## 3. Product completion versus objective achievement (M4 §4.3.1)

**The product meets every O1 and O2 measure that the project can observe.** The modules behind them (P04 simulator, P05 entry/exit, P09 availability) pass CP-04 and CP-05 and the A-49 retest.

**The objectives themselves are only partly demonstrated**, because their outcomes happen in real use, which the project did not have:

| Objective | Outcome stated in M1 | What was shown | Gap |
|---|---|---|---|
| O1 | Less time spent looking for a space | The information a driver needs is correct and current (delay ≤ 155 ms, all counts match) | No measurement of search time with real drivers: no deployment, simulated data only (out of scope: real hardware, Q06) |
| O2 | Monitoring no longer depends on manual notes | Every simulated event has a complete electronic record, and exceptions leave an audit trail | Not observed with real staff at a real gate; the simulator replaces devices (Q06) and the client accepted simulated data |

Assessment for the report: **O1 Partial** and **O2 Partial** as outcomes, with the product measures fully met. A post-handover check by the operations office (S6) could measure the outcomes: time from arrival to parking before and after go-live (O1), and the share of gate events entered by hand versus by device (O2).

## 4. Issues that affect these measures

| ID | Issue | Effect on O1/O2 | Status (26/11) |
|---|---|---|---|
| A-68 D-01 | Two overlapping simulator runs | Simulator counters only; records and availability stayed correct (C5) | Fixed, PR #26 merged |
| A-68 D-03 | Staff entry form showed zone IDs and type codes | Risk of choosing the wrong zone (O1 accuracy) | Fixed in PR #24 (RES-04); labels confirmed in A-49 retest B1, C5 |
| A-68 D-04 | Exit preview labels the entry plate as "Observed plate" | Display only; the mismatch check and the record are correct | Open, due CP-07 (27/11), ISS-11 |
| A-68 D-05 | Session detail does not show the identification method | Display only; the value is stored (O2 record complete) | Open, S3 |
| A-31 O-01 | `next dev` rebuilds on DB writes | Timings and reloads on the dev server; not on the production build | Demo runs on the production build (F5-02) |

## 5. Paste-ready rows for the report (M4 §4.3)

| Objective | Measure | Target | Actual / assessed | Achieved? |
|---|---|---|---|---|
| O1 | Display delay after an entry or exit | ≤ 5 s | 200/200; max 155 ms (A-49) | Yes |
| O1 | Displayed free = independent count | All checks | Hand count = UI = DB in every check (A-68 C1, T05, C5; A-49 6/6; TC-AV-01 5/5; demo run 26/11) | Yes |
| O1 | Outcome: less time searching | — | Not measurable without deployment | Partial |
| O2 | Entries and exits with a valid record | 100 % | 100 % in all runs (100, 104, 220 sessions; A-49 100/100; demo run 26/11 100/100) | Yes |
| O2 | System time per entry or exit | ≤ 3 s | 200/200; max 153 ms (A-49); 14–31 ms on production (A-68 C3) | Yes |
| O2 | Demo log kept | Kept | Demo run 26/11: 100/100 complete records, evidence `docs/final/res05/evidence/f5-03/a-check.txt` | Yes |
| O2 | Outcome: no manual notes for monitoring | — | Shown on simulated data only | Partial |

Effort RES-05: 1.25 h (writing 1.0 h, demo run 0.25 h).
