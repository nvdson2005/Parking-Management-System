# A-114 Individual Contribution and Reflection (RES-04)

**Status:** draft until the A-87/A-88 outcome is added after the demo on 27/11 (the one open TODO below). Everything else is final for review.

Built from the repository history and my own account of work that is not in git (F4-04 of `docs/m3-m4-final-work-division.md`, report ref M4 §4.6). The reflection must match what I can explain at the viva. The one remaining **TODO(RES-04)** is the A-87/A-88 outcome, added after 27/11.

**Member:** Phạm Duy Quý (RES-04), Requirements and UI
**Period covered:** W12 through 26/11/2026 (update after A-87 on 26/11 and A-88 on 27/11)

## Contribution (evidence)

| Area | What I did | Evidence |
|---|---|---|
| Requirements (A-01, A-70) | Synced the SRS and P18 reservation rules with the code (KB-11, KB-20, KB-21). Updated the SRS to v2.1 from the Phase 5 customer answers Q36–Q46, including section 9, which lists the gaps between the SRS and the code | `07cea70`, `e6b4cdb` (A-70); `493fec4` (SRS v2.1); PR #22 approved and merged into `main` on 26/11 (`9b811a2`) |
| Availability testing (A-49) | Added six tests asserting that every event changing free spots sends exactly one live update (RT-01 closed), with a mutation check for each. Wrote an AT-100 script that times 100 visits (200 events) over HTTP with the live stream open. Wrote the A-49 Quality Evidence | `484fbb2`, `b0dd9cd`, `e7fd47e`, `88f4cd8`, `d848d81` (PR #13, merged) |
| Change request (CR-03) | Raised CR-03 from the lecturer replies of 23/11 and the A-49 gaps: impact analysis, options and decision record; RES-01 approved option 2 | `14127a7` (PR #20, merged) |
| UI implementation (F4-01, F4-02) | Spec 006 through Spec Kit. Availability screen: last update time, used spots for Staff and Manager, "Hết chỗ" label (FR-19/20/21). Reservation form: valid default time, earliest time, closed-for-today state. Readable select labels on the entry and reservation forms. Font fix. Early-arrival prompt with booked time and zone (FR-51) | `1b088cd`, `093b9f3`, `60fce57`, `9293038`, `da0ac5f` (PR #24, merged 26/11 as `ac57507`); 376 tests passing at merge |
| Retest (F4-05) | Manual retest of A-49 after CR-03, timed from the database; A-49 moved from Partly verified to Verified | `4eb809d`, `docs/final/res04/a49-retest.md` |
| Payment test (A-76) | Test that all 6 vehicle type × fee group prices are applied | `26677dc` on `test/A-76-payment` (no PR). In the final work division A-76 evidence moved to RES-02 (F2-02); the branch is handed over for that task |
| Requirements before W12 (M1–M2, A-01) | Wrote the Product Description for the SRS (P02), then drafted the whole SRS | SRS files under `docs/m2-report/products/` (`CO3011_M2_SRS_v0.1`); drafts on the team Drive. Not committed under my name |
| UI design (A-13) | Wrote the UI design document from the existing screens | Team shared Drive (not in git) |
| SRS review fixes (A-09) | Revised the SRS after the review | Team shared Drive. No review record was found in the repository on 19/11 (`docs/m3/a-90-planned-vs-actual.md`), so the CP-01 outcome is for RES-02 to record (F2-01) |
| AI use | Claude (chat) for M1–M2 drafting. Claude Code (Claude Opus) from 20/11: drafts of the SRS sync and v2.1, the CR-03 analysis, the spec, plan and tasks, the code and tests, the evidence files, and the independent `review-implementation` runs. I ran the manual tests, took the screenshots and made the scope decisions | Claude Code: all 21 of my non-merge commits from 22/11 carry a `Co-Authored-By: Claude` trailer (checked 26/11 with `git log --all --author=pdiqui-17 --no-merges --since=2026-11-22 --format=%B`). The trailer shows that AI assisted, not how much of each change it wrote. Claude chat use in M1–M2 is self-reported; there is no record of it in the repository. Not yet in the workbook AI Usage Log: rows to paste are below |

**Effort (self-reported estimate, not logged and not verifiable from git):** I did not keep a daily log, so these figures assume 8 h per week, the capacity per member assumed in the baseline. They are not measured and should be marked as estimated wherever they are used (A-90, workbook Planned vs Actual).

| Week | Dates | Estimated hours | Main work |
|---|---|---|---|
| W12 | 09–15/11 | 8 | SRS revision after review (A-09); UI design document (A-13) |
| W13 | 16–22/11 | 8 | SRS and P18 sync with the code (A-70) |
| W14 | 23–29/11 | 8 | SRS v2.1; A-49 tests, timing run and Quality Evidence; CR-03; spec 006 and its implementation; A-49 retest |
| **Total** | | **24** | M1–M2 work before W12 is not counted |

Planned figures to compare with: A-70 3 h, A-49 2 h, A-76 1 h, CR-03 groups A + B + C 2.6 h (decision record), F4-01..F4-05 8 h in the final work division. The estimate equals the baseline capacity of 8 h per member per week (`docs/m3/weekly-log-draft.md`), so it cannot show over- or under-use; that is a limit of not logging hours, not evidence that the plan was met.

## Reflection draft

**Testing found requirement gaps late.** A-49 was planned as a test activity. It found that the availability screen did not show three Must requirements (FR-19, FR-20, FR-21), even though the API already returned the data. The gaps reached the code because nobody compared the screens with the SRS after the SRS changed. The UI design document (A-13) was where that check belonged. I raised the gaps as CR-03 instead of fixing them inside A-49, so the effort and the decision were visible in the plan. On a future project I would compare each screen with the SRS when the SRS version changes, not only at test time.

**Evidence must come from the agreed scenario.** The first A-49 timing evidence used a few manual samples. The reviewer pointed out that the acceptance contract (SC-001) asks for both timings during the 100-visit scenario. I wrote a script that drives 100 visits through the same API the Staff screens use and records every event: the maximum was 153 ms to record and 155 ms to display, against limits of 3 s and 5 s. I would defend this at the viva because the number now answers the question the client asked, under the load they described.

**A passing test is not always the behaviour.** The first font fix had a test that checked the CSS text, and the test passed. The manual retest showed body text still in a serif font, because the font was applied on `html` while its variable was defined on `body`. The test checked the wrong thing. I changed it to check that the font is applied on the element that defines the variable. The independent review later rejected the branch because two fixes on the reservation form had no test, which the constitution requires. I moved the form into a component that can be rendered in a test, and checked each new test by removing the fix and seeing it fail. I learned to ask "would this test fail if the behaviour broke?" for every test I add.

**Coordination mistakes cost time.** My CR-03 reused an ID that RES-03 had already used in the risk register, and part of its group D was already done by RES-03. My SRS v2.1 PR went into another feature branch instead of `main`, so the update was not on `main` when the team needed it. Both came from not checking the team's open PRs and records before starting. On the next project I would check open PRs, the risk register and the PR base branch before raising a change or opening a PR.

**Process.** I skipped `speckit-clarify` and ran `speckit-analyze` only after implementation, and CodeGraph was not installed until late. The analysis still found a real bug (the time picker allowed a minute that the server rejects) and a planning gap. I would run the full Spec Kit chain in order next time; analyze is cheap compared with fixing after review.

**Mock viva:** RES-05's plan (F5-02, `docs/final/res05/demo-script-and-viva.md` section 5) assigns me RES-02's P20 test plan and P21 acceptance tests, for example what separates a T-test from an AT and who signs CP-05. At the A-88 demo I present reservation and early arrival (AT-05).

**After A-87/A-88:** **TODO(RES-04):** add the dry-run and acceptance outcome for the availability and reservation screens, and one lesson from the A-91 retrospective.

## AI Usage Log rows (paste-ready, for RES-03 F3-05)

Columns of the workbook sheet: Date | Member | Tool | Task it was used for | What it produced | How the team verified or changed it | Report section affected.

```text
M1–M2 (self-reported, dates to confirm) | Phạm Duy Quý | Claude (chat) | Drafting the SRS Product Description and SRS sections | Draft text for the Product Description and SRS | I rewrote and restructured the drafts; the SRS went through review (A-09) | M1, M2 (SRS)
20–23/11 | Phạm Duy Quý | Claude Code | SRS and P18 sync with the code (A-70); SRS v2.1 from the Q36–Q46 answers | Draft edits to the SRS and P18; section 9 gap table | I checked each changed rule against the code and the client answers before committing (07cea70, 493fec4) | M3 §3.5, §3.7
23–24/11 | Phạm Duy Quý | Claude Code | A-49 availability tests, AT-100 timing script, Quality Evidence | 6 broadcast tests, timing script, evidence document | Mutation check per test; I ran the timing script and the manual steps; the reviewer's comments were addressed (PR #13) | M3 §3.5
24/11 | Phạm Duy Quý | Claude Code | CR-03 impact analysis and decision record | CR text with options and estimates | Reviewed and approved by RES-01 (option 2, PR #20); wrong FR citations corrected | M3 §3.6
24/11 | Phạm Duy Quý | Claude Code | Spec 006 (spec, plan, tasks), implementation of CR-03 A, B and FR-51, tests | Code, tests and Spec Kit artifacts (PR #24) | Tests written first and seen to fail; I ran the manual retest, which found a font defect the tests missed; an independent review subagent rejected the first version for missing tests, and the fixes were re-reviewed and approved | M3 §3.1, §3.5
24/11 | Phạm Duy Quý | Claude Code | A-49 retest record and this reflection draft | `a49-retest.md`, reflection draft | Results are from my own manual run; timing checked against `dev.db`; reflection reviewed and edited by me | M3 §3.5, M4 §4.6
```
