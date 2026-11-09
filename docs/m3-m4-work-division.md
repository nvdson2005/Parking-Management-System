# Work Division Plan: Milestone 3 (Execution, Monitoring & Control) and Milestone 4 (Final Delivery & Closure)

Source of truth: Project Baseline V1.0 (`docs/m2-report/CO3011_M2_Report_v0.1.md`, `docs/m2-report/data/plan.mjs`, `docs/m2-report/generated/*`).
This plan does **not** rewrite the baseline. It (1) maps every Task 3.x / 4.x requirement in `resources/CO3011_Assignment_2026.pdf` to an owner, (2) restates each member's baseline activities by week, and (3) adds the activities the baseline is missing. The additions count as a lower-level plan (Task 3.8). Record them in the W12 weekly log. When the lecturer's change event arrives, fold them into Baseline V2.0.

## 1. Calendar and fixed dates

| Week | Dates | Capacity / person | Baseline milestone |
|---|---|---|---|
| W12 | 09/11 – 15/11 | 8 h | M-01 Baseline V1.0 submitted (09/11) |
| W13 | 16/11 – 22/11 | 10 h | M-02 Design reviews CP-01..CP-03 done (16/11) |
| W14 | 23/11 – 29/11 | 10 h | M-03 Module fixes + tests done (24/11); M-04 Acceptance demo (27/11) |
| W15 | 30/11 – 06/12 | 10 h | Acceptance report finished 01/12 |
| W16 | 07/12 | — | M-05 Final report submitted (07/12) |

**Assumptions to confirm on LMS:** the M3 submission date (planned here as **29/11**, end of W14) and the date of the lecturer's change event (A-99 is planned for W13–W14).

## 2. Roles

| RES | Member | Role | Owns in M3/M4 |
|---|---|---|---|
| RES-01 | Nguyễn Võ Đức Sơn | PM, Tech lead | Coordination, change-event response (3.6), client contact, entry/exit backend fixes, final sign-off |
| RES-02 | Đào Xuân Sơn | BA, QA | Test plan, acceptance tests, Quality Evidence (3.5), gate reviews CP-02..CP-07 |
| RES-03 | Nguyễn Phạm Mạnh Dũng | Architecture, Data | API/DB fixes, **planned-vs-actual tracker (3.3)**, **risk register (3.4)**, Baseline V2.0 regeneration (3.7), closure plan (4.4) |
| RES-04 | Phạm Duy Quý | Requirements, UI | SRS, UI doc, reservation module, traceability matrix P24, scope-status table (4.1), final package |
| RES-05 | Nguyễn Tuấn Thành | Simulator, Monitoring | Simulator fixes, contract tests, entry/exit testing, **M3 report compiler**, demo script |

Why the PM/QA load moved: RES-01 and RES-02 are fully booked in W12–W13 and RES-02 owns most of the critical path. They keep the decisions and reviews. The tracking and paperwork go to RES-03, RES-04 and RES-05, who have the most spare hours (13.5 h, 12.4 h and 13.3 h).

## 3. Requirement → owner map

### Milestone 3 (Task 3)

| Task | Requirement | Covered by | Owner | Evidence location |
|---|---|---|---|---|
| 3.1 | Implement agreed core scope | A-28, A-63, A-65, A-70, A-44, A-67 (fixes KB-01..KB-19) | RES-01, RES-03, RES-04, RES-05 | git commits referencing A-ID + KB-ID |
| 3.2 | Weekly project log | A-94 (log), A-97 (meeting), **A-100** (each member's own hours) | RES-01; everyone logs own | P16 weekly log W12–W15, Task Log in workbook |
| 3.3 | Actual start/finish/effort vs Baseline V1.0, explain deviations | **A-101** (back-fill MVP actuals, closes ISS-04), **A-103** (tracker) | RES-03 | `docs/m3/actuals.md` + workbook |
| 3.4 | Risk register maintenance | **A-102** weekly review; each risk owner reports status | RES-03 (register), risk owners | `docs/m3/risk-register.md` |
| 3.5 | Quality control + evidence | A-96, A-31, A-49, A-61, A-68, A-72, A-76, A-77, A-79, CP-01..CP-07, **A-104** (traceability) | RES-02 (QA), RES-04 (P24) | Quality Evidence log, review minutes |
| 3.6 | Respond to lecturer change event | A-99 (impact analysis), **A-105** (team options workshop) | RES-01 | Change-impact analysis + decision record |
| 3.7 | Baseline V2.0 if the change alters the baseline | **A-106** (conditional) | RES-03 (regenerate `plan.mjs`), RES-01 (approve) | `docs/m2-report/data/archive/` keeps V1.0 |
| 3.8 | Lower-level plans | This document; AT run schedule inside A-80/A-95 | RES-01, RES-02 | this file + log entry |
| — | M3 report assembly | **A-108** | RES-05 compiles, RES-01 reviews | `docs/m3-report/` |

### Milestone 4 (Task 4)

| Task | Requirement | Covered by | Owner |
|---|---|---|---|
| 4.1 | Deliver/demo product; completed / partial / deferred / removed scope | A-88, A-89, **A-110** (scope-status table) | RES-01 + RES-05 (demo), RES-04 (table) |
| 4.2 | Planned vs actual (effort, time, schedule, cost, scope, quality, risk) | A-90 | RES-01 (with RES-03 tracker data) |
| 4.3 | Objectives O1–O5 and measures of effectiveness | Section in A-92 | RES-02 (O3, O4, O5), RES-05 (O1, O2) |
| 4.4 | Closure / handover plan | **A-112**, builds on A-33 install guide | RES-03 |
| 4.5 | Lessons learned | A-91 meeting, **A-113** write-up | all attend; RES-04 writes |
| 4.6 | Individual contribution + reflection; viva readiness | **A-114**, **A-115** | everyone |
| — | Final report | A-92 | RES-03 writes, RES-02 reviews |
| — | Submission package (PDF, repo link, run guide, V1.0 + V2.0, logs) | **A-116** | RES-04 |

## 4. New activities (lower-level plan, Task 3.8)

These activities are not in Baseline V1.0. Every effort figure is a PERT-style most-likely estimate.

| A-ID | Activity | Product | Owner (h) | Week | Predecessor |
|---|---|---|---|---|---|
| A-100 | Log own actual hours in Task Log every week (15 min, filled in during A-97) | P16 | all 5 × 1 h | W12–W15 | — |
| A-101 | Back-fill actual effort for completed work C-01..C-13 (ISS-04) | P16, P17 | RES-03 1.5 | W12 | members' estimates |
| A-102 | Weekly risk-register review: status, new risks, risks that occurred, effect | P01 | RES-03 1.5 | W12–W15 | A-97 |
| A-103 | Planned-vs-actual tracker: actual start/finish and effort per A-ID, deviations > 20 % explained | P16 | RES-03 2 | W12–W15 | A-100 |
| A-104 | Keep traceability matrix P24 current (O → FR → A → test → CP) | P24 | RES-04 2 | W12–W15 | A-01 |
| A-105 | Change-event options workshop (≥ 2 alternatives, chosen response) | P01 | all 5 × 0.5 h | when event arrives | A-99 |
| A-106 | *Conditional:* regenerate Baseline V2.0 (plan, Gantt, CPM, risks), archive V1.0 | P01 | RES-03 1.5, RES-01 1.5 | after A-105 | A-105 |
| A-108 | Compile M3 report from owners' sections | P17 | RES-05 2.5, RES-01 1 (review) | W14 | A-68, A-102, A-103 |
| A-110 | Scope-status table: completed / partial / deferred / removed, with reasons | P14 | RES-04 1 | W15 | A-87 |
| A-112 | Closure and handover plan: acceptance, open issues, docs, release of resources | P17 | RES-03 1.5 | W15 | A-89 |
| A-113 | Write the lessons learned (repeat / change / improve) | P17 | RES-04 1 | W15 | A-91 |
| A-114 | Individual contribution and reflection statement | P17 | all 5 × 1 h | W15 | A-90 |
| A-115 | Demo script + slides (RES-05 2 h); mock viva, everyone explains any artifact (all 5 × 0.5 h) | P14 | RES-05 2, all 0.5 | W15 | A-88 |
| A-116 | Final submission package and LMS upload | P17 | RES-04 1.5 | W15–W16 | A-92 |

**Effort impact:** about 32.5 h of firm work (+3 h if A-106 is triggered). Total planned effort rises from 139.6 h to 172.1 h against 190 h of capacity, so utilisation goes from 73 % to about **91 %**. That is tight. It raises the likelihood of R-G4-02 (members not keeping their hours), so RES-01 keeps the most free time (≈7 h) to absorb the change event. If the change event costs more than ≈7 h, apply the Q22 fallback order (reports → payment → reservations) through a CR.

## 5. Per-person plan by week

`*` = critical-path activity (A-22 → A-23 → A-44 → A-45 → A-67 → A-68 → A-90 → A-92). Slippage on these moves the finish date, so report it on the same day.

### RES-01 — Nguyễn Võ Đức Sơn (PM, Tech lead)
| Week | Activities |
|---|---|
| W12 | **A-22\*** P18 v1.0 + decisions for KB-01..KB-19 (09–12/11) · A-09 SRS review · A-16 send round-3 questions · A-61 test lot management (13–23/11) · A-94/A-97 log + chair meeting · A-100 |
| W13 | A-63 entry/exit fixes with RES-03 (16–18) · A-74 payment review (18–20) · **A-67\*** integrate simulator (20/11) · A-99 change-event impact · A-105 lead workshop |
| W14 | **A-90\*** actuals vs baseline (23–25) · A-108 review M3 report · **A-88** client acceptance demo (27/11) · A-106 approve V2.0 if triggered |
| W15 | A-91 retrospective (chair) · A-114 · A-115 mock viva · final sign-off on A-92 |
| Total | baseline 26.7 h + new 4 h (+1.5 conditional) of 38 h |

### RES-02 — Đào Xuân Sơn (BA, QA)
| Week | Activities |
|---|---|
| W12 | **A-96 first run of automated tests, day 1 (10–11/11)** · A-01 SRS v1.0 with RES-04 · A-80 test plan v1.0 · **A-23\*** / A-27 architecture + DB reviews (CP-02, CP-03, 13/11) · A-100 |
| W13 | A-82 acceptance tests AT-01..AT-07 (16–19) · A-85 review + send to client (CP-06, 19/11) · **A-45\*** simulator test (CP-04) · A-72 reservation tests (20–24) |
| W14 | **A-68\*** entry/exit test (CP-05, 23/11) · A-95 early AT run · A-87 internal dry run (CP-07, 26–27) · **A-92\*** review final report |
| W15 | A-92 review · O3–O5 section · A-114 · A-115 |
| Total | baseline 29.6 h + new 3 h of 38 h |

### RES-03 — Nguyễn Phạm Mạnh Dũng (Architecture, Data)
| Week | Activities |
|---|---|
| W12 | A-24 DB design v1.0 (12–13) · **A-23\*** / A-27 reviews · **A-101** back-fill MVP actuals · start **A-102** risk register + **A-103** tracker · A-100 |
| W13 | A-63 entry/exit fixes with RES-01 · A-28 auth/access-log fixes (18–20) · A-85 review · A-33 install/demo guide (20–23) · A-102/A-103 weekly |
| W14 | A-65 new APIs: access log, sessions, payment history (23–25) · A-89 acceptance report · **A-92\*** final report · A-106 regenerate V2.0 if triggered |
| W15 | A-92 finish (→30/11) · A-89 finish (→01/12) · A-112 closure plan · A-114 · A-115 |
| Total | baseline 24.5 h + new 9.5 h (+1.5 conditional) of 38 h |

### RES-04 — Phạm Duy Quý (Requirements, UI)
| Week | Activities |
|---|---|
| W12 | A-01 SRS v1.0 (09–10) · A-09 SRS review (CP-01) · A-13 UI design doc (11–24) · A-83 exception ATs + 100-session scenario (13–16) · A-104 · A-100 |
| W13 | A-70 reservation module review + fix (16–18) · A-76 payment tests (20–24) · A-104 |
| W14 | A-49 availability tests (23–24) · A-87 dry run with RES-02 (26–27) · A-89 acceptance report |
| W15 | A-89 finish · A-110 scope-status table · A-113 lessons write-up · A-114 · A-115 · A-116 package + upload (→07/12) |
| Total | baseline 25.6 h + new 8.5 h of 38 h |

### RES-05 — Nguyễn Tuấn Thành (Simulator, Monitoring)
| Week | Activities |
|---|---|
| W12 | A-43 simulator review + SC-01..SC-07 (09–11) · A-77 report-module test (11–13) · A-47 simulated data doc (13–25) · A-09 review · A-100 |
| W13 | **A-44\*** simulator fixes (16–18) · A-79 API contract tests (18–19) · **A-45\*** (19–20) · **A-67\*** with RES-01 (20/11) |
| W14 | **A-68\*** (23/11) · A-31 auth tests (23–24) · **A-108** compile M3 report · A-88 demo with RES-01 (27/11) |
| W15 | O1/O2 section of A-92 · A-115 demo script + slides · A-114 |
| Total | baseline 24.8 h + new 7.5 h of 38 h |

## 6. Working rules

1. **Commits:** reference the A-ID and KB-ID in each commit message (e.g. `fix(entry): normalise plate (A-63, KB-04)`). The repo history is assessed as execution evidence.
2. **Weekly cycle:** at the A-97 meeting each week, everyone fills in A-100 hours. RES-03 then updates the tracker (A-103) and risk register (A-102), and RES-01 writes the log (A-94) the same day.
3. **Escalation:** a critical-path activity more than 1 day late, or a member short by more than 2 h in a week, goes to RES-01 on the same day (M2 escalation level 1).
4. **Gates:** no code fix (A-28, A-44, A-63, A-65, A-70) starts before CP-02 passes. Gate outcomes are recorded in review minutes.
5. **Baseline integrity:** never edit V1.0 outputs. V2.0 is a new generated set, and V1.0 stays in `docs/m2-report/data/archive/`.
6. **Viva readiness:** each member must be able to explain any artifact, so in W15 each person presents one artifact they did not write.
