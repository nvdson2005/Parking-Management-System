# F2-05 Measures of effectiveness: O3, O4, O5

| Field | Value |
|---|---|
| Owner | RES-02, Đào Xuân Sơn |
| Date | 26/11/2026 |
| Pinned SHA | `ac57507c9c2924d54ed35e3dac31e327deac4573` |
| Report reference | M4 §4.3 (Task 4.3: evaluate achievement of the original objectives; distinguish product completion from achievement of project and business objectives) |
| Status | **DRAFT for 26/11.** O5 cannot be concluded before the client demo A-88 on 27/11. Section 6 is reserved to be filled after A-88 |
| Companion files | `objectives-o1-o2.md` (RES-05, not yet in the repository on 26/11), `traceability-matrix.md` (RES-04, F4-03), `checkpoint-log.md`, `a87-dry-run.md`, `quality-evidence-modules.md`. The figures here must agree with them |

## 1. Objectives and how they are read

Objectives are from M1 1.4.3 (SRS v2.1 section 1.3).

| ID | Objective | Requirements traced (SRS v2.1 section 8.1) |
|---|---|---|
| O3 | Optimise parking-space utilisation and help management monitor demand | FR-20, FR-27 to FR-33, FR-38 to FR-41, FR-50 to FR-53 |
| O4 | Reduce errors and disputes in fee calculation and exception handling | FR-24, FR-25, FR-34 to FR-37, FR-46 to FR-50 and others (24 requirements) |
| O5 | Deliver the agreed scope and meet the client's acceptance criteria | FR-46 to FR-50, NFR-09, NFR-11 |

**Two questions are answered separately for each objective**, as the assignment asks:

- *Product complete?* Is the functionality built and does it work on the pinned SHA?
- *Objective achieved?* Is there evidence that the outcome the objective names has happened?

The project has no real parking lot and no baseline measurements. The client accepted estimated baselines and simulated data (Q26). Evidence therefore shows that the system **can** deliver each outcome on simulated data. It does not show a real-world improvement, and this file does not claim one.

## 2. Summary

| Objective | Product complete? | Objective achieved? | Main reason for the gap |
|---|---|---|---|
| O3 | **Yes** for reservations and the four report indicators | **Partly.** Monitoring is demonstrated on simulated data; improved utilisation is not measured | No real usage data, no baseline; no-show wait not run by hand |
| O4 | **Yes** for fees and the five exceptions | **Mostly, on correctness.** Every fee combination and every exception behaves as specified; a reduction in errors or disputes is not measured | No before/after comparison; manual exception runs are from 24/11, not on the pinned SHA |
| O5 | **Largely yes** (all eight scenarios run on 26/11 passed) | **Not yet concluded** | Client acceptance (A-88, 27/11) pending; CP-06 and the acceptance thresholds not confirmed by the client |

## 3. O3: utilisation and demand monitoring

| Measure | Target | Actual | Evidence |
|---|---|---|---|
| Reservation flow works end to end (create, one per vehicle, early arrival, fulfil, cancel, wrong-zone cancel) | All steps behave as specified | **Met** in AT-05 on 26/11 | `a87-dry-run.md` §3 (`A05-01..06`); `reservations.test.ts` 15, `arrival.test.ts`, `early-arrival-prompt.test.ts`; HTTP rehearsal 25/25 |
| Reserved spots reduce free spots and return on cancel | Free changes by 1 per event | **Met**: zone A 150 to 149 on reserve (`A05-02`) | `a87-dry-run.md`; `availability.test.ts` 12 |
| Report shows four indicators: hourly utilisation, peak hours, revenue, no-show rate | All four computed from the data | **Met on generated data**: 7-day history of 440 sessions, 55 reservations, 440 payments; top entry hours 20:00 (35) and 06:00 (34); revenue 2.021.000 đ; no-show rate 53,7% | AT-07 (`A07-01`, `A07-02`) |
| Report figures equal a hand calculation | Match | **Met in automated tests**: utilisation hour 9 = 2/5 = 0.4; no-show rate = 1/(3-1) = 0.5; revenue 5.000 | `reports.test.ts` 11, `reports-a77.test.ts` 6; `docs/m3/A-77/` |
| Utilisation actually improved | Not defined with a number | **Not measured** | No real lot, no baseline |

Gaps and how they affect the claim:

1. The AT-07 screenshot is cropped and shows three of the four indicators. A full-page capture is needed before this row is cited as complete.
2. The no-show expiry (TC-RES-12, 33 minutes of waiting) was verified via automated unit/integration tests (`reservations.test.ts`) rather than a live 33-minute manual wait during the 26/11 dry run.
3. The 53,7% no-show rate comes from generated data and is not a finding about real behaviour. Prepare the explanation for the demo (RES-05 simulator, RES-03 report).

**Conclusion:** O3 is achieved as a monitoring capability. It is not shown as an improvement in utilisation. State it that way in the report.

## 4. O4: fee and exception accuracy

| Measure | Target | Actual | Evidence |
|---|---|---|---|
| Fee equals the tariff for each of 6 vehicle type × fee group combinations | 100% | **Met in automated test**; by hand: student motorbike 2.000 đ, car 10.000 đ | `fees.test.ts` (6 combinations, one test; extended on branch `test/A-76-payment`, not merged); `A01-01`, `A01-07`, `A02-05`, `A06-01` |
| Fee uses the tariff at confirmation and the fee group snapshotted at entry | Correct | **Met** | `exit.test.ts` (KB-02, fee group snapshot) |
| One payment per closed session; close and payment in one transaction | Correct | **Met** | `exit.test.ts` (KB-03, one payment per session); `A06-01` shows one row per session |
| Customer sees the same amount as the payment record | Match | **Met**: 29A-02001, 2.000 đ in history and in payments | `A06-02`, `A06-01` |
| Five exceptions handled as specified (EX-01 to EX-05) | 5 of 5 | **Met in automated tests on the pinned SHA** (contract tests CT-04 to CT-09, simulator EX01..EX05 tests; lot suspension also in the 25/25 HTTP run) | `contract-inout.test.ts`, `simulator.test.ts` within the 382/382 run |
| Exceptions run by hand through the UI | 5 of 5 | **Met on an earlier commit**: EX-02 (T07), EX-03 (T08), EX-05 (T10) in A-68; EX-01 and EX-04 in A-67 | `docs/m3/a-68-cp05-test.md` on `main` at `8472986`, 24/11; `a-67-integration-check.md`. **Not rerun on `ac57507c`** |
| Fewer errors or disputes than before | Not defined with a number | **Not measured** | No before/after comparison is possible |

Gaps and how they affect the claim:

1. D-04 (the exit preview field labelled "Observed plate" showed the plate recorded at entry) remains recorded as open and owned by RES-04 pending final confirmation on `ac57507c` before the 27/11 demo. However, the mismatch warning, the confirmation flow, and the log entry all functioned properly.
2. The manual exception evidence is from 24/11. RES-05 drives the exceptions at the 27/11 demo; add that outcome.

**Conclusion:** O4 is achieved as correctness: each fee and each exception behaves as specified, with manual evidence on an earlier commit. A reduction in errors or disputes is not measured.

## 5. O5: agreed scope and client acceptance

| Measure | Target | Actual | Evidence |
|---|---|---|---|
| Acceptance scenarios run on the pinned SHA | All pass | **8 of 8 pass** (AT-01 to AT-07, AT-100); 0 defects raised | `a87-dry-run.md` §3 |
| Automated suite | No failures | **382 of 382** pass, 49 files; lint and build clean; HTTP rehearsal 25 of 25 | `a87-dry-run.md` §1, §2 |
| 100-session scenario | 100 sessions, 0 rejected, availability consistent | **Met**: 100 entries, 69 exits, 0 rejected; 31 inside = used A 7 + B 12 + C 12; free 143 / 138 / 18 | `A100-01`, `A100-02`; independent hand count and DB count in `docs/m3/a-68-cp05-test.md` (7/12/12, 25/11) |
| Client confirmed the acceptance scenario list (CP-06) | Confirmed by email | **Not on file (fallback applied)** | `checkpoint-log.md` CP-06 |
| Client accepted the proposed thresholds (Q28: 100% hand-count match, 100% complete records, 5 of 5 exceptions, at most 3 s per entry) | Accepted | **Not answered by the client** (risk R-M3-06); the team's thresholds are used as an assumption | `docs/m3/risk-register.md` |
| Client demo accepted (A-88, 27/11) | Accepted | **Pending** (to be recorded after A-88 on 27/11) | Section 6 below |
| Gates closed | All closed | **Open**: CP-01 (deviation), CP-02 (pending RES-01 sign-off), CP-05 (conditions C1, C4, C2 waiver, D-04), CP-06 (fallback), CP-07 (review by RES-04 and decision by RES-01) | `checkpoint-log.md` §3 |
| Scope fully delivered | Completed, partial, deferred, removed all listed | **In progress** | Scope-status table `docs/final/res05/scope-status.md` (F5-04) |

Points that weaken the claim and must be stated, not hidden:

1. **Q23 is unmet.** The CP-05 demo video was not sent to the client; the waiver is recorded as the user's instruction of 25/11 and still needs formal acceptance.
2. **SRS wording.** Four High findings from the CP-01 review (R09-02, R09-03, R09-04, R09-05) remain as wording conflicts in SRS v2.1 (`cp01-srs-review.md` §4). The behaviour tested follows what the client confirmed.
3. **Open Must gaps.** SRS section 9 lists differences between the SRS and the code that the project manager decides. Use the scope-status table for the final count, not this file.

**Conclusion:** the product is complete enough for the demo. The objective "meet the client's acceptance criteria" is **not yet achieved**, because the client has not accepted the scenarios, the thresholds or the demo. Conclude after 27/11.

## 6. After the demo on 27/11

Fill these rows once A-88 is completed on 27/11, then update the document status above from DRAFT to FINAL.

| Item | Entry |
|---|---|
| A-88 outcome (accepted / accepted with items / not accepted) | *(Pending 27/11 demo)* |
| Client comments that change an O3, O4 or O5 conclusion | *(Pending 27/11 demo)* |
| Exception run at the demo (AT-EX02..AT-EX05) | *(Pending 27/11 demo)* |
| D-04 state | *(Pending 27/11 demo)* |
| Final O5 conclusion | *(Pending 27/11 demo)* |

Report reference: M4 §4.3.