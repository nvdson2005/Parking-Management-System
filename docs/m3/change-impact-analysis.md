# Change-Impact Analysis (Task 3.6, A-99)

| Field | Value |
|---|---|
| Date | 2026-11-19 (W13) |
| Owner | Nguyễn Võ Đức Sơn (RES-01) |
| Baseline | V1.0 (`docs/m2-report/`), unchanged |
| Sources | `docs/m3-m4-work-division.md`, `docs/m2-report/generated/*`, `changelog/round3-assumptions-vs-implementation.md`, `docs/superpowers/specs/2026-11-19-m3-change-event-response-design.md` |
| Decision | `docs/m3/decision-record.md` |

## CR-01 Final report and submission moved from 07/12 to 29/11

**Event.** The lecturer moved M-05 (final report and submission) from 07/12 to 29/11, eight days earlier. It was issued in the week of 16/11 (per RES-01). M3 and the final report go in together on 29/11; there is no separate M3 date. W15 no longer exists as working time. M3 deliverables, M4 deliverables and the final report now fall in the same week.

**Facts.**
- Capacity falls from 190 h to 140 h (W12 40 h, W13 50 h, W14 50 h; RES-01 alone 28 h).
- Planned effort is 139.6 h in Baseline V1.0, which is 99.7% of the new capacity and leaves no float. With the 32.5 h of M3/M4 activities from the work-division plan it is 172.1 h, which is 123%.
- The baseline's levelled finish was already 01/12. A-92 (critical) ends 30/11 and A-89 ends 01/12, so both now land after the deadline.
- Fixed dates stay: M-03 on 24/11 and the client demo A-88 on 27/11.
- Actual hours to date are not recorded (the workbook's Weekly Project Log and Planned vs Actual sheets are empty templates). Hours to date are assumed at 8 h per member per week (RES-01's recollection, not measured). The baseline records 8 h in W12 and 10 h from W13; at 8 h per week capacity is 120 h and about 31.5 h would remain unresolved (see the decision record, capacity sensitivity).

| Dimension | Impact |
|---|---|
| Requirements / products | Scope is unchanged: no requirement is added or removed. Product depth changes: P14 (acceptance) and P17 (reports) are produced as one final report; Should/Could modules (reservations P06, payment P10, reports P11) are verified by existing automated tests plus one acceptance pass. |
| Activities | W15 activities move into W14: A-89, A-92, A-110, A-112, A-113, A-114, A-115, A-116, A-91. A-108 folds into A-92; A-89 becomes a section of A-92. A-95 merges into A-87. A-92 finishes by 28/11 to leave a review day. |
| Effort | Demand 139.6 h → 172.1 h on 140 h capacity (123%). Option C removes about 8 h net (A-106, now required, adds 1.5 h), leaving about 164 h against 140 h (117%), a gap of about 24 h. The Q22 fallback (about 2.6 h) and 2 h per person in W14 (10 h) cover about 12.6 h, so **about 11.5 h stay unresolved** pending actual hours to date and the team's choice of further levers (see the decision record). RES-01 carries 26.7 h of baseline against 28 h capacity (95%), 30.7 h with the new activities, so RES-01 cannot absorb the change from its own slack. |
| Resources | Same five members. Per-week capacity unchanged (10 h in W13 and W14) but the ten W15 hours per person are lost. The slack the work-division plan assigned to RES-01 does not exist against 28 h of capacity. |
| Risks | R-G4-02 (members cannot keep their hours, 30% in V1.0) becomes near-certain. R-G2-02 and R-G4-01 (entry/exit fixes cause regressions on the critical path) get less recovery time. R-G5-01 and R-G5-02 (late fixes and defects at dry run) rise because A-95 merges into A-87. New risk R-G5-04: "Deadline compression leaves no float; any slip moves the submission", owner RES-01, response: Q22 fallback checked at M-03 on 24/11. |
| Schedule | M-05 07/12 → 29/11 (8 days earlier). M-03 24/11 and M-04 27/11 unchanged. A-92 ends 28/11. |
| Cost | Converted at 50,000 VND per person-hour (baseline rate, not cash): 172.1 h is 8,605,000 VND against 6,980,000 VND baseline total including reserve (+1,625,000). After option C about 164.1 h, 8,205,000 VND (+1,225,000 VND against V1.0). Both are converted hours, not cash. |
| Quality | Verification depth drops for Should/Could modules (A-77 report tests are already committed on `main`); Must modules (entry/exit, availability, lot management) keep full tests and the 100-session acceptance scenario. Objectives O1 and O2 keep full evidence. Evidence for O3 and O4 (no-shows, fee accuracy) rests on automated tests plus one acceptance pass. If the fallback fires, A-72 and A-76 verification is dropped and recorded as a known gap in the final report. |

## CR-02 Round-3 clarifications (lecturer replies)

The lecturer's round-3 answers confirmed most assumptions and changed four behaviours: early arrival needs staff confirmation, one active reservation per account, utilisation reported per zone and vehicle type, and suspending a lot cancels pending reservations and notifies customers.

- All four are implemented on `refactor/round3-lecturer-alignment` with tests (`tests/entry.test.ts`, `tests/reservations.test.ts`, `tests/reports.test.ts`, `tests/lots.test.ts`, `tests/notifications.test.ts`).
- Impact: requirements list gains four clarified rules; no new activity, no schedule or cost effect beyond what is already spent.
- Baseline effect: recorded in Baseline V2.0 as a change-list entry; no scope change.
- Quality: covered by the existing automated tests and the e2e script from commit `bf07479`.
- Remaining small items from the changelog (peak-hour interval wording, percentage display, "Admin" vs `MANAGER` naming, staff read access) stay on the document checklist for the final report.
