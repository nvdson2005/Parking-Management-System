# Phase 5 Acceptance Coordination Plan

**Goal** Deliver the lecturer-confirmed Phase 5 scope and acceptance evidence while keeping each existing PR with its owner.

**Spec** [Lecturer acceptance alignment](../../../specs/002-lecturer-acceptance-alignment/spec.md), merged in [PR #15](https://github.com/nvdson2005/Parking-Management-System/pull/15).

**Original GitHub snapshot** 24 November 2026, Vietnam time. `origin/main` is `8472986`. It includes the Phase 5 Spec Kit spec and the RES-05 A-67/A-44 confirmation from [PR #14](https://github.com/nvdson2005/Parking-Management-System/pull/14). The open PRs below were checked against their current heads. Reported test runs belong to those heads.

## Current RES-01 closure checklist

Use this checklist for the remaining work. The [final work division](../../m3-m4-final-work-division.md#5-report-section-tracker) defines the closure requirements and dependencies. The [RES-01 Spec Kit checklist](../../../specs/002-lecturer-acceptance-alignment/tasks.md) tracks the acceptance evidence.

- [ ] **F1-01 · Finalize the weekly logs (A-94, A-100).** Complete W12 and W14 in [the weekly log](../../final/res01/weekly-log-final.md), keeping the finalized W13 entry. Collect each member’s actual hours, identify any figures still unconfirmed, and recompute variances when actuals arrive. Keep the Task 3.8 note explaining that the lower-level plans were created during execution. Send the final rows to RES-03 for F3-05.
- [ ] **F1-02 · Finish the workshop and M-03 record (A-105, A-99).** Use [the dedicated record](../../final/res01/m03-decision-and-workshop.md) to confirm the workshop date, attendees, options and actions agreed. Record the 24 November M-03 outcome, the Q22 trigger and decision, owner commitments, and any outstanding QA dependencies. Keep the original gate record and the later decision accurately dated.
- [ ] **F1-03 · Approve Baseline V2.0 (A-106).** After RES-03 delivers F3-02, follow the [Baseline V2.0 handoff checklist](../../m3/baseline-v2-handoff.md). Reconcile the remaining-work forecast and Q22 decision against the regenerated baseline. Record the date, any corrections and the approval decision in `docs/final/res01/baseline-v2-approval.md`. Send the approved version to RES-03 for A-92.
- [ ] **F1-04 · Finish the individual reflection (A-114).** Update [the reflection](../../m3/a-114-reflection-draft.md) through W14 with the acceptance outcome, contributions, confirmed hours where available, and a lesson from the retrospective.
- [ ] **F1-05 · Review, merge and update the tracker.** Refresh PR status and dependencies before acting. Review remaining owner PRs in dependency order, preserve accepted shared rows, and tick each [report-section tracker row](../../m3-m4-final-work-division.md#5-report-section-tracker) once every listed item has merged. Record the supporting PR or evidence reference and hand off paste-ready rows to RES-03.

### Evidence carried into PR #19

- F1-01 and F1-02 have draft records on the branch. The weekly log still needs measured team hours and the full W14 update. The workshop record still needs confirmation of the actions agreed on 20 November.
- F1-03 has a [review of the F3-02 owner evidence](../../m3/baseline-v2-handoff.md#f3-02-owner-evidence-reviewed). RES-01 [endorsed V2.0 as the change-control record](../../final/res01/baseline-v2-approval.md). Recovery schedule approval awaits a reconciled forecast. F1-04 now includes the available W14 evidence. The client verdict, measured W14 effort and A-91 lesson remain pending.
- F1-05 awaits final PR and report tracker reconciliation. [CP-05 follow-up](../../m3/cp05-follow-up-verification.md) and [the demo rehearsal record](../../m3/a-88-a-115-demo-rehearsal.md) track the formal acceptance inputs, including the owner’s A-87 dry-run record and the separate RES-05 internal demo evidence. Report sign-off and the LMS receipt remain open.

### PR sequence and verified status

Local `origin/main` at `2c5a587` shows #11 merged and the #17 integration landed via #21. It also records #10, #13, #20, #8 and #18 as merged. #22 landed the SRS/P18 update selected from #22/#23. #24 carried the CR-03 UI work and A-49 retest, #26 the simulator overlap fix, #27 the simulator test timeout fix, #28 the demo and viva plan, and #25 the RES-04 reflection.

1. GitHub confirms #12, #19, #29, and #33–#39 are open. #30 is merged. Use #35 for the consolidated QA evidence and #36 for the SRS follow-up. #38 contains the D-04 fix and retest. #39 overlaps with the weekly log and workshop changes now on #19. Review the overlap before merging either PR. Use the landed #22 revision for SRS/P18 follow-ups.
2. Review the remaining QA and owner evidence against the pinned candidate. Keep CP-05 follow-up and any waiver open until the required QA and PM sign-offs are recorded. Carry the dated A-88 client verdict and accepted exceptions into A-89 and A-92.
3. M3 §3.1 is checked based on merged PRs #18, #24 and #27. Check that each remaining row’s inputs are merged and referenced before marking it complete. After the owner inputs and closure decisions are available, RES-03 performs the shared workbook update in F3-05.

### RES-01 decisions approved on 27 November 2026

RES-01 approved these planning decisions on 27 November 2026. Keep historical attendance, reported effort, client or QA decisions, and submission receipts tied to their original evidence.

| Item | Proposed entry |
| --- | --- |
| F1-01 · A-100 effort | Use 8 h, 10 h and 12 h per person for W12, W13 and W14 as capacity-based estimates. That gives 30 h per person and 150 h for the team. Leave measured hours and actual variance unknown until supported by member records. |
| F1-02 · Workshop actions | Use Option C as the closeout approach: retain the core pilot scope and the A-72/A-76 checks, consolidate report inputs, assign each unresolved evidence item to its owner, and plan against the reported 12 h per member in W14. The 20 November workshop actions still need confirmation before attributing this wording to the meeting. |
| F1-03 · Baseline decision | Endorse V2.0 as the change-control record. Keep 29 November as the submission target and show working day 24.63 of 15 as the model forecast. Retain A-72/A-76 without taking the 2.6 h fallback saving. Ask RES-03 to reconcile the remaining workload before approving a recovery schedule. |
| CP-05 and A-88 · Acceptance | Keep CP-05 at pass with conditions, retain the A-87 dry-run results as internal QA evidence, and carry any unclosed conditions into the report. Record the lecturer verdict and any accepted exceptions only when they are available. |
| A-91 and A-114 · Lessons | Bring these proposals to the retrospective and use the agreed wording in the reflection: log effort weekly, pin the candidate before collecting evidence, and track technical results, QA sign-off and lecturer acceptance as separate checkpoints. |
| A-92 and A-116 · Closeout | Prepare the report for review with one pinned build, linked evidence and a list of open conditions. Obtain sign-off on the final package and log the LMS submission date and receipt after upload. |

### Final report and submission

- [ ] Close A-90 with verified actuals and clearly identified estimates. Chair A-91 and hand off the lessons. Supply the verified M3 inputs for A-108, then review and sign off A-92 with its acceptance outcome and open exceptions.
- [ ] Use RES-05’s A-116 submission checklist to verify the package, including the repository link, P13 run guide, baseline references and evidence index. RES-01 uploads the approved package to the LMS and records the date and receipt in the closeout record.

## Original Phase 5 work on main

- [ ] **RES-01, A-09/A-16/A-94/A-97/A-99/A-105.** Use one documentation branch from current `origin/main`. Record the 11 answers Q36–Q46 in the client interaction log, cite PR #15, and record the 24 November M-03 decision, owner commitments, and QA dependencies. Reference CR-03 in RES-03’s baseline work. Record your review evidence separately from the CP-01 outcome. Coordinate the workbook update with its owner through one editor.
- [ ] **RES-01, A-90/A-100/A-114.** Update `docs/m3/a-90-planned-vs-actual.md`, `docs/m3/weekly-log-draft.md`, and `docs/m3/a-114-reflection-draft.md`. Link merged A-67 confirmation and A-68 evidence once accepted. Record actual hours separately from draft estimates. Use RES-03’s A-103 inputs when available. Avoid editing `docs/m3/workbook-rows.md` while PRs #11, #17, and #18 carry changes there.
- [ ] **RES-01 with RES-05 and QA, A-61/A-88/A-115.** Draft the dry-run and demo script in the RES-01 evidence files. Keep the prior authorization checks and per-visit payment evidence. Add the checks below and label each as pending until it has evidence against the identified candidate. Review D-01 from PR #18 before opening a simulator patch. For rehearsal, use one operator and a single in-flight run. If the reload or overlapping run still reproduces on the production candidate, reproduce it on a disposable database and coordinate a small follow-up in the simulator UI with RES-05. Reopen backend concurrency work only if the reproduced defect requires it.
- [ ] **RES-01, A-92/A-108.** Supply the dated M-03 decision, reviewed A-90 comparison, A-88 outcome, and open acceptance exceptions to RES-03’s report. Keep final sign-off and the submission receipt with the closeout record.

## Original PR ownership and review notes

| PR and owner | Remaining action |
| --- | --- |
| [#11](https://github.com/nvdson2005/Parking-Management-System/pull/11), RES-03 | On current head `36b1c91`, Q44 and Q46 already have code. The branch conflicts with main and your review is still open. Have RES-03 update it against main, preserving both copies of the workbook evidence rows. Close the short-plate masking case, Staff exit-confirm response, mismatch-note event-type restriction, and stale retention-spec wording on this branch. Review the final head and its fresh verification. |
| [#17](https://github.com/nvdson2005/Parking-Management-System/pull/17), RES-03 | Approved on `bcbbac3` against PR #11’s branch. It already contains informational operating hours, group-specific tariffs and Customer request/Manager group updates. After #11 merges, RES-03 retargets #17 to main, reconciles the stack with the actual merge, and verifies the effective diff contains only #17 changes. Apply migrations on a disposable database, run schema diff and rerun targeted and full checks on the updated head. |
| [#9](https://github.com/nvdson2005/Parking-Management-System/pull/9) then [#16](https://github.com/nvdson2005/Parking-Management-System/pull/16), RES-04 | Finish or confirm the #9 P18 inventory correction, then retarget the approved Phase 5 SRS v2.1 PR #16 to main. Review the final diff. Synchronize P18 contracts against the landed code in a RES-04-owned amendment or follow-up. RES-01 reviews architecture and records CP-01 separately. |
| [#10](https://github.com/nvdson2005/Parking-Management-System/pull/10), RES-03 | G-01 and the Phase 5 data rules are already present in P03 v0.6. Close the two latest review findings in this PR. Identify an integrated build containing #11 and #17 for A-87, and reconcile the CR-03 comparison at 28 h full scope and 16 h selected scope, a 12 h difference. Use the owner forecasts to reconcile the 26 November dry-run target and the 27 November demo target with modelled capacity before RES-01 records A-106 approval. Keep Baseline V1.0 archived. |
| [#13](https://github.com/nvdson2005/Parking-Management-System/pull/13), RES-04 | Keep A-49’s broadcast, count, and full-zone evidence. The ten latency samples were from separate manual actions. Record SC-001 as unverified until the integrated run links per-event timing and browser updates in the normal 100-visit scenario. RES-04 owns the availability display gaps and should use a narrow follow-up if fixing them. |
| [#18](https://github.com/nvdson2005/Parking-Management-System/pull/18) and [#8](https://github.com/nvdson2005/Parking-Management-System/pull/8), RES-05 with RES-02 | Keep CP-04 review fixes in #8 and A-68/CP-05 evidence in #18. Close A-31/T12 on the authorization matrix and plate/access-log checks, then have RES-02 record the CP-05 verdict. Link A-68 results to A-90 and preserve them when merging the shared workbook rows. |
| [#12](https://github.com/nvdson2005/Parking-Management-System/pull/12), RES-03 | Keep the install guide, actuals tracker, A-89 acceptance section, and A-112 closure work in #12. Pass RES-01 actual hours and the signed-off demo outcome to its owner. |

## Original merge and acceptance sequence

**24 November M-03 gate.** Separate merged behavior, pending code, and pending evidence. Apply the existing Q22 criteria and record any approved coverage reduction using the latest owner forecasts. Record the candidate owner and expected availability for A-87.

1. Run reviews for the two stacks in parallel. The independent QA and baseline PRs can proceed when their own findings close. Preserve the dependency `#11 → #17` and the dependency `#9 → #16`. After each parent merge, check the child’s base and changed files before approving it against main.
2. Because #11, #17, and #18 share `docs/m3/workbook-rows.md`, merge them sequentially when ready. After each merge, the next owner updates from main and preserves all accepted rows. If #18 lands first, RES-03 incorporates its rows in #11 before retargeting #17.
3. Pin the acceptance candidate SHA after #11 and #17 land. If main is still blocked, use an explicitly identified integration or #17 candidate that contains both code sets and note its exact SHA and exclusions in P14. Keep that build separate from the release verdict. Use a disposable seeded database and the migration chain. Record `npm test`, lint, production build, and migration verification against the candidate. PR descriptions report successful local runs, and GitHub’s check rollups were empty at the snapshot.
4. **A-87 dry run, target 26 November.** Verify AT-03 hours, group-specific tariffs using deliberately different rates, and the approved fee-group change flow. Verify AT-04 with Staff and Manager accounts, a short plate, the exit response, and records whose entry and exit dates straddle the retention cutoff. Exercise HTTP and UI as applicable. Seed old records for the automatic purge check and verify historical counts, durations, and revenue survive.
5. In the normal 100-visit scenario, correlate each entry/exit event with the recorded result and the corresponding browser availability display. Capture maximum latency against 3 seconds and 5 seconds respectively, complete closed records, and an independent availability count. Record all five exception results, with a separate full-lot refusal test. Capture the core workflows at 360, 768, and 1920 px on Chrome, Edge, and Firefox. Record the actual browser and width for each test.
6. **A-88 client demo, target 27 November.** If a mandatory check remains unavailable on the pinned candidate, record the missing check and owner in P14 and carry the client verdict into A-89 and A-92. Final report and submission targets remain 28 and 29 November.

The handover uses one pilot lot and per-visit pricing. A survey, 30-minute inactivity logout, second-lot operation, and full-capacity timing reruns are outside mandatory acceptance. Use the project’s existing Spec Kit and review trail for any new code follow-up.
