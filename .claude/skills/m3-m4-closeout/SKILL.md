---
name: m3-m4-closeout
description: Use when closing Smart Parking milestones 3 and 4, reconciling A-108 or A-92, or preparing QA, acceptance, handover, and submission evidence.
---

# Smart Parking M3 and M4 closeout

Finish evidence-backed work within the authorized scope. **Bring every RES-member verification, approval, and confirmation to the user for their decision.** Include independent reviews, personal confirmations, gate sign-offs, and waivers. The user decides item by item or approves an explicitly enumerated batch.

## Refresh the baseline

1. Resolve live GitHub `main` to a SHA and check relevant PR states and base branches. Use read-only queries. If live GitHub is unavailable, label the cached SHA and the status as provisional. Preserve local work.
2. At that SHA, read `docs/m3-m4-final-work-division.md`, the CP-01–CP-07 log and A-87 dry run under `docs/final/res02/`, the P24 matrix under `docs/final/res04/`, the submission checklist and lessons learned under `docs/final/res05/`, and the RES-01 decision and weekly log if merged. Reconcile stale “pending PR” references against GitHub. Inspect open branches for candidate evidence and identify the exact branch or SHA.
3. Build one ledger keyed by activity, gate, and condition. Include dependency, evidence link or SHA, exact remaining action, and disposition. Check CP-02, CP-05, CP-07, A-88/CP-08, A-90, A-91/A-113, A-108, A-92, A-110, A-114, and A-116 for outstanding work. Use existing records to discover additional items.

## Execute and record

| Disposition | Action |
| --- | --- |
| Ready | Do the work, run the smallest sufficient verification, and link the evidence. Apply the repository's Spec Kit workflow if product behavior needs changing. |
| User decision | Prepare evidence and queue the specific approval, independent review, sign-off, or confirmation. Continue unrelated ready work. |
| External evidence | Record the actual blocker and any applicable fallback. Request evidence only when the user can supply it. |
| Complete | Link the evidence and the relevant approval, when required. State separately whether the result is merged or local. |

Give the user one consolidated decision queue. Each row must include **ID, required decision, originally assigned RES role, evidence with tested SHA where applicable, any gap or waiver, and the status change approval would authorize**. Offer approve, reject, or defer for each ID. Record each express decision with date, scope, and attribution to the user. Silence, tests passing, PR merges, and approval to run the workflow are insufficient. Record any genuine reviewer sign-off under the person who gave it. If a course rule requires a named independent reviewer, record the user's decision and keep that formal gate open until the required sign-off or documented authorized waiver exists.

Example: CP-05 C1 and C4 go to the user even if the count and evidence rows are ready. Queue D-04 confirmation and the C2 waiver separately. Record test outcomes separately from the decisions. Keep CP-08 open until there is actual lecturer/client evidence. An internal rehearsal can support CP-06.

Prepare drafts and evidence locally. External messages, approval or merge actions on GitHub, publishing a baseline tag, and LMS upload require the user's explicit authorization for those actions. Use a real receipt to close submission. Report any remaining decisions, evidence gaps, and external blockers after verifying the work.
