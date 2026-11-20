# A-90 Planned vs Actual: skeleton (RES-01 activities)

Planned values come from `docs/m2-report/generated/estimates.md` and the work-division plan. **Actual hours and start dates are unknown** (assumed equal to capacity at team level, 8 h in W12 and 10 h from W13; see the RES-01 effort estimates below); finish dates come from commits and documents. Deviations over 20% are explained once actual hours exist (A-103, Task 3.3). This file covers RES-01's activities only; RES-03 owns the full tracker.

| A-ID | Activity | Planned start–finish | Planned E (h) | Actual finish (evidence) | Estimated RES-01 effort (h) | Deviation | Explanation |
|---|---|---|---|---|---|---|---|
| A-22 | P18 v1.0 + KB-01..KB-19 decisions | 09–12/11 | 4.33 | 19/11 (`3d911b6`, P18 v1.0) | 4.50 | +7 days; estimated effort +4% | Decisions waited on the fee-timing and transaction choices (KB-02, KB-03); round-3 lecturer changes took priority 15/11 |
| A-09 | SRS review (CP-01) | W12 | TODO | none: no commit, PR or document on any branch (checked 19/11) | TODO | assumed pending (no evidence) | Owners per baseline: RES-04 (fixes), RES-05 (review), RES-01 (reads architecture parts, approves CP-01). TODO(RES-04/RES-05): confirm status and where it is recorded |
| A-16 | Round-3 questions to client | W12 | TODO | before 15/11 (`resources/client-round3-questions.md`, replies reflected in `5b3ac52`) | 0.50 | on time | — |
| A-61 | Lot management test | 13–23/11 | 1.5 | 20/11 (`0faa6cb`, seven expected Staff HTTP 403 responses) | 1.50 | verification complete | — |
| A-63 | Entry/exit fixes (with RES-03) | 16–18/11 | 6.33 | 19/11 (`42b9d98`, `9e07e29`) | 2.00 | +1 day | KB-02 and KB-03 decided as "accept"; only KB-04, KB-05, KB-13 needed code |
| A-74 | Payment review | 18–20/11 | 2.25 | 19/11 (tests in `42b9d98`, review in P18 10.3) | 0.75 | on time | — |
| A-67 | Integrate simulator | 20/11 | TODO | 20/11 (`0faa6cb`, 25 HTTP checks passed and 120 simulator events ran with zero rejections) | 0.75 | verification complete | — |
| A-99 | Change-event impact | W13–W14 | TODO | 19/11 (`3e7d822`) | 1.00 | early | Deadline change arrived W13 |
| A-105 | Options workshop | when event arrives | 2.5 | decision draft 19/11 | 0.50 (preparation) | pending | Workshop attendance and outcome unverified |
| A-106 | Baseline V2.0 hand-off | after A-105 | 3.0 (now 1.5) | hand-off 19/11 (`e43c2bf`); regeneration by RES-03 pending | 0.25 (handoff) | pending | — |
| A-94 / A-97 | Weekly log and meeting | weekly | TODO | draft 19/11 (`docs/m3/weekly-log-draft.md`) | 0.50 (log) | late (no log for W12) | Log started in W13 |
| A-100 | Own hours in Task Log | weekly | 1 per week | not started; hours ASSUMED equal to capacity (8 h W12, 10 h W13) | TODO | missed W12 | No hours were logged; see weekly-log-draft.md |
| A-90 | Actuals vs baseline | 23–25/11 | 3.42 | pending | — | — | Needs actuals from all members |
| A-88 | Client acceptance demo | 27/11 | 2.83 | pending | — | — | — |

## Extra work not in Baseline V1.0 (scope and effort deviation)

| Item | Evidence | Effort | Note |
|---|---|---|---|
| Round-3 lecturer-alignment refactor (early arrival, one reservation per account, per-zone utilisation, suspension notifications) | 11 commits on 15/11 (`34c9e49`..`360b6ba`), review fixes 18/11 | 4.25 estimated | CR-02; not planned |
| Simulator A-44 (RES-05's activity) | `68ea467`, 12/11 | 1.50 estimated | Done by RES-01; confirm closure with RES-05 |
| Spec Kit scaffold, constitution, KB-fix spec/plan/tasks | `0578a4e`, `ebfee0f` | Included in A-63 estimate | Process overhead required by AGENTS.md |

## RES-01 weekly effort estimates

The figures allocate 8 h in W12 and 10 h in W13 based on recorded work. The totals use the baseline capacity as a proxy. Activity splits are assumptions and exclude unverified workshop attendance. The A-63 and A-74 figures cover RES-01's estimated effort. Confirm that planned estimates cover the same people and work before calculating effort variance.

| Week | Activity | Estimated RES-01 hours |
|---|---|---:|
| W12 | A-22 P18 preparation | 2.00 |
| W12 | A-16 client questions | 0.50 |
| W12 | A-44 simulator | 1.50 |
| W12 | CR-02 round-3 changes | 4.00 |
| W12 | **Total** | **8.00** |
| W13 | A-22 P18 completion | 2.50 |
| W13 | A-61 lot management verification | 1.50 |
| W13 | A-63 entry/exit fixes and Spec Kit preparation | 2.00 |
| W13 | A-74 payment review | 0.75 |
| W13 | A-67 integration verification | 0.75 |
| W13 | A-99 change impact | 1.00 |
| W13 | A-105 decision and workshop preparation | 0.50 |
| W13 | A-106 handoff | 0.25 |
| W13 | A-94 weekly log | 0.50 |
| W13 | CR-02 round-3 review fixes | 0.25 |
| W13 | **Total** | **10.00** |
