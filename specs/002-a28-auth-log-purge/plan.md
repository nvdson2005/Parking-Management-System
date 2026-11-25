# Implementation Plan: A-28 Auth and Access-Log Fixes, Automatic Data Purge

**Branch**: `fix/a28-auth-log-purge` | **Date**: 2026-11-23 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `specs/002-a28-auth-log-purge/spec.md`

## Summary

Three small fixes owned by RES-03 under A-28:

1. **G-05 / Q35, automatic purge.** `purgeOldData` accepts a `null` actor for system runs. A new `registerPurgeSchedule()` (in `src/server/purgeSchedule.ts`) runs the purge once shortly after start and then every 24 h. It uses a `globalThis` guard like the existing reservation-expiry timer, and `src/instrumentation.ts` calls it.
2. **KB-07, LOGIN on registration.** `registerCustomer` writes one LOGIN access-log row after the user is created. The service is called only by the register route, which signs the user in.
3. **KB-14, malformed bodies.** Four routes switch from `req.json()` to `readJsonObject()`.

## Technical Context

**Language/Version**: TypeScript 5 on Node.js (Next.js 15 App Router, React 19)

**Primary Dependencies**: Prisma 6, Zod, jose; vitest for tests

**Storage**: SQLite through Prisma (`prisma/dev.db`; tests use `prisma/test.db`)

**Testing**: vitest, run serially against the test DB (`tests/helpers/db.ts`); route handlers are called directly as in `tests/contract-inout.test.ts`

**Target Platform**: single long-running Node.js server process (pilot deployment, D-16)

**Project Type**: web application, single Next.js project (`src/app`, `src/server`)

**Performance Goals**: no new targets. The purge is one transaction once a day over pilot-scale data (330 spots, 60 days of simulated history).

**Constraints**: the middleware runs on Edge and must not import Prisma, so the timer lives only in the Node.js instrumentation hook. The timer must survive HMR without duplicating, and must never crash the server.

**Scale/Scope**: 4 route files, 2 services, 1 new module, `instrumentation.ts`; about 6 new tests.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Check | Result |
|---|---|---|
| I. Layered architecture | Routes stay thin and now use `readJsonObject()` (KB-14 brings 4 routes into line). Logic stays in services (`registerCustomer`, `purgeOldData`). No new error codes | Pass |
| II. Concurrency safety | The purge runs its own transaction and takes no `withLock`. It is not called from inside a lock, so there is no re-entrancy. Timer state uses a `globalThis` singleton | Pass |
| III. Edge and access boundaries | No middleware change. The scheduler module is imported only from `instrumentation.ts` under `NEXT_RUNTIME === 'nodejs'`. The Manager purge route keeps `requireRole('MANAGER')`. A system log row has no user and no plate in its target | Pass |
| IV. Test-backed changes | Each fix gets a test that fails before the change (see quickstart). Full suite, lint and build run before close. No new i18n keys | Pass |
| V. Traceable delivery | Commits reference A-28 with KB-07, KB-14, G-05. No V1.0 file is edited | Pass |
| Delivery workflow rule 4 (no code fix before CP-02 recorded) | CP-02 decisions exist in P18 v1.0 (19/11); the minutes are not yet recorded | **Deviation, justified below** |

Post-design re-check (after Phase 1): unchanged. The design adds no lock, no Edge import and no schema change.

## Project Structure

### Documentation (this feature)

```text
specs/002-a28-auth-log-purge/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── auth-lang-vehicles-purge.md
└── tasks.md             # created by /speckit-tasks
```

### Source Code (repository root)

```text
src/
├── instrumentation.ts                 # calls registerPurgeSchedule()
├── server/
│   ├── purgeSchedule.ts               # NEW: daily + start-up purge timer, globalThis guard
│   └── services/
│       ├── auth.ts                    # registerCustomer logs LOGIN (KB-07)
│       └── purge.ts                   # actorId: string | null (G-05)
└── app/api/
    ├── auth/login/route.ts            # readJsonObject (KB-14)
    ├── auth/register/route.ts         # readJsonObject (KB-14)
    ├── lang/route.ts                  # readJsonObject (KB-14)
    └── vehicles/route.ts              # POST uses readJsonObject (KB-14)

tests/
├── auth.test.ts                       # + KB-07 cases
├── purge.test.ts                      # + system-actor case
├── purge-schedule.test.ts             # NEW: timer registration, guard, error handling
└── malformed-body.test.ts             # NEW: 4 routes × malformed bodies (KB-14)
```

**Structure Decision**: single Next.js project. The scheduler goes into its own module under `src/server/` so it can be unit-tested with fake timers without loading Next.js. `instrumentation.ts` stays a thin hook.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| Starting A-28 before the CP-02 minutes are recorded (delivery workflow rule 4) | The submission deadline moved to 29/11 (CR-01). A-28 must be merged before the dry run A-87 on 26/11. The purpose of CP-02 (a decision for each KB item, frozen entry/exit contract) is already met in P18 v1.0 §10. A-44, A-63, A-74 and A-79 were done the same way. Recorded as ISS-M3-01 in the risk register | Waiting for the minutes would push A-28 past A-87 and leave Q35 (a client requirement) unmet at the demo (R-M3-07). The work is reviewed through the PR, and RES-03 records the CP-02 minutes in parallel |
