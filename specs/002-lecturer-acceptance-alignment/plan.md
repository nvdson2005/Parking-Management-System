# Phase 5 RES-01 Implementation Plan

**Branch** `docs/phase-5-res01-delivery`
**Date** 24 November 2026
**Spec** [Lecturer acceptance alignment](spec.md)
**Design** [RES-01 delivery design](../../docs/superpowers/specs/2026-11-24-phase-5-res01-delivery-design.md)

## Summary

Deliver the standalone RES-01 updates in one new PR from `main`. During execution, push the specific RES-01 contributions that belong in an existing PR directly to that PR's current head. Teammate-owned work remains on its current stack. Close the evidence loop on one integrated acceptance candidate and carry its results into A-89 and final sign-off.

## Technical Context

| Area | Existing environment |
| --- | --- |
| Repository | Markdown, Git, GitHub pull requests, the project tracking workbook, and the Spec Kit feature directory |
| Product validation | Next.js, Prisma/SQLite, Vitest, disposable seeded database, production build, Chrome/Edge/Firefox |
| Performance and scope | One pilot lot, the normal 100-visit scenario, ≤3 s recording, ≤5 s display update, separate full-lot refusal, nine browser/width combinations |
| Dates | M-03 on 24 November, A-87 target 26 November, A-88 target 27 November, report/sign-off 28 November, submission 29 November |
| Baseline | `origin/main` at `8472986` on 24 November. PR #15 and A-67 confirmation PR #14 merged. Refresh the PR states and heads before execution. |

## Constitution Check

- Keep V1.0 archived, record the Phase 5 decision and the applicable A-ID in each commit, and update the CodeGraph index before finishing repository edits.
- Use the main checkout for implementation. Never discard local work or use the repository’s stale worktrees.
- This plan introduces no application architecture. Any code follow-up stays within the existing route/service structure and retains authorization, plate privacy, concurrency safeguards and bilingual labels. Gate code work on the recorded applicable design decision and the Spec Kit tasks and analysis steps.
- Run focused regressions, the full suite, lint, build, and migration verification on applicable code heads and the integrated candidate. Documentation commits receive traceability, link, and diff checks.
- Post-design review confirms these boundaries. No exception to the constitution is required.

## Project Structure

- **Standalone RES-01 PR** — This feature’s planning artifacts. During execution add only RES-01 changes in `docs/m3/change-impact-analysis.md`, `docs/m3/decision-record.md`, `docs/m3/a-90-planned-vs-actual.md`, `docs/m3/weekly-log-draft.md`, `docs/m3/quality-evidence-A-61.md`, `docs/m3/a-88-a-115-demo-rehearsal.md`, and `docs/m3/a-114-reflection-draft.md` as applicable. Give the Client Interaction Log rows to the workbook’s current editor, or edit in place if coordinated and authorized.
- **Existing PRs** — Exact destinations and ownership in the [handoff contract](contracts/review-and-evidence.md).
- **Validation** — [Quickstart](quickstart.md) describes the checks and how to record results. [Evidence model](data-model.md) defines the records. [Research](research.md) records branch and evidence decisions.

## Implementation Sequence

### 1. Start the standalone RES-01 work

- [ ] Recheck GitHub. For A-09/A-16, capture Q36–Q46 with the date, response and trace references. Link merged PR #15. Separately record the CP-01 review outcome with RES-04 and RES-05.
- [ ] For A-99/A-105/A-97, add the Phase 5 impact and M-03 decision to the RES-01 records. Cross-reference PR #10’s CR-03 entry, its like-for-like options, and the proposed A-87 candidate. Capture the agreed Q22 outcome, dependencies, owners and due dates. Record unknown gate outcomes and hours as pending.
- [ ] For A-90/A-94/A-100/A-114, refresh completion evidence and add actual hours as supplied. Cite merged #14 and distinguish its A-67/A-44 evidence from the pending CP-05 verdict. Keep forecast, estimate and measured actual separate.
- [ ] For A-61/A-88/A-115, add the Phase 5 checks to the RES-01 rehearsal and evidence files. Retain earlier A-61 permissions and per-visit payment evidence. Keep A-63/A-67/A-74 implementation closed unless an integrated regression reveals a defect. Coordinate simulator D-01 with RES-05 only if it reproduces on the production candidate and threatens A-87 or A-88.
- [ ] Keep the standalone diff to RES-01 files. Validate citations, status language, and the test plan. Commit with the applicable A-IDs and update the standalone PR.

### 2. Contribute directly to existing PRs

- [ ] **In parallel** with step 1, refresh each assigned PR head and apply only the RES-01 changes listed in the handoff contract, after coordination with the owner. For #10, this includes the CR-03/A-106 approval record after the estimate and build handoff reconcile. For #12, supply actuals, the RES-01 report input and the A-88 outcome when available.
- [ ] Close the product stack in order **#11 → #17**. RES-03 resolves #11's outstanding review findings and integrates latest main. Inspect the final privacy and retention diff. Once #11 lands, recheck #17's base and migration order. The owner retargets it and verifies the effective diff and final-head checks.
- [ ] Close the documentation stack in order **#9 → #16**. Validate the P18 inventory and Phase 5 contract links on the final versions. Have RES-04 update the SRS/P18 wording on its owning branch.
- [ ] Review QA PRs #8, #13, and #18 independently. Keep A-31/T12 and the CP-05 decision with their owners. Leave `docs/m3/workbook-rows.md` out of the standalone PR. Where #11, #17 and #18 overlap, take one head at a time and carry forward all previously merged rows.
- [ ] Before each direct push, verify the PR remains open, the remote head and owner match GitHub, and the patch is limited to assigned paths. Use a normal push. If the head moves, incorporate the owner's latest commits and repeat checks. If the PR merges first, check what landed and put only the remaining delta on a new branch from main.

### 3. Verify the integrated candidate and close out

- [ ] Pin a release candidate with #11 and #17 when both land. If a dry run must use an integration candidate, record its SHA, branch composition, and exclusions in P14. Follow the [quickstart](quickstart.md) on a disposable database.
- [ ] Have QA record the A-87 evidence and gate outcome. With RES-05, execute A-88 against the identified build or record differences and rerun affected checks. Supply the dated client verdict and exceptions to RES-03 for A-89.
- [ ] Chair A-91 and hand off lessons to RES-04. Finish A-90, A-114 and A-92 review/sign-off, confirm the final package with RES-04, and record the submission receipt. Keep A-108 as an input to A-92.

The next Spec Kit stage is task generation and cross-artifact analysis before implementation.
