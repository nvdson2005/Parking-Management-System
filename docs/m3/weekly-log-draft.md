# Weekly Project Log: draft for W12 and W13 (A-94, A-97, A-100)

Paste into the workbook's **Weekly Project Log** sheet. Columns: Week | Date from | Date to | Planned work | Actual work done | Planned effort (h) | Actual effort (h) | Effort variance (h) | Variance % | Issues / risks raised | Management action taken | Logged by.

**Hours are ASSUMED.** No hours are recorded anywhere in the repo. Per RES-01 the baseline weekly hours apply (8 h per member in W12, 10 h per member from W13), so actuals are entered equal to capacity: W12 5 x 8 = 40 h and W13 5 x 10 = 50 h. These are not measured values: replace them with the members' real hours before the log is used as evidence for Task 3.2 and 3.3. Evidence below comes from `git log` and the documents in `docs/`.

```text
12 | 09/11 | 15/11 | RES-01: A-22 P18 v1.0 + KB-01..KB-19 decisions (09-12/11); A-09 SRS review; A-16 round-3 questions; A-61 lot management test (13-23/11); A-94/A-97; A-100. Team: A-43 simulator review, A-77 report tests, A-24 DB design, A-01 SRS | Done: round-3 questions sent, with replies received on 15/11 (client-round3-questions.md); simulator seeded runs and >=100-session mode (68ea467, A-44, committed by RES-01 on 12/11); A-43 review and SC-01..SC-07 (f643391, RES-05); round-3 refactor of four lecturer-driven changes (11/15 commits). NOT done by 15/11: A-22 (P18 stayed v0.2), CP-02 record, A-09 (no evidence) | 40 (capacity: 5 x 8 h) | 40 (ASSUMED: 5 x 8 h, not measured) | 0 | 0% | A-22 slipped: planned 12/11, finished 19/11. CP-02 review (planned 13/11) not recorded; now planned 20/11 by RES-02 and RES-03, outcome pending. A-09 SRS review: no record, assumed pending. Lecturer replies to round 3 changed 4 behaviours, absorbed unplanned. R-G4-02 (hours) not tracked: no log existed | Round-3 changes implemented on a branch with tests; AGENTS.md and codegraph rules added so work stays traceable; weekly log and Task Log started 19/11 | Nguyễn Võ Đức Sơn
13 | 16/11 | 22/11 (to 20/11) | RES-01: A-63 entry/exit fixes with RES-03 (16-18/11); A-74 payment review (18-20/11); A-67 integrate simulator (20/11); A-99 change-event impact; A-105 workshop; A-61 | Done by 19/11: PR #4 review fixes for reservations, entry form and bell (18/11); KB-04, KB-05, KB-13 fixes and KB-02/KB-03 decisions with tests (A-63, A-74); P18 v1.0 with KB-01..KB-19 decisions (A-22); change-impact analysis, decision record, revised plan, V2.0 hand-off (A-99, A-105, A-106); suite 181/181 pass. Verified on 20/11 in PR #7: A-61, seven expected Staff HTTP 403 responses. A-67, 25 passing HTTP checks and 120 simulator events with zero rejections. A-105 working outcome assumed: retain Option C and target one additional W14 hour per member | 50 (capacity: 5 x 10 h per baseline) | 50 (ASSUMED: 5 x 10 h, not measured) | 0 | 0% | Lecturer moved final submission 07/12 to 29/11 (issued in the week of 16/11, per RES-01): capacity 190 to 140 h, demand 172.1 h, gap about 24 h after cuts, about 11.5 h unresolved. A-63 finished 19/11 (1 day after planned). Build failed from a stale .next cache, cleared | Option C chosen (decision-record.md): keep scope, fold paperwork, trim Should/Could verification, Q22 fallback at M-03 24/11. New risk R-G5-04 raised. Residual gap escalated to the team | Nguyễn Võ Đức Sơn
```

## A-100 reminder (own hours)

## W14 live update (23–24 November; A-94, A-97, A-100)

Planned: M-03 on 24 November, A-87 internal dry run on 26 November, A-88 client demo on 27 November, report review on 28 November, and submission on 29 November. Observed: the 11 client answers were merged through [PR #15](https://github.com/nvdson2005/Parking-Management-System/pull/15); A-67 confirmation merged through [PR #14](https://github.com/nvdson2005/Parking-Management-System/pull/14); A-68 was reported complete on 24 November in [PR #18](https://github.com/nvdson2005/Parking-Management-System/pull/18), one day later than planned. The [M-03/CR-03 decision inputs](decision-record.md#m-03--cr-03-phase-5-decision-checkpoint-24-november) and 28 h/16 h option comparison still need a signed gate record.

**Later update, 24/11:** PR #21 integrated #11/#17 product work into `main` at `26a623c`; PR #18 now reports A-31/T12 passed but QA's formal CP-05 verdict remains open. RES-01 reported all five members committed to 12 h in W14 and to weekend work on 28–29/11. No decision was recorded at the original M-03 gate. In a late decision, RES-01 chose to keep the A-72/A-76 manual checks despite the Q22 trigger; the 2.6 h fallback saving is therefore unavailable. RES-03 must reforecast the remaining work against the regenerated V2.0 model, and the gate remains unsigned.

W14 measured RES-01 and team hours, A-97 attendees/minutes and the revised recovery forecast are **pending owner records**. Do not enter the 12 h W14 commitment or W12/W13 estimates as actuals. When available, enter each member's A-100 hours in the workbook and recalculate the remaining forecast with RES-03.

RES-01's estimated activity allocations total 8 h in W12 and 10 h in W13. The team totals above still use capacity as a proxy. See the [A-90 estimate breakdown](a-90-planned-vs-actual.md#res-01-weekly-effort-estimates) and the [assumed workshop outcome](decision-record.md#assumed-workshop-outcome).

## Evidence for the evidence column

- `git log --author=nvdson2005 --since=2026-11-09`: 27 commits by `nvdson2005` from 12/11 to 19/11.
- Ledger of KB decisions: `docs/m2-report/products/CO3011_M2_KienTrucAPI_v0.1.md` section 10.
- Test result of 19/11: 22 files, 181 tests passed.
