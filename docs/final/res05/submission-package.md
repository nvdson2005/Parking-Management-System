# F5-06 · Submission package checklist (A-116)

| Field | Value |
|---|---|
| Task | F5-06 in `docs/m3-m4-final-work-division.md` |
| Owner | Nguyễn Tuấn Thành (RES-05). Upload: Nguyễn Võ Đức Sơn (RES-01) only |
| Report section | SUB (submission package) |
| Requirement | "Submission Requirements", `resources/CO3011_Assignment_2026.pdf` page 7 |
| State checked | `origin/main` at `5afe2ad` (merge of PR #37) and open PRs, 28/11/2026 |
| Status | Draft 27/11. Items marked "pending #N" become final when that PR merges. RES-05 does **not** upload anything |

This file lists what goes into the submission and where each item lives. It does not copy content. Links are relative to this file unless they are full URLs.

## 1. Course requirements mapped to the package

| # | Requirement (assignment p.7) | Package item | Where | Status 27/11 |
|---|---|---|---|---|
| S1 | Final project-management report in PDF | Final report PDF (A-92, and the M3 report A-108 if submitted separately) | Written in the final phase from the section files in `docs/final/` | Not started (deferred, division §6) |
| S2 | Working link to the source-code repository | Repository URL plus the submission SHA | Section 2 | Repo ready. SHA not chosen yet (B1) |
| S3 | Clear instructions for running and demonstrating | P13 install and demo guide; README | Section 3 | P13 on `main` (#12 merged 28/11) |
| S4 | Baseline V1.0 and approved revised baseline(s) kept for comparison | V1.0 freeze record, V2.0 record and generated tables | Section 4 | V1.0 present, tag not on remote (B2). V2.0 endorsed by RES-01 on 27/11 (pending #39); recovery schedule not approved (B3) |
| S5 | Client Interaction Log and weekly project logs included or linked | Log index | Section 5 | Rounds 1–3 on `main`. Phase 5 log and final weekly log pending #39 |
| S6 | Major diagrams, estimates, schedules, risk registers and traceability readable | Diagram PNGs, generated tables, risk register, P24 matrix | Section 6 | Present on `main` (#29 and #37 merged 28/11) |
| S7 | AI tools declared, with the tasks they were used for (Use of Generative AI) | AI declaration in the final report | Workbook sheet **AI Usage Log**; M2 report AI table (`docs/m2-report/report.src.md`) | Source present. Must be carried into the final report |
| S8 | Exact submission instructions | Format and deadline on the LMS | LMS | RES-01 to confirm (division §1, 29/11) |

## 2. Repository

| Item | Value |
|---|---|
| URL | https://github.com/nvdson2005/Parking-Management-System |
| Branch | `main` |
| Last pinned SHA | `ac57507c9c2924d54ed35e3dac31e327deac4573`, pinned for the A-87 dry run (`docs/final/res02/a87-dry-run.md`). 382/382 tests, build and lint passed on it |
| Latest checked SHA | `d9c663805deac7a85fa964d2d3e520427ced7059` (PR #35 with the D-04 fix): 396/396 tests, lint and build passed on 28/11, AT-01/AT-02 and AT-EX02 UI checks confirmed by RES-01 (A-87 condition A) |
| Submission SHA | ___ (RES-01 fills in after the last merge on 28/11) |
| Visibility | Check that the lecturer can open the URL without being added as a collaborator, or add the lecturer. Test from a browser that is not logged in |

`main` has moved since `ac57507` (#25, #30, docs only). PR #35 (D-04, changes `src/app/staff/exit/ExitForm.tsx`) is still open. If #35 or any other code PR merges, the submission SHA is a different commit from the one the dry run tested. Before upload, either rerun `npm test`, `npm run lint` and `npm run build` on the submission SHA or state in the report which SHA was tested.

Repository history is assessed (assignment p.6, Individual Accountability), so the link points at the full repository, not an export of one commit.

## 3. Run and demo instructions

| Item | Where | Status |
|---|---|---|
| P13 install and demo guide v1.0 (A-33, RES-03) | [`docs/P13-huong-dan-cai-dat-va-demo.md`](../../P13-huong-dan-cai-dat-va-demo.md) | On `main` (#12 merged 28/11) |
| README: setup commands, demo accounts, pages, API table | [`README.md`](../../../README.md) | On `main` |
| Manual E2E test guide | [`docs/manual-e2e-test-guide.md`](../../manual-e2e-test-guide.md) | On `main` |
| Demo run of show and viva plan (F5-02) | [`demo-script-and-viva.md`](demo-script-and-viva.md) | On `main` |

P13 acceptance criterion (PD-P13): someone who did not write it can run the demo from the guide alone. The A-88 internal demo on 26/11 (RES-05) and the A-87 dry run (RES-02) ran the system, but neither records that it followed P13 step by step. Before upload, one member who is not RES-03 runs sections 1–3 of P13 on a clean clone of the submission SHA and adds the result to the check row below.

| Check | By | Date | Result |
|---|---|---|---|
| Clean clone, P13 §1–3, login page opens, demo accounts work | ___ | ___ | ___ |

## 4. Baselines

### V1.0 (kept unchanged)

| Item | Where |
|---|---|
| Freeze record (commit, blob list, check commands) | [`docs/m3/baseline-v1.0-freeze.md`](../../m3/baseline-v1.0-freeze.md) |
| Frozen commit | `061120c9ab26acdb9c88b365bfd2f7800ef6ef09` (09/11/2026) |
| Plan source | `docs/m2-report/data/plan.mjs`; archived copy `docs/m2-report/data/archive/plan-v1.0.mjs` |
| Generated tables | `docs/m2-report/generated/` (19 files) |
| M2 report as submitted | `docs/m2-report/CO3011_M2_Report_v1.0.docx` |

### V2.0 (revised)

| Item | Where |
|---|---|
| V2.0 record (reason CR-01..CR-03, method, figures) | [`docs/m3/baseline-v2.0.md`](../../m3/baseline-v2.0.md) |
| Plan source and generated tables | `docs/m2-report/data/plan-v2.0.mjs`, `docs/m2-report/generated-v2/` (regenerated, #29 merged 28/11) |
| Regenerate command | `node docs/m2-report/scripts/schedule-v2.mjs` |
| Approval (F1-03) | `docs/final/res01/baseline-v2-approval.md` (pending #39): RES-01 endorsed V2.0 on 27/11; recovery schedule approval pending |
| Products changed in V2.0 | `docs/m2-report/v2.0/products/` (SRS v2.1, P18 v1.1) |

Comparison command for the lecturer (works once B2 is fixed):

```bash
git diff --diff-filter=MD --stat baseline-v1.0 -- docs/m2-report
```

On 27/11 this lists one file, `products/CO3011_M2_KienTrucAPI_v0.1.md` (P18), also on the branch of #29. This is the known deviation in `baseline-v1.0-freeze.md`. Either F3-02 restores the file (division, F3-02) or the report states it as a known deviation with the recovery command `git show baseline-v1.0:docs/m2-report/products/CO3011_M2_KienTrucAPI_v0.1.md`.

## 5. Logs index

| Log | Where | Status |
|---|---|---|
| Client Interaction Log, rounds 1–2 (Q01–Q26) | M1 report Appendix A (`resources/[Milestone 1] CO3011_M1_Report_v0.3.docx`); workbook sheet **Client Interaction Log** | On `main` |
| Client Interaction Log, round 3 | [`resources/client-round3-questions.md`](../../../resources/client-round3-questions.md) | On `main` |
| Client Interaction Log, phase 5 (Q36–Q46, reply of 23/11) | `docs/m3/client-interaction-log-phase-5.md` | pending #39 (also in #19) |
| Weekly project log W12–W13 (draft, hours assumed) | [`docs/m3/weekly-log-draft.md`](../../m3/weekly-log-draft.md) | On `main`. Superseded by the final log |
| Weekly project log W12–W14 (final, F1-01) | `docs/final/res01/weekly-log-final.md` | pending #39 |
| Workbook: Weekly Project Log, Task Log, Planned vs Actual, Risk Register, Change Log, Quality Evidence, AI Usage Log | `resources/CO3011_Project_Tracking_Workbook (1).xlsx` | Rows pasted by RES-03 on 28/11 (F3-05) |
| Actuals (A-101, A-103) | [`docs/m3/actuals.md`](../../m3/actuals.md) | On `main` (#12 merged 28/11) |
| Planned vs actual draft (A-90) | [`docs/m3/a-90-planned-vs-actual.md`](../../m3/a-90-planned-vs-actual.md) | On `main`. Final comparison F3-04 not created yet |
| Change-impact analysis and decision record (Task 3.6) | [`docs/m3/change-impact-analysis.md`](../../m3/change-impact-analysis.md), [`docs/m3/decision-record.md`](../../m3/decision-record.md) | On `main` |
| Workshop and M-03 decision (F1-02) | `docs/final/res01/m03-decision-and-workshop.md` | pending #39 |
| Risk register | [`docs/m3/risk-register.md`](../../m3/risk-register.md); final review `docs/final/res03/risk-register-final.md` | On `main` (#29 merged 28/11) |
| Checkpoint gate log CP-01..CP-07 (F2-03) | [`docs/final/res02/checkpoint-log.md`](../res02/checkpoint-log.md) | On `main` (#35 merged 28/11) |
| PR contribution ledger | `docs/m3/pr-contribution-ledger.md` | pending #39 |
| Commit and PR history | https://github.com/nvdson2005/Parking-Management-System/commits/main, `/pulls?q=is%3Apr` | Live |

## 6. Diagrams, estimates, traceability

| Item | Where | Status |
|---|---|---|
| PBS, PFD, activity network, Gantt, critical path, risk matrix, ERD (PNG and `.drawio`) | `docs/m2-report/diagrams/` | On `main`. Check each PNG is legible at the size used in the PDF |
| Estimates, schedule, CPM, allocation, risks (V1.0 / V2.0) | `docs/m2-report/generated/`, `docs/m2-report/generated-v2/` | On `main` |
| Traceability matrix P24 (F4-03) | [`docs/final/res04/traceability-matrix.md`](../res04/traceability-matrix.md) | On `main` (#37 merged 28/11) |
| Quality evidence | `docs/m3/quality-evidence-*.md`, `docs/m3/a-68-cp05-test.md`, `docs/m3/a-31-auth-test.md`, `docs/final/res04/a49-retest.md`, `docs/final/res02/` | On `main` |
| Individual reflections (A-114) | RES-01 `docs/m3/a-114-reflection-draft.md`; RES-02 `docs/final/res02/a114-reflection.md`; RES-03 `docs/m3/a-114-reflection-draft-res03.md`; RES-04 [`docs/final/res04/a114-reflection.md`](../res04/a114-reflection.md); RES-05 `docs/final/res05/a114-reflection.md` | RES-04 on `main`; RES-02 on `main` (#35, still marked draft by its author); RES-03 on `main` (#12); RES-05 on `main` (#34); RES-01 update pending #39 |

## 7. Blockers before upload

| # | Blocker | Owner | Needed by |
|---|---|---|---|
| B1 | Choose the submission SHA after the last merge and rerun test, lint and build on it (section 2) | RES-01 | 28/11 |
| B2 | Tag `baseline-v1.0` exists only on RES-03's machine (`git ls-remote --tags origin` is empty on 27/11). Push it: `git tag -a baseline-v1.0 061120c9ab26 -m "Project Baseline V1.0"` then `git push origin baseline-v1.0`. Without it the check commands in `baseline-v1.0-freeze.md` and section 4 fail on the lecturer's clone | RES-03, agreed by RES-01 | 28/11 |
| B3 | Baseline V2.0 endorsed by RES-01 on 27/11 (pending #39). Recovery schedule still to be approved after RES-03 reconciles remaining work | RES-03, then RES-01 | 28/11 |
| B4 | ~~Merge #12~~ Done: #12 merged 28/11 (P13, actuals, A-89, A-112, RES-03 reflection) | RES-01 | Closed |
| B5 | Merge #39 (final weekly log, phase 5 client log, M-03 decision, V2.0 approval). #29, #34, #37 merged 28/11 | RES-01 | 28/11 |
| B6 | ~~RES-02 file names and PR choice~~ Done: #35 merged 28/11 with the files renamed (`a114-reflection.md`, `checkpoint-log.md`, `objectives-o3-o5.md`). #31 and #32 carry the same F2-04 commit and should be closed without merging | RES-02 | Closed (close #31, #32) |
| B7 | P13 clean-clone check by a non-author (section 3) | Any member except RES-03 | 28/11 |
| B8 | Final report PDF written and AI declaration included (S1, S7) | Final phase (A-92) | 29/11 |
| B9 | Confirm LMS instructions: file format, naming, whether logs are uploaded or linked | RES-01 | 28/11 |

## 8. Upload steps (RES-01)

1. Confirm the final report PDF includes the AI declaration, the repository and P13 guide are accessible, the V1.0 and approved revised baseline references resolve, the required logs are included or linked, and the evidence is readable. Resolve any gap affecting a course or LMS requirement before uploading. Record any remaining internal exceptions in the report with RES-01’s approval.
2. Record the pinned, verified source SHA in the final report and LMS submission details.
3. Upload the final report PDF to the LMS. In the report and the LMS text, give the repository URL, the submission SHA and the path of P13.
4. If the LMS asks for files instead of links, attach the workbook `.xlsx` and the M1 report (Client Interaction Log) as they are on the submission SHA.
5. Open the repository URL from a logged-out browser and check that it loads.
6. Record the submitted PDF version, upload time and LMS receipt in `docs/m3/a-90-planned-vs-actual.md`, then tick the SUB row in section 5 of `docs/m3-m4-final-work-division.md`.
