# M3 Change-Event Response: Design

Date: 2026-11-19 · Branch: `feat/m3-kb-fixes-and-docs` · Status: draft for approval · Owner: RES-01 (A-99, A-105)

## Intent

Task 3.6 requires a change-impact analysis and a justified management decision for the lecturer's change event. Task 3.7 requires Baseline V2.0 if the baseline changes, with V1.0 kept. The event: **the final report and submission (M-05) moves from 07/12 to 29/11**. M3, M4 and the final report now land in one week.

The Round-3 replies (early arrival, one reservation per account, per-zone utilisation, suspension notifications) are a second, smaller change. They are already built, so they get a short impact entry, not a full analysis.

## Facts the analysis rests on

- Capacity drops from 190 h to 140 h (W12 40 + W13 50 + W14 50). W15 is gone.
- Planned effort: 139.6 h baseline (99.7% of 140 h), 172.1 h with the M3/M4 activities from `docs/m3-m4-work-division.md` (123%).
- Baseline levelled finish was already 01/12. A-92 (critical) ends 30/11 and A-89 ends 01/12.
- Fixed: M-03 on 24/11, A-88 client demo on 27/11.
- These figures are arithmetic from the plan. Actual hours are not recorded anywhere yet (the workbook's Weekly Log and Planned-vs-Actual sheets are empty templates).

## Goals

1. A change-impact analysis covering requirements/products, activities, effort, resources, risks, schedule, cost and quality, as Task 3.6 lists them.
2. A decision record with at least two alternatives and a justified choice (chosen: C).
3. A revised W13–W14 plan per member that fits the new deadline.
4. A hand-off to RES-03 for Baseline V2.0 (minimal), V1.0 archived.
5. A Change Log entry (CR-01 deadline, CR-02 round-3 clarifications) ready for the workbook.

## Non-goals and anti-goals

- No scope change to the built product. No rewrite of V1.0 outputs.
- Anti-goal: an analysis that hides the residual gap. If the plan still does not fit, the document says so and names the trade.
- Anti-goal: invented actuals. Any hour not in the repo or workbook is marked unknown.

## Approaches

| | Approach | Verdict |
|---|---|---|
| A | Absorb: keep all scope, about 6.5 h extra per person | Rejected. 123% load, R-G4-02 near-certain. |
| B | Descope under Q22 (reports, then payment, then reservations) | Kept only as the safety net. Breaks O3/O4 evidence and round-3 per-zone reporting. |
| **C** | **Hybrid: keep scope, merge paperwork, trim verification depth, Q22 tripwire** | **Chosen.** |

## Decision C: the cuts (estimates from the baseline, hours)

| Cut | Saves |
|---|---|
| Fold the M3 report (A-108) into the final report as one document | 2.5 |
| Write A-110, A-112, A-113 as final-report sections while the work happens | 1.5 |
| Merge the early acceptance run (A-95) into the dry run (A-87) | 2.2 |
| Trim Should/Could verification (A-72, A-76, A-77) to existing automated tests plus one acceptance pass | 5 |
| A-115: demo script only, no slides, 15-minute mock viva | 3 |
| Baseline V2.0 minimal: schedule, capacity, risks (A-106 from 3 h to 1.5 h) | 1.5 |
| A-105 workshop as one 1-hour session (was 5 x 0.5 h) | 1.5 |
| **Total** | **about 17** |

**Residual gap: about 15 h** (172.1 − 17 = 155 h against 140 h). Proposed cover, to be confirmed by the owner:

- Pre-commit the Q22 tripwire (below) and, if it fires, drop A-72, A-76 and A-77 verification entirely (about 4 h more).
- Accept about 2 h extra per person in W14 (10 h total) as a recorded realisation of R-G4-02, with escalation per working rule 3.

That sums to about 31 h against a 32 h need, so the plan has near-zero float even if all of it works. The analysis must state this plainly.

**Tripwire:** at M-03 on 24/11, if the team is more than 2 days behind or short by more than 2 h/week, Q22 fires and option B's cuts apply. Owner: RES-01.

## Constraints

- Gate: no baseline edits to V1.0 outputs; V2.0 is a new generated set (RES-03 regenerates `plan.mjs`, RES-01 approves).
- Final report A-92 stays the critical path and now finishes by 28/11 so the 29/11 submission has a review day.
- Submission package (A-116) assembled alongside the final report, not after.

## Outputs (what the builder writes)

- `docs/m3/change-impact-analysis.md` (A-99)
- `docs/m3/decision-record.md` (A-105, CR-01 and CR-02 with options and justification)
- revised W13–W14 table appended to `docs/m3-m4-work-division.md`
- Change Log rows as text in the decision record, for pasting into the workbook
- hand-off note to RES-03 for V2.0

## Left to the builder

Wording, tables, and the per-member re-plan within the cuts above. Items needing input from the team are marked `TODO(owner)`: actual hours to date, workshop date and attendance, who approves the decision (lecturer or team lead), and the V2.0 regeneration date.
