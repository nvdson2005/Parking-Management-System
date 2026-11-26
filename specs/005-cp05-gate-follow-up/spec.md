# Feature Specification: CP-05 Conditional Gate Follow-up

**Feature Branch**: `test/a68-cp05`

**Created**: 2026-11-26

**Status**: Tracking

**Input**: RES-02's CP-05 conditional pass and follow-up work recorded in `docs/m3/a-68-cp05-test.md` and `docs/m3/cp05-follow-up-verification.md`.

## Purpose

Keep the CP-05 conditional gate requirements visible in Spec Kit while their completion work is scheduled through CP-07. This is a verification and record-keeping feature; it does not change product behavior or authorize closing CP-05.

## Requirements

- **CP05-FU-001**: The follow-up record MUST keep C6 (fix and retest D-01, D-03, and D-04) attached to the CP-05 conditional gate until the authorized gate owners revise that decision.
- **CP05-FU-002**: C6's work MUST retain its CP-07 due point; this deadline defers completion, not its status as a CP-05 condition.
- **CP05-FU-003**: C6 MUST record the status of each defect separately: D-01 fix/merge and retest, and D-03/D-04 fix and retest.
- **CP05-FU-004**: CP-05 MUST remain open as “pass with conditions” until all required evidence, verifier sign-offs, issue allocation, PM approval, and any authorized waiver acceptance are recorded.
- **CP05-FU-005**: Only RES-02 and RES-01 (PM), acting under the gate process, may revise or accept a change to these conditions; a due date or user-directed waiver alone does not close them.

## Success Criteria

- **SC-001**: The CP-05 and CP-07 records consistently show C6 as a CP-05 condition due by CP-07.
- **SC-002**: The CP-05 gate record does not show C6 as complete until D-01, D-03, and D-04 are resolved and retested, or the authorized gate owners formally revise the condition.
- **SC-003**: CP-05 is not represented as closed while required approvals or conditions remain outstanding.
