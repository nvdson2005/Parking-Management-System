# A-114 Individual Contribution and Reflection (RES-05)

**Status:** final for review, 26/11. Hours in section 2 are estimated.

F5-07 of `docs/m3-m4-final-work-division.md`, report ref M4 §4.6. Built from the repository history and my own account of work that is not in git. It must match what I can explain at the viva (30/11).

**Member:** Nguyễn Tuấn Thành (RES-05), Simulator and Monitoring
**Period covered:** W12 to 26/11/2026

## 1. Contribution (evidence)

| Area | What I did | Evidence |
|---|---|---|
| Simulator review (A-43) | Reviewed the simulator (P04) against the SRS and wrote the SC-01..SC-07 catalogue, the criteria later used to accept P04; updated it after client round 3 | `f643391` (PR #2), `e9fd5e7` (PR #5); `docs/m3/A-43-simulator-review.md` |
| Report module test (A-77) | Tests that check the D-30 report metrics against a hand calculation, including the boundary rule | `69fb9ae`, `a5cff02` |
| API contract tests (A-79) | Contract tests for the entry/exit API shared by the simulator (P04) and the Staff screens (P05), including the exception exit paths EX-02/EX-03 | `3c4c041`, `f3c0cc2` (PR #6) |
| Simulator test (A-45, critical path) | P04 test with a reproducibility check; a TypeScript replay runner with a fresh DB per case; proposed CP-04 "pass with conditions" (KB-A45-01) and withdrew KB-A45-02 after the rerun | `903e582`, `144b2a4`, `24f4063`, `e3bd4b0`, `38efb27` (PR #8) |
| Integration check (A-67, critical path, with RES-01) | Confirmed the UI run and the A-44 closure; split setup and Staff outcomes after review | `07f2438` (PR #14), `cb02705`; `docs/m3/a-67-integration-check.md` |
| Entry/exit module test and CP-05 (A-68, critical path) | Ran T05–T13 with the simulator (100-session runs, exceptions, timings), wrote `scripts/a68-check.ts` for an independent DB count, logged D-01..D-06. CP-05 was recorded by RES-02 as "pass with conditions" C1–C6 | `39121f4`, `4058358` (PR #18); `docs/m3/a-68-cp05-test.md` |
| CP-05 follow-up (A-117) | C1 hand count on paper = UI = DB on the production build; C3 Network timings (entry 31 ms, exit preview 14 ms, confirm 23 ms); C2 demo video (2:54); C4 commit and verifier per QE row; C5 overlapping-run check (220 sessions, DB = UI); proposed ISS-06..ISS-11 | `087b8a5`, `0be7ccf`, `3dd0bb8`, `6c3b0bc` (PR #18); evidence in `docs/m3/evidence/a68/` |
| Defect fix D-01 (C6) | A second simulator run is refused with 409 `SIMULATOR_BUSY` while one is running; 6 tests; retested on the production build (two parallel requests: 200 and 409) | `c2ee5ce`, `9ce7c04` (PR #26); `specs/006-a68-d01-simulator-single-run/` |
| Auth and authorization test (A-31) | Role access per route and API, lockout, plate masking and `VIEW_FULL_PLATE` logging, 12-month purge; closed D-02 after PR #11; 310/310 tests after merge | `37ea2c5`, `2177188`, `840ba76` (PR #18); `docs/m3/a-31-auth-test.md`, 33 evidence files |
| Test suite fix (F5-01) | The simulator suite timed out at the default 5 s; a 60 s suite timeout makes `npm test` green without flags (42 files, 339 tests, run twice) | `9d58c49`, `dbedcc0` (PR #27) |
| Demo script and mock viva (F5-02, A-115) | Run of show for A-88, setup checklist, known issues, roles, mock viva plan | `965452e` (PR #28); `docs/final/res05/demo-script-and-viva.md` |
| O1/O2 measures (F5-03, A-92) | Measures of effectiveness for O1 and O2, §4.3.1 assessment (product measures met, outcomes Partial); solo demo run on 26/11 (A-88 internal) on production build `2c5a587`: 100/100 complete records, hand count = UI = DB | `docs/final/res05/objectives-o1-o2.md` (PR pending) |
| Not in git | Hand count photo and demo video for CP-05; A-09 SRS review (W12) | Video link in `docs/m3/a-68-cp05-test.md` 3.4; A-09 on the team Drive |
| AI use | Consulted AI (Claude) for advice and draft text; every test, measurement and commit was run and checked by me | |

## 2. Effort

Planned for RES-05 (`docs/m3-m4-work-division.md`): baseline 24.8 h + 7.5 h new work; A-117 adds RES-05 4.5–9.5 h; F5 tasks 8.0 h.

| Week | Dates | Actual hours | Main work |
|---|---|---|---|
| W12 | 09–15/11 | 7.5h | A-43, A-77, A-09 review |
| W13 | 16–22/11 | 8h | A-43 round 3, A-79, A-45, A-67 |
| W14 | 23–29/11 | 13h | A-45 runner, A-68 and CP-05, A-31, A-117 (C1–C6, D-01 fix), F5-01, F5-02, F5-03 |
| **Total** | | 28.5h | |

Fill from my Task Log (A-100). If a week was not logged, mark it as estimated, not measured.

## 3. Reflection

**The test environment changed the result.** My first A-68 100-session run showed two overlapping simulator runs. The cause was `next dev`: every DB write triggered a rebuild, the page reloaded and a second run started (A-31 O-01). Timings on the dev server were also 1–1.5 s, against 14–31 ms on the production build. I first treated these as product problems. I now run demos and timings on the production build and say which build a number comes from. The overlap was still a real defect (D-01): nothing stopped two runs at once. I fixed it with a single-run guard instead of only changing the environment.

**"Address the conditions" means do them, not list them.** After CP-05, my first follow-up listed C1–C6 with owners. RES-01's review said the conditions had to be done before A-87. I then did C1, C3, C4 and C5 with evidence, recorded the video for C2 and fixed D-01. A gate condition is closed by evidence, not by a plan.

**Independent checks find more than the app's own screen.** `scripts/a68-check.ts` counts open sessions straight from the DB. Comparing it with the UI and a hand count on paper is what makes the O1 "accuracy" claim credible. It also confirmed that availability stayed correct even when D-01 made the simulator counters wrong (C5), so D-01 stayed S2 instead of blocking the gate.

**Git mistakes cost time.** I applied the F5-02 patch onto `main` instead of a branch and had to reset and reapply. Some commits were made twice with different hashes on two machines, so references had to be regenerated. I now check `git branch --show-current` before every `git am` and commit, and cite hashes only after they are on GitHub.

**Process.** For D-01 and F5-01 I followed the repo workflow (design note, Spec Kit spec/plan/tasks, tests first, `npm test` + `lint` + `build` green). For the test records I did not, because they are documents. The small specs were quick and made the review easy; I would use them for every code change.

**What I would do differently.** Run on the production build from the first test, keep my hours in the Task Log daily, and add the AI trailer to every AI-assisted commit from the start.

**Mock viva:** the F5-02 plan assigns me RES-04's SRS (latest version) and the traceability matrix P24: trace O1 from objective to requirement, activity, test and checkpoint. RES-01 explains my A-43 review and RES-03 my A-68 / CP-05 record.

## 4. AI Usage Log rows (paste-ready, for RES-03 F3-05)

Columns: Date | Member | Tool | Task it was used for | What it produced | How the team verified or changed it | Report section affected.

```text
19–23/11 (self-reported) | Nguyễn Tuấn Thành | Claude (project chat) | A-67 integration check, A-45 replay runner | Step-by-step check guide, draft record, runner refactor | I ran the UI and replay checks; reviewer comments addressed (PR #14, #8) | M3 §3.1, §3.5
23–24/11 (self-reported) | Nguyễn Tuấn Thành | Claude (project chat) | A-68 module test, a68-check script, A-31 auth test | Test steps, check script, draft test records | I ran every test, took all screenshots; results are from my runs (PR #18) | M3 §3.5
25/11 (self-reported) | Nguyễn Tuấn Thành | Claude (project chat with Claude Code tools) | CP-05 conditions C1–C5, D-01 fix, F5-01, F5-02 | Evidence records, single-run guard and 6 tests, test timeout, demo script | Hand count and timings by me on the production build; npm test/lint/build run by me; PR review by RES-01 (PR #18, #26, #27, #28) | M3 §3.1, §3.5; M4 §4.1
26/11 | Nguyễn Tuấn Thành | Claude (project chat with Claude Code tools) | F5-03 O1/O2 measures, F5-07 reflection | Draft section and reflection | Demo-run numbers from my own run (a-check.txt); I reviewed and edited the text | M4 §4.3, §4.6
```
