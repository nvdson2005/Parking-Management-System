# F5-05 · Retrospective (A-91) and lessons learned (A-113)

| Field | Value |
|---|---|
| Task | F5-05 in `docs/m3-m4-final-work-division.md` |
| Owner | Nguyễn Tuấn Thành (RES-05). Review: RES-01; every member adds or disagrees in section 5 |
| Report section | M4 §4.5 (lessons learned: repeat, change, improve) |
| Status | Draft 28/11/2026, for review before the report freeze |
| Retrospective format | **Written. No meeting was held.** Input comes from each member's own written reflection (A-114), see section 1 |

## 1. How the retrospective was run

The plan was a 30-minute A-91 meeting with all five members (`docs/m3-m4-final-work-division.md`, F5-05). **No meeting was held.** Instead, the retrospective was done in writing: each member's views come from the reflection that member wrote on their own (A-114, F*-reflection tasks), and RES-05 combined them with the project records into the lessons below. RES-01 must confirm this change. The meeting effort (5 × 0.5 h) was not spent, and the lessons were not discussed as a group. Record this in the W14 weekly log as a deviation from A-91.

### 1.1 Input from each member

| Member | Own written input | State on 28/11 | Lessons it supports |
|---|---|---|---|
| RES-01 Nguyễn Võ Đức Sơn | `docs/m3/a-114-reflection-draft.md` | Draft on `main`; update for W14 pending #39 | L-C1 (log effort on the day), L-C8 (compare remaining work with hours), L-R2 |
| RES-02 Đào Xuân Sơn | `docs/final/res02/a114-reflection.md` | On `main` (#35 merged 28/11), still marked by RES-02 as still to be rewritten in his own words | L-R3 (CP-05 conditions), L-C7 (review and test records kept on the Drive, not in the repo) |
| RES-03 Nguyễn Phạm Mạnh Dũng | `docs/m3/a-114-reflection-draft-res03.md` | Pending #12. The reflection part is still commented out in the file | L-C2, L-C4, L-C8, L-R5 |
| RES-04 Phạm Duy Quý | `docs/final/res04/a114-reflection.md` | On `main` | L-C5, L-R1 (CR-03), L-R4 (AT-100 timing) |
| RES-05 Nguyễn Tuấn Thành | `docs/final/res05/a114-reflection.md` | On `main` | L-C6, L-R3, L-R4, L-R6, L-I9 |

Where a lesson rests on a draft that its author has not confirmed, it stays attributed to that draft until the author ticks it in section 5. Lessons not listed against a member come from the project records:

- the decision record and change-impact analysis (`docs/m3/decision-record.md`, `docs/m3/change-impact-analysis.md`)
- the risk register and the final risk review (`docs/m3/risk-register.md`; `docs/final/res03/risk-register-final.md`)
- the weekly log and the M-03 record (`docs/final/res01/weekly-log-final.md`, `docs/final/res01/m03-decision-and-workshop.md`, pending #39)
- planned against actual (`docs/m3/a-90-planned-vs-actual.md`; `docs/m3/actuals.md`)
- the A-68/CP-05 record, the A-87 dry run (`docs/final/res02/a87-dry-run.md`) and the A-88 internal demo (`docs/final/res05/objectives-o1-o2.md`)

## 2. What happened, in brief

| Date | Event | Source |
|---|---|---|
| 09/11 | Baseline V1.0 frozen. It was re-planned around an MVP that had already been built (`061120c`, "replan baseline around the built MVP") | `docs/m3/baseline-v1.0-freeze.md` |
| 15/11 | Client round 3 answers changed four behaviours (CR-02), absorbed without plan time | Weekly log W12 |
| Week of 16/11 | Lecturer moved the submission from 07/12 to 29/11 (CR-01). Capacity fell from 190 h to 140 h against about 164 h of demand | Decision record |
| 19–20/11 | Option C chosen (keep scope, fold paperwork, trim verification depth, Q22 as fallback). A-105 workshop held on 20/11 (per RES-01) | Decision record; F1-02 |
| 23/11 | Client round 5 answers (Q36–Q46), three days before the dry run | Client interaction log, phase 5 |
| 24/11 | M-03 gate: Q22 triggered by its rule. RES-01 kept the A-72 and A-76 checks. CP-05 passed with conditions C1–C6 | F1-02; `docs/m3/a-68-cp05-test.md` |
| 24–27/11 | A-49 found FR-19..21 missing on screen (CR-03). A-68 found D-01..D-06. Fixes merged (#24, #26, #38) | `docs/final/res04/a49-retest.md`; risk register final |
| 26/11 | A-87 dry run on `ac57507`: 382/382 tests, AT-01..AT-07 and AT-100 pass | `docs/final/res02/a87-dry-run.md` |
| 26/11 | A-88 run as an internal demo because the client was not available. Client confirmation (CP-08) not obtained | `docs/final/res05/objectives-o1-o2.md` |
| 28/11 | A-87 condition A closed: recheck on `d9c6638` (396/396 tests, lint, build) and RES-01's UI check. Conditions B (evidence gaps) and C (re-review) still open | `docs/final/res02/a87-dry-run.md` |

## 3. Lessons

### 3.1 What we would repeat

| ID | Lesson | Evidence | PM area |
|---|---|---|---|
| L-R1 | **Make every change a numbered CR with options, then decide.** CR-01 compared options A, B and C before RES-01 chose C. CR-03 was raised from the A-49 findings instead of being fixed quietly inside a test task. As a result, the effort and the decision can be seen in the plan | `docs/m3/decision-record.md`; `docs/m3/change-impact-analysis.md`; RES-04 reflection | Change control (Ch. 9) |
| L-R2 | **Agree the fallback and its trigger before the gate.** The Q22 rule ("any Must product not verified, or more than 2 days behind") was written on 19/11. At M-03 on 24/11 the trigger could be checked against the rule, and the decision (keep A-72 and A-76) was taken that evening | F1-02 section 3; decision record, "Fallback trigger" | Risk contingency (Ch. 7) |
| L-R3 | **A gate condition is closed by evidence, not by a plan.** CP-05 passed with conditions C1–C6. Each condition was then closed with a record: a hand count, timings on the production build, a video and an overlap check | `docs/m3/a-68-cp05-test.md`; RES-05 reflection | Quality, checkpoints (Ch. 9) |
| L-R4 | **Check the product against an independent count and the agreed scenario.** `scripts/a68-check.ts` counts sessions from the DB and is compared with the UI and a hand count. The A-49 timing script drives the 100-visit scenario the client asked for (max 155 ms against the 5 s limit) | `docs/final/res05/objectives-o1-o2.md`; RES-04 reflection | Quality, measures of effectiveness |
| L-R5 | **Keep IDs on everything and one owner per file.** A-, KB-, CR-, CP- and D- codes in commits and documents made it quick to answer "why did this change". The final division rule (each person writes only their own files under `docs/final/<res>/`) let five people close M3/M4 in parallel with no conflicting edits to shared files | `docs/m3-m4-final-work-division.md` section 2; RES-03 reflection (#12) | Monitoring, traceability |
| L-R6 | **Use a small spec for every code change, then test, lint and build.** D-01, F5-01, CR-03 and D-04 each went through Spec Kit. The reviewer could check the change against the spec and the tests | `specs/006-*`, `specs/008-d04-exit-plate-labels/`; PRs #24, #26, #27, #38 | Quality, execution |

### 3.2 What we would change

| ID | What went wrong | Effect | Evidence | PM area |
|---|---|---|---|---|
| L-C1 | **Nobody logged real hours.** A-100 (own hours in the Task Log) was planned every week and never done | The weekly log uses capacity as the actual figure, so its variance is 0 by construction. Task 4.2 cannot measure effort error. R-G4-02 occurred, and there was nothing in place to detect it | ISS-M3-05; F1-01 "Basis of the hours"; every member's A-114 | Monitoring (Ch. 9) |
| L-C2 | **The baseline was planned after most of the product was built.** The MVP was built with AI assistance before the M2 plan. V1.0 was then re-planned around it | The estimates describe verification and review more than construction, and the activity network does not match how the work was really done. RES-03's draft puts the original self-build plan at about 179 h | `061120c`; RES-03 reflection draft (#12) | Estimation (Ch. 5), Step Wise (Ch. 3) |
| L-C3 | **Client questions went out late.** The round 5 answers arrived on 23/11, three days before the dry run | Q37, Q38, Q45 and Q46 added work in W14. R-G1-01 occurred twice | Risk register final, R-G1-01 and section 3 note | Client consultation, risk (Ch. 7) |
| L-C4 | **The baseline freeze was not protected.** P18 v1.0 was written over a V1.0 file instead of being added as a new file. The `baseline-v1.0` tag stayed on one laptop | The check command still lists one changed V1.0 file. The lecturer cannot run the comparison until the tag is pushed | `docs/m3/baseline-v1.0-freeze.md`; `docs/final/res05/submission-package.md` B2 (F5-06, PR pending) | Configuration and baseline (Ch. 9) |
| L-C5 | **Screens were compared with the SRS only at test time.** FR-19..21 were Must requirements and the API already returned the data, but the screens never showed it | Found late by A-49 and fixed through CR-03 in W14 | RES-04 reflection; `docs/final/res04/a49-retest.md` | Quality planning |
| L-C6 | **The first test runs used the dev server.** Rebuilds caused overlapping simulator runs, and timings were 1–1.5 s against 14–31 ms on the production build | Time lost separating environment effects from real defects. D-01 was still a real defect | RES-05 reflection; A-31 O-01 | Quality, test environment |
| L-C7 | **Meetings and reviews were not recorded when they happened.** The 20/11 workshop and the 24/11 M-03 gate have no minutes; attendance and timing rest on RES-01's statement. The A-09 review (16/11) was committed only on 26/11. CP-02 was not recorded on its planned date | The report has to cite these as "per RES-01", which is weaker evidence | F1-01 "Meetings"; F1-02; `docs/final/res05/a09-srs-review.md` | Monitoring, reporting |
| L-C8 | **Overload was raised late and the capacity gap was never closed.** The gap was about 24 h after the CR-01 cuts and 33.9 h in V2.0 including reserve. RES-03 went over in W14 | Closure work fell on 28–29/11 | Decision record "Residual gap"; F1-01; RES-03 reflection draft | Resource allocation (Ch. 8) |
| L-C9 | **The client demo was not booked in advance.** A-88 had to be run internally | No client acceptance record (CP-08); O1/O2 outcomes assessed as Partial | `docs/final/res05/objectives-o1-o2.md` | Acceptance, closure |

### 3.3 How we would improve the planning and management approach

| ID | Improvement for a future project | Addresses |
|---|---|---|
| L-I1 | Make tracking a gate criterion: a checkpoint cannot pass unless every member's hours for the period are in the Task Log. Logging is part of each task's definition of done, not a separate weekly activity | L-C1, L-C7 |
| L-I2 | When AI tools are used, estimate in two parts: generation (small) and verification, review and decision (most of the effort). Plan before building, or record clearly that the plan describes a product that already exists | L-C2 |
| L-I3 | Put client question rounds on the schedule as dated activities with their own lead time (questions sent at least one week before the work that depends on them). Add a change reserve to the baseline sized from the number of client rounds expected | L-C3, L-C8 |
| L-I4 | Automate the freeze: tag and push at freeze time, add a CI or pre-commit check that rejects changes to baseline files, and require new versions to be added as new files | L-C4 |
| L-I5 | When the SRS version changes, add a short "screen vs SRS" check to the plan for each affected screen, owned by the UI owner, not left to the test phase | L-C5 |
| L-I6 | Define the test environment in the test plan: production build for all timings and acceptance runs, with the SHA recorded in every evidence file | L-C6 |
| L-I7 | Re-run resource levelling after every approved CR and raise any member over capacity at the next weekly log, under the escalation rule | L-C8 |
| L-I8 | Book the client acceptance demo when the baseline is approved, with a fallback date, and treat client availability as a tracked risk | L-C9 |
| L-I9 | One branch and one PR per task, cut from `main`. Stacked PRs say so in the description. Avoid parallel PRs on the same files (#22/#23, and #31/#32/#35 carried the same F2-04 commit) | Rework in merge order |

## 4. Report-ready summary (M4 §4.5)

The team would **repeat** three practices: handling every change as a numbered CR with options, agreeing fallback rules before gates, and closing gate conditions with evidence, including independent counts under the client's own scenario. It would **change** two things first. Actual hours were never logged, so the planned-versus-actual effort comparison rests on estimates. The baseline was planned after most of the product had been built with AI assistance, so it measures verification more than construction. Late client rounds, an unprotected baseline freeze and unrecorded meetings were further weaknesses. For a future project, the approach would make tracking a gate criterion, estimate AI-assisted work by its verification effort, schedule client rounds and the acceptance demo as dated activities with lead time, and automate the baseline freeze.

## 5. Member input (fill before freeze)

Mark each lesson **A** (agree), **D** (disagree, with reason) or **+** (add a lesson). Lessons nobody confirms stay attributed to RES-05 in the report.

| Member | Agree / disagree | Lessons added | Date |
|---|---|---|---|
| RES-01 Nguyễn Võ Đức Sơn | ___ | ___ | ___ |
| RES-02 Đào Xuân Sơn | ___ | ___ | ___ |
| RES-03 Nguyễn Phạm Mạnh Dũng | ___ | ___ | ___ |
| RES-04 Phạm Duy Quý | ___ | ___ | ___ |
| RES-05 Nguyễn Tuấn Thành | A (author) | — | 28/11 |
