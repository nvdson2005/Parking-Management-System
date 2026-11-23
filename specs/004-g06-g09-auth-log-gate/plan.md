# Implementation Plan: G-06 and G-09

**Spec**: `spec.md` | **Branch**: `fix/res03-a28-a65` (added to PR #11, not yet reviewed)

## Technical Context

Next.js 15, Prisma 6, SQLite, Zod, vitest. Services take `Db` first; routes are thin. The Edge middleware must not import Prisma.

## Constitution Check

- I. Layering: logging lives in `auth.ts`, `rbac.ts` and `accessLog.ts`; routes only pass `gate`. Pass.
- II. Single-process concurrency: no new lock usage. Pass.
- III. Privacy: `LOGIN_FAILED` for an unknown email does not store the email. Pass.
- IV. Tests first: each change has a failing test first. Pass.
- V. i18n parity: new keys go into both `en.ts` and `vi.ts`. Pass.
- Delivery rule 4 (no code before CP-02 is recorded): same justified deviation as specs 002 and 003; the RES-03 part of CP-02 passed with conditions (`docs/m3/cp-02-review-res03.md`).

## Design

| Change | Files |
|---|---|
| Action types `LOGIN_FAILED`, `ACCESS_DENIED`; `GATES`, `GateCode` | `src/lib/types.ts` |
| Failed sign-in logging | `src/server/services/auth.ts` |
| Denied API logging | `src/server/auth/rbac.ts` (`requireRole`) |
| Denied page | `src/middleware.ts` (redirect), `src/app/denied/page.tsx`, `src/server/services/accessLog.ts` (`logPageDenied`) |
| Gate columns | `prisma/schema.prisma`, `prisma/migrations/20261123180000_g09_session_gate/migration.sql` |
| Gate input | `src/server/services/entry.ts`, `src/server/services/exit.ts`, `src/app/api/events/entry/route.ts`, `src/app/api/events/exit/confirm/route.ts` |
| Gate UI | `src/app/staff/entry/EntryForm.tsx`, `src/app/staff/exit/ExitForm.tsx`, `src/app/staff/sessions/[id]/page.tsx`, `src/i18n/{en,vi}.ts` |
| Tests | `tests/auth-log.test.ts`, `tests/gate.test.ts` |
