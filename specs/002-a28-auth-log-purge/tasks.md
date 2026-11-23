# Tasks: A-28 Auth and Access-Log Fixes, Automatic Data Purge

**Input**: `specs/002-a28-auth-log-purge/` (spec, plan, research, data-model, contracts, quickstart)
**Tests**: required (constitution IV). Write each test first and watch it fail before the change.
**Commits**: every commit message references A-28 and the KB/G ID, for example `fix(auth): log LOGIN on registration (A-28, KB-07)`.

## Phase 1: Setup

- [X] T001 Create branch `fix/a28-auth-log-purge` from `main` (the docs branch `docs/a24-a102-round3-update` stays separate). Run `codegraph sync` if the CLI is available, and confirm `git status` is clean apart from `specs/002-a28-auth-log-purge/`

## Phase 2: Foundational

None. The three stories touch different files and share no new code.

## Phase 3: User Story 1 - Old plates disappear automatically after 12 months (P1) 🎯 MVP

**Goal**: G-05 / Q35. The purge runs by itself: once 60 s after server start, then every 24 h, logged as a system action.
**Independent Test**: a closed session older than 12 months gets masked by a system run; the PURGE row has `user_id = NULL`; the timer is registered once.

- [X] T002 [US1] Add a failing test in `tests/purge.test.ts`: `purgeOldData(db, null, NOW)` masks the same eligible sessions as a Manager run and writes exactly one `access_logs` row with `action: 'PURGE'`, `userId: null` and target `"<n> sessions, <m> vehicles"`. Also assert SC-003: the session count, each masked session's `entryTime`/`exitTime`/`zoneId`, and the sum of `payments.amount` are identical before and after the run. Keep the existing Manager-actor cases unchanged (A-28, G-05)
- [X] T003 [US1] In `src/server/services/purge.ts` change the signature to `purgeOldData(db: Db, actorId: string | null, now: Date = new Date())`. Pass `userId: actorId` to `logAccess` as now, and update the doc comment: `null` = system run (Q35, P03 §10 #3). The Manager route `src/app/api/purge/route.ts` keeps passing `user.id` (A-28, G-05)
- [X] T004 [P] [US1] Add failing tests in new `tests/purge-schedule.test.ts` using `vi.useFakeTimers()` and an injected `run` function:
  - (a) `registerPurgeSchedule({ run })` does not call `run` immediately, calls it once at 60 000 ms, then again at 60 000 + 86 400 000 ms;
  - (b) a second `registerPurgeSchedule` call while the first is active creates no extra timers (`run` count unchanged);
  - (c) a `run` that rejects does not throw out of the timer, and the next tick still calls `run`. Advance time with `await vi.advanceTimersByTimeAsync(...)` so rejected promises settle;
  - (d) a `stopPurgeSchedule()` helper clears both timers and the `globalThis` guard so tests are isolated.

  Use `afterEach(stopPurgeSchedule)` (A-28, G-05)
- [X] T005 [US1] Create `src/server/purgeSchedule.ts` exporting `PURGE_FIRST_DELAY_MS = 60_000`, `PURGE_INTERVAL_MS = 86_400_000`, `registerPurgeSchedule(opts?: { run?: () => Promise<unknown> })` and `stopPurgeSchedule()`:
  - The default `run` is `() => purgeOldData(db, null)`.
  - State lives in `globalThis.__purgeSchedule = { startTimer, intervalTimer }`; return early if it is set.
  - The first run uses `setTimeout(PURGE_FIRST_DELAY_MS)`; after it, start `setInterval(PURGE_INTERVAL_MS)`.
  - Every call is wrapped as `run().catch(() => {})`, with a comment that a failure is retried on the next tick.
  - `.unref?.()` both timers.
  - Import nothing from `src/middleware.ts` or Edge code (A-28, G-05)
- [X] T006 [US1] In `src/instrumentation.ts`, inside the existing `NEXT_RUNTIME === 'nodejs'` branch, call `registerPurgeSchedule()` independently of the reservation-expiry guard. The early `return` for `__reservationExpiryTimer` must not skip it, so move the purge call before that check. Update the file's doc comment to mention the daily purge (A-28, G-05)

**Checkpoint**: `npx vitest run tests/purge.test.ts tests/purge-schedule.test.ts` green.

## Phase 4: User Story 2 - Registration is recorded as a login (P2)

**Goal**: KB-07. One LOGIN row per successful registration.
**Independent Test**: register a new email and get exactly one LOGIN row for that user; a duplicate email gives none.

- [X] T007 [P] [US2] Add failing tests in `tests/auth.test.ts`: after `registerCustomer(db, {...})` succeeds, `db.accessLog.count({ where: { userId: user.id, action: 'LOGIN' } })` is 1. After a duplicate-email `registerCustomer` throws `EMAIL_TAKEN`, the total LOGIN count is unchanged (A-28, KB-07)
- [X] T008 [US2] In `src/server/services/auth.ts` `registerCustomer`: keep the created user in a variable, call `await logAccess(db, { userId: user.id, action: 'LOGIN' })`, then return the user. Add a one-line comment that registration signs the user in (`register` route), so it is a login (A-28, KB-07)

**Checkpoint**: `npx vitest run tests/auth.test.ts` green.

## Phase 5: User Story 3 - Malformed request bodies get a clear validation error (P2)

**Goal**: KB-14. Four routes return 400 VALIDATION for a body that is not a JSON object.
**Independent Test**: each route answers `not json`, `[1,2]`, `42` and an empty body with 400 `{ error: 'VALIDATION' }`.

- [X] T009 [P] [US3] Create a failing test `tests/malformed-body.test.ts` that calls the route handlers directly (pattern from `tests/contract-inout.test.ts`):
  - Cover `POST` of `@/app/api/auth/login/route`, `@/app/api/auth/register/route`, `@/app/api/lang/route` and `@/app/api/vehicles/route`.
  - For each, send bodies `'not json'`, `'[1,2]'`, `'42'` and `''`, and expect status 400 and body `{ error: 'VALIDATION' }`.
  - For vehicles, mock `@/server/auth/session` `getCurrentUser` to return a CUSTOMER from `makeFixture`.
  - After the register cases, assert that `db.user.count()` and `db.accessLog.count()` are unchanged.
  - Add one test that an unauthenticated vehicles POST with a malformed body still returns 401 (role check comes first) (A-28, KB-14)
- [X] T010 [P] [US3] `src/app/api/auth/login/route.ts`: replace `await req.json()` with `await readJsonObject(req)` (import from `@/server/api`) (A-28, KB-14)
- [X] T011 [P] [US3] `src/app/api/auth/register/route.ts`: same replacement (A-28, KB-14)
- [X] T012 [P] [US3] `src/app/api/lang/route.ts`: same replacement (A-28, KB-14)
- [X] T013 [P] [US3] `src/app/api/vehicles/route.ts` `POST`: same replacement after `requireRole('CUSTOMER')`; keep passing `body.plate` and `body.vehicleType` to `addVehicle` (A-28, KB-14)

**Checkpoint**: `npx vitest run tests/malformed-body.test.ts` green, and `grep -rn "req.json()" src/app/api` returns nothing.

## Phase 6: Polish & Cross-Cutting

- [X] T014 Run the full gate: `npm test`, `npm run lint`, `npm run build`. All pass (constitution IV)
- [X] T015 [P] Docs (done on branch `docs/a24-a102-round3-update`, where P03 v0.4 and the risk register live):
  - In `docs/m2-report/products/CO3011_M2_ThietKeCSDL_v0.4.md` §6 and §11, mark G-05 as done in A-28 (new label `[main]` once merged).
  - In `docs/m3/risk-register.md`, note under R-M3-07 that G-05 is done (date and commit).
  - Do not edit V1.0 files (A-28, G-05)
- [X] T016 [P] Record the KB-07, KB-14 and G-05 verification in `docs/m3/workbook-rows.md`, Quality Evidence section: test names, date, result (A-28)
- [X] T017 Commit per story, with `(A-28, G-05)`, `(A-28, KB-07)` and `(A-28, KB-14)`; run `codegraph sync` if available; open a PR to `main` only when the user asks

## Dependencies

- US1, US2 and US3 are independent; any order works. US1 is first because it is the client requirement (Q35).
- Within US1: T002 → T003; T004 → T005 → T006.
- Within US3: T009 first, then T010-T013 in parallel.
- Phase 6 after all stories.

## Parallel Examples

- US1: T004 (new test file) can be written in parallel with T002/T003.
- US2 and US3 tests (T007, T009) can be written in parallel with US1.
- T010, T011, T012 and T013 touch four different files.

## Implementation Strategy

MVP = US1 (G-05), because it is the only client-mandated item. Then US2 and US3, which are small and low-risk. Estimated effort: 3,75h (Baseline V2.0, A-28).

**Completion note (23/11)**: `codegraph` CLI is not installed on this machine, so `codegraph sync` was not run (T001, T017). No PR is opened yet; the user asked to hold pushing.
