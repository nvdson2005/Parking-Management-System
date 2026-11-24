# Phase 5 Client Interaction Log and SRS review handoff (A-09, A-16)

**Client:** lecturer Nguyễn Minh Tâm. **Response:** numbered email reply of 23 November 2026. **Recorded by:** RES-01. This log paraphrases the decisions; the reply and [merged PR #15](https://github.com/nvdson2005/Parking-Management-System/pull/15) are the source and implementation trace. Question numbers Q36–Q46 correspond to answers 1–11. Do not present this paraphrase as a verbatim quotation from the email.

| Question / answer | Confirmed decision | SRS v0.2 / acceptance trace | Follow-up owner |
| --- | --- | --- | --- |
| Q36 / 1 | Per-visit tariff by vehicle type and group; hourly charging and rounding outside handover. | FR-24, FR-34, AT-06; Spec Kit FR-001 | RES-04 SRS; RES-03 product |
| Q37 / 2 | Manager maintains displayed lot hours; Customer sees them; hours alone do not gate admission or booking. | FR-22, FR-26, AT-03; FR-002 | RES-04 / RES-03 |
| Q38 / 3 | Customer requests a fee-group change; Manager applies an approved change; Customer cannot self-apply. | FR-07, FR-08, AT-04; FR-003 | RES-04 / RES-03 |
| Q39 / 4 | Explicit logout is required; 30-minute inactivity logout is outside handover scope. | FR-03, AT-04; FR-004 | RES-04 |
| Q40 / 5 | Handover uses one pilot lot; second-lot UI creation is outside acceptance scope. | NFR-11, AT-03; FR-005 | RES-04 / QA |
| Q41 / 6 | Run normal 100-visit timing and counts; test full-lot refusal separately. | FR-21, FR-46, NFR-04–07, NFR-12, AT-100, AT-EX01–05; FR-006, SC-001–002 | QA |
| Q42 / 7 | Survey and proposed score are not mandatory acceptance criteria. | O5, AT-08; FR-007 | RES-04 / QA |
| Q43 / 8 | Check Chrome, Edge and Firefox at 360, 768 and 1920 px. | NFR-08, AS27; SC-003 | QA |
| Q44 / 9 | Automatically remove closed-session plates after more than 12 months from exit; keep non-plate statistics. | FR-45, AT-04; FR-008, SC-004 | RES-03 / QA |
| Q45 / 10 | Signed-in Customers see their current group's per-visit rates for each supported vehicle type before parking. | FR-26, AT-03; FR-010, SC-005 | RES-03 / QA |
| Q46 / 11 | Staff sees a partially masked closed-session plate; Manager sees full plate while retained. | SRS §2.3, FR-42, AT-04; FR-009, SC-004 | RES-03 / QA |

The exact partial mask and audit rules remain governed by earlier accepted decisions. The full source and SRS delta belong in RES-04's [SRS PR #16](https://github.com/nvdson2005/Parking-Management-System/pull/16), stacked on [#9](https://github.com/nvdson2005/Parking-Management-System/pull/9). The RES-01 review must compare that final head with the integrated build.

## CP-01 SRS review (A-09)

This is a separate review gate from the 23 November client reply. RES-04 owns SRS corrections; RES-05 and RES-01 review their assigned sections. The repository has an earlier [P18 v1.0 decision record](../m2-report/products/CO3011_M2_KienTrucAPI_v0.1.md) and open SRS/P18 PRs, but no dated CP-01 approval record has been verified for the final SRS revision. **Status: pending recorded reviewer verdict**, with reviewer, date, revision SHA, findings and disposition required. The lecturer's reply and PR #15 do not themselves close CP-01.
