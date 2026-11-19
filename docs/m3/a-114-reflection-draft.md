# A-114 Individual Contribution and Reflection: DRAFT (RES-01)

Draft from the repository history. Edit freely: the reflection must be in your own words and match what you can explain at the viva. Hours are `TODO`.

**Member:** Nguyễn Võ Đức Sơn (RES-01), PM and Tech lead
**Period covered:** W12 to 19/11/2026 (update at the end of W14)

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
| AI use | Claude Code assisted code and drafts; all decisions (KB-02, KB-03, option C) were mine. Record in the AI Usage Log. | `TODO(RES-01)` workbook AI Usage Log |

Effort: `TODO(RES-01)` hours per row.

## Reflection prompts (write in your own words)

1. **What went to plan, what did not.** Data points: A-22 planned 12/11, finished 19/11; A-63 finished one day late; the round-3 changes were unplanned work; no weekly log existed in W12; the deadline moved a week earlier in W13.
2. **A decision I would defend at the viva.** Candidates: accepting KB-02 (fee at exit time) and KB-03 (one transaction); option C over absorbing or descoping.
3. **A mistake I made and what changed.** Candidates: I overstated the savings of option C (17 h claimed, 8 h real) until a review caught two sign errors; I marked a task done before writing its test and caught it myself; I did not start the weekly log or hours tracking at the start of W12.
4. **What I would do differently on the next project.** Candidates: record hours from day one; do the design-decision gate (CP-02) before coding; cost every saving against the correct baseline before presenting it.
5. **Viva readiness.** Be ready to explain any artifact, including one I did not write (`TODO(RES-01)`: choose which, A-115).

`TODO(RES-01)`: finalise at the end of W14 after A-88 and A-90.
