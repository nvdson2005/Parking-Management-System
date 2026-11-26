# Weekly project log, W12 to W14 (F1-01; A-94, A-97, A-100)

| Field | Value |
|---|---|
| Task | F1-01 in `docs/m3-m4-final-work-division.md` |
| Owner | RES-01, Nguyễn Võ Đức Sơn |
| Report ref | M3 §3.2 (also M3 §3.8) |
| Status | Written 26/11/2026. W14 covers 23–26/11 and is finished on 29/11. |

Paste-ready for the workbook's **Weekly Project Log** sheet. Columns: Week | Date from | Date to | Planned work | Actual work done | Planned effort (h) | Actual effort (h) | Effort variance (h) | Variance % | Issues / risks raised | Management action taken | Logged by. RES-03 pastes the rows on 28/11 (F3-05).

## Basis of the hours

No member's measured hours exist in the repository. RES-01 instructed that the log be completed from the work division (`docs/m3-m4-work-division.md`, section 1 and section 7; `docs/m3-m4-final-work-division.md`). The actual-hours column therefore uses each member's planned weekly capacity: **8 h in W12, 10 h in W13, 12 h in W14** (W14 as committed on 24/11, see `docs/m3/decision-record.md`). These are **assumed values, not timesheets**. The variance is 0 by construction, so it shows nothing about estimation accuracy. When members report real hours, replace the figures in the table below and in the rows, and recompute the variance.

| Member | W12 | W13 | W14 | Total |
|---|---:|---:|---:|---:|
| RES-01 | 8 | 10 | 12 | 30 |
| RES-02 | 8 | 10 | 12 | 30 |
| RES-03 | 8 | 10 | 12 | 30 |
| RES-04 | 8 | 10 | 12 | 30 |
| RES-05 | 8 | 10 | 12 | 30 |
| **Team** | **40** | **50** | **60** | **150** |

150 h equals the capacity in the regenerated Baseline V2.0 (W12–W14, W14 at 12 h per person). Planned effort in V2.0 is 183.89 h including reserve, so the logged hours leave a gap of about 33.9 h.

## Rows

```text
12 | 09/11 | 15/11 | RES-01: A-22 P18 v1.0 and KB-01..KB-19 decisions; A-09 SRS review; A-16 round-3 questions; A-61 lot test; A-94/A-97; A-100. Team: A-43 simulator review, A-77 report tests, A-24 DB design, A-01 SRS | Done: round-3 questions sent, replies 15/11; simulator seeded runs and 100-session mode (A-44, 12/11); A-43 review and SC-01..SC-07 (RES-05); four lecturer-driven round-3 changes implemented (11 commits). Not done by 15/11: A-22 (P18 still v0.2), CP-02 record, A-09 | 40 | 40 (ASSUMED: 5 x 8 h, not measured) | 0 | 0% | A-22 slipped from 12/11 to 19/11. CP-02 not recorded when planned. A-09 has no evidence. Lecturer replies changed four behaviours, absorbed unplanned (CR-02). R-G4-02 (hours) untracked because no log existed | Round-3 changes built on a branch with tests; AGENTS.md and CodeGraph rules added for traceability; log and Task Log started 19/11 | Nguyễn Võ Đức Sơn

13 | 16/11 | 22/11 | RES-01: A-63 entry/exit fixes; A-74 payment review; A-67 integrate simulator; A-99 change-event impact; A-105 workshop; A-61. Team: A-44, A-45, A-79, A-28, A-33, A-82/A-85 | Done: KB-04, KB-05, KB-13 fixes and KB-02/KB-03 decisions with tests (A-63, A-74); P18 v1.0 (A-22, PR #7); A-61 seven expected Staff 403s; A-67 25 HTTP checks and 120 simulator events with zero rejections (20/11); A-79 contract tests (PR #6); A-99 impact analysis, decision record and V2.0 hand-off; A-105 workshop 20/11 with all five members; CR-01 Option C chosen | 50 | 50 (ASSUMED: 5 x 10 h, not measured) | 0 | 0% | Lecturer moved submission from 07/12 to 29/11 (CR-01): capacity 190 to 140 h, demand 172.1 h, gap about 24 h after cuts. A-63 finished 19/11, one day after plan. Stale .next cache broke one build. New risk R-G5-04 | Option C: keep scope, fold paperwork, trim verification depth, Q22 fallback at M-03 24/11, W14 raised to 12 h per member. Residual gap escalated to the team | Nguyễn Võ Đức Sơn

14 | 23/11 | 29/11 (to 26/11) | RES-01: A-90 actuals vs baseline; M-03 gate 24/11; A-87 dry run 26/11; A-88 demo 27/11; review of A-92 28/11; A-114; A-106 approval. Team: A-68, A-65, A-49, A-31, A-87, A-92, A-116 | Done by 26/11: 11 Phase 5 client answers recorded in spec 002 (PR #15, 23/11); A-67 confirmed by RES-05 (PR #14); Phase 5 product merged to main: PR #11 and #17 integrated by #21 (24/11), A-65 group-approval fix; A-49 availability tests (PR #13) and CR-03 UI fixes FR-19/20/21/51 (PR #24, retest passes, A-49 Verified); A-68 entry/exit test and A-31 auth test, CP-05 recorded by RES-02 as pass with conditions C1–C6 (PR #18, merged 25/11); D-01 simulator single-run fix (PR #26) and F5-01 test timeout fix (PR #27), npm test green without flags; SRS v2.1 and P18 sync (PR #22); F5-02 demo script and viva plan (PR #28); CR-03 decision (PR #20) and final work division (24/11); RES-04 reflection (PR #25). Pending at 26/11: A-87 dry run (today), A-88 demo (27/11), report freeze 28/11, submission 29/11, PR #12 (RES-03 closure documents) and #19 (RES-01 Phase 5 records) | 60 | 60 (ASSUMED: 5 x 12 h, committed 24/11, not measured; update on 29/11) | 0 | 0% | A-68 finished 24/11, one day after plan. No decision was recorded at the 24/11 M-03 gate. Q22 trigger met (Must verification incomplete), A-72/A-76 checks kept. Regenerated V2.0 forecasts finish at working day 24.63 of 15: remaining work exceeds capacity. CP-05 conditions open: C2 client video waived (Q23 unmet), C1/C4 QA sign-off, D-03/D-04 to CP-07. R-G5-01 raised by late UI fixes. Candidate SHA for A-87 not yet pinned | CR-03 Option 2 chosen 24/11 (A and B first). Q22 kept A-72/A-76 at the cost of the 2.6 h saving. All five members committed to 12 h in W14 and to work on 28–29/11. Final work division published 24/11 to give each member a disjoint package. See `m03-decision-and-workshop.md` | Nguyễn Võ Đức Sơn
```

## Task 3.8: lower-level plans created during execution

The lower-level plans required by Task 3.8 were created during execution, not at baseline. Section 4 of `docs/m3-m4-work-division.md` adds activities A-100 to A-116 (about 32.5 h) to Baseline V1.0. Section 7 of the same file replaces the W15 plan after CR-01. `docs/m3-m4-final-work-division.md` (24/11) divides the remaining closure work into packages F1 to F5, and the CR-01 decision record holds the cuts. Each plan exists because information arrived after the baseline: the deadline change of the week of 16/11, the lecturer replies of 15/11 and 23/11, and the CP-05 gate findings. F3-03 (RES-03) explains for each plan why that detail was not available at baseline time.

## Meetings (A-97)

| Date | Meeting | Attendance | Outcome |
|---|---|---|---|
| 20/11 | A-105 options workshop (30 min) | All five members, per RES-01 | Option C confirmed; levers listed in `m03-decision-and-workshop.md` |
| 24/11 (evening) | M-03 gate review | All five members, per RES-01 | Q22 triggered, A-72/A-76 checks kept, CR-03 Option 2, W14 at 12 h |

Minutes beyond these lines were not written. The attendance rests on RES-01's statement.

## Evidence

- Merged PRs #4 to #28 on `origin/main` and `git log --since=2026-11-09`.
- Previous drafts: `docs/m3/weekly-log-draft.md` (W12, W13, W14 live update).
- Planned capacity and activities: `docs/m3-m4-work-division.md` sections 1, 4, 5 and 7.
- Test state: 310/310 on 24/11 after the PR #11 merge (PR #18 evidence); `npm test` green without flags after PR #27.
