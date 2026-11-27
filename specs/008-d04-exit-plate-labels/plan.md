# Implementation Plan: Show both plates in the exit preview (A-68 D-04)

**Branch**: `fix/d04-exit-plate-labels` | **Date**: 2026-11-26 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `specs/008-d04-exit-plate-labels/spec.md`

## Summary

The exit preview shows the session's entry plate under the label of the observed plate and never shows the plate Staff typed (A-68 D-04, S2). The fix is display-only: move the preview details out of `ExitForm` into an exported presentational component, label the entry plate "Biển số lúc vào" / "Plate at entry", add a row with the typed plate under "Biển số quan sát" / "Observed plate", and mark the observed plate when `plateMismatch` is true. No API, service or schema change. A render test that fails on the current code comes first.

## Technical Context

**Language/Version**: TypeScript 5, Node 20

**Primary Dependencies**: Next.js 15 App Router, React 19, Tailwind 4, shadcn components

**Storage**: none touched (SQLite via Prisma 6, no schema change)

**Testing**: vitest; the component test renders to static HTML with `react-dom/server` inside `I18nProvider`, the pattern of `tests/early-arrival-prompt.test.ts` and `tests/reservation-form.test.ts`

**Target Platform**: browsers Chrome, Edge, Firefox; single-process Node server

**Project Type**: full-stack web application (Next.js)

**Performance Goals**: no change

**Constraints**: i18n key parity between vi and en (`tests/i18n.test.ts`); clearing the preview on an input change is not enough on its own, so the form state lives in `createExitFormModel`, which drops stale answers and keeps the sent plate with the preview (FR-006)

**Scale/Scope**: planned 3 source files and 1 test file (about 1 h). After four review rounds: 5 source files (`ExitForm.tsx`, `vi.ts`, `en.ts`, `lib/requestGuard.ts`, `lib/exitFormModel.ts`) and 3 test files; see Complexity Tracking

## Constitution Check

| Principle | Check | Result |
|---|---|---|
| I. Layered architecture | No route or service change. The component only formats data the preview API already returns plus the form's own input. No business rule moves into the UI: the mismatch decision stays in `previewExit` (`plateMismatch`). | Pass |
| II. Concurrency safety | No mutation, no lock. | Pass |
| III. Edge and access boundaries | Middleware untouched. The entry plate belongs to an OPEN session, which Staff may see in full (`canViewFullPlate`); this is the same value the screen shows today. The observed plate is what Staff typed. | Pass |
| IV. Test-backed changes | A render test fails on the current code (the entry plate under the observed-plate label; the typed plate missing). The new key `exit.entryPlate` goes into both `vi.ts` and `en.ts`. `npm test`, `npm run lint` and `npm run build` run before closing. | Pass |
| V. Traceable delivery | Commits reference A-68 and D-04 (ISS-11). Nothing under the Baseline V1.0 outputs in `docs/m2-report/` is edited. Main checkout. | Pass |
| VI. Shared service layer for entry/exit | `previewExit` and `confirmExit` are unchanged, so the route and the simulator keep the same behaviour. No caller-only rule is added. | Pass |

Delivery workflow: the design is recorded in `docs/superpowers/specs/2026-11-26-a68-d04-exit-plate-labels-design.md` (option C, agreed by RES-04 on 26/11). The full Spec Kit chain runs in order: specify, clarify (no questions), plan, tasks, analyze, implement. CodeGraph is indexed and synced on this branch.

Post-design re-check: still Pass. The only interface that changes is the screen (see [contracts/exit-preview-view.md](contracts/exit-preview-view.md)).

## Project Structure

### Documentation (this feature)

```text
specs/008-d04-exit-plate-labels/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── exit-preview-view.md
├── checklists/requirements.md
└── tasks.md
```

### Source Code (repository root)

```text
src/
├── app/staff/exit/ExitForm.tsx   # export ExitPreviewDetails; ExitForm renders it; discards late responses
├── lib/requestGuard.ts           # createRequestGuard (FR-006)
├── lib/exitFormModel.ts          # exit form state: inputs, previews, loading, confirm (FR-006)
└── i18n/
    ├── vi.ts                     # exit.entryPlate
    └── en.ts                     # exit.entryPlate
tests/
├── exit-preview-details.test.ts  # new render test
├── request-guard.test.ts         # late-response guard (FR-006)
└── exit-form-model.test.ts       # form-level: edit during a pending request, overlap, confirm plate (FR-006)
docs/final/res04/
└── d04-retest.md                 # manual AT-EX02 retest record (T007)
```

**Structure Decision**: keep the component in `ExitForm.tsx`, exported next to `ExitForm`, as `EarlyArrivalPrompt` is exported from `EntryForm.tsx`. A separate file is not needed for one small component.

## Complexity Tracking

No constitution deviation. One process deviation:

| Deviation | Why | Simpler option rejected because |
|---|---|---|
| Handwritten source change is about 375 lines (insertions + deletions in `src/`), over the default 300 of `review-implementation` | The reviews of `12dae51`, `ca6867b`, `e18e574` and `bc1b602` required the late-response handling, the loading-state fix and form-level tests. The form state had to move out of `ExitForm` into `src/lib/exitFormModel.ts` to be testable, because the repo has no DOM test environment and installing jsdom was not permitted in this session | Keeping the state in `ExitForm` leaves the fixes untested (rejected by the reviews); splitting the PR would leave `main` with a known race before the demo |
