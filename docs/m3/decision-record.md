# Decision Record (Task 3.6, A-105)

| Field | Value |
|---|---|
| Date | 2026-11-19 (W13) |
| Owner | Nguyễn Võ Đức Sơn (RES-01) |
| Analysis | `docs/m3/change-impact-analysis.md` (CR-01, CR-02) |
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

## Consequences

- M3 and the final report are submitted together on 29/11 (confirmed by RES-01: everything goes in on that date). There is no separate M3 submission date.
- Objectives O1 and O2 keep full evidence. O3 and O4 evidence for Should modules rests on automated tests plus one acceptance pass (and on nothing further if the fallback fires).
- The final report is written once and carries the M3 and M4 content. A-92 finishes by 28/11; 29/11 is the submission day.
- Baseline V2.0 is required (Task 3.7). See `docs/m3/baseline-v2-handoff.md`.

## Change Log rows

For pasting into the workbook's Change Log sheet. Columns: CR ID | Date raised | Raised by | Description | Affected products / activities | Effort impact (h) | Schedule impact (days) | Cost impact | Scope impact | Risk impact | Options considered | Decision | Justification | Approved by | Date approved | New baseline required?

```text
CR-01 | week of 16/11 (per RES-01) | Lecturer | Final report and submission moved from 07/12 to 29/11 | P14, P17, A-88..A-92, A-95, A-105, A-106, A-108, A-110..A-116 | +32.5 demand (172.1 h), -8.0 net from cuts, about 12.6 covered by fallback and W14 hours, about 11.5 unresolved | -8 (M-05 07/12 to 29/11) | 172.1 h = 8,605,000 VND (+1,625,000 vs V1.0 6,980,000); after cuts about 164.1 h = 8,205,000 VND (+1,225,000); converted, not cash | None; verification depth reduced for Should/Could | R-G4-02 near-certain; new R-G5-04 | 1 absorb, 2 descope under Q22, 3 hybrid | Option 3 (C) | Protects O1, O2 and the 27/11 demo; Q22 is the pre-agreed fallback; residual gap open | Nguyễn Võ Đức Sơn (RES-01, PM) | 19/11/2026 | Yes, V2.0 minimal
CR-02 | 15/11/2026 | Lecturer (round-3 replies) | Early arrival needs staff confirmation; one active reservation per account; utilisation per zone and vehicle type; suspension cancels reservations and notifies customers | P05, P06, P11, notifications | 0 additional (already built) | 0 | 0 | Four behaviours clarified | None | 1 build as clarified | Option 1 | Matches lecturer wording; already implemented and tested | Nguyễn Võ Đức Sơn (RES-01, PM) | 19/11/2026 | No; listed as a V2.0 change entry
```

## Workshop (A-105)

A 30-minute session with all five members (5 x 0.5 h = 2.5 h, as planned for A-105). Agenda: (1) the facts and the 24 h gap (5 min); (2) options A, B, C (5 min); (3) cuts per member and the W14 2 h (5 min); (4) pick levers for the residual 11.5 h (10 min); (5) fallback trigger and who reports on 24/11 (5 min). The decision is recorded straight after.

Date: **20/11/2026** (per RES-01). Chair: RES-01. Duration 30 minutes, all five members. `TODO(RES-01): record attendance and the levers chosen after the session.`
Approved by Nguyễn Võ Đức Sơn (RES-01, PM) on 19/11/2026. The decision stands with the residual gap open; the team's choice of levers is still outstanding.
### Assumed workshop outcome

For planning, assume the workshop selected Option C, with a target of one additional W14 hour from each member above the existing two. Protect Must verification, O1/O2 evidence, the client demo, and the submission. Each member still needs to confirm the extra hour, for up to 5 h of additional team capacity. If all five confirm, the estimated gap falls from 14.1 h to 9.1 h before Q22, or from 11.5 h to 6.5 h if Q22 triggers. Treat these figures as scenarios until capacity is confirmed.

Have RES-03 recalculate remaining effort from completed activities and owner estimates. If a gap remains, propose reducing Could-level acceptance coverage and shortening Should-module report sections while retaining the evidence required by the assignment. Record owners and revised effort before counting any savings. Evaluate Q22 only at the documented 24 November gate. The workshop date, attendance, and team agreement still need confirmation.
