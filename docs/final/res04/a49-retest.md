# F4-05: A-49 availability retest after CR-03

| Field | Value |
|---|---|
| Task | F4-05 of `docs/m3-m4-final-work-division.md` (T020 of `specs/006-cr03-ui-fixes/tasks.md`) |
| Activity | A-49, availability display module (P09) |
| Run by | Phạm Duy Quý (RES-04) |
| Date | 2026-11-24, 21:46–22:35 |
| Requirements | SRS v2.1: FR-19, FR-20, FR-21, FR-18, FR-27, FR-51, NFR-05. Spec 006: SC-001..SC-007 |
| Closes | Gaps G1–G3 of `docs/m3/quality-evidence-A-49.md` |
| Report ref | M3 §3.5 |

## Environment

| Item | Value |
|---|---|
| Code | branch `fix/cr-03-ui`. Sections A–C and E on commit `449df8e`. The font recheck and the second full-zone run (D, run 2) on `efe80fd`, which fixes the font defect found in this run (see "Defect found") |
| Server | `npm run dev` on `http://localhost:3000`, single process |
| Data | `prisma/dev.db` after `npx prisma migrate reset --force` before the run, and again before D run 2: pilot lot, zone A 150 motorbikes, zone B 150 motorbikes, zone C 30 cars |
| Browser | Chrome 157.0.8103.80. Staff and Manager in normal windows, Customer in an incognito window |
| Accounts | `staff1@demo.local`, `customer01@demo.local` (motorbike `29A-01001`), `manager1@demo.local` |
| Automated suite | 47 files; 368 of 370 tests pass. The 2 failures are simulator tests that hit the default 5 s timeout while the dev server was running: the known issue F5-01 (RES-05), not this change. Without the dev server: 369/369 at `449df8e`. Lint and `tsc --noEmit` clean |

## A. Screen content (FR-19, FR-20)

| # | Check | Result |
|---|---|---|
| A1 | "Cập nhật lúc HH:mm:ss" on the lot card for Customer, Staff and Manager | Pass |
| A2 | Customer: no "Đã dùng" column | Pass |
| A3 | Staff and Manager: "Đã dùng" column; A 150 / 0 / 150, C 30 / 0 / 30 | Pass |
| A4 | Sans-serif font | Pass after the fix in `efe80fd`. The first pass on `449df8e` was recorded as Pass, but the screenshots showed body text still in serif (only headings in Geist). After the fix, the menu and table text render in Geist (screenshot at 22:34:57) |

## B. TC-AV-01 rerun (zone A, motorbike; no reload)

| Step | Action | Free (Customer) | Used (Staff) | Free + used | "Cập nhật lúc" |
|---|---|---|---|---|---|
| 0 | Starting value | 150 | 0 | 150 | 21:46:13 |
| 1 | Staff entry `51F-999.01`, zone A, motorbike, gate 1 | 149 | 1 | 150 | 21:55:55 |
| 2 | Customer reserves zone A with `29A-01001` | 148 | 2 | 150 | 22:07:10 |
| 3 | Customer cancels that reservation | 149 | 1 | 150 | 22:09:17 |
| 4 | Staff exit `51F-999.01` | 150 | 0 | 150 | 22:11:53 |

**Result: Pass.** 5/5 steps match the hand count. The update time changed at every step. Free + used = capacity in 5/5 rows. The entry form selects showed "Khu A", "Cổng 1" and "Xe máy" at step 1.

## C. Demo-path defects

| # | Check | Result |
|---|---|---|
| C1 | Reservation submitted with the default arrival time | Pass: created on the first attempt, no `RESERVATION_WINDOW` |
| C2 | Reservation form selects show "29A-01001 · Xe máy" and the zone name | Pass |
| C3 | Time picker: the current minute and earlier cannot be chosen; latest is 23:59 today | Pass |
| C4 | Reservation from C1 cancelled | Pass |
| C5 | Staff entry form: zone C, car, gate 2 show their labels | Pass |
| C6 | English: "Updated at", "Used", "Motorbike/Car", "Gate …" | Pass |

## E. Early arrival (FR-51)

| # | Check | Result |
|---|---|---|
| E1 | Customer reserves zone A for about one hour later | Pass |
| E2 | Staff entry of `29A-01001` now: the prompt shows "Giờ hẹn: HH:mm · Khu: A" with the booked time | Pass |
| E3 | Cancel: no session created, reservation still pending | Pass |
| E4 | Confirm: vehicle admitted, reservation fulfilled, free and used unchanged (held spot becomes a parked vehicle) | Pass |
| E5 | English: "Booked: … · Zone: A" | Pass |

## D. Full zone (FR-21, EX-01)

**Run 1** (on `449df8e`, about 22:18). Manager → Simulator → EX-01 filled **zone A**. The Staff screen showed zone A "0 Hết chỗ", used 150 = capacity, and no mark on zones B and C. In English it showed "0 Full" with "Updated at 22:18:18". Screenshot at 22:22:16 (Customer): A free 1, no mark. The update time was not measured in this run. Zone B also showed free 1 there, which the run does not explain. The database was reset before run 2, so this could not be checked afterwards. Run 1 is kept for the label check only.

**Run 2** (on `efe80fd`, fresh database):

| Time | Event | Screen | Result |
|---|---|---|---|
| 22:34:52–22:34:57 | EX-01 filled **zone C** (30 cars) | Staff: C "0 Hết chỗ", used 30 = capacity; A and B 150 free, no mark; "Cập nhật lúc 22:34:57" | Pass |
| 22:35:25.867 | Staff confirmed the exit of one car from zone C (exit time read from `dev.db`) | — | — |
| 22:35:27 | Update received | Staff: C free 1, used 29, "Hết chỗ" gone, no reload | Pass |

Display update after the exit: between 1.1 s and 2.1 s. The screen shows whole seconds, so this is 22:35:27.000–22:35:27.999 minus 22:35:25.867. The limit is ≤ 5 s (SC-003, NFR-05). The Staff member switched browser tabs to record the exit, and the open screen still received the update.

## Defect found and fixed during the run

| Defect | Cause | Fix | Test |
|---|---|---|---|
| Body text still serif after the first font fix | `font-sans` was applied on `<html>`, but `--font-geist-sans` is defined by a class on `<body>`, so it was undefined on `<html>` | Apply `font-sans` on `body` (`src/app/globals.css`, commit `efe80fd`) | `tests/globals-css.test.ts`, "applies font-sans on the element that defines the Geist variable": failed with `html` before the fix, passes after |

## Verdict

| Spec 006 criterion | Result |
|---|---|
| SC-001 TC-AV-01: 5/5 steps, update time changes at each step, no reload | Pass |
| SC-002 Free + used = capacity on Staff and Manager | Pass (5/5 steps, both full-zone runs) |
| SC-003 Full mark on Customer and Staff, gone within 5 s of a freed spot | Pass. Manually: label seen on the Staff screen in both runs (vi and en); removal seen on the Customer screen (run 1) and the Staff screen (run 2, measured 1.1–2.1 s). The label on the Customer screen was not captured in a screenshot; it is covered by `tests/live-availability.test.ts`, which renders the full mark for every role from the same component |
| SC-004 Default reservation time succeeds on the first attempt | Pass (C1) |
| SC-005 Entry form selects show labels in both languages | Pass (B step 1, C5, C6) |
| SC-006 Early-arrival prompt shows booked time and zone | Pass (E2, E5) |
| SC-007 A-49 to Verified | **Verified**: gaps G1–G3 closed |

Paste-ready Quality Evidence row (for RES-03, F3-05):

```text
A-49 | P09 availability | availability.test.ts 12 passing (RT-01 closed); AT-100 run: recording max 153 ms ≤ 3 s, display max 155 ms ≤ 5 s, 100/100 records, 6/6 counts (SC-001, SC-002); CR-03 retest 24/11 (docs/final/res04/a49-retest.md): TC-AV-01 5/5 with update time, free + used = capacity, "Hết chỗ" shown and cleared 1.1–2.1 s after a freed spot (FR-19/20/21, G1–G3 closed) | RES-04 | 24/11 | Verified
```
