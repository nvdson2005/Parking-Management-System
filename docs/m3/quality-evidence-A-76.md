# Quality Evidence: A-76 simulated payment module (P10)

| Field | Value |
|---|---|
| Activity | A-76, test the simulated payment module: fee for all 6 combinations, payment record, history (planned 20–24/11; reduced by CR-01 option C to existing automated tests plus one acceptance pass) |
| Verified by | Phạm Duy Quý (RES-04) |
| Date | 2026-11-24 |
| Evidence | `tests/fees.test.ts` (6/6 combinations, branch `test/A-76-payment`); existing `tests/exit.test.ts`, `tests/history.test.ts`; manual pass in section 2 |
| Requirements | SRS v2.1: FR-24, FR-34, FR-35, FR-36, FR-37 (per-visit fee only, Q36). MVP-spec numbering used in the test plan and the E2E guide: FR-26, FR-27, FR-28 |
| Test plan rows | P20: A-76, RT-05, objective O4 (6/6 fee combinations); E2E guide TC-PAY-01..03 |

## Environment

| Item | Value |
|---|---|
| Code | branch `test/A-76-payment` (= `main` `399fa9c` + the 6-combination fee test; no product code changed) |
| Server | `npm run dev` on `http://localhost:3000`, single process |
| Data | `prisma/dev.db` after `npx prisma migrate reset --force`. The seed gives every fee group the same price (motorbike 2,000, car 10,000), so section 2 first sets six different prices |
| Browsers | TODO(RES-04): Chrome version; Customer in an incognito window |
| Accounts | `manager1@demo.local`, `staff1@demo.local`, `customer01@demo.local` (Student, motorbike `29A-01001`), `customer02@demo.local` (Lecturer/Staff, motorbike `29A-02001`) |

## 1. Automated tests (L2)

Full suite on 24/11: **24 files, 209 tests passing** (`npx vitest run`, separate `prisma/test.db`).

| Requirement (SRS v2.1) | Test |
|---|---|
| FR-34 fee = per-visit price of (vehicle type, fee group), 6/6 combinations | `fees.test.ts` › `returns the tariff price for each of the 6 vehicle type and fee group combinations` (**extended in A-76**: car × Student and car × Lecturer/Staff added; all six prices differ) |
| FR-34 missing tariff is reported, not a crash | `fees.test.ts` › `throws NOT_FOUND when the tariff is missing` |
| FR-34 fee group is the one snapshotted at entry | `exit.test.ts` › `fee uses feeGroup snapshotted at entry even if vehicle later claimed by a customer` |
| FR-34 price is read at confirm time | `exit.test.ts` › `KB-02 fee is the tariff at confirm time, not at preview time (A-74)` |
| FR-35 session closes only together with a confirmed payment | `exit.test.ts` › `closes session and creates CONFIRMED payment with group fee`; `KB-03 close and payment are one transaction: payment failure leaves session OPEN (A-74)` |
| FR-36 one payment per closed session | `exit.test.ts` › `one payment per closed session (A-74, FR-27)` |
| FR-37 history per customer | `tests/history.test.ts` |

**RT-05 closed.** Before A-76 the automated tests asserted only 4/6 combinations, and car × Guest was the only car price checked. Mutation check: with `computeFee` changed so every car uses the Guest price, the old test file still passed (2/2) and the new test fails (`expected 20000 to be 12000`). `src/server/services/fees.ts` was restored afterwards.

## 2. Manual pass (TC-PAY-01..03)

Preparation: Manager → **Tariffs**, set six different prices and save. Suggested values:

| Vehicle type | Student | Lecturer/Staff | Guest |
|---|---|---|---|
| Motorbike | 3,000 | 5,000 | 7,000 |
| Car | 12,000 | 15,000 | 20,000 |

### TC-PAY-01 Fee per combination (FR-34)

Staff records an entry, then the exit, for each row. The exit screen shows the fee before confirming.

| # | Vehicle | Group | Expected fee | Fee shown at exit | Amount in Payments | Result |
|---|---|---|---|---|---|---|
| 1 | `29A-01001` (customer01) motorbike | Student | 3,000 | TODO | TODO | TODO |
| 2 | `29A-02001` (customer02) motorbike | Lecturer/Staff | 5,000 | TODO | TODO | TODO |
| 3 | guest plate `51F-888.01`, motorbike | Guest | 7,000 | TODO | TODO | TODO |
| 4 | guest plate `51F-888.02`, car | Guest | 20,000 | TODO | TODO | TODO |

Car × Student and car × Lecturer/Staff are covered by the automated test only: no customer in the seed owns a car.

### TC-PAY-02 Payment record (FR-35, FR-36)

Manager → **Payments**.

| Check | Expected | Result |
|---|---|---|
| Rows 1–4 above each appear once | 4 payments, one per exit | TODO |
| Each row shows plate, zone, amount, paid-at time and *Confirmed by* | `staff1` as confirmer | TODO |
| From/To filter | Narrows the list to the chosen dates | TODO |

### TC-PAY-03 Customer history (FR-37)

| Check | Expected | Result |
|---|---|---|
| `customer01` → **Parking history** | Only customer01's sessions, newest first, with amount 3,000 and paid-at for row 1 | TODO |
| `customer01` does not see row 2 | customer02's session is absent | TODO |

## Verdict

TODO(RES-04) after section 2. Expected **Verified** if TC-PAY-01..03 pass: 6/6 combinations by automated test, 4 combinations confirmed end to end, payment record and history checked.

Quality Evidence row for the workbook:

```text
A-76 | P10 payment | fees.test.ts 6/6 combinations (RT-05 closed, mutation-checked); exit/history tests pass (209/209); manual TC-PAY-01..03: TODO | RES-04 | 24/11 | TODO
```
