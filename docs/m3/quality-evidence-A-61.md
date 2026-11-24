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

## Verification on 20 November 2026

Commit `a55f6a8` ran on a local Next.js development server with a disposable seeded SQLite database.

The targeted HTTP verification authenticated as the seeded Staff user. All seven protected endpoints returned HTTP 403 with valid requests. The preceding Manager GET authenticated successfully and supplied real lot and zone IDs.

- GET /api/lots
- POST /api/lots
- PATCH /api/lots/:id
- POST /api/zones
- PATCH /api/zones/:id
- GET /api/tariffs
- PUT /api/tariffs

The targeted script exited 0. The A-61 permission gap is closed.

## Phase 5 extension: lot information and fee groups

The 20 November A-61 verdict covers the earlier lot CRUD, tariff and permission behavior. Phase 5 adds the following **pending integrated-build checks** from lecturer answers Q37, Q38 and Q45. Their results must cite the final SHA of [product PR #17](https://github.com/nvdson2005/Parking-Management-System/pull/17) after its base [#11](https://github.com/nvdson2005/Parking-Management-System/pull/11) is integrated.

| Check | Expected result | Evidence to record |
| --- | --- | --- |
| Manager edits pilot-lot hours; Customer views them | Saved hours appear to the Customer; an otherwise valid entry and reservation outside the displayed hours remain governed by ordinary rules. | Account roles, lot, old/new hours, API/UI result, SHA |
| Two Customer fee groups | Each account sees its own configured motorcycle and car per-visit rates before parking. | Account group, tariff values, observed view, SHA |
| Customer requests group change | Customer can request but cannot directly apply the group update; Manager applies an approved request. | Request and authorization results, before/after group, SHA |
| Migration and regression | Candidate applies migrations without data loss; existing seven Staff 403 checks and lot management tests remain valid. | Migration command/result, suite/lint/build, SHA |

**Status:** Phase 5 extension not yet verified on an integrated candidate. The existing A-61 permission evidence remains valid for the tested `a55f6a8` revision only. Keep these results distinct in the Quality Evidence log.

### Current PR #17 head review (24 November)

PR #17 is at `bcbbac3d9531cf05d876cbab9ce6e1476c8b923e`, stacked on PR #11 at `36b1c9158034761bd094a62a8c6485d8281eb3c4`. Its owner recorded a production-build scratch-database exercise at the earlier `e732938` commit in [PR #17's round-5 evidence](https://github.com/nvdson2005/Parking-Management-System/blob/bcbbac3d9531cf05d876cbab9ce6e1476c8b923e/docs/m3/evidence/round5-e2e.md): Manager saved 06:00–22:00 hours, an unpaired value returned 400, Staff update returned 403, Customer saw the new hours and per-visit prices, and a Customer request was applied by Manager with a notification. The owner also records 323 passing tests, lint with zero errors and a passing build in [PR #17's workbook rows](https://github.com/nvdson2005/Parking-Management-System/blob/bcbbac3d9531cf05d876cbab9ce6e1476c8b923e/docs/m3/workbook-rows.md). The seed used equal prices across groups; `tests/my-tariff.test.ts` covers different group prices in service tests.

This is **owner-reported head-level evidence**, not RES-01's final integrated A-61 result. PR #11 remains under requested changes and conflicts with `main`, so the final SHA, migration application, two-group Customer display, outside-hours admission, full regression and inherited Staff permission checks must be rerun after integration. Keep T011 open until those results are recorded against that final build.
