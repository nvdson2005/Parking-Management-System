# Round 3: Lecturer Replies vs. Current Implementation

Compares the assumptions the team sent in Round 3 (and the lecturer's replies) against the code on `main`.
Each row says whether the implementation already matches, or what must change.

Status legend: ✅ matches · ⚠️ must change · ❓ unverified / needs a decision

Code references were checked against `src/server/services/*` at the time of writing (2026-11-15).

## 1. Summary of required changes

| # | Topic | Assumption sent | Lecturer's reply | Current code | Status | Action |
|---|-------|-----------------|------------------|--------------|--------|--------|
| 1 | Early arrival | Early arrival still counts as arrived | Staff checks spot availability and decides. Mark "arrived" only when the vehicle is actually admitted. Never auto check-in. | `recordEntry` (`entry.ts:103`) links any PENDING reservation with `holdUntil > now` and never compares `arrivalTime`. An early vehicle is auto-linked and the reservation becomes `FULFILLED`. | ⚠️ | Define the early-arrival rule (staff confirmation or explicit check). Add a test. Update spec wording. |
| 2 | Active-reservation limit | At most [1] active reservation | At most **one per account** at a time | `reservations.ts:84` checks `vehicleId + PENDING`. An account with several vehicles can hold several reservations. | ⚠️ | Check `customerId + PENDING` instead of (or in addition to) the vehicle check. Add a test with two vehicles on one account. |
| 3 | Utilisation report | Average occupied ÷ capacity | Same formula, but compute **separately per vehicle type or zone** when capacity is split | `reports.ts:61` sums `zoneCapacity` across all zones and types into one `totalCapacity`. Output is a single series by hour. | ⚠️ | Group `utilisationByHour` by zone and vehicle type. Update the report API shape and UI. |
| 4 | Suspended lot: pending reservations | Cancel pending reservations and notify users | Confirmed ("agree") | `updateLot` (`lots.ts:85`) only updates the `status` field. No reservation cancellation found in this function. No user notification found. | ❓ | Verify whether cancellation happens elsewhere (e.g. the expiry timer). If not, implement it, plus a notification (or a documented substitute). |

## 2. Assumptions that hold

| Topic | Agreed behaviour | Where in code | Status |
|-------|------------------|---------------|--------|
| Exception: lot full | Reject entry when no suitable spot; show lot status | `entry.ts:124` → `ZONE_FULL` | ✅ |
| Exception: plate mismatch at exit | No auto-complete or payment; staff verifies and confirms manually | `exit.ts:124` → `PLATE_MISMATCH` unless `confirmMismatch`; writes `PLATE_MISMATCH_CONFIRMED` event | ✅ |
| Exception: lost QR/card | Staff looks up by plate, verifies, confirms manually, logs; penalty not mandatory | `exit.ts:139` writes `LOST_CARD` event. No penalty is added to the fee. | ✅ |
| Exception: open session exists | No second session for the same plate | `entry.ts:101` → `ALREADY_OPEN` | ✅ |
| Exception: lot suspended (entry) | No new vehicles | `entry.ts:87` → `LOT_SUSPENDED` | ✅ |
| Suspended lot (reservations) | No new reservations | `reservations.ts:81` → `LOT_SUSPENDED` | ✅ |
| Suspended lot (exit) | Vehicles already inside may leave | No suspension check in `exit.ts` | ✅ |
| Multiple vehicles per account, no limit | Allowed | No cap in vehicle registration | ✅ |
| Plate unique system-wide | Duplicate registration errors | `vehicles.ts:89` → `PLATE_TAKEN` | ✅ |
| Guest plate adopted on registration | Guest vehicle assigned to the registering account | `vehicles.ts` (registration flow) | ✅ |
| User group chosen at registration; guests billed at "Guest" rate | Separate Guest fee tier | `entry.ts:130` → `owner?.userGroup ?? 'GUEST'` | ✅ |
| Reservation deducts a spot immediately | Held spot is excluded from free count | `reservations.ts` + `availability.getFree` | ✅ |
| Guest cannot take a reserved spot | Walk-ins see reduced availability | `entry.ts:122–125` | ✅ |
| Same-day reservations only | Arrival must be later today | `reservations.ts:75` → `RESERVATION_WINDOW` | ✅ |
| Wrong zone on arrival | Cancel reservation, admit as walk-in at the new zone's rate | `entry.ts:113` → `CANCELLED` / `ENTERED_OTHER_ZONE` | ✅ |
| Payment | Staff confirms at exit | `exit.ts` creates a `CONFIRMED` payment | ✅ |
| Roles | Manager: lots, zones, capacity, prices, accounts, groups, reports. Staff: entry/exit, lookup, payment, exceptions, availability | `rbac.ts`, role pages under `src/app/{staff,manager}` | ✅ (see note below) |
| Retention | After 12 months, auto-mask plate on finished sessions; keep stats | `RETENTION_MONTHS = 12` in `lib/time.ts`; `purge.ts` | ✅ |
| Peak hours | Top 3 hours by entries | `reports.ts:93–97` | ✅ |
| Revenue | Sum of confirmed payments per day | `reports.ts:101–112` | ✅ |
| No-show rate | no-show ÷ (total − cancelled) | `reports.ts:121–123` | ✅ (see note below) |

## 3. Notes and smaller items

- **Peak-hour interval:** the lecturer asked the team to state the statistics interval. The code uses clock-hour buckets (0–23). Write "per clock hour" into the spec and report docs.
- **Percent display:** the lecturer writes formulas "× 100%". The API returns fractions rounded to 4 places (`round4`). The UI must show percentages.
- **No-show definition:** the lecturer says to count only reservations that timed out without the user arriving. The code counts status `NO_SHOW` over all non-`CANCELLED` reservations in range. `FULFILLED` and still-`PENDING` reservations stay in the denominator. This is consistent with the lecturer's formula. Confirm that is the intended reading.
- **Role name:** the lecturer says "Admin"; the code and UI say `MANAGER`. Align terminology in the report documents.
- **Staff read access:** the lecturer said staff should see vehicle, session, reservation and lot information. Confirm that RBAC lets staff read reservations.
- **Acceptance thresholds** (100 % match with the manual count in the 100-session scenario, 5/5 exceptions, ≤ 3 s per record): the lecturer did not object, but did not explicitly sign off either. Treat as proposed, not confirmed.

## 4. Suggested order of work

1. Item 2 (reservation limit per account): small, isolated, easy to test.
2. Item 1 (early arrival): needs a rule decision first, then code and tests.
3. Item 4 (suspension cancels pending reservations): verify the gap, then implement.
4. Item 3 (utilisation breakdown): changes the report API and UI.

Per `AGENTS.md`, each of these goes through `superpowers:brainstorming` and then the speckit chain. Run `codegraph sync` after any code change.
