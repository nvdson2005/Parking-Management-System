# Weekly Project Log: draft for W12 and W13 (A-94, A-97, A-100)

Paste into the workbook's **Weekly Project Log** sheet. Columns: Week | Date from | Date to | Planned work | Actual work done | Planned effort (h) | Actual effort (h) | Effort variance (h) | Variance % | Issues / risks raised | Management action taken | Logged by.

Actual hours are not recorded anywhere in the repo. Every hours cell is `TODO(member)`. Evidence below comes from `git log` and the documents in `docs/`.

```text
12 | 09/11 | 15/11 | RES-01: A-22 P18 v1.0 + KB-01..KB-19 decisions (09-12/11); A-09 SRS review; A-16 round-3 questions; A-61 lot management test (13-23/11); A-94/A-97; A-100. Team: A-43 simulator review, A-77 report tests, A-24 DB design, A-01 SRS | Done: round-3 questions sent and answered (client-round3-questions.md); simulator seeded runs and >=100-session mode (68ea467, A-44, committed by RES-01 on 12/11); A-43 review and SC-01..SC-07 (f643391, RES-05); round-3 refactor of four lecturer-driven changes (11/15 commits). NOT done by 15/11: A-22 (P18 stayed v0.2), CP-02 record, A-09 (no evidence) | TODO(sum planned) | TODO(members) | TODO | TODO | A-22 slipped: planned 12/11, finished 19/11. CP-02 gate (13/11) not recorded. Lecturer replies to round 3 changed 4 behaviours, absorbed unplanned. R-G4-02 (hours) not tracked: no log existed | Round-3 changes implemented on a branch with tests; AGENTS.md and codegraph rules added so work stays traceable; weekly log and Task Log started 19/11 | Nguyễn Võ Đức Sơn
13 | 16/11 | 22/11 (to 19/11) | RES-01: A-63 entry/exit fixes with RES-03 (16-18/11); A-74 payment review (18-20/11); A-67 integrate simulator (20/11); A-99 change-event impact; A-105 workshop; A-61 | Done by 19/11: PR #4 review fixes for reservations, entry form and bell (18/11); KB-04, KB-05, KB-13 fixes and KB-02/KB-03 decisions with tests (A-63, A-74); P18 v1.0 with KB-01..KB-19 decisions (A-22); change-impact analysis, decision record, revised plan, V2.0 hand-off (A-99, A-105, A-106); suite 181/181 pass. In progress: A-67 (due 20/11), A-61 evidence, A-105 workshop (not yet held) | TODO | TODO(members) | TODO | TODO | Lecturer moved final submission 07/12 to 29/11 (date issued TODO(RES-01)): capacity 190 to 140 h, demand 172.1 h, gap about 24 h after cuts, about 11.5 h unresolved. A-63 finished 19/11 (1 day after planned). Build failed from a stale .next cache, cleared | Option C chosen (decision-record.md): keep scope, fold paperwork, trim Should/Could verification, Q22 fallback at M-03 24/11. New risk R-G5-04 raised. Residual gap escalated to the team | Nguyễn Võ Đức Sơn
```

## A-100 reminder (own hours)

`TODO(RES-01)`: log own hours for W12 and W13. Draft rows for the Task Log are not possible without the numbers. Suggested split to fill in: A-22/P18, A-63/A-74 KB fixes, round-3 refactor, change-event analysis, project coordination.

## Evidence for the evidence column

- `git log --author=nvdson2005 --since=2026-11-09`: 27 commits by `nvdson2005` from 12/11 to 19/11.
- Ledger of KB decisions: `docs/m2-report/products/CO3011_M2_KienTrucAPI_v0.1.md` section 10.
- Test result of 19/11: 22 files, 181 tests passed.
