# Quality Evidence: A-49 availability display module (P09)

| Field | Value |
|---|---|
| Activity | A-49, test the availability display module: hand count after the P04 scenario, update latency, Quality Evidence (planned 23–24/11) |
| Verified by | Phạm Duy Quý (RES-04) |
| Date | 2026-11-23 to 2026-11-24 |
| Evidence | `tests/availability.test.ts` (12 tests, 6 added for RT-01, commit `484fbb2`); manual runs in sections 2–5 below |
| Requirements | SRS v2.1: FR-17, FR-18, FR-19, FR-20, FR-21, FR-25, NFR-05, NFR-06, NFR-12, EX-01. MVP-spec numbering used in the test plan and the E2E guide: FR-17, FR-18, FR-19, FR-19a |
| Test plan rows | P20: A-49, T05, T-DB6, RT-01; E2E guide TC-AV-01..07 |

## Environment

| Item | Value |
|---|---|
| Code | branch `test/A-49-availability`, commit `484fbb2` (= `main` `4c8fde2` + the RT-01 tests; no product code changed) |
| Server | `npm run dev` (Next.js development server) on `http://localhost:3000`, single process |
| Data | `prisma/dev.db` after `npx prisma migrate reset --force`: pilot lot, zone A 150 motorbikes, zone B 150 motorbikes, zone C 30 cars |
| Browsers | Chrome 157.0.8103.80 (official build, 64-bit); Customer in an incognito window so each role keeps its own session cookie |
| Accounts | `staff1@demo.local`, `customer01@demo.local` (motorbike `29A-01001`), `manager1@demo.local` |

## 1. Automated tests (L2)

Full suite on 23/11: **24 files, 215 tests passing** (`npx vitest run`, separate `prisma/test.db`).

| Requirement (SRS v2.1) | Test in `tests/availability.test.ts` |
|---|---|
| FR-17 free = capacity − open sessions − active reservations | `free = capacity - open - pending reservations`; `ignores CLOSED sessions and non-PENDING / expired reservations`; `never returns negative free when capacity lowered below occupancy` |
| FR-18 free changes after entry, exit, reservation, cancellation, expiry | `expires stale PENDING reservations before reporting availability`; **new (RT-01):** `entry: broadcasts and decrements free by 1 in the entered zone only`; `exit: broadcasts and increments free by 1`; `reservation: broadcasts and decrements free by 1`; `cancellation: broadcasts and gives the held spot back` |
| FR-18 / NFR-05 every change reaches the live stream | `publishes availability:changed when the read expires a hold, and only then`; **new (RT-01):** the four tests above plus `capacity change: broadcasts and free follows the new capacity` and `lot suspension: broadcasts so every open view shows the new status` |
| FR-25 suspended lot still shows counts | `reports SUSPENDED lot status with normal counts` |
| Concurrency (T05) | `tests/entry.test.ts` › `20 concurrent entries into zone with cap 2 -> exactly 2 succeed` |

**RT-01 closed.** Before A-49 only hold expiry had a broadcast test. Mutation check: with `publishAvailabilityChanged()` commented out in `src/server/services/exit.ts`, the new exit test fails (1 failed, 11 passed); the file was restored afterwards.

## 2. Hand count, small scenario (TC-AV-01..03, FR-17, FR-18)

Staff and Customer windows side by side; no page reload between steps. Zone A, motorbike.

| Step | Action | Expected (hand count) | Shown on Customer screen | Updated without reload |
|---|---|---|---|---|
| 0 | Starting value | 150 | 150 | — |
| 1 | Staff records entry, plate `51F-999.01`, zone A, motorbike | 149 | 149 | Yes |
| 2 | Customer reserves zone A with `29A-01001` | 148 | 148 | Yes |
| 3 | Customer cancels that reservation | 149 | 149 | Yes |
| 4 | Staff records exit of `51F-999.01` | 150 | 150 | Yes |

**Result: Pass.** 5/5 steps match the hand count.

## 3. Update latency (NFR-05, threshold ≤ 5 s)

**Method.** In the Staff window, a console script opened its own `EventSource` on `/api/availability/stream` and wrapped `fetch`. For each entry or exit submitted through the Staff form, it printed the time from the moment the `POST /api/events/...` response arrived to the next availability message on the stream. The server broadcasts one `availability:changed` event to every open stream, so this is also the delay seen by Customer and Manager windows. Client and server ran on the same machine, so both timestamps come from one clock.

| # | Event | Latency (ms) |
|---|---|---|
| 1 | Entry | 158 |
| 2 | Entry | 21 |
| 3 | Entry | 24 |
| 4 | Entry | 132 |
| 5 | Entry | 170 |
| 6 | Exit | 18 |
| 7 | Exit | 22 |
| 8 | Exit | 46 |
| 9 | Exit | 147 |
| 10 | Exit | 39 |

| Statistic | Entry (5) | Exit (5) | All (10) |
|---|---|---|---|
| Maximum | 170 ms | 147 ms | **170 ms** |
| Mean | 101 ms | 54 ms | **78 ms** |
| Minimum | 21 ms | 18 ms | 18 ms |

**Result: Pass.** 10/10 samples ≤ 5 s; the slowest is 170 ms, about 3% of the threshold.

Notes:

- Measured on the development server. Each action also triggered a Next.js Fast Refresh rebuild in the console, so these numbers include development-mode overhead; a production build would not be slower.
- Entries 1–5 and exits 6–10 came from two separate console sessions (the page was reloaded and the script pasted again). This does not change what is measured.
- Visual check: the Customer window updated on every event without a reload.
- The NFR-05 acceptance criterion names the 100-event scenario. The simulator runs those events on the server in one request, so per-event latency is measured on manual events here; section 4 checks correctness after 100 events.

## 4. 100-event scenario (TC-AV-04, TC-AV-05, FR-17, NFR-06)

Manager → Simulator → Live events, 100 events per run. The run was triggered several times because the result line (small grey text under the button) was not noticed, so the scenario covers **more than 100 events**. The database shows simulator batches at 00:19–00:21, 00:25 and 00:26 on 24/11 (UTC+7), and 274 sessions in total, about 6 of them manual from sections 2–3. The per-run result line was not captured.

The independent count comes from a read-only script that counts OPEN sessions and unexpired PENDING reservations per zone and vehicle type in `dev.db`; the system value comes from `GET /api/availability`. Both were read at 00:27–00:28 on 24/11 with no activity in between.

| Zone | Vehicle type | Capacity | Open (DB) | Reserved (DB) | Free, hand count | Free, `/api/availability` | Match |
|---|---|---|---|---|---|---|---|
| A | Motorbike | 150 | 27 | 0 | 123 | 123 | Yes |
| B | Motorbike | 150 | 24 | 0 | 126 | 126 | Yes |
| C | Car | 30 | 24 | 0 | 6 | 6 | Yes |

**Result: Pass.** 3/3 rows match; free is never negative and never above capacity.

## 5. Other cases

| Case | Requirement | Action | Expected | Result |
|---|---|---|---|---|
| TC-AV-06 | FR-18 | Manager → Lot management → zone A motorbike capacity 150 → 160 → Save, then back to 150 | New capacity and free count appear live for Customer and Staff | **Pass**: Customer and Staff screens changed to capacity 160, free 133 (was 150 / 123) without a reload; after reverting, 150 / 123 again |
| Full zone | FR-21, NFR-12, EX-01 (Q41) | Simulator → Exceptions → EX-01 filled zone C (cars), then Staff recorded entry `51F-999.99`, car, zone C | Free shows 0; entry rejected "Khu vực đã hết chỗ" (`ZONE_FULL`); Customer cannot pick that zone when reserving | **Pass** (free 0 on the Customer screen; entry rejected with the toast "Khu vực đã hết chỗ"). Customer reservation zone list: not applicable, no customer in the seed owns a car (checked in `dev.db`: 0 owned cars); the reservation page lists only zones with free > 0 (`availableZones` in `src/app/customer/reservations/page.tsx`) |
| Full zone label | FR-21 | Same as above | Customer and Staff screens show "Hết chỗ" | **Fail** (gap G3): zone C row shows only `0`, no "Hết chỗ" label |
| TC-AV-07 | FR-25 | Manager → Lot management → Suspend (lot status shows "Tạm ngưng"), then reactivate | "Tạm ngưng" badge in every availability view, counts still shown | **Pass**: red "Tạm ngưng" badge on the lot card of the Customer and Staff home pages, counts unchanged (A 123/150, B 126/150, C 0/30). Reactivated afterwards: status "Đang hoạt động", badge gone from the Customer and Staff screens |

## Gaps found

The service layer and the live stream meet the requirements. The availability screen (`src/components/LiveAvailability.tsx`, shared by Customer, Staff and Manager) does not show three things the SRS asks for. The API already returns the data, so each is a front-end change. All three are recorded in SRS v2.1 section 9.

| ID | Requirement (Must) | SRS asks for | Screen today |
|---|---|---|---|
| G1 | FR-19 | Time of the last update next to the counts | No timestamp |
| G2 | FR-20 | Used spots per zone for Staff and Manager (free + used = capacity) | Only "Còn trống" and "Sức chứa" columns; `open` and `reserved` are not shown |
| G3 | FR-21 | "Hết chỗ" when free is 0 | Shows the number 0 only; no "Hết chỗ" string in i18n |

Action: fix through CR-03 (owner RES-04, about 1 h), then rerun TC-AV-01 and the full-zone case and append the results here.

Observed outside A-49 scope (recorded for CR-03, not part of this verdict):

- Reservation page pre-fills the arrival time with the current minute (seconds dropped), which is already in the past, so submitting the default value always fails with `RESERVATION_WINDOW` (module P06, FR-27).
- The global font falls back to the browser serif because `--font-sans` in `src/app/globals.css` refers to itself.
- Staff entry form (module P05): after choosing a value, the Zone select shows the raw zone ID (for example `cmwthjh41000…`) and the Vehicle type select shows the code `CAR` instead of the zone name and "Ô tô".
- Simulator EX-05 suspends the lot and reactivates it within the same request, so the "Tạm ngưng" badge cannot be observed through it; TC-AV-07 uses the Manager lot screen instead.

## Verdict

**Partly verified.**

| Area | Result |
|---|---|
| Free-spot calculation and concurrency (FR-17, T05) | Pass: automated tests; hand count 5/5; 3/3 rows after 100+ simulator events |
| Every change reaches open screens (FR-18) | Pass: 6 new broadcast tests (RT-01 closed); live updates seen for entry, exit, reservation, cancellation, capacity change, suspension |
| Update latency (NFR-05) | Pass: max 170 ms, mean 78 ms over 10 samples, threshold 5 s |
| Full zone rejection (EX-01, NFR-12, Q41) | Pass: entry rejected with `ZONE_FULL` |
| Suspended badge (FR-25) | Pass |
| Screen content (FR-19, FR-20, FR-21) | Fail: gaps G1–G3 |

A-49 moves to **Verified** once G1–G3 are fixed (CR-03) and TC-AV-01 and the full-zone case are rerun and appended here.

Quality Evidence row for the workbook:

```text
A-49 | P09 availability | availability.test.ts 12 passing (6 new, RT-01 closed); hand count 5/5 and 3/3 after 100+ simulator events; SSE latency max 170 ms, mean 78 ms (10 samples) ≤ 5 s; screen misses FR-19/20/21 (G1–G3, CR-03) | RES-04 | 24/11 | Partly verified
```
