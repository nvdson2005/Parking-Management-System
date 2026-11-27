# F2-02 Quality evidence for A-72, A-76, A-77, A-79

| Field | Value |
|---|---|
| Owner | RES-02, Đào Xuân Sơn |
| Date | 26/11/2026 |
| Pinned SHA | `ac57507c9c2924d54ed35e3dac31e327deac4573` (`origin/main`). PR #35 (D-04 fix) was merged on 27/11; the post-merge SHA and its rerun are recorded in `a87-dry-run.md`. The results in this file stay on `ac57507c` |
| Report reference | M3 §3.5 |
| Scope | Per CR-01 option C, A-72 and A-76 were reduced to existing automated tests plus one acceptance pass each; A-77 and A-79 follow the same pattern. Any gap is recorded under the Q22 fallback (the order in which scope is dropped is reports, then simulated payment, then reservations) |
| Basis | Full suite on the pinned SHA: **49 files, 382 tests, 0 failed** (`npm test`, RES-02, 26/11, 12:29; `a87-dry-run.md` §1). Per-file test counts below are a **static count of declared tests in the source on the pinned SHA**, not a per-file run; the pass result comes from the full-suite run. Acceptance passes are the manual run of 26/11 (`a87-dry-run.md` §3, screenshots in `A87/`) |

## 1. Summary

| Activity | Module | Owner of the activity | Automated evidence | Acceptance pass | Result | Gap |
|---|---|---|---|---|---|---|
| A-72 | Reservation (P06) | RES-02 | `reservations.test.ts` 15, `reservation-form.test.ts` 6, `early-arrival-prompt.test.ts` 3, `arrival.test.ts` 5, `notifications.test.ts` 5 | AT-05 (`A05-01..06`) | Pass | No-show wait (TC-RES-12): automated test only on paper, no manual run evidenced (RES-02 to confirm); manual cancel not shown |
| A-76 | Simulated payment (P10) | RES-04 | `fees.test.ts` 2 (4 of 6 combinations on `main`), `exit.test.ts`, `history.test.ts`; RES-04's record `docs/m3/quality-evidence-A-76.md` | AT-06 (`A06-01`, `A06-02`, `A01-07`, `A02-05`) | Pass | 4 of 6 fee combinations covered by automated test on `main` (6/6 only on branch `test/A-76-payment`, no PR yet); by hand only the per-visit fee and the tariff edit effect, not group pricing; RES-04's file is on branch `test/A-76-payment`, not on `main` |
| A-77 | Reports (P11) | RES-05 | `reports.test.ts` 11, `reports-a77.test.ts` 6; `docs/m3/A-77/` (comparison sheet and result screenshot) | AT-07 (`A07-01`, `A07-02`) | Pass | Report screenshot is cropped: only three of the four indicators are in view |
| A-79 | Entry/exit API contract tests | RES-05 | `contract-inout.test.ts` 16; HTTP rehearsal `e2e/round3.e2e.mjs` 25/25 | AT-01, AT-02 (`A01-*`, `A02-*`) | Pass | none known |

## 2. A-72 Reservation module (RES-02)

**Requirements:** one active reservation per vehicle, hold window of 30 minutes, early arrival confirmation, cancellation, no-show expiry, notifications (SRS v2.1 reservation group; the E2E guide `docs/manual-e2e-test-guide.md` TC-RES-xx rows).

**Automated tests (pinned SHA):** `tests/reservations.test.ts` (15), `tests/reservation-form.test.ts` (6), `tests/early-arrival-prompt.test.ts` (3), `tests/arrival.test.ts` (5), `tests/notifications.test.ts` (5). Included in the 382/382 full run. The HTTP rehearsal covers the 409 `RESERVATION_LIMIT` rule, early arrival with and without confirmation (409 `EARLY_ARRIVAL`, then admitted and FULFILLED) and lot suspension cancelling reservations with `LOT_SUSPENDED` (`a87-dry-run.md` §2).

**Acceptance pass (AT-05, 26/11, Customer and Staff on `localhost:3000` / `192.168.2.8:3000`):**

| Step | Result | Evidence |
|---|---|---|
| Reserve zone A for 29A-01001, arrival 15:45 | Created, status Đang chờ, hold until 16:15 | `A05-01` |
| Availability while reserved | Zone A 149 free, 1 used | `A05-02` |
| Second reservation for the same vehicle | Refused, "Xe đã được đặt chỗ" | `A05-03` |
| Staff enters the vehicle before the reserved time | Early-arrival warning with confirm and cancel | `A05-04` |
| Confirm and admit | Zone A 149 / 1 after admission | `A05-05` |
| Reservation after admission | Status Đã nhận (fulfilled) | `A05-06` |
| Reservation for another zone when the vehicle parks in zone B | Cancelled by the system, "bạn đã đỗ xe ở khu vực B" | `A05-06` |

**Gaps (Q22 fallback if the PM wants them closed):**
1. No-show expiry (TC-RES-12): covered by `reservations.test.ts` (expiry of stale PENDING holds frees the spot). **No manual run is evidenced**: there is no screenshot in the `A87/` set. **[RES-02 to confirm whether a manual run took place on 26/11.]** Until then cite only the automated test. If a manual run did take place, add a screenshot of the reservation showing the no-show status.
2. The manual Cancel button was not shown being used (`A05-06` shows a system cancellation).

**Verdict:** Pass for the core flow; two minor gaps above (no screenshot of the no-show run; manual Cancel not shown).

## 3. A-76 Simulated payment module (RES-04's activity; RES-02 records the acceptance pass)

**Requirements:** fee = per-visit price of (vehicle type, fee group), six combinations (FR-34); payment record and history (SRS v2.1 FR-24, FR-35 to FR-37; per-visit fee only, Q36).

**Automated tests:** `tests/fees.test.ts` (2 tests; on `main` and on `ac57507c` they check 4 of the 6 combinations: motorbike × the 3 fee groups and car × Khách. Car × Sinh viên appears only in the missing-tariff case, and car × Giảng viên/Nhân viên is not checked. The 6/6 version is on branch `test/A-76-payment`, commit `26677dc` (RES-04), not yet in a PR; it merges into `main` without conflict), `tests/exit.test.ts` (fee uses the fee group snapshotted at entry), `tests/history.test.ts`. RES-04's own record is `docs/m3/quality-evidence-A-76.md` on `test/A-76-payment` (not yet on `main`); link to it after merge instead of copying it.

**Acceptance pass (AT-06, 26/11):**

| Check | Result | Evidence |
|---|---|---|
| Student fee table | Motorbike 2.000 đ, car 10.000 đ per turn | `A01-01` |
| Motorbike exit and payment | 2.000 đ, confirmed by Staff 1 | `A01-07`, `A06-01` |
| Car exit and payment | 10.000 đ, zone C, plate 30K-123.45, fee group Khách (`A03-05`) | `A02-05`, `A06-01` |
| Customer payment history | 29A-02001, in 13:50:18, out and paid 13:51:23, 2.000 đ | `A06-02` |
| Guest car fee preview | 15.000 đ, fee group Khách | `A03-05` |

**Note on the 15.000 đ guest fee:** the seed gives every fee group the same price (motorbike 2.000, car 10.000), per RES-04's record, so 15.000 đ means the guest car price was changed on the manager tariffs page during AT-03 (RES-02's report). Evidence is `A03-05`: the exit preview for plate 30K-123.45, zone C, car, fee group Khách, entry 13:39:37, **15.000 đ**. The same plate was charged **10.000 đ** at 13:34:22 in AT-02 (`A02-05`), so the price changed between the two visits. `A03-05` shows the effect of the change, not the edit itself: **the tariff edit screen was not captured**, and the price shown (15.000 đ) is the only value the screenshots give for the new tariff.

**Gaps:**
1. Fee by fee group is shown by automated test only, and on `main` only for 4 of the 6 combinations (see above). The by-hand checks show the per-visit fee and that a tariff edit takes effect: the car in AT-02 (`30K-123.45`) is in fee group Khách (`A03-05`), not Sinh viên, and because the seed gives every fee group the same price, no by-hand check on seed data tells the groups apart. State it that way; do not claim by-hand evidence of group pricing. The student car price (10.000 đ) is seen only in the fee table (`A01-01`).
2. Either merge `test/A-76-payment` (6/6 test), or keep the wording "4 of 6 combinations by automated test".
3. The tariff edit screen is not captured (see the note above).
4. `A06-01` (13:51) shows only the payments of 13:51; the payments of 13:30 (`A01-07`) and 13:34 (`A02-05`) are not in view, and it lists plate `30K-123.42`, a different vehicle from `30K-123.45` (RES-02, 27/11), paid 10.000 đ at 13:51. **[RES-02 to fill: screenshot cropped, or DB reset between scenarios.]**

**Verdict:** Pass for the per-visit fee, the payment record and history; fee by group is by automated test for 4 of 6 combinations until the 6/6 test is merged.

## 4. A-77 Report module (RES-05's activity; RES-02 records the acceptance pass)

**Automated tests:** `tests/reports.test.ts` (11), `tests/reports-a77.test.ts` (6). RES-05's evidence is in `docs/m3/A-77/` (`A-77_So-sanh.xlsx`, `A77_test_result.png`). The HTTP rehearsal confirms the report keeps the 24-hour series with per-zone and per-type slices.

**Acceptance pass (AT-07, 26/11):** the simulator generated 7 days of history (440 sessions, 55 reservations, 440 payments; `A07-01`). The report page shows the hourly occupancy chart, the top entry hours (20:00 with 35 entries, 06:00 with 34), revenue total 2.021.000 đ with daily bars, and a no-show rate of 53,7% (`A07-02`).

**Gaps:**
1. `A07-02` is cropped: add one full-page screenshot showing all four indicators.
2. The 53,7% no-show rate is on generated data and may draw a question at the demo; have the explanation ready (RES-05 for the simulator, RES-03 for the report).

**Verdict:** Pass, with the screenshot gap.

## 5. A-79 Entry/exit API contract tests (RES-05's activity; RES-02 records the acceptance pass)

**Automated tests:** `tests/contract-inout.test.ts` (16), which RES-03's CP-02 review cites as the check of the entry/exit contract; the HTTP rehearsal `e2e/round3.e2e.mjs` passes 25/25 on the pinned SHA.

**Acceptance pass:** AT-01 and AT-02 exercise entry, exit and payment through the UI on the same contract (`A01-02..07`, `A02-01..05`). The exception scenarios AT-EX01..AT-EX05 (27/11, D-04 build, `AX*` screenshots) exercise the same contract for exceptions.

**Gaps:** none known. The contract adds the optional `confirmEarly` field and the `EARLY_ARRIVAL` error (Q31, CR-02), covered by the early-arrival tests.

**Verdict:** Pass.

## 6. Paste-ready workbook rows (Quality Evidence)

RES-03 pastes these on 28/11; do not edit the `.xlsx`.

| Test | SHA | Date | Result | Evidence link |
|---|---|---|---|---|
| A-72 reservation module | `ac57507c` | 26/11/2026 | Pass: 34 declared tests in 5 files within the 382/382 run; AT-05 Pass; no-show wait by automated test only (manual run to be confirmed); manual cancel not shown | this file §2 |
| A-76 simulated payment | `ac57507c` | 26/11/2026 | Pass: fee tests and exit/history tests within the 382/382 run; AT-06 Pass; 4 of 6 fee combinations by test on `main` (6/6 on unmerged `test/A-76-payment`); group pricing not shown by hand | this file §3; `docs/m3/quality-evidence-A-76.md` after merge |
| A-77 report module | `ac57507c` | 26/11/2026 | Pass: 17 declared tests in 2 files; AT-07 Pass; screenshot of four indicators to add | this file §4; `docs/m3/A-77/` |
| A-79 contract tests | `ac57507c` | 26/11/2026 | Pass: 16 declared tests; e2e 25/25; AT-01 and AT-02 Pass | this file §5 |

Report reference: M3 §3.5.
