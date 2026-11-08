# Plan: Milestone 2 Report (Planning Baseline V1.0)

- Created: 2026-11-08
- Owner: PM (Nguyễn Võ Đức Sơn)
- Inputs: `resources/[Milestone 2] Drafts.docx`, `resources/[Milestone 2] CO3011_Milestone_2_Planning_Baseline_Template.docx`, `resources/[Milestone 1] CO3011_M1_Report_v0.3.docx`, `resources/CO3011_Project_Tracking_Workbook (1).xlsx` (Client Interaction Log, Estimates V1 assumptions), `resources/CO3011_Assignment_2026.pdf` (Task 2)
- Outputs:
  - `docs/m2-report/CO3011_M2_Report_v0.1.md`: full report draft (Vietnamese, same style as M1)
  - `docs/m2-report/diagrams/*.drawio` and exported `*.png`
  - `docs/m2-report/data/plan.json`: single source of truth for products, activities, estimates, risks, resources and checkpoints
  - `docs/m2-report/CO3011_M2_Report_v1.0.docx`: produced only after the user approves

## Decisions already made (from the user)

| Topic | Decision |
|---|---|
| Existing MVP code in the repo | Ignore it. The baseline is written as a plan made before execution. The stack is still chosen in A-20. |
| Member availability (2.10) | 8 h/week for every member (Nguyễn Võ Đức Sơn raised from 6 to 8). Whole team unavailable in the week of 12/10 (W8). Capacity = 11 working weeks × 40 h = 440 person-hours for the whole project. |
| Dates (2.11) | Project runs 14/09/2026 to 07/12/2026 (W4 = week of 14/09, W15 = week of 30/11). Baseline V1.0 starts at the **M2 LMS deadline** (date still to come from the user). Work before that date is recorded as actual M1/M2 planning effort, not as planned work. |
| Baseline window | M2 deadline 09/11 = Baseline V1.0 start. Planned work W12–W15 (09/11–04/12), final submission 07/12. Capacity: W12 5×8 h, W13–W15 5×12 h (option A, raised from 10 h after the time-phased schedule showed a 1.6-day overrun at 10 h) = 220 h. The levelled schedule ends 03/12 with about 1.8 days of float and 86% load. Scope: Must items only; P06, P10, P11, P12 deferred in the Q22 order (candidates for Baseline V2.0). |
| Closing the capacity gap (2.10) | Use all three levers: (1) re-estimate leaner, (2) cut scope in the Q22 order (reports, then payment, then reservations) only as far as needed, (3) 8 h/week for everyone. Report the result as a resource-constrained re-plan, with the ideal plan kept for comparison. |
| Contingency | Option A: a risk-based rework reserve (Σ exposure of the activity risks), kept separate from base effort. No flat 15%, to avoid counting the same uncertainty twice. Labour rate is 50,000 VND/person-hour, the same as M1 section 1.3.3. |
| MVP and replan (09/11) | The MVP built on 08/11 (W11) is recorded as completed work before the baseline (report 2.0.5, real dates from git, effort TBD from Task Log). W12–W15 is replanned as verification, fixes for the P18 findings KB-01..KB-19, testing and acceptance (131.15 h + 8.45 h reserve). P06, P10, P11 are back in Baseline V1.0 scope; Q22 is only the contingency order. Hours: 8 h in W12, 10 h/week in W13–W15 (190 h, 73% load, finish 01/12). Weeks use the academic calendar (week 1 = 24/08). |
| QA role | QA (second reviewer, checkpoint pass/fail) moves to Đào Xuân Sơn. Nguyễn Võ Đức Sơn keeps PM and Tech lead. Record this as a change from M1 section 1.5 and give the reason (reviewer bottleneck). |
| Increments | Confirmed: Inc 1 = P07, P08, P04; Inc 2 = P05, P09; Inc 3 = P06, P10, P11, then acceptance. |
| Cost basis (2.11) | Notional labour rate in VND/h (proxy, stated as such); cash cost ≈ 0 per CN5 (free tools, free-tier hosting). Proposed rate: 50,000 VND/h, to be confirmed. |
| Report language and structure | Vietnamese, sections numbered 2.1–2.14 to mirror M1's 1.x numbering. Section content follows the M2 template (Tasks 2.1–2.12, traceability, checklist). |

Risk to note: repo commits dated 2026-11-08 are visible to the lecturer. The report must not claim anything that contradicts them (for example "no code exists"). It simply does not mention them.

## Phase 0: Inputs still needed from the user

1. M2 LMS deadline, which is the Baseline V1.0 start date (still open).
2. M3 deadline, if it differs from 07/12 (optional; otherwise M3 is placed by the plan).

Answered: availability, project dates, rate, reserve method, increments, QA role.

Phases 1 to 3 can run before these arrive. Values that depend on them stay as `[TBD: …]`, and every placeholder is listed in the review index (Phase 4).

## Phase 1: Canonical facts and ID reconciliation

Build `data/plan.json` and a "Quyết định chuẩn" table, then fix every draft contradiction against the Client Interaction Log (CIL) and M1.

1. Confirmed business facts (CIL rounds 1 and 2 plus M1 1.4):
   - Exceptions: **5** core exceptions (Q21, M1 O4): bãi hết chỗ, biển số không khớp, mất QR/thẻ, xe đã có lượt mở, bãi tạm ngưng. Replace the "7" (A-06, A-43, P04 notes) and the "4" (A-65); re-estimate A-06, A-43 and A-65.
   - Fee: per visit, rate configurable by vehicle type and user group (Q16, M1 1.4.1). Per-hour fees and monthly passes are out of scope (M1 1.4.2). Fix PD-P03 appendix and AS11.
   - Lot info: name, address, zones, capacity per vehicle type, active/suspended status, tariff (Q14). **Opening hours are out of scope** (M1 1.4.2). Remove them from PD-P03 ENT-03, A-60 and PD-P05 references.
   - Free spaces are counted per zone from entry/exit events (Q17). Drop ENT-14 and the "Chờ Q17" markers.
   - Reservations: hold 30 min after the booked time, auto-cancel and count as no-show, cancellable beforehand, taken from shared capacity (Q15).
   - Plate retention: 12 months, then delete (Q18).
   - Roles: Customer, Staff, Manager; admin functions are Manager-only (Q25, answered).
   - Pilot scale: 3 zones, about 300 motorbike and 30 car spaces (Q24).
   - Reports: 4 indicators, Could (Q20).
   - Approval by email, no fixed turnaround (Q19). Demos by email at the end of each increment (Q23).
   - De-scope order if time runs short: reports, then simulated payment, then reservations (Q22).
   - Round-3 questions (`resources/client-round3-questions.md`) are not sent yet, so they are not confirmed. Their topics become assumptions (AS-xx) plus open questions in "Planning inputs".
2. Update all PD statuses ("Phụ thuộc đang chờ") to match items 1 and 2.
3. IDs:
   - Products: keep P01–P24, add the root P00. Add P23 and P24 to the product register.
   - Activities, by owner range: G1 A-01..19, G2 A-20..39, G3 A-40..59, G4 A-60..79, G5 A-80..99.
   - Risks: R-G1..R-G5. Rename the P21 risks "R-G4-21..26" to R-G5-01..06.
   - Others: checkpoints CP-01..; resources RES-01..05; tests T-xx (consolidate the provisional T05–T13 and T-DB1–10).
   - Every predecessor must be an activity ID (replace "P02" with the last activity of P02, A-10).
4. Increments (proposed, to be confirmed):
   - Inc 1: platform (P07, P08) and simulator (P04).
   - Inc 2: core flow (P05, P09). This matches "CP5 = increment 2" in PD-P05.
   - Inc 3: P06, P10, P11, then acceptance.
5. Roles: PM, Tech lead and QA are all Nguyễn Võ Đức Sơn (M1 1.5). BA is Đào Xuân Sơn. Name people in full everywhere to remove the "Sơn" ambiguity. Model the PM's review load as a bottleneck (feeds R-G1-04 and 2.10).

## Phase 2: Fill the missing content, section by section

| § | Section | Work |
|---|---|---|
| 0 | Front matter | Cover table, document control, roles, AI-use declaration, abbreviations, planning inputs and assumptions (template "Baseline foundations") |
| 2.1 | PBS | Product register P00–P24 (parent, D/I, acceptance) and classification rationale. Diagram `01-pbs.drawio` |
| 2.2 | PDs | Keep the 5 PDs (P02, P03, P04, P05, P21). Remove old duplicate copies, fill PD-P05 owner (Nguyễn Võ Đức Sơn), fix the "P01" typo in PD-P04 and "Teach lead", add a "Verification / responsibility" row with CP-IDs. PD coverage table |
| 2.3 | PFD | Dependency and instance log (e.g. P05 inc 2, P14 per acceptance run). Diagram `02-pfd.drawio` (reuse the existing PlantUML logic) |
| 2.4 | Activities | Complete catalog. **New**: G1 activities for P19, P12, P24 and P15 round-3 upkeep (P15/P23 are M1 inputs); G3 activities for P09, P11, P22; G4 catalog with predecessors for A-60..A-79; P13/P01/P16 tidy-up. Network assumptions. Diagram `03-activity-network.drawio` |
| 2.5 | Checkpoints | **New** table CP-01..CP-08. Proposed: SRS review (A-09); architecture and API contract freeze (A-23, the drafts' "CP2"); Baseline V1.0 client approval (the drafts' "CP3"); DB design review (A-27); Inc 1 demo; Inc 2 demo (the drafts' "CP5"); acceptance-test review and client confirmation (A-85/A-86); acceptance demo (A-88). For each: criteria, evidence, approver, failure path. Plus decision rules |
| 2.6 | Estimates | Keep the PERT tables. Add estimates for the new activities. Method and units: 5 productive h/day, 5 days/week, 15% contingency (workbook Estimates V1). **New** effort-to-duration table. Team-wide total with the reviewer-hour double counting removed |
| 2.7 | Controllability | Split table (A-21/A-22, 24 h threshold). **New** bundles for tiny activities (e.g. A-12, A-32, A-34) with a crosswalk |
| 2.8 | Risks | One L×I scale (from the drafts). Score R-G4-01..07. **New** R-G2 risks (R5 realtime, P18 contract churn, P03 schema rework, P07 delay), R-G3 risks for P09/P11/P22, and R-G4-07 once exam weeks are known. Section 8.3: schedule and cost impact per risk |
| 2.9 | Risk responses | A-11, A-12, A-58, A-78, A-79, A-95 plus **new** A-35 realtime spike (R5) and any new G3 response. Rework reserve sized from total exposure, kept separate from base effort. Before/after reconciliation table |
| 2.10 | Resources | Capacity register RES-01..05 `[TBD from user]`, allocation by activity, conflict log (PM/Tech lead/QA overload, exam weeks, the G2 → G4 chain) |
| 2.11 | Schedule and cost | Resource-constrained schedule computed by script from `plan.json` (CPM forward/backward pass, float, then leveling by RES capacity), milestones, week-grid Gantt, critical path, cost table (labour proxy, ≈0 cash, risk-response work, contingency), totals reconciliation panel |
| 2.12 | Quality and baseline | Quality and verification plan, plan-review checklist, open-issues list, Baseline V1.0 declaration, approval table (client approval **recorded as pending**, never invented), what V1.0 fixes |
| 2.13 | Traceability | O1–O5 → REQ/P → A → RES → R → T → CP matrix plus reconciliation checks |
| 2.14 | Checklist | Task 2.1–2.12 completion table with section links |

Consistency rule: every table is generated or checked against `plan.json`. A small Node script (`docs/m2-report/scripts/check.mjs`) verifies: IDs exist, predecessors resolve, the network has no cycles, totals match, every A has an owner, estimate and dates, every R has an owner and a response, and every O reaches a test and a checkpoint.

## Phase 3: Diagrams (draw.io)

Each diagram is made with the draw.io MCP or skill as a `.drawio` file in `docs/m2-report/diagrams/`, built from `plan.json` so IDs match the tables.

| File | Section | What it shows |
|---|---|---|
| `01-pbs.drawio` | 2.1 | Product tree P00 → deliverable / intermediate / management → sub-products |
| `02-pfd.drawio` | 2.3 | Product flow, input → dependent product, with instances |
| `03-activity-network.drawio` | 2.4 | Ideal activity-on-node network with checkpoints |
| `04-gantt.drawio` | 2.11.4 | Resource-levelled Gantt by week, milestones ◆ |
| `05-critical-path.drawio` | 2.11.5 | Dated network with ES/EF/LS/LF, float, critical path highlighted |
| `06-risk-matrix.drawio` (optional) | 2.8 | L×I heat map with R-IDs placed |

Placeholder format in the markdown at each diagram spot:

```
> 📐 **SƠ ĐỒ CẦN REVIEW:** `diagrams/01-pbs.drawio` (export: `diagrams/01-pbs.png`)
> Kiểm tra: đủ P00–P24, phân loại D/I khớp bảng 2.1.2.
```

PNG export: the draw.io desktop CLI is not installed. Options: `brew install --cask drawio` and then `drawio -x -f png`, or export by hand from app.diagrams.net. Decide before Phase 5.

## Phase 4: Review loop

1. Produce `CO3011_M2_Report_v0.1.md`, starting with a **review index**: a table of every diagram file, every `[TBD]` and every decision for the user to confirm, with its section.
2. The user reviews; Claude applies feedback, re-runs `check.mjs`, and bumps v0.x.
3. Exit condition: the user confirms, the review index is empty and `check.mjs` passes.

## Phase 5: DOCX conversion (only after confirmation)

- Use the `docx` skill (docx-js; pandoc is not installed) to generate `CO3011_M2_Report_v1.0.docx`.
- Layout follows the M1 report: cover info table, document control, roles table, AI declaration, numbered Heading 1–3, bordered tables with a shaded header row, page numbers, A4.
- Font: Times New Roman throughout (13 pt body, 12 pt tables, larger headings), 1.15–1.3 line spacing.
- Embed diagram PNGs at the placeholder positions with captions ("Hình 2.x").
- Verify by converting to PDF or reading back the docx XML: fonts, headings, tables and images all present. Report any issue.

## Out of scope for this plan

- Updating the tracking workbook (could follow from `plan.json` later).
- Sending round-3 questions or the baseline email to the client (a user action).
