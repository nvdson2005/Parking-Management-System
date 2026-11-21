# AGENTS.md

Guidance for AI coding agents (Claude Code, Codex, etc.) working in this repository.

Smart Parking MVP (course CO3011 / QLDAPM): Next.js 15 App Router + React 19, Prisma 6 + SQLite, Zod, jose JWT, vitest. UI is bilingual (vi/en). See `README.md` for demo accounts, pages and API table.

## Workflow

1. **Idea analysis.** Before any new feature, behavior change or design work, use `superpowers:brainstorming` in Claude Code or `$brainstorming` in Codex. Record the agreed design in `docs/superpowers/specs/`.
2. **Implementation → Spec Kit.** Use the existing constitution in `.specify/memory/constitution.md`. Once the design is agreed, follow `speckit-specify` → `speckit-clarify` → `speckit-plan` → `speckit-tasks` → `speckit-analyze` → `speckit-implement`. Use `speckit-converge` to append leftover work to `tasks.md`. Keep the spec, plan, and tasks in `specs/`.
   Claude Code loads the shared skills from `.claude/skills/`. Codex discovers the same skills through relative links in `.agents/skills/`. In Codex, invoke them as `$speckit-<step>` and use the request text as `$ARGUMENTS`. Resolve references to `/speckit-*` as the corresponding skill names. For existing feature artifacts, set `SPECIFY_FEATURE_DIRECTORY` to the chosen feature directory when the local feature pointer is missing or points elsewhere. Use `SPECIFY_FEATURE_NO_PERSIST=1` for read-only analysis.
3. **Navigation → CodeGraph.** `.codegraph/` is indexed. Use `codegraph_explore` (MCP) or `codegraph explore "<symbols or question>"` BEFORE grep/Read to locate code, callers and blast radius. Fall back to grep only for non-code files or when the index lacks the symbol.
   **Keep the index fresh:** after any change to the codebase (edits, new/deleted files, merges, pulls, branch switches), run `codegraph sync` before the next `codegraph_explore` and before finishing the task. Stale index = wrong callers and blast radius.
4. Other repo skills: `create-implementation-issue` → `publish-jira-issue` (Jira drafts under `.tmp/jira-issues/`), `review-implementation` (read-only APPROVED/REJECTED verdict).

Work on the main checkout, not in `.worktrees/` (those hold stale full copies; vitest excludes them).

## Commands

```bash
npm i && cp .env.example .env
npx prisma migrate reset --force   # migrate + seed demo data (also: npm run db:reset / db:seed)
npm run dev                        # http://localhost:3000
npm run build                      # prod build; doubles as type-check
npm run lint
npm test                           # vitest run, full suite
npx vitest run tests/entry.test.ts            # single file
npx vitest run tests/entry.test.ts -t "name"  # single test
```

Tests use a separate `prisma/test.db`, reset by `tests/global-setup.ts` via `prisma db push --force-reset`; `DATABASE_URL`/`AUTH_SECRET` are injected in `vitest.config.ts`. Files run serially (`fileParallelism: false`) because they share one DB.

## Architecture

- **Layering:** `src/app/api/**/route.ts` (thin) → `src/server/services/*` (all business logic) → Prisma (`src/server/db.ts`). Services take a `Db` (`PrismaClient | TransactionClient`) as first arg so they compose inside transactions and are tested directly against the test DB (`tests/helpers/db.ts`).
- **Route handlers** are wrapped in `handle()` and read bodies with `readJsonObject()` (`src/server/api.ts`). Throw `DomainError(code, msg)` (`src/server/errors.ts`); the code→HTTP status map lives there. Add new codes to both `ErrorCode` and `STATUS_MAP`. `ZodError` → 400 `VALIDATION`.
- **Concurrency:** single-process SQLite deployment. Mutations that must not race (entry, vehicle registration, reservations) run inside `withLock()` (`src/server/lock.ts`, a `globalThis` promise-chain mutex). It is **non-reentrant**: never call a lock-taking service (e.g. `addVehicle`) from inside another `withLock` body — see `createGuestVehicle` in `entry.ts`, which deliberately avoids it. `recordEntry` owns the transaction and casts `db` to `PrismaClient`.
- **Live availability:** services call `publishAvailabilityChanged()` (`src/server/bus.ts`, `globalThis` EventEmitter) after commit; `/api/availability/stream` pushes SSE. `src/instrumentation.ts` starts a 30 s timer expiring stale PENDING reservations. Both rely on `globalThis` singletons to survive HMR.
- **Auth/RBAC:** JWT in `session` cookie. `src/middleware.ts` runs on **Edge** and verifies with `jose` directly — it must not import `src/server/auth/session.ts` or anything pulling Prisma. Server-side role checks use `src/server/auth/rbac.ts`. Roles: CUSTOMER, STAFF, MANAGER.
- **i18n:** `src/i18n/{en,vi}.ts` must keep identical key sets (a test enforces parity). Language chosen per request via `/api/lang` cookie.
- **Domain:** fees in `services/fees.ts` (`computeFee`, used by exit and simulator), exception flows EX-01..EX-05 (see `docs/m3/`), plate matching is separator-insensitive (`plateCompareKey` in `vehicles.ts`; `lib/plate.ts` normalizes), access logging via `accessLog.ts`, data purge masks old plates (`purge.ts`). `services/simulator.ts` generates seeded live/history/exception data.
- **UI:** `src/components` (shadcn + `@base-ui/react`, Tailwind 4), role pages under `src/app/{customer,staff,manager}`.

## Docs

`docs/m2-report/` (milestone 2 report), `docs/m3/` (simulator review, SC-01..SC-07 catalogue), `docs/m3-m4-work-division.md`, `docs/manual-e2e-test-guide.md`. `resources/` holds the course tracking workbook.
