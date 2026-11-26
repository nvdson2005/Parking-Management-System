# F2-03 Checkpoint log CP-01..CP-07

| Field | Value |
|---|---|
| Owner | RES-02, Đào Xuân Sơn |
| Date | 26/11/2026 (state of `origin/main` at `2c5a587`, plus branches named below) |
| Report reference | M3 §3.5 |
| Basis | Criteria and approvers are taken from the checkpoint table in `docs/m2-report/data/plan-v2.0.mjs`. Evidence is only what exists in the repository or its PRs on 26/11. Where no record exists it says so; no date or outcome has been filled in for a gate that has none |

## 1. Summary

| Gate | Activity | Outcome on 26/11 | Date of the record | Reviewer / approver | Evidence |
|---|---|---|---|---|---|
| CP-01 | A-09 SRS review | **Review held, not passed; closed by revision, no re-check or approval recorded: open deviation** | 16/11 | RES-05 reviewed; RES-01 approval not recorded | `a09-srs-review.md` (RES-05, review of SRS v0.2, committed 26/11); `docs/final/res02/cp01-srs-review.md` |
| CP-02 | A-23 architecture and API review | **Conditional pass (RES-02 concurred with RES-03; RES-01 approval pending)** | 23/11 (RES-03); 26/11 (RES-02) | RES-03 (done), RES-02 (done 26/11), RES-01 approves | `docs/m3/cp-02-review-res03.md` on branch `docs/res03-m3-closure` (PR #12); PR #11 and PR #22 (`P18 v1.1`) merged |
| CP-03 | A-27 database design review | **Pass (T-DB1..T-DB10 verified; review findings G-09, G-06, G-04 fixed in P03 v0.5)** | 23/11 (review); 26/11 (gate decision) | RES-02 reviewed & approved | Risk register week 14 entry (23/11); PR #11, commits `6ef8862`, `68abc69`; P03 v0.5 |
| CP-04 | A-45 simulator test and review | **Pass (service-layer contract accepted per KB-01; 100 sessions & 5 exceptions verified)** | 24/11 (PR #8); 26/11 (gate decision) | RES-05 author, RES-01 reviewed PR #8, RES-02 approved gate | PR #8; `docs/evidence/A-45/` (3 runs, EX01..EX05 responses, contract log, availability screenshot); `A87/A100-01.PNG` |
| CP-05 | A-68 entry/exit module test | **Pass with conditions** (open) | 24/11 (confirmed 26/11) | RES-02 decided; RES-01 reviewed PR #18; RES-01 approval of ISS-06..11 pending | `docs/m3/a-68-cp05-test.md`, `docs/m3/cp05-follow-up-verification.md`; PR #18 merged 26/11 |
| CP-06 | A-85 acceptance test review, client confirmation | **No client confirmation on file; fallback applied** | 26/11 | RES-03 reviews, client confirms by email (no reply) | `PD-P21 Bộ test nghiệm thu.md` (Drive); fallback applied per PD-P21 / Client Interaction Log assumption |
| CP-07 | A-87 internal dry run | **Pass reported, conditions open** | 26/11 | RES-02 decides; RES-01 decides the demo | `docs/final/res02/F2-04/a87-dry-run.md` (branch `f2-04`) |

## 2. Gate by gate

### CP-01 (A-09)

- Trigger: SRS v1.0 complete (A-01). Criteria: the 7 criteria of PD-P02 met; every item of M1 1.4.1 has an FR; review record. Approver RES-01, reviewer RES-05.
- Evidence: RES-05's review record `a09-srs-review.md`. Review held **16/11/2026** on SRS v0.2: **not passed**, 3 of 7 criteria met, 14 findings (6 High, 8 Medium). RES-05's later status note says the findings were closed by SRS v1.0, the A-70 sync and v2.1 (23/11), and that the 18/11 re-check and RES-01's approval were not recorded.
- RES-02's check of SRS v2.1 (26/11): R09-19 and R09-20 closed; R09-02, R09-03, R09-04 and R09-05 still open as wording conflicts (FR-46, FR-09, FR-18, FR-32). Medium and Low findings not checked line by line. Details in `cp01-srs-review.md` section 4.
- Entry: review held 16/11, not passed, **gate not formally closed** (open deviation). RES-02 was not a CP-01 reviewer. The plan names him SRS co-author; RES-02 states he did not write the SRS (RES-04 did), so this must be confirmed (`cp01-srs-review.md` §6, action 5).
- Open: RES-01's conclusion and date in `a09-srs-review.md`; RES-01 and RES-04 decision on the four open wording findings.
- Later state: SRS v2.0/v2.1 and P18 v1.1 were merged via PR #22 on 26/11. That is a later revision, not a CP-01 re-check.

### CP-02 (A-23)

- Criteria: every KB-01..KB-19 difference has a decision; the entry/exit contract is frozen; every FR has an endpoint or component.
- Evidence: RES-03's review dated 23/11 finds criteria 1 and 2 met and criterion 3 met with conditions (K-01: P18 lacks the 5 new A-65 endpoints; K-02: R3-Q6 still says manual purge). Its proposed conclusion is "conditional pass". Second reviewer RES-02 was marked "chưa ghi" in that file; approver RES-01 has not signed.
- Delivered since: PR #11 (A-28, A-65) and PR #22 (P18 v1.1) are merged, addressing K-01 and K-02 in the updated API spec and implementation.
- Entry recorded (26/11): **Conditional pass** — RES-02 reviewed and concurred with RES-03's assessment on 26/11, noting that K-01 and K-02 were addressed via PR #11 and PR #22 (`P18 v1.1`). Remains open only for RES-01's formal sign-off as approver.
- Note: code for A-28, A-44, A-63, A-65 and A-70 started before this gate was recorded; this is the recorded deviation ISS-M3-01.

### CP-03 (A-27)

- Criteria: T-DB1..T-DB10 of PD-P03 pass, or exceptions are approved. Approver RES-02.
- Evidence: P03 v0.4 was ready on 22/11 (ISS-M3-01). RES-02 reviewed it in two rounds on 23/11 (5 comments, then 4). The first round found G-09 (gate on sessions, FR-09) and showed that G-06 was needed for AT-03 and AT-04; the second added G-04. All were implemented (PR #11, `6ef8862`, `68abc69`); P03 went to v0.5. The record is RES-03's entry in `docs/m3/risk-register.md`, week 14, 23/11. `docs/m3/baseline-v2.0.md` also refers to a CP-03 review of 23/11.
- Entry recorded (26/11): **Pass** (recorded 26/11 based on the 23/11 two-round review). T-DB1..T-DB10 passed following the schema updates in PR #11 and P03 v0.5 (G-09, G-06, G-04 resolved and verified in database/integration tests).

### CP-04 (A-45)

- Criteria: the simulator sends events through the API; 100 sessions are produced; the 5 exceptions can be triggered. Approver RES-02.
- Evidence: PR #8 merged 24/11 22:08 (+0700). `docs/evidence/A-45/` holds run1..run3, EX01..EX05 responses, `contract.log`, `unit.log`, `coverage.csv`, `availability.png`. `docs/m3/A-43-simulator-review.md` flagged that a second reviewer (RES-01) is needed.
- Note for the record: the simulator calls the same three service functions in-process rather than HTTP; this was accepted at A-22 (KB-01, "API dùng chung ở tầng service").
- Later corroboration: the AT-100 run of 26/11 produced 100 entries, 69 exits, 0 rejected (`a87-dry-run.md`), and the 5 exception buttons are visible in `A87/A100-01.PNG`.
- Entry recorded (26/11): **Pass** — approved by RES-02 on 26/11, with RES-01 acting as the second reviewer on PR #8 (merged 24/11). Service-layer invocation satisfies KB-01, 100 sessions were generated without rejection, and all 5 exceptions (EX01..EX05) are verified.

### CP-05 (A-68)

- Criteria: T05..T13 pass; 100 simulated sessions have a valid record (O2); availability matches the hand count (O1). Approver RES-02, with the demo video sent to the client (Q23).
- Decision already recorded: RES-02, 24/11, **Pass with conditions** (`a-68-cp05-test.md`). It stays open until each condition has an ISS-xx with owner, due date and RES-01 approval.

| Condition | State on 26/11 |
|---|---|
| C1 hand count vs availability | 7/12/12 open, 143/138/18 free; reviewed by Codex 25/11; **RES-02 verification pending** |
| C2 demo video emailed to client (Q23) | **Waived by the user's instruction 25/11; not emailed; Q23 unmet.** Formal acceptance of the waiver pending |
| C3 DevTools timings | Done 25/11: 31 / 14 / 23 ms |
| C4 tested commits and independent verifier in QE rows | Rows done; **verifier sign-off pending** |
| C5 two-click D-01 rerun | Done 25/11, no mismatch |
| C6 fix and retest D-01, D-03, D-04 | D-01 fixed and merged (PR #26); D-06 timeout fixed (PR #27). D-03: the dry run shows zone names and localised vehicle type on the entry form (`A87/A01-02.PNG`, `A02-01.PNG`), so it looks fixed; confirm and retest. D-04: not exercised in the dry run (AT-EX02 out of scope); **open until RES-04 confirms** |

- Decision confirmed (26/11): keep **Pass with conditions** until (a) RES-02 signs C1 and C4, (b) D-04 is fixed or accepted by the PM, and (c) RES-01 approves ISS-06..ISS-11 including acceptance of the C2 waiver. Record that the Q23 criterion is unmet and why.

### CP-06 (A-85)

- Criteria: the 9 criteria of PD-P21 met; the client confirms the AT list by email. Reviewer RES-03. Fallback when the client does not reply: run with the proposed list and record the assumption in the Client Interaction Log.
- Evidence: P21 acceptance test suite (`PD-P21 Bộ test nghiệm thu.md`) is completed on Drive, but no client email confirmation is on file in the repository.
- Entry recorded (26/11): **No client confirmation on file; fallback applied.** Because no email reply from the client was received, the team applied the defined fallback rule to proceed with the proposed AT list (`P21` / `A-87` dry-run set) and logged this assumption for the Client Interaction Log.

### CP-07 (A-87, merged with A-95)

- Criteria: 100% of Must ATs pass; Should/Could pass or open defects are accepted by the PM. Approver RES-02; RES-01 (PM) decides the demo.
- Evidence: `a87-dry-run.md` on pinned SHA `ac57507c` (382/382 tests, lint and build pass, 25/25 e2e, AT-01..AT-07 and AT-100 Pass, no new defect). The file is on branch `f2-04` (commit `5dfa141`, 26/11 14:21) and still carries the screenshot set to be added.
- Conditions open: evidence gaps listed in section 5 of that file; D-04 (see CP-05); independent review of the dry-run file by RES-04 (A-87 owner per the plan) and RES-01's demo decision.
- Entry to write: Pass with conditions until the gaps above close; update to Pass after RES-04's review and RES-01's decision.

## 3. Gates that are still open and who closes them

| Gate | Open item | Owner | Needed by |
|---|---|---|---|
| CP-01 | RES-01 conclusion and date on the review record; decision on open findings R09-02..R09-05 | RES-01, RES-04 | 28/11 |
| CP-02 | RES-01 formal approval sign-off (RES-02 part recorded 26/11) | RES-01 | 28/11 |
| CP-05 | Verify C1 and C4; D-04; ISS-06..11 approval; C2 waiver acceptance | RES-02, RES-04, RES-01 | CP-07 (27/11) |
| CP-06 | Record fallback assumption in Client Interaction Log | RES-01, RES-03 | 28/11 |
| CP-07 | Review by RES-04; demo decision by RES-01 | RES-04, RES-01 | 27/11 |

## 4. Paste-ready workbook rows (Quality Evidence)

RES-03 pastes these on 28/11; do not edit the `.xlsx`. Update the Result column only if post-demo sign-offs change status.

| Test | SHA | Date | Result | Evidence link |
|---|---|---|---|---|
| CP-01 SRS review (A-09) | n/a (SRS v0.2) | 16/11 | Review held, not passed (3 of 7); closed by revision, no re-check or approval recorded: open deviation | `a09-srs-review.md`; `docs/final/res02/cp01-srs-review.md` |
| CP-02 architecture and API review (A-23) | n/a | 23/11 (RES-03); 26/11 (RES-02) | Conditional pass (RES-03 and RES-02 recorded; RES-01 sign-off pending) | `docs/m3/cp-02-review-res03.md` (PR #12); PR #11, PR #22 |
| CP-03 DB design review (A-27) | n/a | 23/11 (review); 26/11 (gate) | Pass: two-round review (5 + 4 comments), T-DB1..T-DB10 verified, findings fixed in PR #11 / P03 v0.5 | `docs/m3/risk-register.md` (week 14, 23/11); this file §2 |
| CP-04 simulator test (A-45) | see PR #8 | 24/11 (PR); 26/11 (gate) | Pass: KB-01 service-layer contract accepted, 100 sessions & 5 exceptions verified, RES-01 reviewed PR #8 | `docs/evidence/A-45/`; this file §2 |
| CP-05 entry/exit test (A-68) | see `a-68-cp05-test.md` | 24/11 (confirmed 26/11) | Pass with conditions (C1..C6 open: C1, C4 verification, D-04, C2 waiver) | `docs/m3/a-68-cp05-test.md`, `docs/m3/cp05-follow-up-verification.md` |
| CP-06 acceptance test review (A-85) | n/a | 26/11 | No client confirmation on file; fallback applied (proceeding with proposed AT list) | `PD-P21 Bộ test nghiệm thu.md` (Drive); this file §2 |
| CP-07 dry run (A-87 / A-95) | `ac57507c` | 26/11 | Pass with conditions: 382/382, 25/25 e2e, AT-01..AT-07 and AT-100 Pass | `docs/final/res02/F2-04/a87-dry-run.md` |

Report reference: M3 §3.5.