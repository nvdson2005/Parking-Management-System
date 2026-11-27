# Final Work Division: Milestone 3 and Milestone 4 closure (24/11 – 29/11/2026)

Scope: everything still open for Tasks 3.1–3.8 and 4.1–4.6 **except** work already carried by an open PR (section 4). Report writing (A-108, A-92) is deferred to the final phase; these tasks produce the **section-ready inputs** the report will cite.

Supersedes section 7 of `docs/m3-m4-work-division.md` for the remaining work. Baseline V1.0 and V2.0 files are not edited by this plan.

Basis: state of `origin/main` and the open PRs on 24/11 (#8, #12, #18, #19, #20, #22, #23; #17 is merged). Hour figures are estimates, not measurements.

## 1. Dates

| Date | Event |
|---|---|
| 25/11 | Code fixes (RES-04, RES-05) open as PRs. Evidence rows from RES-02 drafted |
| 26/11 | A-87 dry run (CP-07), on the pinned candidate SHA |
| 27/11 | A-88 client acceptance demo |
| 28/11 | All section inputs merged. Report freeze (the report itself is written in the final phase) |
| 29/11 | Submission (confirm on LMS) |

## 2. Rules that keep the packages disjoint

1. **One owner per file.** Every task writes only to its own path under `docs/final/<res>/`, or to the code files named in the task. Nobody edits another person's file.
2. **Do not edit shared files directly:** `docs/m3/workbook-rows.md`, `docs/m3/decision-record.md`, `docs/m3/risk-register.md`, `docs/m3/a-90-planned-vs-actual.md`, and the workbook `.xlsx`. Write paste-ready rows in your own file instead. RES-03 pastes them into the workbook once, on 28/11, so the binary file has a single editor.
3. **Code PRs** follow `AGENTS.md`: Spec Kit artifacts for the change, A-ID in commit messages, `codegraph sync` before finishing, `npm test`, `npm run lint`, `npm run build` green. Only RES-04 and RES-05 touch `src/`, and in different files (see tasks).
4. **Dependencies on other people's output are read-only.** Link to it. If it is not merged yet, link to the PR and mark the row "pending #N".
5. **Every task ends with its report reference filled in** (section 5). RES-01 ticks the tracker when the PR merges.

## 3. Packages

Load: RES-02, RES-03, RES-04 and RES-05 are about 8 h each. RES-01 is about 3.5 h because RES-01 reviews and merges. RES-03 also carries the open PR #12, which is outside this count.

Report reference format: **M3 §3.x** and **M4 §4.x** follow the Task numbers in `resources/CO3011_Assignment_2026.pdf`. **TR** is the mandatory traceability matrix. **SUB** is the submission package.

### RES-01, Nguyễn Võ Đức Sơn, PM (about 3.5 h plus review and merge)

| ID | Task | Output file | Report ref | h |
|---|---|---|---|---|
| F1-01 | Weekly logs W12 and W14 (W13 finalized). Collect each member's actual hours (A-94, A-100). Include the line that Task 3.8 lower-level plans, section 4 of `m3-m4-work-division.md`, were created during execution | `docs/final/res01/weekly-log-final.md` | M3 §3.2 | 1.5 |
| F1-02 | A-105 workshop record (date, attendees, options, choice) and the 24/11 M-03 decision, including whether Q22 fires | `docs/final/res01/m03-decision-and-workshop.md` | M3 §3.6 | 1.0 |
| F1-03 | Approve Baseline V2.0 using the `baseline-v2-handoff.md` checklist, after F3-02. Record approval and any change | `docs/final/res01/baseline-v2-approval.md` | M3 §3.7 | 0.5 |
| F1-04 | Update own reflection `a-114-reflection-draft.md` through W14 (A-114) | `docs/m3/a-114-reflection-draft.md` (existing, RES-01 only) | M4 §4.6 | 0.5 |
| F1-05 | Review and merge PRs in the sequence in `docs/superpowers/plans/2026-11-24-phase-5-acceptance-coordination.md`; tick the tracker (section 5) | this file | all | — |

### RES-02, Đào Xuân Sơn, QA (about 8 h)

| ID | Task | Output file | Report ref | h |
|---|---|---|---|---|
| F2-01 | A-09 SRS review (CP-01): confirm whether it was done, record the outcome or record it as skipped with the reason | `docs/final/res02/cp01-srs-review.md` | M3 §3.5 | 1.0 |
| F2-02 | Quality evidence for A-72, A-76, A-77, A-79: existing automated tests plus one acceptance pass each, and record any gap under the Q22 fallback | `docs/final/res02/quality-evidence-modules.md` | M3 §3.5 | 2.0 |
| F2-03 | Gate log CP-01..CP-07: outcome, date, reviewer, evidence link for each. CP-04 and CP-05 point to #8 and #18; CP-02 points to #12. Decide the CP-05 gate | `docs/final/res02/checkpoint-log.md` | M3 §3.5 | 1.0 |
| F2-04 | A-87 internal dry run, merged with A-95 (CP-07) on 26/11. Pin the candidate SHA. Cover AT-01..AT-07 and the 100-visit scenario; list defects with owners | `docs/final/res02/a87-dry-run.md` | M3 §3.5, M4 §4.1 | 2.5 |
| F2-05 | Measures of effectiveness for O3, O4, O5 against evidence (product complete vs objective achieved) | `docs/final/res02/objectives-o3-o5.md` | M4 §4.3 | 1.0 |
| F2-06 | Own reflection and contribution statement (A-114) | `docs/final/res02/a114-reflection.md` | M4 §4.6 | 0.5 |

### RES-03, Nguyễn Phạm Mạnh Dũng, Architecture and data (about 8 h, excluding PR #12)

| ID | Task | Output file | Report ref | h |
|---|---|---|---|---|
| F3-01 | A-102 final risk review: current status of every risk, the ones that occurred (R-G4-02 and others), their effect on schedule, cost and scope, plus RES-01's re-rates | `docs/final/res03/risk-register-final.md` | M3 §3.4 | 2.0 |
| F3-02 | A-106 finalize Baseline V2.0: regenerate after CR-03 and the M-03 decision, check V1.0 is untouched, settle the P18 modification noted in `baseline-v1.0-freeze.md` | `docs/m2-report/data/plan-v2.0.mjs` and `generated-v2/` (existing, RES-03 only) | M3 §3.7 | 1.5 |
| F3-03 | Task 3.8 explanation: for each lower-level plan, why the detail was not possible at baseline time | `docs/final/res03/lower-level-plans.md` | M3 §3.8 | 1.0 |
| F3-04 | Planned vs actual by dimension (effort, elapsed time, schedule, cost, scope, quality, risk), major estimation errors and the decisions taken. Built from `actuals.md` in #12 and `a-90-planned-vs-actual.md`; read-only | `docs/final/res03/performance-comparison.md` | M4 §4.2 | 2.5 |
| F3-05 | Workbook sync, sole editor: Risk Register, Change Log, Planned vs Actual, Task Log, Quality Evidence. Paste rows from each owner's file on 28/11 | `resources/CO3011_Project_Tracking_Workbook (1).xlsx` | M3 §3.2–3.5 | 1.0 |

### RES-04, Phạm Duy Quý, Requirements and UI (about 8 h)

| ID | Task | Output file | Report ref | h |
|---|---|---|---|---|
| F4-01 | Code: availability screen gaps FR-19 (last update time), FR-20 (used spots), FR-21 "Hết chỗ" label, and the three demo-path defects listed in #20. Confirm scope against #20 before starting | `src/app/**/availability*`, `src/components/**` (availability and reservation UI only), plus tests | M3 §3.1, §3.5 | 4.0 |
| F4-02 | Code: reservation UI gap named in the SRS section 9 snapshot (see #23). If it is larger than 1.5 h, record it as partial scope in F5-04 instead of building it | reservation page components, plus tests | M3 §3.1 | 1.0 |
| F4-03 | Traceability matrix P24: O → product/FR → A-ID → resource → risk → test → CP. Must agree with the risk register, the checkpoint log and the objectives files | `docs/final/res04/traceability-matrix.md` | TR (also M3 §3.5, M4 §4.3) | 2.0 |
| F4-04 | Own reflection and contribution statement (A-114) | `docs/final/res04/a114-reflection.md` | M4 §4.6 | 0.5 |
| F4-05 | Re-run the A-49 availability tests after F4-01 and record the result | `docs/final/res04/a49-retest.md` | M3 §3.5 | 0.5 |

### RES-05, Nguyễn Tuấn Thành, Simulator and monitoring (about 7.5 h)

| ID | Task | Output file | Report ref | h |
|---|---|---|---|---|
| F5-01 | Code: the four simulator tests fail on the default 5 s timeout. Fix the tests or the timeout so `npm test` is green without flags (`vitest.config.ts`, `tests/simulator.test.ts`) | those two files only | M3 §3.1 | 1.0 |
| F5-02 | A-115 demo script (run of show for 27/11, who shows what) and the 15-minute mock viva plan (each member explains an artifact they did not write) | `docs/final/res05/demo-script-and-viva.md` | M4 §4.1, §4.6 | 2.0 |
| F5-03 | Measures of effectiveness for O1 and O2 (simulator and monitoring evidence, A-49 timing run) | `docs/final/res05/objectives-o1-o2.md` | M4 §4.3 | 1.0 |
| F5-04 | Scope-status table (A-110): completed, partially completed, deferred, removed, each with reason and evidence link. Fill after F2-04 and F4-02 | `docs/final/res05/scope-status.md` | M4 §4.1 | 1.5 |
| F5-05 | A-91 retrospective (30 min, all five attend) and A-113 lessons learned: repeat, change, improve | `docs/final/res05/lessons-learned.md` | M4 §4.5 | 1.5 |
| F5-06 | A-116 submission package checklist: repo link, run guide (P13, from #12), V1.0 and V2.0 pointers, logs index. Do not upload; RES-01 uploads | `docs/final/res05/submission-package.md` | SUB | 0.5 |
| F5-07 | Own reflection and contribution statement (A-114) | `docs/final/res05/a114-reflection.md` | M4 §4.6 | 0.5 |

## 4. Already carried by open PRs (not reassigned)

| PR | Owner | Carries | Report ref |
|---|---|---|---|
| #18 | RES-05 (review: RES-02) | A-68 entry/exit test, CP-05 evidence, A-31 auth test, A-67 rows | M3 §3.1, §3.5 |
| #8 | RES-05 (review: RES-02) | A-45 simulator test (CP-04) | M3 §3.5 |
| #12 | RES-03 | A-101/A-103 actuals tracker, CP-02 review, A-89 acceptance section, A-112 closure plan, RES-03 reflection, P13 install guide | M3 §3.3; M4 §4.1, §4.4, §4.6 |
| #20 | RES-04 | CR-03 decision and impact analysis (decision still needed) | M3 §3.6 |
| #22 / #23 | RES-04 / RES-01 | SRS v2.1 and P18 v1.1 (same two files; merge one) | M3 §3.5, §3.7 |
| #19 | RES-01 | This phase's plan | — |

Still needs an owner decision from RES-01: the CR-03 decision in #20, and which of #22 or #23 to merge.

## 5. Report-section tracker

One row per subsection. Tick the box when the PR for every listed item has merged. The first line of each row is what the final report will cite.

### Milestone 3

| Section | Requirement (assignment) | Items | Done |
|---|---|---|---|
| M3 §3.1 | Implement the agreed core scope | #18 (A-68), #24 (F4-01 and F4-02), #27 (F5-01) | [x] |
| M3 §3.2 | Weekly project log | F1-01, F3-05 | [ ] |
| M3 §3.3 | Progress against Baseline V1.0, actuals and deviations | PR #12 (`actuals.md`), F3-05 | [ ] |
| M3 §3.4 | Risk register maintenance | F3-01, F3-05 | [ ] |
| M3 §3.5 | Quality control and evidence | F2-01, F2-02, F2-03, F2-04, F4-03, F4-05, PRs #8 and #18 | [ ] |
| M3 §3.6 | Response to the lecturer change event | F1-02, PR #20 | [ ] |
| M3 §3.7 | Baseline V2.0 | F3-02, F1-03, PRs #22 or #23 | [ ] |
| M3 §3.8 | Lower-level plans | F3-03, F1-01 | [ ] |

### Milestone 4

| Section | Requirement (assignment) | Items | Done |
|---|---|---|---|
| M4 §4.1 | Deliver and demonstrate; completed, partial, deferred, removed scope | F2-04, F5-02, F5-04, PR #12 (A-89) | [ ] |
| M4 §4.2 | Planned vs actual: effort, time, schedule, cost, scope, quality, risk | F3-04, RES-01 A-90 draft | [ ] |
| M4 §4.3 | Objectives and measures of effectiveness | F2-05, F5-03, F4-03 | [ ] |
| M4 §4.4 | Closure and handover plan | PR #12 (A-112) | [ ] |
| M4 §4.5 | Lessons learned | F5-05 | [ ] |
| M4 §4.6 | Individual contribution and viva | F1-04, F2-06, F4-04, F5-07, PR #12 (RES-03), F5-02 | [ ] |
| TR | Mandatory traceability | F4-03 | [ ] |
| SUB | Submission package | F5-06 | [ ] |

## 6. Deferred to the final phase

A-108 (M3 report), A-92 (final report), final sign-off, LMS upload. Inputs are the section files above. If the report is written section by section, each section can start as soon as its row in section 5 is ticked.

## 7. Dependency order

Independent from the start: F1-01, F1-02, F2-01, F2-02, F2-05, F3-01, F3-03, F4-01, F4-02, F4-04, F5-01, F5-02, F5-03, F5-07.
Wait on another task: F4-05 after F4-01; F2-04 after the candidate SHA is pinned; F5-04 after F2-04 and F4-02; F3-04 after #12 merges; F3-02 after the M-03 decision (F1-02); F1-03 after F3-02; F4-03 after F2-03 and F3-01; F3-05 last, on 28/11.
