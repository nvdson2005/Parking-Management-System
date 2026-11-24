# Decision Record (Task 3.6, A-105)

| Field | Value |
|---|---|
| Date | 2026-11-19 (W13) |
| Owner | Nguyễn Võ Đức Sơn (RES-01) |
| Analysis | `docs/m3/change-impact-analysis.md` (CR-01, CR-02, CR-03) |
| Approved | RES-01 (PM), 19/11/2026 |
| Decision | **Option C**: keep scope, merge paperwork, trim verification depth, Q22 fallback. The residual gap of about 11.5 h is open and needs the team's decision. |

## Options for CR-01 (final submission moved to 29/11)

| Option | Description | Effect on effort | Verdict |
|---|---|---|---|
| A | Absorb: keep all scope and all planned activities; extra hours only | 0 h saved; demand 172.1 h (+1.5 h for A-106) on 140 h | Rejected. 123% load, R-G4-02 near-certain, the first slip breaks the submission. |
| B | Descope under Q22: drop verification of reports, payment, reservations | at most about 5 h (A-72 3.2 h and A-76 2.0 h; A-77 2.6 h is already committed on `main`) | Too small on its own, and it damages O3 and O4 evidence. Kept as the fallback inside C. |
| **C** | **Hybrid: keep scope, merge paperwork, trim verification, Q22 as a pre-agreed fallback** | about 8 h net (table below) plus the fallback and W14 hours | **Chosen.** It takes B's cut only if needed, and it protects O1, O2 and the 27/11 demo. It does **not** close the whole gap (see below). |

Extending the deadline was not considered: the date is set by the lecturer.

## The cuts in option C

Savings are measured against the 172.1 h demand, which excludes A-106. Items marked "estimate" are judgment, not baseline figures.

| Cut | Owner | Net saving (h) |
|---|---|---|
| Fold the M3 report (A-108) into the final report (A-92); RES-01's 1 h review stays | RES-05 | 2.5 |
| Write A-110, A-112 and A-113 as sections of A-92 (estimate: about 30% of their 3.5 h) | RES-04, RES-03 | 1.0 |
| Merge the early acceptance run (A-95, 2.2 h) into the dry run A-87 (estimate: half) | RES-02 | 1.1 |
| Trim A-72 and A-76 to existing automated tests plus one acceptance pass (estimate: half of 5.2 h); A-77 needs nothing, it is committed | RES-02, RES-04 | 2.6 |
| A-115: demo script only, no slides (about 1 h); mock viva 15 minutes instead of 30 (about 1.3 h) | RES-05, all | 2.3 |
| A-106 minimal V2.0 is now **required**; 1.5 h total (the 172.1 h figure leaves A-106 out, so this adds) | RES-03, RES-01 | -1.5 |
| A-105 workshop stays at 5 x 0.5 h (a single 1-hour session would cost 5 h, more than planned) | all | 0 |
| **Net total** | | **8.0** |

A-89 (acceptance report) becomes a section of A-92, written by RES-03 with the acceptance results supplied by RES-04 and RES-02. This is a restructure with no hours counted as saved.

## Residual gap: unresolved

Demand after the cuts is about 164.1 h (172.1 − 8.0) against 140 h capacity: a gap of about **24 h**, 117% load. Cover that exists:

- **Q22 fallback** (about 2.6 h more): if it fires, A-72 and A-76 verification is dropped entirely.
- **Extra hours:** 2 h per person in W14 (10 h total), recorded as R-G4-02 occurring, with escalation per working rule 3.

That covers about **12.6 h, leaving about 11.5 h unresolved.** The "near-zero float" statement in earlier drafts was wrong. Two things decide what happens next:

1. **Actual hours to date.** The 172.1 h and 140 h figures are totals including work already done. If the team is ahead of plan (the MVP existed before the baseline, and A-43, A-44, A-77 and A-79 are already committed), the real remaining demand is lower, and the residual may shrink or vanish. Hours to date are ASSUMED equal to capacity (8 h in W12, 10 h from W13; not measured); replace with real hours.
2. **Further levers if the residual stands:** more W14 hours (3 h per person gives 5 h more), hold the A-91 retrospective as 30 minutes at the end of the workshop, drop further Could-level acceptance scenarios, or reduce the final report depth for Should modules. The team must choose; none is applied here.

**Weekly hours (confirmed by RES-01: the baseline applies).** 8 h per member in W12 and 10 h per member from W13, so capacity is 140 h and the residual stays at about 11.5 h. If the team in practice works fewer hours, the gap grows (at 8 h per week: capacity 120 h, residual about 31.5 h). The gap depends on earned value, not hours: only a per-activity completion status (what is already done) shows the real remaining demand, because the 172.1 h total includes finished work.

RES-01 is already carrying 26.7 h of baseline against 28 h of capacity (95%) and 30.7 h with the new activities, so RES-01 cannot absorb the change out of its own slack.

## Fallback trigger (24/11, M-03)

The Q22 fallback fires if, at M-03, any Must product is not verified or the schedule is more than 2 days behind. A member being short on hours is **not** a trigger, because it is already expected under R-G4-02; it is escalated to RES-01 under working rule 3. Owner: RES-01. The decision and its effect go in the weekly log and the risk register (R-G5-04).

### M-03 decision record for 24 November

| Input or decision | Evidence to record |
|---|---|
| Must verification | [A-67 integration](a-67-integration-check.md) and [A-61 lot management](quality-evidence-A-61.md) evidence are available. The formal A-68/CP-05 verdict and remaining Must checks are pending. RES-02 records any unverified product and its owner. |
| Schedule variance | The [V2.0 draft](baseline-v2-draft.md) records target dates. The live forecast and measured variance are pending from RES-03. Record the reference baseline and variance in days. |
| Q22 decision and effect | RES-01 records trigger status, rationale, verification omitted if triggered, and any recovery actions. Copy the result to R-G5-04 and the weekly log. |
| Status | Pending gate evidence and RES-01 decision. |

## Consequences

- M3 and the final report are submitted together on 29/11 (confirmed by RES-01: everything goes in on that date). There is no separate M3 submission date.
- Objectives O1 and O2 keep full evidence. O3 and O4 evidence for Should modules rests on automated tests plus one acceptance pass (and on nothing further if the fallback fires).
- The final report is written once and carries the M3 and M4 content. A-92 finishes by 28/11; 29/11 is the submission day.
- Baseline V2.0 is required (Task 3.7). See `docs/m3/baseline-v2-handoff.md`.

## Options for CR-03 (lecturer replies of 23/11 and A-49 findings)

The analysis and the full item list are in `docs/m3/change-impact-analysis.md`, section CR-03. Hours are owner estimates.

| Group | Covers | Estimate |
|---|---|---|
| A | Availability screen gaps G1–G3 and the A-49 retest | 1.5 h |
| B | Defects on the demo path | 0.6 h |
| C | Reservation UI | 3.25 h |
| D | Five lecturer-confirmed requirements, carried by `specs/002-lecturer-acceptance-alignment` | 4.75 h |

| Option | Description | Effort | Effect |
|---|---|---|---|
| 1 | Do all groups A–D before the A-92 freeze (28/11) | about 10.1 h | Closes every item in SRS v2.1 section 9. Does not fit the open CR-01 gap without new hours, and carries a high regression risk two days before the demo. |
| **2** | **A + B before the demo (27/11). C and D in priority order, only if hours are found by 28/11. Anything left is recorded in A-110 as partial or deferred.** | **about 2.1 h, up to 10.1 h** | **Approved as the prioritization plan, not as a verification result.** A-49 can reach "Verified" only after its retest. Order for D: purge from exit and masked plates first (privacy, P1 in spec 002), then tariff, hours and group change. |
| 3 | A only. B, C and D are recorded as known limitations. | about 1.5 h | Lowest risk, but the demo shows a reservation form that fails on its own default value. |
| 4 | No change. All items are reported as gaps. | 0 h | A-49 stays "Partly verified", and three Must requirements (FR-19..21) are unmet at handover. Not recommended. |

**Decision:** Nguyễn Võ Đức Sơn (RES-01, PM) approved option 2 on 24/11/2026 in the [PR #20 review](https://github.com/nvdson2005/Parking-Management-System/pull/20), and reconfirmed it on 24/11/2026. The estimate is a planning input; it does not establish capacity or a passed A-49 gate. P05 Staff entry selects belong to RES-04.

| Owner | Assigned items from the approved review | Estimated effort |
|---|---|---:|
| RES-04 | A + B, including P05 selects; C early-arrival prompt (FR-51) | 2.6 h |
| RES-03 | C active-reservation list (FR-52), with RES-04 on the page; D automatic exit-based purge (FR-45) | 2.75 h |
| RES-01 | D closed-session plate masking (FR-42); spec 002, A-110, decision record | 0.5 h for D |
| RES-02 | D opening hours (FR-22/26) and Customer tariff view (FR-26) | 2.5 h |
| RES-05 | D Manager fee-group change (FR-07); C reservation labels, cards and errors | 1.75 h |

**Delivery update, 24/11/2026:** [PR #21](https://github.com/nvdson2005/Parking-Management-System/pull/21) integrated all five group D product requirements from PRs #11/#17 into `main` at `26a623c15df6686ee329c496a3788fed3850d9a2`, including the Q38 exact-request approval correction. This changes their delivery status, not the historical CR-03 estimate or the pending A-87/A-88 acceptance verdict. Groups A–C and A-49 retest still require separate evidence.

## Change Log rows

For pasting into the workbook's Change Log sheet. Columns: CR ID | Date raised | Raised by | Description | Affected products / activities | Effort impact (h) | Schedule impact (days) | Cost impact | Scope impact | Risk impact | Options considered | Decision | Justification | Approved by | Date approved | New baseline required?

```text
CR-01 | week of 16/11 (per RES-01) | Lecturer | Final report and submission moved from 07/12 to 29/11 | P14, P17, A-88..A-92, A-95, A-105, A-106, A-108, A-110..A-116 | +32.5 demand (172.1 h), -8.0 net from cuts, about 12.6 covered by fallback and W14 hours, about 11.5 unresolved | -8 (M-05 07/12 to 29/11) | 172.1 h = 8,605,000 VND (+1,625,000 vs V1.0 6,980,000); after cuts about 164.1 h = 8,205,000 VND (+1,225,000); converted, not cash | None; verification depth reduced for Should/Could | R-G4-02 near-certain; new R-G5-04 | 1 absorb, 2 descope under Q22, 3 hybrid | Option 3 (C) | Protects O1, O2 and the 27/11 demo; Q22 is the pre-agreed fallback; residual gap open | Nguyễn Võ Đức Sơn (RES-01, PM) | 19/11/2026 | Yes, V2.0 minimal
CR-02 | 15/11/2026 | Lecturer (round-3 replies) | Early arrival needs staff confirmation; one active reservation per account; utilisation per zone and vehicle type; suspension cancels reservations and notifies customers | P05, P06, P11, notifications | 0 additional (already built) | 0 | 0 | Four behaviours clarified | None | 1 build as clarified | Option 1 | Matches lecturer wording; already implemented and tested | Nguyễn Võ Đức Sơn (RES-01, PM) | 19/11/2026 | No; listed as a V2.0 change entry
CR-03 | 24/11/2026 | Phạm Duy Quý (RES-04) | Lecturer replies of 23/11 (five requirements unbuilt when raised; integrated by PR #21 on 24/11) and A-49 findings (availability screen misses FR-19/20/21; past default arrival time; font; raw IDs in Staff entry selects) | P01, P03, P05, P06, P09, P10, P13; A-49, A-110, spec 002 | A+B about 2.1; all groups about 10.1 (historical estimates) | 0 for A+B; C+D conditional before 28/11 | A+B about 105,000 VND; all groups about 505,000 VND; converted, not cash | None added; group D integrated, acceptance pending; A–C subject to evidence | R-G5-01 rises with late fixes; pending verification affects O3/O4 | 1 all groups, 2 A+B now and C+D if hours allow, 3 A only, 4 no change | Option 2 | Protect Must availability and demo path first; record unfinished items in A-110 | Nguyễn Võ Đức Sơn (RES-01, PM) | 24/11/2026 | No; listed as a V2.0 change entry
```

## Workshop (A-105)

A 30-minute session with all five members (5 x 0.5 h = 2.5 h, as planned for A-105). Agenda: (1) the facts and the 24 h gap (5 min); (2) options A, B, C (5 min); (3) cuts per member and the W14 2 h (5 min); (4) pick levers for the residual 11.5 h (10 min); (5) fallback trigger and who reports on 24/11 (5 min). The decision is recorded straight after.

Date: **20/11/2026** (per RES-01). Chair: RES-01. Duration 30 minutes, all five members. `TODO(RES-01): record attendance and the levers chosen after the session.`
Approved by Nguyễn Võ Đức Sơn (RES-01, PM) on 19/11/2026. The decision stands with the residual gap open; the team's choice of levers is still outstanding.
### Assumed workshop outcome

For planning, assume the workshop selected Option C, with a target of one additional W14 hour from each member above the existing two. Protect Must verification, O1/O2 evidence, the client demo, and the submission. Each member still needs to confirm the extra hour, for up to 5 h of additional team capacity. If all five confirm, the estimated gap falls from 14.1 h to 9.1 h before Q22, or from 11.5 h to 6.5 h if Q22 triggers. Treat these figures as scenarios until capacity is confirmed.

Have RES-03 recalculate remaining effort from completed activities and owner estimates. If a gap remains, propose reducing Could-level acceptance coverage and shortening Should-module report sections while retaining the evidence required by the assignment. Record owners and revised effort before counting any savings. Evaluate Q22 only at the documented 24 November gate. The workshop date, attendance, and team agreement still need confirmation.

## M-03 / CR-03 Phase 5 decision checkpoint (24 November)

**Status: held pending evidence; no new approval recorded.** This checkpoint updates the earlier Option C decision; it does not replace the 19 November approval of CR-01. [Client answers Q36–Q46](client-interaction-log-phase-5.md) and [PR #15](https://github.com/nvdson2005/Parking-Management-System/pull/15) establish the acceptance interpretation.

| Decision input | Current evidence / required next record | Owner |
| --- | --- | --- |
| CR-03 options | Compare **28 h full scope** with **16 h selected scope** on identical line items, assumptions and affected checks in [PR #10](https://github.com/nvdson2005/Parking-Management-System/pull/10). Record the accepted option, approver and date there. | RES-03 prepares; RES-01 approves |
| A-87 candidate | Name one integrated SHA containing #11 and #17, migration state, environment, and any exclusions. No such final build is identified yet. | RES-03 integrates; RES-02/RES-04 verify |
| Must and CP-05 | [PR #18](https://github.com/nvdson2005/Parking-Management-System/pull/18) proposes CP-05 pass with T12 pending A-31. QA has not recorded the gate verdict. #11 remains under requested changes. | RES-02 QA; RES-03 resolves #11 |
| Schedule variance | A-68 completed 24/11, one day after its 23/11 plan. Compare the remaining critical path with a dated V2.0 forecast; owner actuals and the live variance are pending. | RES-03 tracker; RES-01 gate |
| Q22 fallback | Apply the existing trigger only after Must verification and schedule variance are recorded. If triggered, name every omitted A-72/A-76 check and carry it into P14. The outcome is pending. | RES-01 |

The gate record needs the decision time, participants, Q22 outcome, recovery owners and dates, and exceptions before it can be signed. The 26 November A-87 dry run, 27 November A-88 demo, 28 November report sign-off, and 29 November submission are targets, not completed events.
