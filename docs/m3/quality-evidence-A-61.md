# Quality Evidence: A-61 lot management module (P08)

| Field | Value |
|---|---|
| Activity | A-61, test the lot management module (planned 13–23/11, 1.5 h) |
| Verified by | Nguyễn Võ Đức Sơn (RES-01) |
| Date | 2026-11-19 |
| Evidence | `tests/lots.test.ts` (16 tests, all passing on 19/11: 22 files, 181 tests in the suite) |
| Requirements | FR-07, FR-08, FR-09, FR-10 (lots, zones, capacity, tariffs, status), D-27 |

## Coverage by requirement

| Requirement | Test in `tests/lots.test.ts` |
|---|---|
| FR-07 create and edit lot | `creates second lot and zone; getAvailability returns 2 lots`; `createLot logs LOT_CHANGE`; `edits lot name/address and zone name without touching status or capacity (FR-07, FR-08)` |
| FR-08 capacity per vehicle type | `updating capacity changes free count and logs LOT_CHANGE`; `rejects negative capacity/price with VALIDATION`; `rejects non-integer capacity/price with VALIDATION` |
| FR-09 tariffs | `setTariff changes computeFee result and logs TARIFF_CHANGE`; `listTariffs returns all configured tariffs` |
| FR-10 Active / Suspended | `suspend then reactivate lot toggles status; entry allowed again after reactivation`; `new reservation and entry on the suspended lot are still rejected with LOT_SUSPENDED`; `open sessions are unaffected and can still exit` |
| Round-3 suspension rule | `cancels PENDING reservations in that lot with LOT_SUSPENDED and notifies each customer`; `only PENDING reservations in that lot are touched`; `suspending an already suspended lot is a no-op`; `a lapsed hold becomes NO_SHOW on suspension`; `cancelPendingReservations:false leaves reservations and notifications alone` |

## Gap found

- **Manager-only permission is not tested at the route level.** `src/app/api/lots`, `zones` and `tariffs` all call `requireRole('MANAGER')`, but no test calls those routes with a CUSTOMER or STAFF session and expects 403. The baseline's A-61 includes 1 h for "phân quyền Manager". Evidence today is code inspection only.
- Action: one manual acceptance check (log in as Staff, call the lot, zone and tariff endpoints, expect 403) recorded here, or a route-level test. `TODO(RES-01 or RES-02)`: choose and record the result. Under the change-event decision this stays at one check.

## Verdict

Service behaviour: verified by automated tests. Permission: open gap, one check outstanding. Quality Evidence row for the workbook:

```text
A-61 | P08 lot management | Automated tests lots.test.ts (16 passing) cover FR-07..FR-10 and the suspension rule; route-level Manager-only check outstanding | RES-01 | 19/11 | Partly verified
```
