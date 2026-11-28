# F5-04 · Scope status: completed, partial, deferred, removed (A-110)

| Field | Value |
|---|---|
| Task | F5-04 in `docs/m3-m4-final-work-division.md` |
| Owner | Nguyễn Tuấn Thành (RES-05). Review: RES-01 (scope decisions), RES-02 (acceptance results), RES-04 (SRS) |
| Report section | M4 §4.1 (deliver and demonstrate; completed, partially completed, deferred and removed scope) |
| Depends on | F2-04 A-87 dry run (`docs/final/res02/a87-dry-run.md`, #35 merged 28/11); F4-02 reservation UI gap: FR-51 in PR #24 (merged 26/11, retest `a49-retest.md`), FR-52 in PR #21 (merged 24/11); closure confirmed in P24 item I-01 (`docs/final/res04/traceability-matrix.md`) |
| State checked | `origin/main` at `5afe2ad` (merge of PR #37) and open PRs, 28/11/2026 |
| Baseline scope | Products P01–P24 in `docs/m2-report/generated/products.md` (V1.0) and `generated-v2/products.md` (V2.0); SRS v2.1 (`docs/m2-report/v2.0/products/CO3011_M3_SRS_v2.1.md`) |

## 1. Definitions used

| Status | Meaning in this table |
|---|---|
| **Completed** | Built and on `main`, and verified by at least one acceptance scenario (AT) or recorded test that passed |
| **Partially completed** | Built, but part of the product or its verification is missing, open or only on an unmerged branch |
| **Deferred** | Planned in the baseline, not done in this project, and could be done later without changing the agreed requirements |
| **Removed** | Taken out of the handover scope by a client answer or an approved decision. Not planned to be done |

"Verified" here means the team's internal acceptance (A-87 and the module tests). No client acceptance was obtained, see row PT-01.

## 2. Software products (PG-1, P04, P22)

| ID | Product / scope item | Status | Evidence | Note |
|---|---|---|---|---|
| P07 | Authentication and RBAC: 3 roles, plate masking, access log, 12-month purge | **Completed** | AT-04 Pass (A-87); A-31 auth test (`docs/m3/a-31-auth-test.md`) | Automatic purge after 12 months from exit added through CR-03 (FR-45, Q35/Q44, PR #21) |
| P08 | Lot management: lots, zones, capacity, tariffs, suspend/reactivate, display-only opening hours | **Completed** | AT-03 Pass (A-87); A-61 seven Staff 403s (`docs/m3/quality-evidence-A-61.md`) | Opening hours (FR-22, Q37) added through CR-03, PR #21 |
| P05 | Entry/exit with the 5 exception flows EX-01..EX-05 | **Completed** | AT-EX01..AT-EX05 Pass (A-87, 27/11); AT-100 Pass; A-68 / CP-05 (`docs/m3/a-68-cp05-test.md`) | D-04 (exit preview showed the entry plate as the observed plate) fixed in PR #38, retest `docs/final/res04/d04-retest.md`. D-05 open, row P05-a |
| P05-a | Session detail shows identification method and entry Staff (D-05) | **Partially completed** | A-68 D-05; `docs/final/res05/objectives-o1-o2.md` | S3, display only. The value is stored, so the O2 record is complete |
| P09 | Live availability per zone and vehicle type, last update time, used spots, "Hết chỗ" label | **Completed** | AT-01 Pass; A-49 retest Verified (`docs/final/res04/a49-retest.md`); AT-100 max 155 ms to display | FR-19..21 were missing until CR-03 (PR #24, merged 26/11) |
| P06 | Reservations: book, cancel, 30-min hold, no-show, early arrival with Staff confirmation, one active reservation per account, Staff view of reservations | **Completed** | AT-05 Pass (A-87, evidence gap 4: no-show wait and manual cancel not shown); F4-02 closed (FR-51 PR #24, FR-52 PR #21; P24 I-01) | F4-02 was the SRS section 9 reservation gap. It was built in full, so nothing is recorded as partial here (the division allowed that if it exceeded 1.5 h) |
| P10 | Simulated payment, per-visit fee for 6 vehicle type × fee group combinations | **Partially completed** | AT-06 Pass (motorbike 2.000 đ, car 10.000 đ); `tests/fees.test.ts` | Product works. Verification: `main` tests 4 of 6 combinations; the 6/6 test is on branch `test/A-76-payment` (`26677dc`) with no PR |
| P11 | Reports: 4 indicators, occupancy per zone × vehicle type (Q28) | **Completed** | AT-07 Pass (A-87); A-77 hand calculation (`docs/m3/A-77/`) | Verified on sample data |
| P04 | Device simulator (QR, RFID, plate events), seeded runs, ≥ 100-session mode | **Completed** | A-45 / CP-04; A-67 SC-01..SC-07; AT-100 100 entries, 69 exits, 0 rejected | D-01 (two runs at once) fixed in PR #26 with a single-run guard |
| P22 | Pilot lot data: zones A, B (150 motorbikes each), C (30 cars) | **Completed** | Seed in `prisma/seed.ts`; AT-01 starts from A 150/150 | |
| — | Round 3 changes (CR-02): early arrival confirmation, one reservation per account, per-zone utilisation, suspension notifications | **Completed** | Weekly log W12; tests in PR #4 | Added after the baseline, no plan time |
| — | Browsers | **Partially completed** | A-87 technical run 24/11 (Chrome 360/768/1920 px) | Only Chrome tested. Edge and Firefox not tested (A-89 section 4) |

## 3. Delivered documents and project-management products (PG-2, PG-3, PG-4)

| ID | Product | Status | Evidence | Note |
|---|---|---|---|---|
| P13 | Install and demo guide | **Partially completed** | `docs/P13-huong-dan-cai-dat-va-demo.md` (#12, merged 28/11) | Written and merged. Its acceptance criterion (a non-author runs the demo from the guide alone) is not recorded yet, see `submission-package.md` B7 |
| P14 | Acceptance test report | **Partially completed** | `docs/m3/a-89-acceptance-section.md`; `docs/final/res02/a87-dry-run.md` | 13/13 AT run and Pass. CP-07 is still "pass with conditions": condition A (one build) closed 28/11 by the recheck on `d9c6638` (396/396 tests, lint, build) and RES-01's AT-01/AT-02/AT-EX02 UI check; condition B (9 evidence gaps) and C (RES-04 re-check) open |
| PT-01 | Client acceptance (M-04: demo video and client confirmation email, Q23, Q11) | **Partially completed** | A-88 run internally on 26–27/11, client not available; CP-08 not obtained | Internal acceptance only. O5 "client acceptance" is not achieved (A-89 section 5) |
| P12 | User guide | **Deferred** | `generated-v2/products.md`: "Hoãn; thay bằng phần hướng dẫn thao tác trong P13" | Replaced by the operating steps in P13 |
| P02 | SRS | **Completed** | SRS v2.1 (PR #22); section 9 has no open gap after PR #36 | A-09 review (CP-01) did not pass on 16/11; closed by revision without a recorded re-check (`docs/final/res02/cp01-srs-review.md`) |
| P18 | Architecture and API design | **Completed** | P18 v1.1 in `docs/m2-report/v2.0/products/` | V1.0 file overwritten by P18 v1.0, known deviation (`baseline-v1.0-freeze.md`) |
| P03 | Database design | **Completed** | P03 v0.6 (`docs/m2-report/products/CO3011_M2_ThietKeCSDL_v0.6.md`); CP-03 review | |
| P20, P21 | Test plan, acceptance test set | **Completed** | P20 v1.2 (CP-05 row); P21 AT-01..AT-07, AT-EX01..05, AT-100 used in A-87 | P21 kept on the team Drive (RES-02 reflection) |
| P24 | Traceability matrix | **Completed** | `docs/final/res04/traceability-matrix.md` (#37 merged 28/11) | |
| P01 | Baseline V1.0 | **Completed** | `docs/m3/baseline-v1.0-freeze.md` | Tag `baseline-v1.0` not on the remote yet (B2) |
| — | Baseline V2.0 | **Partially completed** | `docs/m3/baseline-v2.0.md`, regenerated (#29 merged 28/11); RES-01 endorsed it on 27/11 (`docs/final/res01/baseline-v2-approval.md`, pending #39) | The recovery schedule is not approved yet: RES-03 reconciles remaining work first |
| P15, P16 | Client Interaction Log, weekly log | **Completed** | Logs index in `submission-package.md` section 5 | Phase 5 client log and W14 log pending #39. Hours in the weekly log are assumed, not measured |
| P17 | Final PM report | Not started (final phase) | Division §6 | Written from these section files |

## 4. Removed from the handover scope

All items below were removed by a client answer or an approved decision. None is a silent omission.

| Item | Requirement | Decision | Source |
|---|---|---|---|
| Hourly charging and rounding | FR-24, FR-34 (hourly part); FR-36 (tariff item stored on the payment) | Client: per-visit charging only for this handover | Q36 (23/11); SRS v2.1 sections 6 and 9 |
| Blocking entry and booking outside opening hours | FR-22 (blocking part) | Client: opening hours are for display only | Q37 |
| Customer changes own fee group | — | Client: Customer requests, Manager applies (FR-07, FR-08) | Q38 |
| Logout after 30 min of inactivity | FR-03 | Client: not an acceptance criterion; explicit logout required | Q39 |
| Creating and running a second lot in the UI during acceptance | NFR-11 | Client: one pilot lot; the model stays multi-lot | Q40 |
| Re-measuring timings with a full lot | NFR-12 | Client: not required; full-lot refusal tested separately (AT-EX01) | Q41 |
| User satisfaction survey as an acceptance measure | — | Client: not required | Q42 |

Outside the scope from the start (M1 1.4.2, SRS v2.1 section 6), listed so the table is complete: real payment gateway (Q03), real hardware (Q06), university SSO (Q08), several real lots (Q04), native mobile apps (Q12), monthly passes (AS11), lost-card fee (AS13), per-spot sensors (AS12).

## 5. Verification and management scope changed by decisions

| Change | Status | Decision | Source |
|---|---|---|---|
| A-72 reservation and A-76 payment checks cut to existing automated tests plus one acceptance pass | Reduced, not removed | Option C (19/11). At M-03 (24/11) Q22 fired, but RES-01 kept both checks: nothing was omitted under Q22 | `docs/m3/decision-record.md`; F1-02 (pending #39) |
| A-95 early acceptance run merged into A-87 | Merged | Option C | Decision record |
| A-108 M3 report folded into A-92; A-89, A-110, A-112, A-113 written as sections of A-92 | Restructured | Option C | Decision record; division §6 |
| A-115 demo script only (no slides), mock viva 15 min | Reduced | Option C | `docs/final/res05/demo-script-and-viva.md` |
| A-91 retrospective meeting | Replaced by a written retrospective | RES-05, 28/11, to be confirmed by RES-01 | `docs/final/res05/lessons-learned.md` |

## 6. Summary for the report (M4 §4.1)

All eight software products (P04–P11) and the pilot data (P22) were delivered on `main`. The team's internal acceptance (A-87, 26–27/11) ran all 13 acceptance scenarios, AT-01..AT-07, AT-EX01..AT-EX05 and AT-100, and every one passed. CP-07 is still pass with conditions: the build condition was closed on 28/11, but nine evidence gaps and RES-04's re-check remain. Work added after the baseline was also completed: the round 3 changes (CR-02) and the Phase 5 requirements built through CR-03 (FR-07, FR-19..22, FR-26, FR-42, FR-45, FR-51, FR-52). Four items are partially completed:
- simulated payment, whose full 6-combination test is not on `main`;
- the session detail display (D-05, S3);
- the P13 non-author check;
- client acceptance, because A-88 had to be run internally and no client confirmation was obtained.

The user guide (P12) was deferred and replaced by P13. Seven requirements were removed from the handover scope, each by a client answer from 23/11 (Q36–Q42). Verification depth was reduced under Option C, but no check was dropped under the Q22 fallback.
