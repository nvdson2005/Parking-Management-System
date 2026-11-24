# Baseline V2.0 Hand-off (Task 3.7, A-106)

| Field | Value |
|---|---|
| From | Nguyễn Võ Đức Sơn (RES-01) |
| To | Nguyễn Phạm Mạnh Dũng (RES-03), who regenerates; RES-01 approves |
| Date | 2026-11-19 |
| Trigger | CR-01 (final submission moved from 07/12 to 29/11) changes the schedule, capacity and risks, so V2.0 is required. CR-02 does not change the baseline but is listed. |
| Effort | A-106 minimal: 1.5 h total (RES-03 1 h regenerating, RES-01 0.5 h approving) |

## What changes in V2.0

The table below is the planning estimate of 19/11. For the figures of the generated V2.0, use the section "V2.0 as generated" at the end.

| Area | V1.0 | V2.0 |
|---|---|---|
| End date | M-05 07/12; work ends before 04/12 | M-05 **29/11**; A-92 finishes 28/11 |
| Capacity | 190 h (W12–W15) | **140 h** (W12–W14) |
| Activities | As V1.0 plus work-division additions | Cuts applied: A-108 folded into A-92; A-110, A-112, A-113 as sections of A-92; A-89 a section of A-92; A-95 merged into A-87; A-72 and A-76 reduced to automated tests plus one acceptance pass (A-77 already committed); A-115 demo script only; A-106 1.5 h; A-105 stays 5 x 0.5 h |
| Effort | 139.6 h baseline (172.1 h with M3/M4 additions) | about 164.1 h after cuts (net -8.0 h, A-106 adds 1.5 h); gap to 140 h about 24 h, cover about 12.6 h, about 11.5 h open pending actual hours and the team's levers |
| Risks | R-G4-02 at 30% | R-G4-02 near-certain; new **R-G5-04** deadline compression (owner RES-01); R-G5-01 and R-G5-02 raised by the A-95/A-87 merge |
| Change log | empty | CR-01 and CR-02 (rows in `docs/m3/decision-record.md`) |

## What stays

Scope (all V1.0 products), objectives O1–O5, the Q22 fallback order, roles and RES-IDs, fixed dates M-03 24/11 and M-04 27/11.

## Process

1. RES-03 regenerates the plan set from `docs/m2-report/data/plan.mjs` into a new V2.0 output with the changes above. V1.0 outputs under `docs/m2-report/` are **not edited**; V1.0 outputs are copied into `docs/m2-report/data/archive/` before regenerating (today the archive holds only `plan-build-v0.2.mjs`, so the V1.0 `plan.mjs` and `generated/*` must be copied in by RES-03) for comparison.
2. RES-01 reviews and approves the V2.0 set.
3. The final report cites V1.0 and V2.0 side by side (Task 3.7: original information must remain available).

RES-03's [V2.0 baseline on `main`](baseline-v2.0.md) reports generation on 23/11 and regeneration on 24/11 after PR #10 review. **RES-01 approval is held** pending the capacity and M-03 decisions below; no approval date is entered.

Review the [V2.0 draft](baseline-v2-draft.md) for the revised milestones, dependencies, and capacity scenarios.

## RES-01 approval checklist

- [X] Verify the V1.0 plan is archived and V1.0 `generated/` remains separately available; V2.0 uses `plan-v2.0.mjs` and `generated-v2/` on `main`. The archived plan is `data/archive/plan-v1.0.mjs`; the V1.0 generated files remain in their original directory.
- [ ] Check the regenerated schedule: `generated-v2/milestones.md` labels M-03 24/11, M-04 27/11 and M-05 29/11, but `baseline-v2.0.md` reports a resource-levelled finish at working day 24.63 of 15, about 9.6 days beyond the window. A-92's 28/11 finish is a target, not a feasible result from that model; reconcile remaining actual work before approval.
- [ ] Check the revised activities, generated Gantt/CPM and risks against CR-01 and the work-division plan. The V2.0 ideal critical path is A-22 → A-23 → A-65 → A-87 → A-88 → A-89 → A-92 → A-116; R-G4-02 and R-G5-04 are present. Reconcile 183.89 h V2.0 demand with the older 164.1 h CR-01 scenario, and confirm CR-02's 15/11 reply date in the final record.
- [X] Verify owner commitments for the extra W14 capacity: V2.0 assumes 12 h per member and 150 h total, rather than the 140 h base. On 24/11, RES-01 reported all five members committed to the extra 2 h each and to work on 28–29/11. This is a PM-reported commitment; A-100 still needs each member's measured hours and it does not cure the 33.89 h planned demand gap.
- [ ] Record the feasible remaining-work forecast, corrections and approval. RES-01 decided on 24/11 to keep A-72/A-76 manual checks despite the Q22 trigger, so the model cannot claim the 2.6 h fallback saving. Share the approved version with RES-03 for A-92. Until then, treat V2.0 as a reviewed draft.

## V2.0 as generated (RES-03, 24/11)

The figures in the table above are the planning estimates of 19/11. The generated V2.0 (`docs/m3/baseline-v2.0.md`, `docs/m2-report/generated-v2/totals.md`) gives:

| Item | Value |
|---|---|
| Capacity | 150 h (W12–W14, W14 at 12 h per person under option C) |
| Base effort | 171.32 h, including CR-03 in A-28 (7.75 h) and A-65 (15.83 h) |
| Rework reserve | 12.58 h (R-M3-01 lowered on 24/11 after client answers Q36, Q39, Q40) |
| Total baseline effort | 183.89 h (122.59 % of capacity) |
| Cost at 50,000 VND/h | 8,565,833 VND base + 628,750 VND reserve = 9,194,583 VND |
| Levelled finish (model forecast) | working day 24.63 of 15; target dates for A-87, A-88 and the submission are fixed, see "Mục tiêu và dự báo" in `baseline-v2.0.md` |

