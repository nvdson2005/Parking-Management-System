# Decision Record (Task 3.6, A-105)

| Field | Value |
|---|---|
| Date | 2026-11-19 (W13) |
| Owner | Nguyễn Võ Đức Sơn (RES-01) |
| Analysis | `docs/m3/change-impact-analysis.md` (CR-01, CR-02) |
| Decision | **Option C**: keep scope, merge paperwork, trim verification depth, Q22 tripwire |

## Options for CR-01 (final submission moved to 29/11)

| Option | Description | Effort | Verdict |
|---|---|---|---|
| A | Absorb: keep all scope and all planned activities; about 6.5 h extra per person | 0 h saved; 32 h over capacity | Rejected. Team load is 123%; R-G4-02 is near-certain; the first slip breaks the submission. |
| B | Descope under Q22 (reports, then payment, then reservations) | about 12–15 h saved | Kept only as the safety net. The client agreed the order, but cutting these features damages objectives O3 and O4 and the round-3 per-zone reporting. The features are already built, so descoping only removes their verification. |
| **C** | **Hybrid: keep scope, merge paperwork, trim verification depth, pre-commit the Q22 tripwire** | **about 17 h saved plus tripwire and W14 hours** | **Chosen.** Protects objectives O1 and O2 and the 27/11 demo, and does not rely on overtime alone. |

Extending the deadline was not considered: the date is set by the lecturer.

## The cuts in option C

| Cut | Owner | Saves (h) |
|---|---|---|
| Fold the M3 report (A-108) into the final report (A-92) as one document | RES-05 | 2.5 |
| Write A-110, A-112 and A-113 as sections of the final report while the work happens | RES-04, RES-03 | 1.5 |
| Merge the early acceptance run (A-95) into the dry run (A-87) | RES-02 | 2.2 |
| Trim Should/Could verification (A-72, A-76, A-77) to existing automated tests plus one acceptance pass | RES-02, RES-04, RES-05 | 5 |
| A-115: demo script only, no slides; 15-minute mock viva | RES-05 | 3 |
| Baseline V2.0 kept minimal (A-106 from 3 h to 1.5 h) | RES-03, RES-01 | 1.5 |
| A-105 workshop as one 1-hour session (was 5 x 0.5 h) | all | 1.5 |
| **Total** | | **about 17** |

## Residual gap and its cover

Demand after the cuts is about 155 h against 140 h capacity, a gap of about 15 h. Cover:

- **Q22 tripwire** (about 4 h more): if it fires, A-72, A-76 and A-77 verification is dropped entirely.
- **Extra hours:** 2 h per person in W14 (10 h total), recorded as R-G4-02 occurring, with escalation per working rule 3 of the work-division plan.

Total cover is about 31 h against about 32 h needed. Float is near zero. The plan works only if nothing else slips, and the final report states this plainly.

## Tripwire

At M-03 on 24/11, if the team is more than 2 days behind plan, or any member is short by more than 2 h in the week, Q22 fires and option B's cuts apply in the order reports, payment, reservations (verification only). Owner: RES-01. The firing and its effect are recorded in the weekly log and the risk register (R-G5-04).

## Consequences

- Objectives O1 and O2 keep full evidence. O3 and O4 evidence for Should modules rests on automated tests plus one acceptance pass.
- The final report is written once and carries the M3 and M4 content. A-92 finishes by 28/11; 29/11 is the submission day.
- Baseline V2.0 is required (Task 3.7). See `docs/m3/baseline-v2-handoff.md`.

## Change Log rows

For pasting into the workbook's Change Log sheet. Columns: CR ID | Date raised | Raised by | Description | Affected products / activities | Effort impact (h) | Schedule impact (days) | Cost impact | Scope impact | Risk impact | Options considered | Decision | Justification | Approved by | Date approved | New baseline required?

```text
CR-01 | TODO(RES-01): date lecturer issued | Lecturer | Final report and submission moved from 07/12 to 29/11 | P14, P17, A-88..A-92, A-95, A-105, A-106, A-108, A-110..A-116 | +32.5 demand, about -17 saved, about 15 covered by tripwire and W14 hours | -8 (M-05 07/12 to 29/11) | 172.1 h = 8,605,000 VND converted (V1.0 total 6,980,000) | None; verification depth reduced for Should/Could | R-G4-02 near-certain; new R-G5-04 | 1 absorb, 2 descope under Q22, 3 hybrid | Option 3 (C) | Protects O1, O2 and the 27/11 demo without overtime alone; Q22 is the pre-agreed fallback | TODO(team lead) | TODO(date) | Yes, V2.0 minimal
CR-02 | 15/11 | Lecturer (round-3 replies) | Early arrival needs staff confirmation; one active reservation per account; utilisation per zone and vehicle type; suspension cancels reservations and notifies customers | P05, P06, P11, notifications | 0 additional (already built) | 0 | 0 | Four behaviours clarified | None | 1 build as clarified | Option 1 | Matches lecturer wording; already implemented and tested | TODO(team lead) | TODO(date) | No; listed as a V2.0 change entry
```

## Workshop (A-105)

One-hour session with all five members, agenda: (1) the 32 h gap and the facts (10 min); (2) walk through options A, B, C (15 min); (3) confirm cuts per member and the W14 2 h (20 min); (4) agree the tripwire and who reports on 24/11 (10 min); (5) record the decision (5 min).

`TODO(RES-01): workshop date and attendance.`
`TODO(team lead): approver of this decision and approval date.`
