# A-114 Individual Contribution and Reflection: DRAFT (RES-01)

Draft from the repository history. Edit freely: the reflection must be in your own words and match what you can explain at the viva. Review the first-person draft below before submission.

**Member:** Nguyễn Võ Đức Sơn (RES-01), PM and Tech lead
**Period covered:** W12 through 21/11/2026 (update at the end of W14)

**Phase 5 update to verify before submission:** The 23 November client reply was mapped to 11 decisions in [PR #15](https://github.com/nvdson2005/Parking-Management-System/pull/15) and the [RES-01 interaction log](client-interaction-log-phase-5.md). I prepared the split delivery design and Spec Kit plan in [PR #19](https://github.com/nvdson2005/Parking-Management-System/pull/19). A-68 was reported one day late in PR #18, while the QA gate, integrated build and client verdict remained open at the 24 November review. I kept estimates separate from measured hours. Add the actual M-03, A-87, A-88 and retrospective outcomes after they occur; this draft is not a signed personal statement.

## Contribution (evidence)

| Area | What I did | Evidence |
|---|---|---|
| Planning and baseline | Built the M2 baseline and the work-division plan for M3/M4 | `0508c3b`, `061120c`, `0babc33` |
| Product | MVP before the baseline: auth, entry/exit, reservations, simulator, reports, accounts; manual E2E guide | 39 commits dated 08/11 |
| Execution (W12–W13) | Round-3 lecturer changes: early arrival confirmation, one reservation per account, per-zone utilisation, suspension notifications and bell | `34c9e49`, `f5f75f9`, `b79b759`, `00659e6`, `95293a1`, `360b6ba`; review fixes `beda3ad`, `85d8f3e`, `30b5032` |
| Execution (A-63, A-74) | Exit plate match without separators (KB-04), server-side lost-card PLATE rule (KB-05), known-vehicle type tests (KB-13); fee-at-exit and one-transaction tests | `42b9d98`, `9e07e29` |
| Design decisions | P18 v1.0 with decisions for KB-01..KB-19 | `3d911b6` |
| Change event (Task 3.6, 3.7) | Impact analysis, decision record, revised W13–W14 plan, V2.0 hand-off | `3e7d822`, `d8dd6ce`, `d6dbfb2`, `e43c2bf`, `ca7808b` |
| Process | Spec Kit scaffold and constitution; AGENTS.md, CLAUDE.md, codegraph rules | `0578a4e`, `5ee2186`, `7e99357` |
| AI use | Claude Code assisted with code and drafts. Codex helped prepare the A-90 comparison, reflection, and demo rehearsal. | Workbook AI Usage Log for the 21/11 Codex session. Confirm earlier Claude Code entries before submission. |

Estimated RES-01 effort through W13 was **18 h** across 8 h in W12 and 10 h in W13. The same allocation accounts for 4.50 h on P18, 4.25 h on CR-02 implementation and review fixes, 2.75 h across A-63/A-74, and 1.75 h across CR-01 analysis, workshop preparation, and V2.0 handoff. The [A-90 ledger](a-90-planned-vs-actual.md#res-01-weekly-effort-estimates) lists the full breakdown.

## Reflection draft for RES-01 review

I had planned to finish P18 on 12 November. It was committed on 19 November after the round-3 changes took priority and the fee and transaction decisions were settled. Entry and exit fixes finished one day after their target. The deadline also moved from 7 December to 29 November. I consolidated report work and kept the core entry, exit, and availability checks in the revised plan. The remaining hours gap still needed decisions from the team.

I kept session closure and simulated payment in one transaction. If payment creation fails, the session remains open. The regression test checks that failure and that a successfully closed session has one payment. I would defend this decision at the viva because it gives staff a consistent session state when a payment write fails.

I started the weekly log after W12 and had to reconstruct my effort from activity evidence. On a future project, I would log effort and review outcomes on the day they happen and compare remaining work with each owner's available hours before claiming a schedule saving.

For the mock viva I will explain RES-05's A-43 simulator review, including how SC-07 tests the 100-session requirement and how that evidence feeds the demo.

After A-88 and A-90, add the acceptance outcome, any W14 hours available, and one lesson from the retrospective. RES-01 should revise the first-person wording before submission.
