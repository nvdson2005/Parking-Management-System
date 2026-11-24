# Tasks: Phase 5 RES-01 delivery

**Input:** [spec](spec.md), [plan](plan.md), [handoff contract](contracts/review-and-evidence.md), and [validation quickstart](quickstart.md).

## Phase 1: Setup

**Goal:** Establish current PR ownership and protect the existing stacks.

- [X] T001 Verify `origin/main`, PR #8–#19 heads, owners, bases, and review states against `specs/002-lecturer-acceptance-alignment/contracts/review-and-evidence.md`.
- [X] T002 Check the existing RES-01 records and workbook ownership before changing `docs/m3/` and `resources/`.

## Phase 2: Foundational

**Goal:** Keep the acceptance and decision evidence tied to an identifiable build.

- [X] T003 Record the 11 lecturer answers and SRS trace in `docs/m3/client-interaction-log-phase-5.md` (DR-001).
- [X] T004 Record CP-01 review status separately from the lecturer answers in `docs/m3/client-interaction-log-phase-5.md` (DR-001).
- [X] T005 Reconcile CR-03 full and selected estimates, candidate identity, and M-03 gate inputs with PR #10 in `docs/m3/change-impact-analysis.md` and `docs/m3/decision-record.md` (DR-002).

## Phase 3: User Story 1 — Single-lot acceptance (P1)

**Independent test:** An identified integrated build passes the normal 100-visit timings, complete records, exact counts, and a separate full-lot refusal, with five exception outcomes.

- [X] T006 [US1] Document the one-lot, per-visit, explicit-logout, 100-visit, refusal, and exception checks; exclude the survey score from mandatory acceptance in `docs/m3/a-88-a-115-demo-rehearsal.md` (FR-001, FR-004–FR-007, SC-001, SC-002).
- [X] T007 [US1] Pin the integrated #11/#17 candidate, migrations, environment, and exclusions in `docs/m3/a-88-a-115-demo-rehearsal.md` (DR-004).
- [ ] T008 [US1] Carry QA's measured A-87/CP-05 outcome and A-88 client verdict into `docs/m3/a-88-a-115-demo-rehearsal.md` (DR-004, DR-005).

## Phase 4: User Story 3 — Closed-session privacy (P1)

**Independent test:** Staff sees masked retained plates, Manager sees full retained plates, and exit-based 12-month purge preserves non-plate statistics.

- [ ] T009 [US3] Review PR #11's final-head masking, exit cutoff, short-plate, response, and unrelated-note results; record the review and remaining gaps in `docs/m3/a-88-a-115-demo-rehearsal.md` (FR-008, FR-009, SC-004).

## Phase 5: User Story 2 — Lot information and fee groups (P2)

**Independent test:** Customers see current hours and group-specific motorcycle/car prices before parking; only Manager applies a requested group change; hours do not reject admission.

- [X] T010 [US2] Extend the existing A-61 permission evidence and list Phase 5 hours, tariff, and fee-group acceptance checks in `docs/m3/quality-evidence-A-61.md` (FR-002, FR-003, FR-010, SC-005).
- [ ] T011 [US2] Review PR #17's final-head authorization, display, and migration checks; record tested SHA and outcome in `docs/m3/quality-evidence-A-61.md` (DR-004).
- [ ] T012 [US2] Record the nine browser/width results in `docs/m3/a-88-a-115-demo-rehearsal.md` (SC-003).

## Phase 6: RES-01 delivery and closeout

**Independent test:** A reviewer can follow each RES-01 activity to an owner, dated result, measured or explicitly estimated effort, and exact PR/build.

- [X] T013 [P] Update A-90 and A-100 with evidence and clearly labelled unknown actuals in `docs/m3/a-90-planned-vs-actual.md` (DR-005).
- [X] T014 [P] Update W14 events, decisions, and unresolved owner inputs in `docs/m3/weekly-log-draft.md` (DR-005).
- [X] T015 [P] Update the contribution and reflection evidence in `docs/m3/a-114-reflection-draft.md` (DR-005).
- [ ] T016 Contribute only coordinated RES-01 changes to the current heads of PR #9/#16, #10, #11/#17, #12, and QA PRs; record starting/resulting SHA and checks in `docs/m3/pr-contribution-ledger.md` (DR-003).
- [X] T017 Check citations, diff scope, and repository index; commit and push standalone RES-01 work to PR #19 from `docs/phase-5-res01-delivery` (DR-003).
- [ ] T018 Record A-91, A-92 sign-off, and the 29 November submission receipt in `docs/m3/a-90-planned-vs-actual.md` when those events occur (DR-005).

## Dependencies and execution order

T001–T002 precede branch edits. T003–T005 establish the trace and gate. T006, T009, T010, and T013–T015 can advance independently. T007 requires an integrated #11/#17 candidate. T008, T011, and T012 require the relevant final-head or QA evidence. T016 requires an owner-coordinated open head and a scoped contribution. T018 requires the later events.

## Implementation strategy

First deliver the standalone audit trail and ready-to-run checks. Then use owner-coordinated direct pushes for any in-scope existing PR work. Close acceptance and reporting tasks only after the dated evidence exists. Never convert a pending QA or client outcome into a pass based on a PR description.
