# M3 Change-Event Response Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Produce the Task 3.6 change-impact analysis, the decision record, the revised W13–W14 plan and the Baseline V2.0 hand-off for the deadline change (M-05 07/12 → 29/11).

**Architecture:** Four markdown documents under `docs/m3/` plus one appended section in `docs/m3-m4-work-division.md`. All numbers come from the design doc and `docs/m2-report/generated/*`. Nothing under `docs/m2-report/` is edited.

**Tech Stack:** Markdown only. Verification by `grep` and `git diff`.

**Spec:** `docs/superpowers/specs/2026-11-19-m3-change-event-response-design.md`

## Global Constraints

- Capacity 190 h → 140 h (W12 40 + W13 50 + W14 50). Planned 139.6 h (99.7%); with M3/M4 additions 172.1 h (123%).
- Chosen option C saves about 17 h; residual about 15 h; cover: Q22 tripwire (about 4 h more) plus 2 h per person in W14 (10 h). Total about 31 h against 32 h needed. State the near-zero float.
- Tripwire: at M-03 on 24/11, more than 2 days behind or short by more than 2 h/week fires Q22 (reports → payment → reservations). Owner RES-01.
- Fixed dates: M-03 24/11, A-88 demo 27/11, A-92 finishes by 28/11, submission 29/11.
- Never edit V1.0 outputs under `docs/m2-report/`. V2.0 is a new set by RES-03, approved by RES-01.
- Unknowns are `TODO(owner)`. No invented actuals.
- Documents in English, matching `docs/m3-m4-work-division.md`.

## Review Focus

- The two events are different in size: the deadline change is the CR-01 analysis; round-3 clarifications (CR-02) are already built and get a short entry only. Test: Task 1 check that CR-02 section is under 15 lines.
- Totals must agree across all four documents (172.1, 140, 123%, 17, 15, 31/32). Test: Task 5 grep.
- Critical path now ends before 29/11. Test: Task 3 asserts A-92 finish 28/11 appears.
- Anything needing the team (hours to date, workshop date, approver, V2.0 date) must be a `TODO(owner)`. Test: Task 5 lists them.
- Round-3 changes are in the analysis as a scope/requirement impact, not as new effort. Test: Task 1 section present.

---

### Task 1: Change-impact analysis (A-99)

**Files:**
- Create: `docs/m3/change-impact-analysis.md`

**Interfaces:**
- Produces: section headings `## CR-01`, `## CR-02`; a table with rows `Requirements/products`, `Activities`, `Effort`, `Resources`, `Risks`, `Schedule`, `Cost`, `Quality`. Task 2 cites these.

- [ ] **Step 1: Write the file.** Header with date 2026-11-19, owner RES-01, sources. `## CR-01 Deadline moved to 29/11`: the facts from the design, then the eight-row impact table. Effort row: 139.6 → 172.1 h on 140 h. Cost row: hours × 50,000 VND (the baseline's conversion rate), 172.1 h = 8,605,000 VND vs 6,980,000 baseline total, flagged as converted, not cash. Risks row: R-G4-02 raised from 30% likelihood to near-certain; R-G2-02 and R-G4-01 affected by the compressed critical path; add new risk R-G5-01 "deadline compression leaves no float" with owner RES-01.
- [ ] **Step 2: Write `## CR-02 Round-3 clarifications`** (under 15 lines): the four changes from `changelog/round3-assumptions-vs-implementation.md`, all already built on `refactor/round3-lecturer-alignment`, impact on tests and the requirement list, no schedule effect.
- [ ] **Step 3: Verify.** Run `grep -c "^| " docs/m3/change-impact-analysis.md` and confirm the eight dimension rows exist with `grep -E "Requirements/products|Quality" docs/m3/change-impact-analysis.md`. Expected: both rows found.
- [ ] **Step 4: Commit** `docs(m3): change-impact analysis for deadline change (A-99)`.

### Task 2: Decision record (A-105, CR-01, CR-02)

**Files:**
- Create: `docs/m3/decision-record.md`

**Interfaces:**
- Consumes: Task 1 headings.
- Produces: heading `## Change Log rows` with one line per CR as pipe-separated text matching the workbook's Change Log columns (`CR ID | Date raised | Raised by | Description | Affected products/activities | Effort impact (h) | Schedule impact (days) | Cost impact | Scope impact | Risk impact | Options considered | Decision | Justification | Approved by | Date approved | New baseline required?`).

- [ ] **Step 1: Write the file:** options A, B, C table from the design with the verdict and why; decision C; the cuts table with hours (total about 17); the residual cover; the tripwire definition and owner; consequences for objectives O1–O5 (O3 and O4 evidence for Should modules reduced to automated tests plus one acceptance pass).
- [ ] **Step 2: Add `## Change Log rows`** with CR-01 (effort +32.5 h demand, schedule −8 days of calendar, scope: none, new baseline: Yes V2.0 minimal) and CR-02 (effort 0 additional, scope: clarified, new baseline: No, folded into V2.0 change list). Approved by and date are `TODO(RES-01)` / `TODO(team lead)`.
- [ ] **Step 3: Add `## Workshop`** with agenda for the one-hour A-105 session and `TODO(RES-01): workshop date and attendance`.
- [ ] **Step 4: Verify.** `grep -c "TODO(" docs/m3/decision-record.md` is at least 3; `grep -E "A.*B.*C" docs/m3/decision-record.md` finds the options table.
- [ ] **Step 5: Commit** `docs(m3): decision record, option C with Q22 tripwire (A-105)`.

### Task 3: Revised W13–W14 plan

**Files:**
- Modify: `docs/m3-m4-work-division.md` (append `## 7. Revised plan after the deadline change (19/11)`; do not edit sections 1–6)

**Interfaces:**
- Consumes: the cuts table from Task 2.

- [ ] **Step 1: Append the section** with: new calendar (W13 to 22/11, W14 to 29/11, M-05 29/11); a per-member table for W13 remainder and W14 with the cuts applied (RES-01: A-99/A-105, A-90, A-88, A-91 as 30-minute retro; RES-02: merged A-95+A-87 run, Should/Could verification trim; RES-03: A-90 data, A-92 finish by 28/11, minimal V2.0, A-112 as section; RES-04: A-110 and A-113 as sections, A-116 package assembled in parallel; RES-05: A-108 folded into A-92, A-115 demo script only); +2 h per person in W14 marked as accepted risk; the tripwire row for 24/11; A-92 review day 28/11.
- [ ] **Step 2: Verify.** `grep -n "28/11" docs/m3-m4-work-division.md` shows A-92 finish; `git diff --stat docs/m3-m4-work-division.md` shows additions only (no deletions).
- [ ] **Step 3: Commit** `docs(m3): revised W13-W14 plan after deadline change (A-99)`.

### Task 4: Baseline V2.0 hand-off for RES-03

**Files:**
- Create: `docs/m3/baseline-v2-handoff.md`

- [ ] **Step 1: Write the file** listing what V2.0 changes (end date 29/11, capacity 140 h, activity list with the cuts, risk R-G5-01, change log CR-01 and CR-02) and what stays (scope, products, objectives). State the process: RES-03 regenerates `docs/m2-report/data/plan.mjs` into a new V2.0 set and archives V1.0 in `docs/m2-report/data/archive/`; RES-01 approves. Date to regenerate: `TODO(RES-03)`; V2.0 is minimal: A-106 drops from 3 h to 1.5 h total (RES-03 1 h regenerating, RES-01 0.5 h approving).
- [ ] **Step 2: Verify.** `git status docs/m2-report` shows no changes.
- [ ] **Step 3: Commit** `docs(m3): Baseline V2.0 hand-off note (A-106)`.

### Task 5: Consistency check and finish

**Files:**
- Modify: whichever of the four documents disagrees

- [ ] **Step 1: Run** `grep -nE "172\.1|140 h|123%|about 17|about 15|31 h" docs/m3/*.md docs/m3-m4-work-division.md`. Expected: every figure present is one of the Global Constraints values, no variants.
- [ ] **Step 2: Run** `grep -rn "TODO(" docs/m3/` and list each in the final report to the user as items needing the team.
- [ ] **Step 3: Run** `codegraph sync` and `git status`. Expected: clean tree after commits.
- [ ] **Step 4: Commit** any fixes `docs(m3): align figures across change-event documents (A-99, A-105)`.
