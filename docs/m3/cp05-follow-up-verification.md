# CP-05 Follow-up Verification Tasks

**Status:** Updated 2026-11-25. C1 evidence independently reviewed by Codex; formal RES-02 verification remains pending. Per the user's explicit instruction, C2's client-email task is waived for this follow-up; the video was **not emailed**. This records the user's direction only: Q23 remains unmet unless the authorized gate approvers formally accept the waiver. RES-02 issue allocation and RES-01 (PM) approval remain pending. CP-05 remains **pass with conditions** and cannot be closed on this record.

**Tracking:** Proposed IDs ISS-06–ISS-11 are recorded in the latest A-68 gate evidence; RES-02 allocation and RES-01 (PM) approval remain pending there. Due points below follow the A-68 gate record.

| ID | Follow-up task | Owner | Due point | Completion evidence | Estimate |
|---|---|---|---|---|---:|
| C1 | Count open sessions by zone and vehicle type; photograph count beside displayed availability. | RES-05; RES-02 verifies | Before A-87 | Evidence reviewed by Codex 25/11: photo, UI, and `a68-check` agree at 7/12/12 open and 143/138/18 free; RES-02 verification pending. `a68-cp05-test.md` §3.4, `evidence/a68/c1-*` | Evidence confirmed; formal sign-off pending |
| C2 | Send the recorded CP-05 demo video to the client; record send date and recipient. | RES-01 sends; RES-02 records | Before A-87 | **Waived per user's explicit instruction 25/11. Video was not emailed.** Q23 remains unmet; formal acceptance of waiver by authorized gate approvers is pending. `a68-cp05-test.md` §3.4, ISS-07 | Waived by user direction; gate acceptance pending |
| C3 | Capture DevTools Network evidence for `events/entry`, `exit/preview`, and `exit/confirm`. | RES-05 | Before A-87 | **Done 25/11**: production timings 31 / 14 / 23 ms. `evidence/a68/c3-network.png` | Done |
| C4 | Add tested commits and an independent verifier to the Quality Evidence rows. | RES-05; RES-02 verifies | Before A-87 | Rows prepared 25/11; verifier sign-off pending. `a-68-cp05-test.md` §3.2, ISS-09 | Rows done; sign-off pending |
| C5 | Re-run the two-click D-01 scenario on a scratch database and compare `a68-check` with the UI. | RES-05; RES-02 reviews | Before A-87 | **Done 25/11**: overlap reproduced, availability matched, incomplete records 0; D-01 remains S2. `a-68-cp05-test.md` §3.3, ISS-10 | Done |
| C6 | Fix and retest D-01, D-03, and D-04. | D-01: RES-05 with RES-01; D-03/D-04: RES-04 | CP-07 | D-01 fixed and retested 25/11; fix PR merge pending. D-03/D-04 remain open to CP-07. `a-68-cp05-test.md` §3.5, ISS-11 | Partial; D-03/D-04 outstanding |

## Gate controls

- Track conditions as ISS-06–ISS-11; RES-02 allocation and RES-01 approval remain to be recorded per the A-68 gate log. Mark ISS-07 waived by user direction, not completed; authorized gate acceptance is still required because Q23 is unmet.
- Keep the deferred-work notice with the follow-up record; it does not substitute for the formal PM approval required by the gate.
- Keep CP-05 marked **pass with conditions** while required evidence or approvals are outstanding.
- C5 is complete with no mismatch; any later evidence of an availability mismatch requires immediate gate reassessment.
- C6 is due by CP-07. Any later deferral needs a revised gate decision.

**Planning estimate:** 9–15 person-hours, plus about 0.5–1 hour for QA review and recording approvals. This assumes C5 finds no availability defect requiring broader investigation.
