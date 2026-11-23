# Tasks: G-06 and G-09

**Tests**: required (constitution IV). Commits reference A-28 (G-06) or A-65 (G-09) and the G ID.

## Phase 1: User Story 1 - G-06 (P1)

- [X] T001 [US1] Failing tests in `tests/auth-log.test.ts`: US1 scenarios 1-4 and 6 (unknown email, wrong password, locked, Customer calling `requireRole('MANAGER')`, no session)
- [X] T002 [US1] Add `LOGIN_FAILED`, `ACCESS_DENIED` to `AccessAction` in `src/lib/types.ts`; log in `authenticate` (`src/server/services/auth.ts`) and `requireRole` (`src/server/auth/rbac.ts`)
- [X] T003 [US1] Failing test for `logPageDenied` (an allowed prefix logs `page:<prefix>`, any other value logs nothing); implement in `src/server/services/accessLog.ts`
- [X] T004 [US1] Middleware redirects a wrong role to `/denied?from=<prefix>`; add `src/app/denied/page.tsx` and `denied.*` i18n keys

## Phase 2: User Story 2 - G-09 (P1)

- [X] T005 [US2] Failing tests in `tests/gate.test.ts`: US2 scenarios 1-4
- [X] T006 [US2] Schema and migration `20261123180000_g09_session_gate`; `GATES`/`GateCode` in `src/lib/types.ts`; `gate` in `recordEntry`, `confirmExit` and both routes
- [X] T007 [US2] Gate select in the Staff entry and exit forms; gates on the session detail page; i18n keys

## Phase 2b: User Story 3 - G-04 (P1)

- [X] T010 [US3] Failing tests in `tests/source.test.ts`: US3 scenarios 1-4
- [X] T011 [US3] `SOURCES`/`SessionSource` in `src/lib/types.ts`; schema and migration `20261123190000_g04_session_source`; `source` in `recordEntry`, `confirmExit` and both routes; Staff forms send `MANUAL`; session detail shows both sources; i18n keys

## Phase 3: Polish

- [X] T008 Full `npm test`, `npm run lint`, `npm run build`; `codegraph sync`
- [X] T009 Update P03 (v0.5), README, `docs/m3/workbook-rows.md`, CR-03 row in the risk register (P03 v0.5 and the risk register are on branch `docs/a24-a102-round3-update`, PR #10, commits `2187bd1`, `0ea25e4`)

## Phase 4: Review of PR #11 (RES-01, 23/11)

- [X] T012 [US1] ACCESS_DENIED at the decision point: `requireSection` in section layouts, one row per render, `/denied` read-only, middleware checks the session only; tests in `tests/auth-log.test.ts`, `tests/auth-guard-render.test.ts` (`a239fec`)
- [X] T013 Publish availability when `staffLookup` or `listActiveReservations` expires a hold, also before NOT_FOUND; tests in `tests/read-expiry-publish.test.ts` (`69c9931`)
- [X] T014 [US2] [US3] `generateHistory` sets entry and exit gate and source (`GATE-1`, `DEVICE`); test in `tests/simulator.test.ts` (`178289c`)
- [X] T015 Parse the lookup page query as untrusted (`src/lib/lookupQuery.ts`): repeated or unknown values show a validation message; tests in `tests/lookup-query.test.ts` (`57d5d33`)
- [X] T016 Registration creates the account and its LOGIN row in one nested write; test in `tests/register-atomic.test.ts` forces the log insert to fail (`64d0a0d`)
- [X] T017 Full gate, and a run of the production build against a scratch database: one row per refused request, none for `/denied` refreshes or a forged `from`; evidence in `docs/m3/evidence/pr11-review-e2e.md`
