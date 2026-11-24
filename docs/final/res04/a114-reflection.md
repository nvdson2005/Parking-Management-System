# A-114 Individual Contribution and Reflection: DRAFT (RES-04)

Draft built from the repository history (F4-04 of `docs/m3-m4-final-work-division.md`, report ref M4 §4.6). The reflection must be in my own words and match what I can explain at the viva. Lines marked **TODO(RES-04)** need facts that the repository does not hold.

**Member:** Phạm Duy Quý (RES-04), Requirements and UI
**Period covered:** W12 through 24/11/2026 (update after A-87 on 26/11 and A-88 on 27/11)

## Contribution (evidence)

| Area | What I did | Evidence |
|---|---|---|
| Requirements (A-01, A-70) | Synced the SRS and P18 reservation rules with the code (KB-11, KB-20, KB-21). Updated the SRS to v2.1 from the Phase 5 customer answers Q36–Q46, including section 9, which lists the gaps between the SRS and the code | `07cea70`, `e6b4cdb` (A-70); `493fec4` (SRS v2.1, PR #22, waiting for RES-01 to choose #22 or #23) |
| Availability testing (A-49) | Added six tests asserting that every event changing free spots sends exactly one live update (RT-01 closed), with a mutation check for each. Wrote an AT-100 script that times 100 visits (200 events) over HTTP with the live stream open. Wrote the A-49 Quality Evidence | `484fbb2`, `b0dd9cd`, `e7fd47e`, `88f4cd8`, `d848d81` (PR #13, merged) |
| Change request (CR-03) | Raised CR-03 from the lecturer replies of 23/11 and the A-49 gaps: impact analysis, options and decision record; RES-01 approved option 2 | `14127a7` (PR #20, merged) |
| UI implementation (F4-01, F4-02) | Spec 006 through Spec Kit. Availability screen: last update time, used spots for Staff and Manager, "Hết chỗ" label (FR-19/20/21). Reservation form: valid default time, earliest time, closed-for-today state. Readable select labels on the entry and reservation forms. Font fix. Early-arrival prompt with booked time and zone (FR-51) | `1b088cd`, `093b9f3`, `60fce57`, `9293038`, `da0ac5f` (PR #24); 376 tests passing |
| Retest (F4-05) | Manual retest of A-49 after CR-03, timed from the database; A-49 moved from Partly verified to Verified | `4eb809d`, `docs/final/res04/a49-retest.md` |
| Payment test (A-76) | Test that all 6 vehicle type × fee group prices are applied | `26677dc` on `test/A-76-payment` (no PR yet; manual TC-PAY-01..03 still TODO) |
| Earlier milestones | **TODO(RES-04):** M1/M2 work that is not in git (SRS v0.1/v1.0 drafting, A-13 UI design document, A-09 review fixes), with where each is stored | — |
| AI use | Claude Code (Claude Opus) helped draft the CR-03 analysis, the spec, plan and tasks, the code and tests, and the evidence files, and ran the independent `review-implementation` checks. I ran the manual tests, took the screenshots and made the scope decisions | **TODO(RES-04):** add the sessions to the workbook AI Usage Log |

**Effort:** **TODO(RES-04):** actual hours per week for W12–W14. The planned figures to compare with: A-70 3 h, A-49 2 h, A-76 1 h, CR-03 groups A + B + C 2.6 h (decision record), F4-01..F4-05 8 h in the final work division.

## Reflection draft

**Testing found requirement gaps late.** A-49 was planned as a test activity. It found that the availability screen did not show three Must requirements (FR-19, FR-20, FR-21), even though the API already returned the data. The gaps reached the code because nobody compared the screens with the SRS after the SRS changed. The UI design document (A-13) was where that check belonged. I raised the gaps as CR-03 instead of fixing them inside A-49, so the effort and the decision were visible in the plan. On a future project I would compare each screen with the SRS when the SRS version changes, not only at test time.

**Evidence must come from the agreed scenario.** The first A-49 timing evidence used a few manual samples. The reviewer pointed out that the acceptance contract (SC-001) asks for both timings during the 100-visit scenario. I wrote a script that drives 100 visits through the same API the Staff screens use and records every event: the maximum was 153 ms to record and 155 ms to display, against limits of 3 s and 5 s. I would defend this at the viva because the number now answers the question the client asked, under the load they described.

**A passing test is not always the behaviour.** The first font fix had a test that checked the CSS text, and the test passed. The manual retest showed body text still in a serif font, because the font was applied on `html` while its variable was defined on `body`. The test checked the wrong thing. I changed it to check that the font is applied on the element that defines the variable. The independent review later rejected the branch because two fixes on the reservation form had no test, which the constitution requires. I moved the form into a component that can be rendered in a test, and checked each new test by removing the fix and seeing it fail. I learned to ask "would this test fail if the behaviour broke?" for every test I add.

**Coordination mistakes cost time.** My CR-03 reused an ID that RES-03 had already used in the risk register, and part of its group D was already done by RES-03. My SRS v2.1 PR went into another feature branch instead of `main`, so the update was not on `main` when the team needed it. Both came from not checking the team's open PRs and records before starting. On the next project I would check open PRs, the risk register and the PR base branch before raising a change or opening a PR.

**Process.** I skipped `speckit-clarify` and ran `speckit-analyze` only after implementation, and CodeGraph was not installed until late. The analysis still found a real bug (the time picker allowed a minute that the server rejects) and a planning gap. I would run the full Spec Kit chain in order next time; analyze is cheap compared with fixing after review.

**Mock viva:** **TODO(RES-04):** the artifact I will explain that I did not write (F5-02 assigns it). A natural choice is RES-03's staff reservation lookup (A-65, FR-52), which sits next to my FR-51 work.

**After A-87/A-88:** **TODO(RES-04):** add the dry-run and acceptance outcome for the availability and reservation screens, and one lesson from the A-91 retrospective.
