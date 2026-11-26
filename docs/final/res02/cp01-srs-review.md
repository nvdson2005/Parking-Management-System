# F2-01 CP-01 SRS review (A-09): outcome record

| Field | Value |
|---|---|
| Owner | RES-02, Đào Xuân Sơn |
| Date written | 26/11/2026 |
| Report reference | M3 §3.5 |
| Status | **FINAL for RES-02's part.** One item stays with RES-01 (approval, section 4) |
| Basis | RES-05's review record `a09-srs-review.md` (review of 16/11/2026, committed 26/11); SRS v2.1 (`docs/m2-report/v2.0/products/CO3011_M3_SRS_v2.1.md`, read on `origin/main` `2c5a587`, 26/11); `docs/m3/a-90-planned-vs-actual.md` |

## 1. Outcome in one line

**The CP-01 review took place on 16/11/2026 (reviewer RES-05, SRS v0.2) and did not pass: 3 of 7 criteria met, 14 findings (6 High, 8 Medium).** The findings were closed by later SRS revisions and client decisions, not by a recorded re-check, and RES-01's approval is not recorded. CP-01 was therefore **not formally closed**. This is a recorded deviation, handled in section 4.

This replaces the earlier draft that offered "not recorded". That draft was wrong: the review record exists.

## 2. What the plan required and what happened

| Item | Plan (baseline V1.0 and V2.0) | What the record shows |
|---|---|---|
| Gate | CP-01, activity A-09 "Review SRS", after SRS v1.0 (A-01) | Review held 16/11 on SRS **v0.2** (15/11, 52 FR, 13 NFR, 5 EX), before A-10 fixed v1.0 |
| Reviewers | RES-05 reviews, RES-01 approves | RES-05 reviewed (about 1 h, plan 1 h). RES-01's conclusion and date are **blank** in the sign-off table |
| Owner of the SRS | RES-04. The plan also lists RES-02 as co-author (BA, 35% of A-01); RES-02 states he did not write the SRS | RES-04 marked "received" with no date |
| Criterion 7 | At least 2 reviewers who are not authors | **Not met.** One reviewer is on record. RES-05's finding R09-12 excluded RES-02 because the plan names him co-author; RES-02 states he did not write the SRS, so the exclusion rests on the plan, not on the work |
| If the gate fails | Return to A-01, fix within 2 days (by **18/11**) from the rework reserve; reviewer re-checks the section 6 list; A-82 and A-83 wait | Fix by revision happened, but the **18/11 re-check was not recorded** and A-82/A-83 and CP-02 went ahead on the client's decisions (`specs/002-lecturer-acceptance-alignment/`) |

## 3. Result of the 16/11 review against the 7 criteria

| # | Criterion (PD-P02) | Result on 16/11 | Findings |
|---|---|---|---|
| 1 | Every M1 1.4.1 item has at least one FR | Met (9 of 9) | R09-15, R09-19 (minor) |
| 2 | Acceptance criteria testable | Partly met | R09-07, R09-08, R09-09 |
| 3 | Each requirement has an objective and a source | Met (65 of 65) | R09-14 |
| 4 | No requirement outside the scope of M1 1.4.2 | **Not met** (operating hours, hourly fee) | R09-19, R09-20 |
| 5 | Each exception has a handling requirement | Met | R09-13 |
| 6 | No contradictory requirements; figures agree with M1, M2 2.0.2, PBS | **Not met** (6 contradictory pairs) | R09-02..R09-07, R09-10, R09-11, R09-19, R09-20 |
| 7 | At least 2 non-author reviewers before v1.0 | In progress, never completed | R09-12 |

## 4. How the findings stand on 26/11

RES-05's note says all findings were closed by the later revisions. RES-02 checked the High findings against the text of SRS v2.1. The result is **mixed**, so the claim is only partly confirmed.

| Finding | Level | State on 26/11 | Evidence |
|---|---|---|---|
| R09-20 hourly fee | High | **Closed** | FR-24 and FR-34 now price per visit only (Q36); AS26 marked "not applicable"; the section 9 table lists the change |
| R09-19 operating hours | High | **Closed by client decision** | Client kept hours as information only (Q37); FR-22 says hours do not block entry or reservations |
| R09-02 FR-46 against FR-31 | High | **Open in the SRS text** | FR-46 still says entry is refused when the zone is full "even if the remaining spots are all held" for reservations. No change in v2.1 and no entry in section 9 |
| R09-03 FR-09 against FR-51 | High | **Open in the SRS text** | FR-09 still says every valid entry event creates exactly one session, with no exception for early arrival |
| R09-04 FR-18 against FR-31 and FR-32 | High | **Open in the SRS text** | FR-18 still says free spots change by exactly 1 after each of five event types, with no case for a reserved vehicle entering its own zone |
| R09-05 FR-32 fee wording | High | **Open in the SRS text** | FR-32 still says "like a walk-in guest, applying the corresponding fee" without saying which fee group applies |
| R09-06..R09-18 | Medium and Low | **Not checked by RES-02** | Taken from RES-05's statement that they are superseded by v1.0, the A-70 sync and v2.1. Not verified line by line. The change history in SRS v2.1 lists v0.1, v0.2, v2.0 and v2.1 and has **no v1.0 row**, so "revised through v1.0" cannot be confirmed from the document itself |

What this means: the code does what the client confirmed (reservation hold, early-arrival confirmation, availability counts; see the passing tests and AT-05 in `a87-dry-run.md`). The open items are **wording conflicts inside the SRS**, not known product defects. They matter for the report because the SRS still contradicts itself on four requirements, and because a reader applying FR-18 or FR-46 literally would expect a different result from the one tested.

## 5. Outcome to cite in the report

| Field | Entry |
|---|---|
| Gate | CP-01 (A-09) |
| Review held | Yes, 16/11/2026 |
| Reviewer | Nguyễn Tuấn Thành (RES-05) |
| Approver | Nguyễn Võ Đức Sơn (RES-01): **not recorded** |
| Result of the review | **Not passed** at the first review (3 of 7 criteria) |
| Closure | Findings revised through later SRS versions; **no re-check and no approval recorded** |
| Gate status | **Open deviation.** Not "pass" |
| Effect | A-82 and A-83 (acceptance tests) and design and code work went ahead before the gate closed, the same pattern as CP-02 and CP-03 (recorded deviation ISS-M3-01) |
| Mitigations in place | SRS moved to v2.0 and v2.1 against the client answers Q36 to Q46; every acceptance scenario was run on 26/11 (`a87-dry-run.md`, AT-01..AT-07 and AT-100 Pass); P24 traceability by RES-04 (F4-03) |
| Residual risk | Four High wording conflicts (R09-02, R09-03, R09-04, R09-05) remain in SRS v2.1; the effort to correct them is small, but the SRS is already merged (PR #22) |

Reason the gate was not closed as planned: the record does not give one. RES-05's note says A-82, A-83 and CP-02 went ahead on the client decisions, which is the observed cause; it does not say why the 18/11 re-check was skipped. Do not state a reason beyond that unless RES-01 or RES-05 supplies it.

## 6. Actions that remain, with owner

| # | Action | Owner | Needed by |
|---|---|---|---|
| 1 | Record the CP-01 conclusion and date in the sign-off table of `a09-srs-review.md`, or state in writing that the gate closes by deviation. Do this in RES-05's file, not in this one | RES-01 | 28/11 |
| 2 | Decide for R09-02, R09-03, R09-04, R09-05: correct the SRS text in a v2.2 (RES-04), or accept as known wording issues and list them in the report | RES-01 with RES-04 | 28/11 |
| 3 | Tell RES-01 that row A-09 in `a-90-planned-vs-actual.md` changes from "TODO, no record" to the outcome in section 5. RES-02 does not edit that file | RES-02 informs RES-01 | now |
| 4 | Keep the traceability matrix (F4-03) in line with section 5: CP-01 is an open deviation, not a pass | RES-04 | 28/11 |
| 5 | Confirm with RES-04 who wrote the SRS. If RES-02 did not, the plan share of A-01 (35% RES-02) and the independence remark in R09-12 do not match the work; report it for A-90 and decide whether RES-02's review would have counted toward criterion 7 | RES-02 informs RES-01 and RES-04 | 28/11 |

## 7. Entries that follow

- `checkpoint-log.md`, CP-01 row, section 2 block and workbook row: updated to match section 5.
- Paste-ready workbook row (RES-03 pastes on 28/11; do not edit the `.xlsx`):

| Test | SHA | Date | Result | Evidence link |
|---|---|---|---|---|
| CP-01 SRS review (A-09) | n/a (SRS v0.2) | 16/11/2026 | Review held, not passed (3 of 7 criteria, 14 findings). Closed by revision, no re-check or approval recorded: open deviation | `a09-srs-review.md`; `docs/final/res02/cp01-srs-review.md` |

Report reference: M3 §3.5.
