# Quality Evidence: A-49 availability display module (P09)

| Field | Value |
|---|---|
| Activity | A-49, test the availability display module: hand count after the P04 scenario, update latency, Quality Evidence (planned 23–24/11) |
| Verified by | Phạm Duy Quý (RES-04) |
| Date | 2026-11-23 to 2026-11-24 |
| Evidence | `tests/availability.test.ts` (12 tests, 6 added for RT-01, commit `484fbb2`); AT-100 timing run with `scripts/a49-at100-latency.mjs` (commit `e7fd47e`), raw data in `docs/m3/evidence/a49-at100-2026-11-24T05-20-01-689Z.csv` and `.json`; manual runs in sections 2, 4 and 5 below |
| Requirements | SRS v2.1: FR-17, FR-18, FR-19, FR-20, FR-21, FR-25, NFR-04, NFR-05, NFR-06, NFR-12, EX-01. Lecturer acceptance contract `specs/002-lecturer-acceptance-alignment/spec.md`: SC-001, SC-002. MVP-spec numbering used in the test plan and the E2E guide: FR-17, FR-18, FR-19, FR-19a |
| Test plan rows | P20: A-49, T05, T-DB6, RT-01; AT-100 (timing and count part); E2E guide TC-AV-01..07 |

## Environment

| Item | Value |
|---|---|
| Code | branch `test/A-49-availability`: commit `484fbb2` (= `main` `4c8fde2` + the RT-01 tests) for sections 1–2 and 4–5; commit `e7fd47e` (adds the timing script only) for section 3. No product code changed |
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

**RT-01 closed.** Before A-49 only hold expiry had a broadcast test. Each of the six new tests asserts **exactly one** broadcast (`toBe(1)`): entry broadcasts a second time only when it sweeps lapsed holds, and these fixtures have none.

Mutation check, one change at a time, `tests/availability.test.ts` run after each and the source restored afterwards:

| Mutation | Test that fails | Result |
|---|---|---|
| `publishAvailabilityChanged()` removed in `recordEntry` (`entry.ts`) | entry | 1 failed, 11 passed |
| removed in `confirmExit` (`exit.ts`) | exit | 1 failed, 11 passed |
| removed in `createReservation` (`reservations.ts`) | reservation | 1 failed, 11 passed |
| removed in `cancelReservation` (`reservations.ts`) | cancellation | 1 failed, 11 passed |
| removed in `updateZone` (`lots.ts`) | capacity change | 1 failed, 11 passed |
| removed in `updateLot` (`lots.ts`) | lot suspension | 1 failed, 11 passed |
| broadcast duplicated in `recordEntry` | entry (`expected 2 to be 1`) | 1 failed, 11 passed |
| broadcast duplicated in `updateLot` | lot suspension (`expected 2 to be 1`) | 1 failed, 11 passed |

Full suite after the change: 24 files, 215 tests passing.

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

## 3. Timing in the 100-visit scenario (AT-100; SC-001, SC-002; NFR-04, NFR-05, NFR-06)

The acceptance contract (SC-001) asks for both timings **during the normal 100-visit scenario**: each entry or exit recorded within 3 s, and the availability display updated within 5 s of the event being recorded. SC-002 asks, in the same scenario, for complete closed sessions and availability matching a manual count.

**Method.**

- `scripts/a49-at100-latency.mjs` logs in as `staff1@demo.local` and drives 100 visits through the same HTTP API the Staff screens call: `POST /api/events/entry` for entry, `POST /api/events/exit/preview` then `/confirm` for exit.
- 100 visits = 200 events: 80 motorbikes spread over zones A and B, 20 cars in zone C, plate identification. Entries and exits interleave in a seeded random order (seed 1686), one event at a time, as a Staff member at one gate would work.
- One availability SSE stream (`/api/availability/stream`, the stream every availability screen uses) stays open for the whole run.
- Per event the script records:
  - **recording time**: the entry request, or exit preview plus confirm, from sending the request to receiving the response;
  - **display time**: from sending the request that records the event to the first stream message showing the new count for that zone and vehicle type. Measured from the request, not the response, so it is an upper bound on "within 5 s of being recorded".
- The route warm-up (dev server compiles a route on first use) is done with three invalid requests that change no data; they are not counted.
- Completeness and counts are checked with a read-only Prisma query, independent of the service code: every closed session of the run must have entry time, exit time, vehicle type, zone and plate; and `GET /api/availability` must equal capacity − open sessions − unexpired pending reservations per zone and vehicle type. The count is taken after event 100 (vehicles parked) and at the end.

**Run.** 24/11/2026 12:20 (UTC+7), development server (`npm run dev`) on `dev.db` freshly seeded (first car entry shows 29 free of 30). 200 events in 10.1 s. Raw data per event: `docs/m3/evidence/a49-at100-2026-11-24T05-20-01-689Z.csv`; summary: same name `.json`.

To repeat the run with the same event order and plates (timings will differ), on a freshly reset database with the server running:

```powershell
npx prisma migrate reset --force
$env:STAFF_PASSWORD = 'password123'; $env:SEED = '1686'; node scripts/a49-at100-latency.mjs
```

The recorded run used commit `e7fd47e`, where the password fell back to the seeded demo value. Since review the script requires `STAFF_PASSWORD` from the environment; the scenario is unchanged.

| Measure | Events | Min | Mean | p95 | Max | Over threshold | Threshold |
|---|---|---|---|---|---|---|---|
| Recording, all | 200 | 22 ms | 44 ms | 68 ms | 153 ms | 0 | 3 s |
| Recording, entry | 100 | 22 ms | 32 ms | 43 ms | 153 ms | 0 | 3 s |
| Recording, exit (preview + confirm) | 100 | 36 ms | 55 ms | 76 ms | 93 ms | 0 | 3 s |
| Display update, from request | 200 | 22 ms | 35 ms | 47 ms | 155 ms | 0 (0 missing) | 5 s |
| Display update, from response | 200 | 1 ms | 3 ms | 5 ms | 104 ms | 0 | 5 s |

| Check | Zone | Vehicle type | Capacity | Open (DB) | Reserved (DB) | Free, hand count | Free, `/api/availability` | Match |
|---|---|---|---|---|---|---|---|---|
| After event 100 | A | Motorbike | 150 | 1 | 0 | 149 | 149 | Yes |
| After event 100 | B | Motorbike | 150 | 4 | 0 | 146 | 146 | Yes |
| After event 100 | C | Car | 30 | 3 | 0 | 27 | 27 | Yes |
| End of run | A | Motorbike | 150 | 0 | 0 | 150 | 150 | Yes |
| End of run | B | Motorbike | 150 | 0 | 0 | 150 | 150 | Yes |
| End of run | C | Car | 30 | 0 | 0 | 30 | 30 | Yes |

Closed sessions with complete records: **100/100**.

**Result: Pass.** SC-001: 200/200 events recorded within 3 s (max 153 ms) and 200/200 display updates within 5 s (max 155 ms). SC-002 (count and completeness part): 100/100 closed sessions complete, 6/6 count rows match. The five exception cases in SC-002 are outside A-49 (A-68, A-87).

Limits of this measurement:

- Development server on one machine; client and server share one clock. A production build is not expected to be slower.
- The display time is measured at the SSE stream, which feeds every availability screen; the browser's repaint after the message arrives is not included. The Customer window was watched during the manual runs in sections 2 and 3a and updated on every event without a reload.
- The run uses plate identification for every event; QR and RFID share the same entry and exit services after the vehicle lookup.

### 3a. Earlier manual latency samples (reference only)

These ten samples came from separate manual entries and exits, not from the 100-visit scenario, so they do not count towards SC-001. They are kept because they include the Staff form in a real browser.

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

All 10 samples ≤ 5 s (max 170 ms). Measured on the development server; entries 1–5 and exits 6–10 came from two console sessions. Visual check: the Customer window updated on every event without a reload.

## 4. Simulator events (supplementary, not counted towards the verdict)

**Supplementary observation only.** This run is not reproducible: the simulator was triggered several times, the per-run result line was not captured, and the event total is only known to be above 100. FR-17 and NFR-06 are decided by section 3 (and sections 1–2); this section only records that the count also matched after a heavier, uncontrolled simulator load. The simulator runs its events on the server inside one request, so it cannot give per-event timing.

Manager → Simulator → Live events, 100 events per run. The run was triggered several times because the result line (small grey text under the button) was not noticed, so the scenario covers **more than 100 events**. The database shows simulator batches at 00:19–00:21, 00:25 and 00:26 on 24/11 (UTC+7), and 274 sessions in total, about 6 of them manual from sections 2–3. The per-run result line was not captured.

The independent count comes from a read-only script that counts OPEN sessions and unexpired PENDING reservations per zone and vehicle type in `dev.db`; the system value comes from `GET /api/availability`. Both were read at 00:27–00:28 on 24/11 with no activity in between.

| Zone | Vehicle type | Capacity | Open (DB) | Reserved (DB) | Free, hand count | Free, `/api/availability` | Match |
|---|---|---|---|---|---|---|---|
| A | Motorbike | 150 | 27 | 0 | 123 | 123 | Yes |
| B | Motorbike | 150 | 24 | 0 | 126 | 126 | Yes |
| C | Car | 30 | 24 | 0 | 6 | 6 | Yes |

**Observation:** 3/3 rows match; free is never negative and never above capacity. Not counted.

## 5. Other cases

| Case | Requirement | Action | Expected | Result |
|---|---|---|---|---|
| TC-AV-06 | FR-18 | Manager → Lot management → zone A motorbike capacity 150 → 160 → Save, then back to 150 | New capacity and free count appear live for Customer and Staff | **Pass**: Customer and Staff screens changed to capacity 160, free 133 (was 150 / 123) without a reload; after reverting, 150 / 123 again |
| Full zone | FR-21, NFR-12, EX-01 (Q41) | Simulator → Exceptions → EX-01 filled zone C (cars), then Staff recorded entry `51F-999.99`, car, zone C | Free shows 0; entry rejected "Khu vực đã hết chỗ" (`ZONE_FULL`); Customer cannot pick that zone when reserving | **Pass** (free 0 on the Customer screen; entry rejected with the toast "Khu vực đã hết chỗ"). Customer reservation zone list: not applicable, no customer in the seed owns a car (checked in `dev.db`: 0 owned cars); the reservation page lists only zones with free > 0 (`availableZones` in `src/app/customer/reservations/page.tsx`) |
| Full zone label | FR-21 | Same as above | Customer and Staff screens show "Hết chỗ" | **Fail** (gap G3): zone C row shows only `0`, no "Hết chỗ" label. **Pass in the CR-03 retest** (section 6) |
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

## 6. Retest after CR-03 (24/11)

The fixes for G1–G3 (branch `fix/cr-03-ui`, spec 006) were retested on 24/11: TC-AV-01 5/5 with the update time changing at each step, free + used = capacity on the Staff screen, and "Hết chỗ" / "Full" shown on a full zone (Staff screen observed; every role covered by `tests/live-availability.test.ts`) and cleared 1.1–2.1 s after a spot was freed. Details, timings and screenshots are in [docs/final/res04/a49-retest.md](../final/res04/a49-retest.md) (F4-05).

## Verdict

**Verified** (24/11, after the CR-03 retest). Before the retest: Partly verified.

| Area | Result |
|---|---|
| Free-spot calculation and concurrency (FR-17, T05) | Pass: automated tests; hand count 5/5; 6/6 rows in the 100-visit run (simulator count in section 4 is supplementary, not counted) |
| Every change reaches open screens (FR-18) | Pass: 6 new broadcast tests, each asserting exactly one broadcast and each mutation-checked (RT-01 closed); live updates seen for entry, exit, reservation, cancellation, capacity change, suspension |
| Timing in the 100-visit scenario (SC-001; NFR-04, NFR-05) | Pass: 200/200 events recorded ≤ 3 s (max 153 ms); 200/200 display updates ≤ 5 s (max 155 ms) |
| Records and counts in the 100-visit scenario (SC-002 count part; NFR-06) | Pass: 100/100 closed sessions complete; 6/6 count rows match |
| Full zone rejection (EX-01, NFR-12, Q41) | Pass: entry rejected with `ZONE_FULL` |
| Suspended badge (FR-25) | Pass |
| Screen content (FR-19, FR-20, FR-21) | Pass after CR-03 (24/11): gaps G1–G3 closed; retest in `docs/final/res04/a49-retest.md` |

G1–G3 were fixed under CR-03 and the retest passed (section 6), so A-49 is **Verified**.

Quality Evidence row for the workbook:

```text
A-49 | P09 availability | availability.test.ts 12 passing (6 new, RT-01 closed); AT-100 run (100 visits, 200 events): recording max 153 ms ≤ 3 s, display update max 155 ms ≤ 5 s, 100/100 records complete, 6/6 counts match (SC-001, SC-002); hand count 5/5; CR-03 retest: FR-19/20/21 on screen, G1–G3 closed (docs/final/res04/a49-retest.md) | RES-04 | 24/11 | Verified
```
