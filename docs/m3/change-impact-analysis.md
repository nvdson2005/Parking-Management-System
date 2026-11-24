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
- Actual hours to date are not recorded (the workbook's Weekly Project Log and Planned vs Actual sheets are empty templates). Hours to date are assumed equal to capacity (8 h per member in W12, 10 h from W13; confirmed by RES-01 as the weekly hours that apply), not measured. At fewer hours per week the gap would grow (8 h per week: capacity 120 h, residual about 31.5 h).

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

## CR-03 Lecturer replies of 23/11 and gaps found in A-49 testing

**Status update, 24/11/2026:** The five lecturer-confirmed product items below were gaps when CR-03 was raised. [PR #21](https://github.com/nvdson2005/Parking-Management-System/pull/21) subsequently integrated all five into `main` at `26a623c15df6686ee329c496a3788fed3850d9a2`. Their A-87 verification and A-88 client verdict remain pending. The A-49 screen gaps and other groups A–C retain their own fix and retest status; see the approved option 2 in the [decision record](decision-record.md).

| Field | Value |
|---|---|
| Date raised | 2026-11-24 (W14, M-03) |
| Raised by | Phạm Duy Quý (RES-04) |
| Sources | Lecturer reply of 23/11 (11 answers: Q36–Q46 in SRS v2.1, answers 1–11 in `specs/002-lecturer-acceptance-alignment/spec.md`); SRS v2.1 section 9 (branch `docs/srs-v2.1-customer-feedback`); `docs/m3/quality-evidence-A-49.md` |
| Decision | `docs/m3/decision-record.md`, section "Options for CR-03" |

**Event.** Two inputs arrived together.

1. **Lecturer replies, 23/11.** Six answers accept what the code already does: per-visit fee only, explicit logout only, one pilot lot, no full-lot timing rerun, no survey, and three browsers at three widths. SRS v2.1 records these as SRS changes; no code is needed. Five answers confirm requirements that the code does not meet yet:
   - published opening hours, informational only;
   - a Manager changes a Customer's fee group;
   - a Customer sees their tariff;
   - Staff sees masked plates for closed sessions;
   - automatic plate removal 12 months after **exit**.

   RES-01 has opened `specs/002-lecturer-acceptance-alignment` for these five.
2. **A-49 testing, 23–24/11.** The availability service and the live stream pass. The availability screen misses three Must requirements (G1–G3). The manual runs also showed four defects outside P09.

**Facts.**

- All 215 automated tests pass. No defect found affects stored data or fee amounts.
- A-49 is "Partly verified". It can move to "Verified" only after G1–G3 are fixed and TC-AV-01 and the full-zone case are rerun.
- The client demo (A-88, 27/11) uses the reservation page, the Staff entry form and the availability screen, so the group B defects below would show during it.
- The CR-01 residual gap (about 11.5 h, see the decision record) is still open. Any hours CR-03 adds compete with A-92 and the submission package.
- Effort figures below are owner estimates, not measurements.

**Change items.**

| Group | Item | Requirement | Product / file | Proposed owner | Estimate (h) |
|---|---|---|---|---|---|
| A. Must, blocks A-49 | G1: show the time of the last update next to the counts | FR-19 | P09, `src/components/LiveAvailability.tsx` | RES-04 | 0.3 |
| | G2: show used spots (`open + reserved`) for Staff and Manager | FR-20 | P09, same file | RES-04 | 0.4 |
| | G3: show "Hết chỗ" / "Full" when free is 0, with vi and en keys | FR-21 | P09, same file, `src/i18n/*` | RES-04 | 0.3 |
| | Rerun TC-AV-01 and the full-zone case; append the results to the A-49 evidence | FR-19..21 | A-49 | RES-04 | 0.5 |
| B. Defects on the demo path | The reservation page pre-fills the arrival time with the current minute, which is already past, so the default value always fails with `RESERVATION_WINDOW` | FR-27 | P06, `src/app/customer/reservations/page.tsx` | RES-04 | 0.25 |
| | The global font falls back to serif because `--font-sans` refers to itself | UI design (A-13) | `src/app/globals.css` | RES-04 | 0.1 |
| | Staff entry form: after a choice, the Zone select shows the raw zone ID and the Vehicle type select shows `CAR` | NFR-09 | P05, `src/app/staff/entry/EntryForm.tsx` | RES-01 (P05) or RES-04 | 0.25 |
| C. Reservation UI (Should) | The early-arrival prompt shows the booked time and zone | FR-51 | P05, P06 | RES-04 | 0.5 |
| | Staff list of active reservations (endpoint and page) | FR-52 | P06, API | RES-04 with RES-03 | 2.0 |
| | Status labels match the SRS; reservation cards show zone and plate; error messages say how to fix the input | SRS reservation status wording, NFR-09 | P06 | RES-04 | 0.75 |
| D. Lecturer replies (spec 002) | Opening hours: stored, edited by the Manager, shown to the Customer, never blocking | FR-22, FR-26 (Q37) | P03, migration | per spec 002 | 1.5 |
| | The Manager changes a Customer's fee group | FR-07 (Q38) | P01, `PATCH /api/accounts/[id]` | per spec 002 | 1.0 |
| | The Customer sees the per-visit tariff of their group | FR-26 (Q45) | P10 | per spec 002 | 1.0 |
| | Staff sees masked plates for closed sessions | §2.3, FR-42 (Q46) | P13, `src/lib/plate.ts` | per spec 002 | 0.5 |
| | Plate purge measured from `exitTime` and run automatically | FR-45 (Q44) | P13, `purge.ts`, `instrumentation.ts` | per spec 002 | 0.75 |

Totals: A 1.5 h, B 0.6 h, C 3.25 h, D 4.75 h. All groups together come to about 10.1 h.

| Dimension | Impact |
|---|---|
| Requirements / products | No requirement is added. Items in groups A–C are existing SRS requirements that the code does not meet. Group D items were confirmed by the lecturer on 23/11. SRS v2.1 section 9 already lists every item. |
| Activities | A-49 gains a fix-and-retest step. Group D is carried by spec 002 (RES-01's Spec Kit flow). A-110 (scope-status table) records anything not done as "partial" or "deferred", with the reason. |
| Effort | A + B: about 2.1 h. All groups: about 10.1 h. Against the open CR-01 gap, only A + B fits without new hours. |
| Resources | Same five members. Groups A, B and C sit with RES-04 (UI owner). Group D touches RES-03's API and data code and RES-01's spec. |
| Risks | R-G5-01 (late fixes cause regressions) rises with each item taken. Mitigation: each fix lands with its test, the full suite runs before merge, and A-49 is rerun. If group D is not done, the acceptance report shows five lecturer-confirmed requirements as unmet, which weakens the O3 and O4 evidence. |
| Schedule | A + B fit before the 27/11 demo with no milestone change. C and D cannot all finish before 27/11; they can land before the A-92 freeze on 28/11 only if hours are found. |
| Cost | Converted at 50,000 VND per person-hour (not cash): A + B about 105,000 VND; all groups about 505,000 VND. |
| Quality | Group A moves A-49 from "Partly verified" to "Verified" and closes FR-19..21. Group B removes defects that anyone watching the demo would see first. Groups C and D raise O3 and O4 coverage; skipping them is recorded as a known gap, not hidden. |
| Baseline | No new baseline. The CR is listed as a V2.0 change entry, as CR-02 was. |

## CR-03 addendum: Phase 5 client decisions and acceptance impact (24 November review)

The 11 answers in the [Phase 5 interaction log](client-interaction-log-phase-5.md) supersede conflicting handover wording. [PR #15](https://github.com/nvdson2005/Parking-Management-System/pull/15) merged the interpretation. Product work is split across [#11](https://github.com/nvdson2005/Parking-Management-System/pull/11) (exit-based retention and Staff masking) and [#17](https://github.com/nvdson2005/Parking-Management-System/pull/17) (hours, rates, and fee-group changes). The latter is stacked on the former. Neither head alone is the full A-87 candidate.

CR-03's **full scope is 28 h and selected scope is 16 h**. These are alternative totals, not additive increments. RES-03 owns the line-item comparison and V2.0 regeneration in [PR #10](https://github.com/nvdson2005/Parking-Management-System/pull/10); its current head requires that comparison and a named integrated build before approval. The 16 h selected estimate is a plan, not measured actual effort. V1.0 remains the archived reference. The Phase 5 client decisions change acceptance checks but do not authorize dropping Must evidence.

| Impact | Required disposition |
| --- | --- |
| Product and migration | Integrate #11 then #17; verify exit cutoff, role masking, published hours, group-specific tariff and Manager-only group update on one SHA. |
| Quality | Normal 100-visit run with ≤3 s recording and ≤5 s display; separate full-lot refusal; five exceptions; nine browser/width combinations; plate retention and statistics. |
| Schedule and resources | A-68 finished 24/11 rather than 23/11 per [PR #18](https://github.com/nvdson2005/Parking-Management-System/pull/18). Recalculate remaining work from owner actuals and QA status; do not treat 140 h capacity or 16 h selected estimate as measured work. |
| Risk | #11 has requested changes and conflicts with main; #17 depends on it. The A-87 build, migration state, CP-05 verdict, A-31/T12 and M-03 variance are still open as of this review. |

No independent V2.0 approval is inferred here. M-03 must identify the build and compare the full and selected CR-03 options using the same scope boundary.
