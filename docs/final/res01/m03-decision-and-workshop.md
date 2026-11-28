# M-03 decision and A-105 workshop record (F1-02)

| Field | Value |
|---|---|
| Task | F1-02 in `docs/m3-m4-final-work-division.md` (A-105 workshop record, M-03 decision, Q22 outcome) |
| Owner | RES-01, Nguyễn Võ Đức Sơn |
| Report ref | M3 §3.6 |
| Status | Draft 26/11/2026. Items marked `TODO(RES-01)` are facts only RES-01 can confirm. Nothing below was inferred. |

Sources: [decision record](../../m3/decision-record.md), [change impact analysis](../../m3/change-impact-analysis.md) (CR-01, CR-03), [weekly log draft](../../m3/weekly-log-draft.md).

## 1. Change event and options (A-99, A-105)

| Item | Record |
|---|---|
| Event | CR-01: the lecturer moved the final report and submission (M-05) from 07/12 to 29/11. Issued in the week of 16/11 (per RES-01). |
| Impact analysis | A-99, 19/11. Demand 172.1 h against 140 h of capacity; about 24 h gap after cuts. |
| Options | A absorb; B descope under Q22; **C hybrid: keep scope, fold paperwork, trim verification depth, Q22 as a pre-agreed fallback**. At least two alternatives were compared, as Task 3.6 requires. |
| Choice | **Option C**, approved by RES-01 on 19/11/2026. |
| Why C | Protects O1, O2, the 27/11 demo and the submission. B alone saves at most about 5 h and damages O3 and O4 evidence, so it stays only as the fallback inside C. |
| Residual | About 11.5 h unresolved at approval. The workshop was to choose the levers for it. |

## 2. A-105 workshop

| Item | Record |
|---|---|
| Planned | 30 minutes, five members (5 x 0.5 h), chaired by RES-01. Agenda: facts and gap; options A/B/C; cuts per member and extra W14 hours; levers for the residual; fallback trigger and who reports on 24/11. |
| Date | 20/11/2026 (per RES-01). |
| Attendance | All five members (RES-01 to RES-05), per RES-01. No attendance record exists in the repository, so this rests on RES-01's statement. |
| Levers chosen | `TODO(RES-01): confirm.` The planning assumption was Option C plus one extra W14 hour per member. |
| Capacity commitment | RES-01 reported on 24/11 that all five members committed to **12 h in W14** and to work on **28–29/11**. This is a PM-reported commitment, not a measured one. |

Until RES-01 confirms the levers, cite the workshop as "held 20/11 per RES-01, levers not recorded" and do not cite the assumed outcome as a measured one.

On 27 November, RES-01 approved Option C as the closeout approach. Keep the core pilot and A-72/A-76 checks, consolidate report inputs, assign outstanding evidence to its owners, and plan against the reported 12 h per member in W14. The actions agreed at the 20 November workshop still need confirmation.

## 3. M-03 gate, 24/11/2026

| Input | Outcome |
|---|---|
| Rule | Q22 fires if, at M-03, any Must product is not verified or the schedule is more than 2 days behind. A member short on hours is not a trigger (R-G4-02, escalated under working rule 3). |
| Gate record | No dated M-03 decision was recorded at the 24/11 gate. This record does not create one retroactively. |
| Must verification | A-61 and A-67 evidence available. CP-05 recorded by RES-02 on 24/11 as **pass with conditions** C1–C6. Some Must checks (A-49 availability screen) were still open at the gate. |
| Schedule | Regenerated V2.0 models a levelled finish about working day 24.63 of 15. It is a model forecast, not a measured variance. A-68 finished 24/11, one day after its 23/11 plan. |
| **Q22 trigger** | **Triggered on the stated rule** (Must verification incomplete). |
| **Q22 decision** | **Late 24/11 decision by RES-01: retain the A-72 and A-76 manual acceptance checks.** No verification is omitted under Q22. The 2.6 h fallback saving is not counted, and the checks are not listed as omitted in P14. |
| Effect | Coverage kept for O3 and O4. The effective capacity gap is about 2.6 h larger than the V2.0 model assumed. Recovery rests on the 12 h W14 commitment and RES-03's revised remaining-work forecast. |
| Decision time and participants | Evening of 24/11/2026, about 20:00, all five members, per RES-01. The time is RES-01's entry; no system record backs it. |

## 4. CR-03 (24/11)

| Item | Record |
|---|---|
| Event | Lecturer replies of 23/11 plus gaps found in A-49 testing. Raised by RES-04. Merged in PR #20. |
| Options | 1 all groups, 2 A+B now and C+D if hours allow, 3 A only, 4 no change. |
| Choice | **Option 2**, decided by RES-01 on 24/11. Protect the Must availability screen and the demo path first. Anything unfinished goes in A-110 (scope status) as partial or deferred. |
| Delivery since | Group D (Q36–Q46 product items) integrated into `main` by PR #21 on 24/11. Availability screen and demo-path fixes merged in PR #24 on 25/11. Retest evidence is `docs/final/res04/a49-retest.md` (F4-05). |
| Baseline effect | Listed as a V2.0 change entry. Approval of V2.0 stays with F1-03 and needs F3-02. |

## 5. Open items

| Item | Owner | Needed before |
|---|---|---|
| Confirm the levers chosen at the workshop (the one remaining `TODO(RES-01)` in section 2) | RES-01 | F1-03, report freeze 28/11 |
| Formal acceptance of the CP-05 conditions, including the waived C2 client video (Q23 unmet until accepted) | RES-02 records, RES-01 approves | A-87 / CP-07 |
| Revised remaining-work forecast and recovery assignment | RES-03 | F3-02, F1-03 |
| Candidate SHA for A-87 (`26a623c` is out of date; `main` has since gained #22, #24, #26, #27, #28) | RES-02 | A-87 dry run |
