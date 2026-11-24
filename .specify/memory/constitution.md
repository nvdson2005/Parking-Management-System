<!--
Sync Impact Report
Version change: 1.0.0 -> 1.1.0
Modified principles: none
Added sections: Principle VI (shared service layer for entry/exit, KB-01 / A-22 / CP-02)
Removed sections: none
Deferred TODOs: none
-->
# Smart Parking MVP Constitution

## Core Principles

### I. Layered Architecture
Route handlers in `src/app/api/**/route.ts` MUST stay thin: they wrap logic in `handle()`, read
bodies with `readJsonObject()`, and delegate to `src/server/services/*`. All business logic MUST
live in services, which take a `Db` as first argument and reach Prisma only through
`src/server/db.ts`. Domain failures MUST throw `DomainError(code, msg)`; every new code MUST be
added to both `ErrorCode` and `STATUS_MAP` in `src/server/errors.ts`.
Rationale: services compose inside transactions and are tested directly against the test DB.

### II. Concurrency Safety
Mutations that must not race (entry, vehicle registration, reservations, lot suspension) MUST
run inside `withLock()`. The lock is non-reentrant: a lock-taking service MUST NOT be called from
inside another `withLock` body. Availability changes MUST call `publishAvailabilityChanged()`
after commit. Cross-request state MUST use `globalThis` singletons to survive HMR.
Rationale: the deployment is a single-process SQLite instance with no database-level isolation.

### III. Edge and Access Boundaries
`src/middleware.ts` runs on Edge and MUST NOT import `src/server/auth/session.ts`, Prisma, or
anything that pulls them in; it verifies the JWT with `jose` directly. Server-side role checks
MUST use `src/server/auth/rbac.ts` (roles CUSTOMER, STAFF, MANAGER). Notifications and logs MUST
NOT expose a plate to users who may not see it.
Rationale: Edge cannot load Prisma, and plate privacy is a stated product requirement.

### IV. Test-Backed Changes (NON-NEGOTIABLE)
Every behaviour change or bug fix MUST ship with a vitest test that fails without the change.
Service tests MUST run against the separate `prisma/test.db`, never the dev database. The full
suite (`npm test`), `npm run lint` and `npm run build` MUST pass before a task is closed.
`src/i18n/en.ts` and `src/i18n/vi.ts` MUST keep identical key sets; every new error code, event
type and notification type needs both languages.
Rationale: the repo history and test evidence are assessed as execution proof.

### V. Traceable Delivery
Each commit message MUST reference the activity ID and, where relevant, the KB ID, for example
`fix(exit): separator-insensitive plate match (A-63, KB-04)`. Baseline V1.0 outputs under
`docs/m2-report/` MUST NOT be edited; a V2.0 is a new generated set and V1.0 stays archived.
Work MUST happen on the main checkout, not in `.worktrees/`.
Rationale: the course assesses planned-vs-actual evidence and baseline integrity.

### VI. Shared Service Layer for Entry/Exit
Entry and exit events (FR-15) MUST go through one shared set of service functions in
`src/server/services/` (`recordEntry`, exit preview, exit confirm). The routes
`/api/events/entry`, `/api/events/exit/preview` and `/api/events/exit/confirm` and the device
simulator (`services/simulator.ts`) MUST call these functions in-process; the simulator MUST NOT
call HTTP. A new entry/exit rule MUST go into the service, never into one caller only. Moving the
simulator to HTTP needs a new decision against KB-01.
Rationale: decision A-22 accepted KB-01 as "API shared at the service layer"; CP-02 passed with it
recorded (P18 section 10.2, 2026-11-24) and the entry/exit contract frozen (P18 section 7).
Reference: `docs/m2-report/products/CO3011_M2_KienTrucAPI_v0.1.md` (KB-01, 10.2),
`docs/m3/A-43-simulator-review.md` (criterion 6), PD-P04 criterion 6.

## Technical Constraints

- Stack: Next.js 15 App Router, React 19, Prisma 6 with SQLite, Zod, jose, vitest, Tailwind 4.
- UI is bilingual (vi/en); language is chosen per request through the `/api/lang` cookie.
- Plate matching MUST be separator-insensitive via `plateCompareKey`; `lib/plate.ts` normalises.
- Fees MUST be computed through `computeFee` in `services/fees.ts`.
- After any code or file change, `codegraph sync` MUST run before the next `codegraph_explore`
  and before a task is finished.

## Delivery Workflow

1. New features and behaviour changes start with `superpowers:brainstorming`.
2. Implementation follows the Spec Kit trail: `speckit-specify`, `speckit-clarify`,
   `speckit-plan`, `speckit-tasks`, `speckit-analyze`, `speckit-implement`. Code MUST NOT be
   written without a spec, plan and tasks trail. `speckit-converge` appends leftover work.
3. Use `codegraph_explore` before grep or Read to locate code and blast radius.
4. Code-fix activities do not start before the design review gate (CP-02) is recorded as passed.
5. Independent completion review uses `review-implementation` (read-only verdict).

## Governance

This constitution supersedes other working practices in this repository. `AGENTS.md` carries
runtime guidance and MUST NOT contradict it. An amendment MUST be a commit that states the
change, its rationale and any migration needed for open work. Versioning follows semantic rules:
MAJOR for removed or redefined principles, MINOR for added principles or materially expanded
guidance, PATCH for clarifications. Plans and reviews MUST check compliance with the six
principles, and any deviation MUST be justified in the plan's complexity section.

**Version**: 1.1.0 | **Ratified**: 2026-11-18 | **Last Amended**: 2026-11-24
