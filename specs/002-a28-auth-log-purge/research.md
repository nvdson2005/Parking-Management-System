# Research: A-28

No item in the Technical Context was left as NEEDS CLARIFICATION. The decisions below record the choices made.

## R1. Where the automatic purge runs

- **Decision**: In-process timer started from the Next.js instrumentation hook (`register()`, Node.js runtime only), in a new module `src/server/purgeSchedule.ts`.
- **Rationale**: This is the same mechanism as the 30 s reservation-expiry timer, which already works across HMR through a `globalThis` guard. The pilot runs as one long-lived process (D-16), so no external scheduler is needed.
- **Alternatives considered**: An OS cron job calling `/api/purge` needs a service account, because the route requires a Manager session, plus deployment setup. Running the purge on each availability read is too frequent and adds work to a hot path. Running it only at start-up misses long uptimes.

## R2. Interval and first run

- **Decision**: First run 60 s after `register()`, then every 24 h (`setInterval`). Both timers are `unref()`'d so they never keep the process alive.
- **Rationale**: The spec requires at least daily (FR-001) and a run soon after start (FR-006). The 60 s delay keeps start-up and the first requests free of a DB transaction.
- **Alternatives considered**: A fixed clock time (for example 02:00) needs time-zone and drift handling for no client benefit (spec assumption). Running immediately at start-up competes with migrations and seed during `npm run dev`.

## R3. Actor of a system run

- **Decision**: `purgeOldData(db, actorId: string | null, now)`. The automatic run passes `null`, and the PURGE row gets `user_id = NULL`.
- **Rationale**: `access_logs.user_id` is already nullable and `logAccess` accepts `null`. P03 v0.4 §10 #3 makes this the rule: `user_id` may be empty only for system actions.
- **Alternatives considered**: A dedicated "system" user row would need a seed change and a fake account that could log in. A new action value such as `PURGE_AUTO` would add an i18n key and a type, and the null user already distinguishes the two.

## R4. Logging a no-op run

- **Decision**: Always log, even when both counts are 0.
- **Rationale**: Evidence that the job ran is the point of SC-002. At one row a day the volume is negligible. The Manager button already logs zero-count runs (`tests/purge.test.ts`, idempotency case).

## R5. Where KB-07 is fixed

- **Decision**: In the service `registerCustomer`, after `user.create`.
- **Rationale**: Logic belongs in services (principle I), and the service is directly testable. Its only production caller is the register route, which signs the user in, so "registered" equals "logged in". `authenticate` logs LOGIN in the service the same way.
- **Alternatives considered**: Logging in the route would need cookie mocking in tests and would split the audit rule across two layers.

## R6. KB-14 scope

- **Decision**: Replace `await req.json()` with `await readJsonObject(req)` in `auth/login`, `auth/register`, `lang` and `POST /api/vehicles`. In vehicles, read `body.plate` and `body.vehicleType` from the returned object, as now. The service schema still validates the types.
- **Rationale**: These are exactly the four routes listed in P18 KB-14. `readJsonObject` already has unit tests (`tests/api.test.ts`).
- **Check**: a repo-wide search for `req.json()` under `src/app/api` should return no other route after the change. Any other hit gets noted in tasks.
