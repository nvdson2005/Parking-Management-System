# CP-05 Follow-up Verification Tasks

**Status:** Deferred-work notice recorded on 2026-11-25 per the user's instruction. This carries the outstanding checks into A-117; it does not waive any check or close CP-05. The latest A-68 gate record still marks formal RES-01 (PM) approval and RES-02 issue allocation as pending. CP-05 remains **pass with conditions**.

**Tracking:** Proposed IDs ISS-06–ISS-11 are recorded in the latest A-68 gate evidence; RES-02 allocation and RES-01 (PM) approval remain pending there. Due points below follow the A-68 gate record.

| ID | Follow-up task | Owner | Due point | Completion evidence | Estimate |
|---|---|---|---|---|---:|
| C1 | Count open sessions by zone and vehicle type; photograph count beside displayed availability. | RES-05; RES-02 verifies | Before A-87 | **Evidence done 25/11**; RES-02 verification pending. `a68-cp05-test.md` §3.4, `evidence/a68/c1-*` | Done; sign-off pending |
| C2 | Send the recorded CP-05 demo video to the client; record send date and recipient. | RES-01 sends; RES-02 records | Before A-87 | Video recorded 25/11; client email and record pending. `a68-cp05-test.md` §3.4, ISS-07 | 1–2 h remaining |
| C3 | Capture DevTools Network evidence for `events/entry`, `exit/preview`, and `exit/confirm`. | RES-05 | Before A-87 | **Done 25/11**: production timings 31 / 14 / 23 ms. `evidence/a68/c3-network.png` | Done |
| C4 | Add tested commits and an independent verifier to the Quality Evidence rows. | RES-05; RES-02 verifies | Before A-87 | Rows prepared 25/11; verifier sign-off pending. `a-68-cp05-test.md` §3.2, ISS-09 | Rows done; sign-off pending |
| C5 | Re-run the two-click D-01 scenario on a scratch database and compare `a68-check` with the UI. | RES-05; RES-02 reviews | Before A-87 | **Done 25/11**: overlap reproduced, availability matched, incomplete records 0; D-01 remains S2. `a-68-cp05-test.md` §3.3, ISS-10 | Done |
| C6 | Fix and retest D-01, D-03, and D-04. | D-01: RES-05 with RES-01; D-03/D-04: RES-04 | CP-07 | D-01 fixed and retested 25/11; fix PR merge pending. D-03/D-04 remain open to CP-07. `a-68-cp05-test.md` §3.5, ISS-11 | Partial; D-03/D-04 outstanding |

## Gate controls

- Track conditions as ISS-06–ISS-11; RES-02 allocation and RES-01 approval remain to be recorded per the A-68 gate log.
- Keep the deferred-work notice with the follow-up record; it does not substitute for the formal PM approval required by the gate.
- Keep CP-05 marked **pass with conditions** while required evidence or approvals are outstanding.
- C5 is complete with no mismatch; any later evidence of an availability mismatch requires immediate gate reassessment.
- C6 is due by CP-07. Any later deferral needs a revised gate decision.

**Planning estimate:** 9–15 person-hours, plus about 0.5–1 hour for QA review and recording approvals. This assumes C5 finds no availability defect requiring broader investigation.
