# Implementation Plan: M3 KB Fixes (A-22, A-63, A-74)

**Branch**: `feat/m3-kb-fixes-and-docs` | **Date**: 2026-11-18 | **Spec**: [spec.md](spec.md)

## Summary

Three small code fixes in the exit and entry services (KB-04 plate comparison, KB-05 lost-card lookup method, KB-13 tests and contract), decision records for the remaining KB rows in P18 section 10, and an A-74 payment review locked in by regression tests. KB-02 and KB-03 are accepted as-is and only get tests plus documentation.

## Technical Context

**Language/Version**: TypeScript, Next.js 15 App Router, React 19
**Primary Dependencies**: Prisma 6, Zod, jose, vitest
**Storage**: SQLite (`prisma/test.db` for tests)
**Testing**: vitest, serial files, services tested directly against the test DB
**Project Type**: web application (single repo)
**Constraints**: constitution principles I-V; no schema change; i18n key parity; `withLock` non-reentrant
**Scale/Scope**: 2 services, 1 route, 1 UI form, 1 doc, 3 test files

## Constitution Check

| Principle | Status |
|---|---|
| I Layered architecture | Pass. Logic stays in `exit.ts`; route only forwards `method`. No new error code: reuses `VALIDATION`. |
| II Concurrency safety | Pass. No new lock use; method check runs before the existing `withLock` body. |
| III Edge boundaries | Pass. Middleware untouched. |
| IV Test-backed changes | Pass. Each fix has a failing-first test. |
| V Traceable delivery | Pass. Commits carry A-ID and KB-ID. P18 edited as working product, V1.0 generated files untouched. |

Post-design re-check: pass, no violations.

## Project Structure

```text
specs/001-m3-kb-fixes/{spec,plan,research,data-model,quickstart,tasks}.md, contracts/
src/lib/plate.ts                      # export plateCompareKey (moved from vehicles.ts)
src/server/services/vehicles.ts       # import plateCompareKey
src/server/services/exit.ts           # KB-04, KB-05
src/server/services/lots.ts           # KB-18 comment only
src/app/api/events/exit/confirm/route.ts   # forward method
src/app/staff/exit/ExitForm.tsx       # send effectiveMethod on confirm
tests/exit.test.ts, tests/entry.test.ts, tests/plate.test.ts
docs/m2-report/products/CO3011_M2_KienTrucAPI_v0.1.md   # P18 v1.0 decisions
```

**Structure Decision**: existing layout; no new directories under `src/`.

## Complexity Tracking

No violations.
