# A-90 Planned vs Actual · report draft

## Phase 5 status note (24 November 2026)

[PR #15](https://github.com/nvdson2005/Parking-Management-System/pull/15) merged the 11 lecturer answers; [the interaction log](client-interaction-log-phase-5.md) maps Q36–Q46. A-68 finished on 24 November according to [PR #18](https://github.com/nvdson2005/Parking-Management-System/pull/18), one day after the 23 November plan; CP-05 is still a proposed result with T12 pending A-31. The product PR stack #11 → #17 remains open, so A-87 and A-88 lack a final integrated candidate. [PR #14](https://github.com/nvdson2005/Parking-Management-System/pull/14) merged the RES-05 confirmation of A-67; that does not close CP-05.

No measured RES-01 or team hours for W14 were found in the repository. The estimates and capacity proxies below remain labelled as such. Obtain per-activity actual hours from each owner and the RES-03 tracker before calculating final effort, cost, or >20% variances. A-91, A-92 sign-off and the LMS submission receipt remain pending; the 28 and 29 November dates are targets.

Planned values come from `docs/m2-report/generated/estimates.md` and the work-division plan. **Actual hours and start dates are unknown** (assumed equal to capacity at team level, 8 h in W12 and 10 h from W13; see the RES-01 effort estimates below); finish dates come from commits and documents. Deviations over 20% are explained once actual hours exist (A-103, Task 3.3). The detailed activity table covers RES-01. RES-03 owns the team tracker.

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
| A-105 | Options workshop | when event arrives | 2.5 | decision draft 19/11 | 0.50 (preparation) | planning assumption recorded | Option C with one additional W14 hour per member targeted. Confirm the workshop date, attendance, and capacity. |
| A-106 | Baseline V2.0 hand-off | after A-105 | 3.0 (now 1.5) | hand-off 19/11 (`e43c2bf`); regeneration by RES-03 pending | 0.25 (handoff) | pending | — |
| A-94 / A-97 | Weekly log and meeting | weekly | TODO | draft 19/11 (`docs/m3/weekly-log-draft.md`) | 0.50 (log) | late (no log for W12) | Log started in W13 |
| A-100 | Own hours in Task Log | weekly | 1 per week | not started; hours ASSUMED equal to capacity (8 h W12, 10 h W13) | TODO | missed W12 | No hours were logged; see weekly-log-draft.md |
| A-90 | Actuals vs baseline | 23–25/11 | 3.42 | draft through 21/11 | — | in progress | Team actuals and gate evidence pending |
| A-88 | Client acceptance demo | 27/11 | 2.83 | pending | — | — | — |

## Comparison for A-92 · evidence through 21 November

| Dimension | Original baseline and revised plan | Observed result or variance |
|---|---|---|
| Effort | V1.0 planned 139.6 team hours including reserve. Revised demand is about 164.1 h after the agreed cuts. | Team actuals are pending. RES-01 has 18 h estimated across W12–W13. A-22 is estimated at 4.50 h versus 4.33 h planned (+3.9%). A-61 is estimated at 1.50 h versus 1.50 h planned. Compare other activities once RES-03 provides like-for-like planned and actual allocations. |
| Schedule | V1.0 submission was 7 Dec. CR-01 moves submission to 29 Nov and targets report sign-off on 28 Nov. | The submission target moved eight calendar days earlier. A-22 finished seven days late and A-63 finished one day late. A-67 verification was recorded on its 20 Nov target. Current project forecast and M-03 variance are pending. |
| Cost | At the baseline proxy rate of 50,000 VND/h, V1.0 planned 6,980,000 VND and revised demand represents about 8,205,000 VND. | Revised planned cost is about 1,225,000 VND higher. RES-01's 18 h estimate represents 900,000 VND in proxy effort. Team actual cost awaits the tracker. |
| Scope | Option C retains V1.0 product scope while consolidating report work and reducing verification depth. | CR-02 added four lecturer clarifications on 15 Nov. The changes were implemented, with 4.25 h estimated for RES-01. Final accepted scope and any omissions await A-87/A-88 and the M-03 gate. |
| Quality | The revised plan protects Must verification and O1/O2 evidence. | A-61 recorded seven expected Staff authorization denials. A-67 recorded 25 passing HTTP checks and a 120-event simulator run with zero rejections. Formal CP-02 and A-68/CP-05 outcomes and the client acceptance record remain pending. |
| Risk | Revised demand exceeds 140 h base capacity by about 24.1 h. R-G4-02 tracks capacity shortfalls and R-G5-04 tracks deadline compression. | The estimated gap is 14.1 h after the planned W14 extra hours. The workshop assumption reduces it to 9.1 h if all additional hours are confirmed. Q22 is conditional on the M-03 gate. |

For final integration into A-92, add RES-03's dated team tracker and risk update, RES-02's gate evidence, and the M-03 decision. Keep the original and revised planned figures distinct from measured actuals. Explain comparable effort deviations over 20% once the tracker is available.

Sources: [V1.0 totals](../m2-report/generated/totals.md), [V2.0 review draft](baseline-v2-draft.md), [change and gate decisions](decision-record.md), [A-61 evidence](quality-evidence-A-61.md), and [A-67 evidence](a-67-integration-check.md).

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
