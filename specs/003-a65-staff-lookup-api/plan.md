# Implementation Plan: A-65 Staff Lookup, Read APIs and Indexes

**Branch**: `fix/res03-a28-a65` | **Date**: 2026-11-23 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `specs/003-a65-staff-lookup-api/spec.md`

## Summary

1. **G-08 / Q34, staff lookup.**
   - New service `staffLookup(db, { method, identifier, viewerId })` in `src/server/services/lookup.ts`. It reuses `findVehicleByIdentifier` and expires stale holds, then returns the vehicle, its open session and its active reservation. It logs VIEW_FULL_PLATE.
   - New `listActiveReservations(db, { zoneId? })` in `reservations.ts`.
   - Two routes under `/api/staff/`, plus a server page `/staff/lookup` linked from the staff menu.
2. **KB-15, read endpoints.**
   - `GET /api/access-logs` (Manager) wraps `listAccessLogs`.
   - `GET /api/sessions` (Staff/Manager) uses a new `listSessions` service; the staff sessions page is refactored to use it (it queries Prisma directly today).
   - `GET /api/payments`: Manager gets `allPayments`, Customer gets `customerHistory`.
3. **G-07, indexes.** Four `@@index` lines in `schema.prisma` and a new migration with the matching `CREATE INDEX` statements.

## Technical Context

**Language/Version**: TypeScript 5, Next.js 15 App Router, React 19

**Primary Dependencies**: Prisma 6, Zod, jose; vitest

**Storage**: SQLite via Prisma; new migration `prisma/migrations/20261123100000_a65_indexes`

**Testing**: vitest against `prisma/test.db`. Services are tested directly; routes are called directly with `getCurrentUser` mocked (pattern from `tests/contract-inout.test.ts`).

**Target Platform**: single Node.js server (pilot)

**Project Type**: single Next.js web project

**Performance Goals**: none new. The lookup is one indexed vehicle query plus two small queries.

**Constraints**:
- Plate privacy (constitution III): use `presentPlate` and log VIEW_FULL_PLATE on lookup.
- i18n parity (constitution IV): add every new key in both `en.ts` and `vi.ts`.
- No `withLock` is needed, because all of these are reads. `expireReservations` is a plain update and is safe outside the lock (the timer already calls it that way).

**Scale/Scope**: 3 services touched or added, 5 new routes, 1 new page, a nav entry, i18n keys, 1 migration, about 5 new test groups.

## Constitution Check

| Principle | Check | Result |
|---|---|---|
| I. Layered architecture | Routes only call `requireRole`, read query strings and delegate. Validation (Zod) lives in the services. The staff sessions page moves from direct Prisma to the `listSessions` service. No new error codes (`NOT_FOUND`, `VALIDATION`, `FORBIDDEN` exist) | Pass |
| II. Concurrency safety | Read-only; no lock taken, none nested | Pass |
| III. Edge and access boundaries | No middleware change. Roles: lookup and active list are STAFF and MANAGER; access log is MANAGER; payments are MANAGER (all) or CUSTOMER (own); sessions are STAFF and MANAGER. Plates go through `presentPlate`; the lookup logs VIEW_FULL_PLATE | Pass |
| IV. Test-backed changes | Each service and route gets tests written first. Nav test updated. i18n parity test covers the new keys | Pass |
| V. Traceable delivery | Commits reference A-65 with G-08, KB-15, G-07. No V1.0 file edited | Pass |
| Delivery workflow rule 4 | Same deviation as A-28 (CP-02 minutes pending) | **Deviation, justified below** |

Post-design re-check: unchanged.

## Project Structure

### Documentation (this feature)

```text
specs/003-a65-staff-lookup-api/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/read-apis.md     # also the P18 addendum sent to RES-01
└── tasks.md
```

### Source Code (repository root)

```text
prisma/
├── schema.prisma                                   # 4 @@index (G-07)
└── migrations/20261123100000_a65_indexes/migration.sql
src/
├── lib/nav.ts                                      # STAFF link /staff/lookup
├── i18n/en.ts, vi.ts                               # lookup.* keys
├── server/services/
│   ├── lookup.ts                                   # NEW staffLookup
│   ├── sessions.ts                                 # NEW listSessions
│   └── reservations.ts                             # + listActiveReservations
└── app/
    ├── api/staff/lookup/route.ts                   # NEW GET
    ├── api/staff/reservations/route.ts             # NEW GET
    ├── api/access-logs/route.ts                    # NEW GET
    ├── api/sessions/route.ts                       # NEW GET
    ├── api/payments/route.ts                       # NEW GET
    └── staff/
        ├── lookup/page.tsx                         # NEW page
        └── sessions/page.tsx                       # uses listSessions
tests/
├── lookup.test.ts                                  # NEW service tests (G-08)
├── read-apis.test.ts                               # NEW route role and filter tests (KB-15, G-08)
├── indexes.test.ts                                 # NEW index existence (G-07)
└── nav.test.ts                                     # updated STAFF links
```

**Structure Decision**: single Next.js project. The new services follow the existing one-file-per-domain layout. Staff routes go under `/api/staff/` so their role scope is clear from the path.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| Code before CP-02 minutes (delivery workflow rule 4) | Q34 is a client requirement that must work at the 27/11 demo, and A-65 must merge before A-87 on 26/11 (CR-01). The CP-02 decisions already exist in P18 v1.0. Recorded as ISS-M3-01 | Waiting would miss A-87 and leave Q34 unmet (R-M3-07, High) |
