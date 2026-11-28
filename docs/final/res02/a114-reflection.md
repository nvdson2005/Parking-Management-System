# A-114 Individual Contribution and Reflection (RES-02)

**Status: DRAFT.** Built from the repository, the project records and the work done on 26/11 and 27/11 (F2-06 of `docs/m3-m4-final-work-division.md`, report reference M4 §4.6). It is written in the first person so that it can be submitted, but **RES-02 must read every line and rewrite it in his own words**, because he will be asked about it at the viva on 30/11. A-88 ran internally on 26/11 because the client was unavailable. CP-08 was not obtained and the CP-06 fallback applies. See [F5-03](../res05/objectives-o1-o2.md).

**Member:** Đào Xuân Sơn (RES-02), BA and Quality (QA)
**Period covered:** M2 through 26/11/2026 with the A-88 outcome recorded above

## Contribution (evidence)

| Area | What I did | Evidence |
|---|---|---|
| Test plan P20 (M2) | Wrote P20 v0.1 and v0.2: scope, strategy, objective mapping, tests T05 to T13 and T-DB1 to T-DB10, traceability from FR and exceptions to tests | `docs/m2-report/products/CO3011_M2_KeHoachKiemThu_v0.1.md` (change history: v0.1 08/11, v0.2 09/11) |
| SRS (A-01) | I did **not** write the SRS; RES-04 did. The baseline plan names me as BA and co-author with a 35% share of A-01 (RES-04 65%), so the plan and the actual work differ. My part on the requirements side was the test view: P20 traces every FR and exception to a test | Baseline V2.0 plan, activity A-01 (plan only); SRS change history shows RES-04 as the author of every version |
| First automated run (A-96) | Ran the first full automated suite and recorded Quality Evidence. Risk R-G4-03 closed because the suite passed 181 of 181 on 19/11 | `docs/m3/workbook-rows.md`; risk register R-G4-03 |
| CP-03 database design review (A-27) | Reviewed P03 v0.4 in two rounds (5 comments, then 4). The first round found a missing gate field on sessions (G-09, FR-09) and showed that G-06 was needed for AT-03 and AT-04; the second added G-04. All were implemented | Risk register, week 14 entry of 23/11 (written by RES-03); PR #11, commits `6ef8862`, `68abc69`. No minutes in the repository |
| CP-05 gate decision (A-68) | Decided **Pass with conditions** on 24/11 against the CP-05 row of P20 v1.2, and set conditions C1 to C6 | `docs/m3/a-68-cp05-test.md` §3; `docs/m3/cp05-follow-up-verification.md` |
| PR #8 and PR #18 | I did **not** review these pull requests; RES-01 (Nguyễn Võ Đức Sơn) did, although the final work division named me as reviewer. My role was the gate decision for the tests they carry: CP-05 decided on 24/11 (above); CP-04 decision recorded on 26/11 | PR #8 and PR #18 on GitHub; `docs/final/res02/checkpoint-log.md` |
| Acceptance scenarios (A-82) | Authored P21 (`PD-P21 Bộ test nghiệm thu.md` / `CO3011_M2_AcceptanceTests`), covering 3 test blocks: core workflows (`AT-01` to `AT-07`, AT-07 being the reports scenario), 5 core exceptions (`AT-EX01` to `AT-EX05`), and the 100-session volume test (`AT-VOL01`) | Team Google Drive (`PD-P21 Bộ test nghiệm thu.md`, created 01/11); mapped to `AT-01..AT-07`, `AT-100` and `AT-EX01..AT-EX05` in the A-87 dry run |
| A-87 dry run (CP-07) | Pinned SHA `ac57507c` (26/11); ran `npm test` (382 of 382), build and lint; ran the HTTP rehearsal (25 of 25); ran AT-01 to AT-07 and AT-100 by hand. On 27/11, after RES-04's review, ran AT-EX01 to AT-EX05 on a build with the D-04 fix (PR #38, now merged). Took all screenshots (44 files in `A87/`) | `docs/final/res02/a87-dry-run.md`; commit `5dfa141` (first 32 screenshots) |
| Quality evidence (F2-02) | A-72 reservation, A-76 payment, A-77 reports, A-79 contract tests: automated tests plus one acceptance pass each | `docs/final/res02/quality-evidence-modules.md` |
| Gate log (F2-03) | Gate log CP-01 to CP-07 with outcome, reviewer and evidence per gate | `docs/final/res02/checkpoint-log.md` |
| CP-01 record (F2-01) | Recorded that the SRS review took place on 16/11 and did not pass, that it was closed by revision without a recorded re-check, and which findings are still open in SRS v2.1 | `docs/final/res02/cp01-srs-review.md` |
| Objectives O3 to O5 (F2-05) | Measures of effectiveness, separating product completion from objective achievement | `docs/final/res02/objectives-o3-o5.md` |
| Risks owned | R-G5-01, R-G5-02, R-G5-03 (dry run and client confirmation) | `docs/m3/risk-register.md` |
| AI use | Claude (chat), 26/11. See the log rows below | Below |

**Effort:** my hours are recorded on the team Drive, not in the repository. The figures below are copied from there and are **self-reported, not measured**; keep that wording wherever they are used (A-90, workbook Planned vs Actual). Planned figures to compare with: F2-01 to F2-06 total 8 h in the final work division; A-72 1.6 h; A-68 shared with RES-05 (3.17 h for both); A-114 1 h in W14.

| Week | Dates | Estimated hours | Main work |
|---|---|---|---|
| W12 | 09 to 15/11 | ~8 h | Test plan P20 updates (A-80), first automated test run setup (A-96), initial test traceability |
| W13 | 16 to 22/11 | ~8 h | First full automated suite run 181/181 (A-96, 19/11), acceptance scenarios P21 review/sync (A-82), reservation module testing (A-72) |
| W14 | 23 to 29/11 | ~8 h | CP-03 review, CP-05 gate decision, CP-02/CP-04/CP-06 gate closure, A-87 dry run, F2-01 to F2-06 |

**Work outside git:** my commits include `5dfa141` (the first dry-run screenshots). My test and review records, my hours and my other working documents are on the team Drive, so git history alone understates my work. Key Drive files include:
* `PD-P21 Bộ test nghiệm thu.md` (`CO3011_M2_AcceptanceTests_v0.1` / `v1.0`, created 01/11/2026) — full specification for AT-01..AT-07, AT-EX01..AT-EX05, and AT-VOL01.
* `CO3011_Project_Tracking_Workbook.xlsx` (Task Log and Quality Evidence tabs, updated through W14) — self-reported weekly hours and test execution records.
* Working drafts of test plan P20 and review notes stored in the group Drive folder.

## Reflection (draft; edit to your own words)

**Gates were recorded late.** CP-02 and CP-03 had no review record by 17/11 (ISS-M3-01), and code for A-28, A-44, A-63, A-65 and A-70 started before they were. My CP-03 comments came on 23/11, a day after P03 v0.4 was ready. They found G-09 and G-06, which cost about 3.5 h plus 1.5 h of change work in CR-03. A review a few days earlier would have found them before code depended on the design. In a future project I would book the review the day the document is ready and record the outcome that day.

**A gate needs a named approver and a date.** The CP-01 review happened on 16/11 and did not pass. The findings were fixed through later SRS versions, but nobody recorded a re-check or an approval, so on 26/11 I could only record the gate as open. I could not tell from the repository whether it had closed. I also found that the plan did not match the work: it lists me as co-author of the SRS, but RES-04 wrote it. Roles in the plan have to be checked against who actually does the work, because the plan also decides who counts as an independent reviewer.

**Evidence has to be planned before the run.** The dry run passed all 13 scenarios (eight on 26/11, the five exception scenarios on 27/11 after RES-04's review), but when I checked my own screenshots against the scenarios I found gaps: one report screenshot was cropped, steps such as the lot reactivation and the tariff edit were missing, run times were not recorded, and the exception run repeated the reactivation gap and did not show how zone C was filled. A pass that cannot be shown does not count. I would list the screenshot and the number needed for each scenario before running it, not after. RES-04's review also showed that my first run covered 8 of 13 scenarios while the gate asks for all Must scenarios; I would check the scenario list against the gate criterion before reporting a result.

**A test is not the same as an objective.** Writing the O3 to O5 measures showed that the system proves correctness on simulated data, such as fees and exceptions, but cannot show a real reduction in errors or an improvement in utilisation, because there is no real lot and no baseline. I would define at planning time what number proves each objective and where it will come from.

**One risk I owned did not occur.** R-G5-02 (the dry run finds more defects than expected) was rated high. The dry run raised no new defect. D-04 was already known from A-68 and showed again on the pinned SHA; it was fixed in PR #38 and merged on 27/11. Earlier testing in A-67 and A-68 had already found D-01 to D-06, which is what kept the dry run clean. *(Note: add one lesson from the A-91 retrospective ).*

## Viva preparation

At the demo: AT-01, AT-02, AT-06, presenter for exceptions, QA observer (`docs/final/res05/demo-script-and-viva.md` §4). Mock viva: I explain **P03 and the availability formula** (RES-03's artifact); RES-04 explains my P20 and P21.

| Likely question | Short answer (check it in the code and files before the viva) |
|---|---|
| How is "free" computed, and why can it never be negative? | `free = max(0, capacity − open sessions − pending reservations)` per zone and vehicle type (`src/server/services/availability.ts`, line 28). The `max(0, ...)` is the floor; the entry check refuses a vehicle when a zone is full, so open sessions cannot exceed capacity. Tests: `availability.test.ts`, "free never negative after simulateLive" |
| What separates a T-test from an AT? | A T-test (T05 to T13, T-DB1 to T-DB10 in P20) checks one module or the data design against the plan. An AT (P21: `AT-01..AT-07`, `AT-EX01..AT-EX05`, `AT-VOL01`, executed as `AT-01..AT-07`, `AT-100` and `AT-EX01..AT-EX05` in the dry run) is a scenario seen from the client's side with concrete values and expected results; each objective needs at least one AT with a numeric threshold |
| Who signs CP-05, and what does "pass with conditions" mean? | RES-02 as QA decides the gate, and the project manager approves the follow-up issues (ISS-06 to ISS-11). "Pass with conditions" is valid once each condition C1 to C6 has an issue with an owner and due date. The Q23 demo-video condition is waived and unmet |
| Why did CP-01 not close? | The 16/11 review did not pass; findings were revised later; no re-check or approval was recorded (`cp01-srs-review.md`) |
| Which objective can you not show as achieved, and why? | O5 until the client accepts the demo; O3 and O4 are shown as capability and correctness, not as measured improvement (`objectives-o3-o5.md`) |
| Which defect did the dry run show, and what happened to it? | D-04: the exit preview labelled the plate recorded at entry as "Biển số quan sát" (`A03-05`). Known from A-68, severity S2, owner RES-04. Fixed in PR #38 (retest 7/7, independent review), merged 27/11; `AX02-02` shows both labels. The reported 27/11 rerun lacks a recorded SHA and result (`a87-dry-run.md`, condition A) |
| What did you do that is not in git? | My acceptance test specification (`PD-P21 Bộ test nghiệm thu.md`), test/review records, and self-reported weekly hours log (`CO3011_Project_Tracking_Workbook.xlsx`), kept on the team Drive |
    
Report reference: M4 §4.6.