# Baseline V2.0 · CR-01 review draft

RES-03 owns regeneration and RES-01 owns approval. This draft records the revised targets, dependencies, and capacity scenarios for their review. The V1.0 source and generated tables are preserved at commit `061120c9ab26acdb9c88b365bfd2f7800ef6ef09` under `docs/m2-report/data/plan.mjs` and `docs/m2-report/generated/`. V1.0 remains the reference for the original planned-versus-actual comparison.

## Schedule and dependencies

| Target | Work and dependency | Owner or reviewer |
|---|---|---|
| 20 Nov | A-67 verification recorded. This feeds A-68 and A-49. A-44 closure confirmation remains open. | RES-01 and RES-05 |
| 23 Nov | A-68/CP-05 after A-67. Supply the test and manual count results for M-03 and A-90. | RES-02 and RES-05 |
| 24 Nov | M-03 reviews A-68, A-49, A-72, A-76 and A-77 evidence. Record the Q22 trigger decision against the current forecast. | RES-01, with QA and schedule inputs |
| 23–25 Nov | A-90 compares original and revised plans with actuals and test results. Provide the section for A-92. | RES-01 with RES-03 |
| 26–27 Nov | A-87/CP-07 includes the former A-95 checks. Its outcome and the install guide A-33 feed A-88. | RES-02 and RES-04 |
| 27 Nov | A-88/CP-08 client demo. Record acceptance and exceptions for A-89. | RES-01 and RES-05 |
| 28 Nov | Finish and review A-92 after A-90 and A-87. Integrate acceptance and handover, scope status, lessons, and M3 evidence. | RES-03 writes, RES-02 reviews, RES-01 signs off |
| 29 Nov | M-05 joint submission. A-116 packaging starts in W14 and finalizes against the signed-off report. | RES-04 uploads, RES-01 checks receipt |

The demo-to-submission dependency is A-87 → A-88 → A-89 acceptance section → A-92 sign-off → A-116. A-67 → A-68 → A-90 → A-92 feeds report completion in parallel. These are planned dependencies. Resource-levelled dates and critical-path float require the per-owner forecast.

## Capacity and effort

W12 provides 8 h per person and W13 and W14 each provide 10 h per person. W15 is removed. The five-person base capacity is 140 h, compared with 190 h in V1.0. Revised demand is about 164.1 h after the 8.0 h net reduction, including the 1.5 h V2.0 work. At the baseline proxy rate of 50,000 VND/h, planned demand is approximately 8,205,000 VND.

| Scenario | Capacity | Demand | Gap |
|---|---:|---:|---:|
| Base capacity | 140 h | 164.1 h | 24.1 h |
| With planned W14 extra 2 h per member | 150 h | 164.1 h | 14.1 h |
| With another 1 h per member if confirmed | 155 h | 164.1 h | 9.1 h |
| With all extra hours and Q22 if triggered | 155 h | 161.5 h | 6.5 h |

Recalculate remaining demand from completed activities and owner forecasts before approval. See the [decision record](decision-record.md) for the full activity changes and the Q22 rule. CR-02 replies arrived 15 November 2026. The clarifications are logged without an additional rebaseline.

## Risks and approval

| Risk | Response |
|---|---|
| R-G4-02 · Capacity shortfall | Confirm extra hours by owner, track actuals, and escalate a weekly shortfall above 2 h. |
| R-G5-01 / R-G5-02 · Late defects | Keep Must scenarios in A-87, triage failures promptly, and carry open findings into P14. |
| R-G5-04 · Deadline compression | Protect Must verification and the demo. At M-03, apply Q22 if any Must product is unverified or the schedule is more than two days behind. Record any removed verification coverage. |

Approval remains pending. RES-03 supplies the regenerated resource-levelled schedule and current owner forecast. RES-01 records approval after reviewing both. See the [approval checklist](baseline-v2-handoff.md).
