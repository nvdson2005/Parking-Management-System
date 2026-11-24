# Smart Parking MVP Constitution

## Core Principles

### I. Shared service layer is the entry/exit API (KB-01, A-22, CP-02)

Entry and exit events (FR-15) MUST go through one shared set of service functions in
`src/server/services/` (`recordEntry`, exit preview, exit confirm). The HTTP routes
`/api/events/entry`, `/api/events/exit/preview` and `/api/events/exit/confirm` and the device
simulator (`services/simulator.ts`) both call these functions in-process. The simulator MUST NOT
call HTTP.

**Rationale:** Decision A-22 accepted KB-01 as "API shared at the service layer". Staff and
simulator then apply the same business rules. CP-02 review (P18 §10.2, 2026-11-24) passed with this
decision recorded and the entry/exit contract frozen (P18 §7).

- No business rule is duplicated in the simulator or in a route handler.
- A new entry/exit rule goes into the service, never into one caller only.
- Moving the simulator to HTTP needs a new decision against KB-01.

**Reference:** `docs/m2-report/products/CO3011_M2_KienTrucAPI_v0.1.md` (§10 KB-01, §10.2);
`docs/m3/A-43-simulator-review.md` (criterion 6); PD-P04 criterion 6.

### II. Layered architecture

Route handlers (`src/app/api/**/route.ts`) MUST stay thin: wrap in `handle()`, read bodies with
`readJsonObject()`, then delegate. All business logic lives in `src/server/services/*`, which take a
`Db` (`PrismaClient | TransactionClient`) as first argument so they compose in transactions and are
tested directly against the test DB. Failures MUST be thrown as `DomainError(code, msg)`; every new
code is added to both `ErrorCode` and `STATUS_MAP`.

**Rationale:** One place per invariant keeps Staff, Customer and simulator behavior identical.

### III. Concurrency safety on SQLite

The deployment is single-process SQLite. Mutations that must not race (entry, vehicle registration,
reservations) MUST run inside `withLock()`. `withLock()` is non-reentrant: a lock-taking service MUST
NOT be called from inside another `withLock` body. Services MUST call `publishAvailabilityChanged()`
after commit.

**Rationale:** Two simultaneous entries must never over-fill a zone or duplicate an open session.

### IV. Edge-safe auth and RBAC

`src/middleware.ts` runs on Edge and MUST verify the session JWT with `jose` directly. It MUST NOT
import `src/server/auth/session.ts` or anything that pulls Prisma. Server-side role checks MUST use
`src/server/auth/rbac.ts`. Roles are CUSTOMER, STAFF, MANAGER.

**Rationale:** Prisma cannot run on Edge; role checks must not depend on the middleware alone.

### V. Bilingual UI with key parity

`src/i18n/en.ts` and `src/i18n/vi.ts` MUST keep identical key sets; the parity test MUST pass. User
text MUST NOT be hard-coded outside the i18n files.

### VI. Evidence-backed acceptance

A checkpoint (CP-xx) criterion counts as met only with reproducible evidence in the repo (tests,
`docs/evidence/**`, or a recorded review). A criterion waiting on another checkpoint stays "partial"
until that checkpoint is recorded in the owning document.

## Development Workflow

1. Idea analysis with `superpowers:brainstorming`; design docs in `docs/superpowers/specs/`.
2. Implementation with Spec Kit in order: constitution, specify, clarify, plan, tasks, analyze,
   implement. Do not write code without a spec/plan/tasks trail.
3. Navigate with CodeGraph first; run `codegraph sync` after any codebase change.
4. Work on the main checkout, not `.worktrees/`.
5. Gates before merge: `npm run lint`, `npm test`, `npm run build`.

## Governance

This constitution records decisions the team has accepted. Later specs, plans and reviews MUST
comply with it. Amendments need a recorded decision (A-xx / CP-xx) and an updated reference line.

Versioning: MAJOR for removed or redefined principles; MINOR for a new principle or materially
expanded guidance; PATCH for wording fixes. `speckit-analyze` and `review-implementation` MUST treat
a violation of a principle above as a blocking finding.

**Version**: 1.1.0 | **Ratified**: 2026-11-24 | **Last Amended**: 2026-11-24
