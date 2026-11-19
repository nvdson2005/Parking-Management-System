# A-90 Planned vs Actual: skeleton (RES-01 activities)

Planned values come from `docs/m2-report/generated/estimates.md` and the work-division plan. **Actual hours and start dates are unknown** (assumed 8 h per member per week at team level; per-activity actuals `TODO(member)`); finish dates come from commits and documents. Deviations over 20% are explained once actual hours exist (A-103, Task 3.3). This file covers RES-01's activities only; RES-03 owns the full tracker.

| A-ID | Activity | Planned start–finish | Planned E (h) | Actual finish (evidence) | Actual effort (h) | Deviation | Explanation |
|---|---|---|---|---|---|---|---|
| A-22 | P18 v1.0 + KB-01..KB-19 decisions | 09–12/11 | 4.33 | 19/11 (`3d911b6`, P18 v1.0) | TODO | +7 days; effort TODO | Decisions waited on the fee-timing and transaction choices (KB-02, KB-03); round-3 lecturer changes took priority 15/11 |
| A-09 | SRS review (CP-01) | W12 | TODO | none: no commit, PR or document on any branch (checked 19/11) | TODO | status unknown | TODO(RES-01): confirm whether the SRS review (CP-01) took place and where it is recorded |
| A-16 | Round-3 questions to client | W12 | TODO | before 15/11 (`resources/client-round3-questions.md`, replies reflected in `5b3ac52`) | TODO | on time | — |
| A-61 | Lot management test | 13–23/11 | 1.5 | evidence drafted 19/11 (`docs/m3/quality-evidence-A-61.md`), route 403 check pending | TODO | in progress | — |
| A-63 | Entry/exit fixes (with RES-03) | 16–18/11 | 6.33 | 19/11 (`42b9d98`, `9e07e29`) | TODO | +1 day | KB-02 and KB-03 decided as "accept"; only KB-04, KB-05, KB-13 needed code |
| A-74 | Payment review | 18–20/11 | 2.25 | 19/11 (tests in `42b9d98`, review in P18 10.3) | TODO | on time | — |
| A-67 | Integrate simulator | 20/11 | TODO | `docs/m3/a-67-integration-check.md` 19/11, e2e run pending | TODO | in progress | — |
| A-99 | Change-event impact | W13–W14 | TODO | 19/11 (`3e7d822`) | TODO | early | Deadline change arrived W13 |
| A-105 | Options workshop | when event arrives | 2.5 | decision record 19/11; workshop not held | TODO | pending | TODO(RES-01): date |
| A-106 | Baseline V2.0 hand-off | after A-105 | 3.0 (now 1.5) | hand-off 19/11 (`e43c2bf`); regeneration by RES-03 pending | TODO | pending | — |
| A-94 / A-97 | Weekly log and meeting | weekly | TODO | draft 19/11 (`docs/m3/weekly-log-draft.md`) | TODO | late (no log for W12) | Log started in W13 |
| A-100 | Own hours in Task Log | weekly | 1 per week | not started; hours ASSUMED 8 h per member per week | TODO | missed W12 | No hours were logged; see weekly-log-draft.md |
| A-90 | Actuals vs baseline | 23–25/11 | 3.42 | pending | — | — | Needs actuals from all members |
| A-88 | Client acceptance demo | 27/11 | 2.83 | pending | — | — | — |

## Extra work not in Baseline V1.0 (scope and effort deviation)

| Item | Evidence | Effort | Note |
|---|---|---|---|
| Round-3 lecturer-alignment refactor (early arrival, one reservation per account, per-zone utilisation, suspension notifications) | 11 commits on 15/11 (`34c9e49`..`360b6ba`), review fixes 18/11 | TODO | CR-02; not planned |
| Simulator A-44 (RES-05's activity) | `68ea467`, 12/11 | TODO | Done by RES-01; confirm closure with RES-05 |
| Spec Kit scaffold, constitution, KB-fix spec/plan/tasks | `0578a4e`, `ebfee0f` | TODO | Process overhead required by AGENTS.md |

`TODO(RES-01)`: replace each `TODO` with real figures, then write explanations for any deviation over 20%.
