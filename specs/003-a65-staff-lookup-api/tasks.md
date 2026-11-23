# Tasks: A-65 Staff Lookup, Read APIs and Indexes

**Input**: `specs/003-a65-staff-lookup-api/` (spec, plan, research, data-model, contracts, quickstart)
**Tests**: required (constitution IV). Write each test first and watch it fail.
**Commits**: reference A-65 and the KB/G ID, for example `feat(staff): vehicle and reservation lookup (A-65, G-08)`.

## Phase 1: Setup

- [X] T001 On branch `fix/res03-a28-a65`, run `codegraph sync` and confirm `git status` is clean apart from `specs/003-a65-staff-lookup-api/` and the known `package-lock.json` change

## Phase 2: Foundational

None. Each story uses its own new files. US1 and US2 both add routes, but under different paths.

## Phase 3: User Story 1 - Staff look up a vehicle and its reservation (P1) 🎯 MVP

**Goal**: G-08 / Q34. **Independent Test**: lookup by plate, QR or RFID returns the vehicle, open session and active reservation, and logs VIEW_FULL_PLATE; customers get 403.

- [X] T002 [US1] Write failing service tests in new `tests/lookup.test.ts` (use `resetDb`, `makeFixture`; create a customer vehicle, a pending reservation via `db.reservation.create`, an open session):
  - (a) `staffLookup(db, { method: 'PLATE', identifier: '51f 123 45', viewerId: staff.id })` finds vehicle `51F-123.45` and returns `vehicle.hasOwner: true`, `openSession: null` and `activeReservation` with zone name, `arrivalTime` and `holdUntil`;
  - (b) QR and RFID identifiers find the same vehicle;
  - (c) a vehicle with an OPEN session returns `openSession { zoneName, entryTime, idMethod }`;
  - (d) an expired PENDING reservation (`holdUntil` < now) is returned as `activeReservation: null` and is NO_SHOW afterwards;
  - (e) an unknown identifier throws `NOT_FOUND` and writes no access-log row;
  - (f) a successful lookup writes exactly one `VIEW_FULL_PLATE` row with `userId = staff.id` and `target = 'vehicle:<id>'`;
  - (g) an empty identifier or an unknown method throws a ZodError or `VALIDATION`;
  - (h) `listActiveReservations(db, {})` returns only PENDING reservations with `holdUntil` > now, ordered by `arrivalTime` ascending, with `plate` and `zoneName`; `{ zoneId }` filters to that zone.

  (A-65, G-08)
- [X] T003 [US1] Add `listActiveReservations(db, opts: { zoneId?: string; now?: Date } = {})` to `src/server/services/reservations.ts`. It calls `expireReservations(db, now)`, then `findMany({ where: { status: 'PENDING', holdUntil: { gt: now }, zoneId? }, include: { zone, vehicle }, orderBy: { arrivalTime: 'asc' } })` and maps the rows to `{ id, plate: vehicle.plate, zoneId, zoneName, vehicleTypeCode, arrivalTime, holdUntil }`. It takes no lock (read plus the expiry update, same as the timer) (A-65, G-08)
- [X] T004 [US1] Create `src/server/services/lookup.ts` with `lookupSchema = z.object({ method: z.enum(['PLATE','QR','RFID']), identifier: z.string().trim().min(1), viewerId: z.string().min(1) })` and `staffLookup(db, input)`:
  - parse the input; `now = new Date()`; `expireReservations(db, now)`;
  - `findVehicleByIdentifier(db, method, identifier)`, and if there is no vehicle throw `DomainError('NOT_FOUND', 'Vehicle not found')`;
  - find the open session (`status: 'OPEN'`, include zone) and the PENDING reservation with `holdUntil > now` (include zone);
  - `logAccess(db, { userId: viewerId, action: 'VIEW_FULL_PLATE', target: 'vehicle:' + vehicle.id })`;
  - return the LookupResult from data-model.md.

  (A-65, G-08)
- [X] T005 [US1] Create `src/app/api/staff/lookup/route.ts` with `GET = handle(async (req) => { const user = await requireRole('STAFF','MANAGER'); const q = new URL(req.url).searchParams; return staffLookup(db, { method: q.get('method') as IdMethod, identifier: q.get('identifier') ?? '', viewerId: user.id }) })` (A-65, G-08)
- [X] T006 [P] [US1] Create `src/app/api/staff/reservations/route.ts`: `GET` with `requireRole('STAFF','MANAGER')`, then `listActiveReservations(db, { zoneId: q.get('zoneId') || undefined })` (A-65, G-08)
- [X] T007 [US1] Write failing route tests in new `tests/read-apis.test.ts` (mock `@/server/auth/session` `getCurrentUser` as in `tests/contract-inout.test.ts`):
  - lookup as STAFF gives 200 with the result shape; as MANAGER, 200;
  - as CUSTOMER, 403 `FORBIDDEN`; as nobody, 401;
  - an unknown plate gives 404 `NOT_FOUND`;
  - a missing identifier gives 400 `VALIDATION`;
  - `/api/staff/reservations` as STAFF gives 200 and the list; as CUSTOMER, 403.

  (A-65, G-08)
- [X] T008 [US1] Add i18n keys `lookup.title`, `lookup.method`, `lookup.identifier`, `lookup.search`, `lookup.notFound`, `lookup.vehicle`, `lookup.guest`, `lookup.registered`, `lookup.parked`, `lookup.notParked`, `lookup.reservation`, `lookup.noReservation`, `lookup.arrival`, `lookup.holdUntil`, `lookup.activeReservations`, `lookup.noActiveReservations` and `lookup.zone` to both `src/i18n/en.ts` and `src/i18n/vi.ts` (parity test) (A-65, G-08)
- [X] T009 [US1] Create server page `src/app/staff/lookup/page.tsx`:
  - `requireRole('STAFF','MANAGER')`;
  - a GET form with a method `<select>` (PLATE/QR/RFID) and an identifier input;
  - when `searchParams.identifier` is present, call `staffLookup`; catch `DomainError` `NOT_FOUND` and show `lookup.notFound`;
  - render vehicle, session and reservation sections;
  - below, a table from `listActiveReservations(db, {})`.

  Use the existing `Table`, `Input`, `Label`, `Button` components and the layout of `src/app/manager/payments/page.tsx` (A-65, G-08)
- [X] T010 [US1] Add `{ href: '/staff/lookup', labelKey: 'lookup.title' }` to `ROLE_LINKS.STAFF` in `src/lib/nav.ts`, after `/staff/sessions`, and update the STAFF expectation in `tests/nav.test.ts` (A-65, G-08)

**Checkpoint**: `npx vitest run tests/lookup.test.ts tests/read-apis.test.ts tests/nav.test.ts tests/i18n.test.ts` green.

## Phase 4: User Story 2 - Read endpoints for logs, sessions and payments (P2)

**Goal**: KB-15. **Independent Test**: each endpoint returns the same data as its screen, with role and validation checks.

- [X] T011 [US2] Add failing tests to `tests/read-apis.test.ts`:
  - `/api/access-logs` as MANAGER gives 200, newest first, with `userName`; `?limit=1` returns one row; `?limit=0` or `?limit=abc` give 400; STAFF and CUSTOMER get 403;
  - `/api/sessions` as STAFF with default status returns OPEN sessions only, and `?status=CLOSED` returns closed ones; `?status=X` gives 400; CUSTOMER gets 403;
  - `/api/payments` as MANAGER returns all confirmed payments and respects `?from=&to=`; `?from=notadate` gives 400; as CUSTOMER it returns only sessions with `ownerId = customer`; STAFF gets 403.

  (A-65, KB-15)
- [X] T012 [US2] Create `src/server/services/sessions.ts` with `listSessionsSchema = z.object({ status: z.enum(['OPEN','CLOSED']).default('OPEN') })` and `listSessions(db, input: { status?: string }, viewer: { id: string; role: Role })`. It returns SessionListItem[] (data-model.md) with `plate: presentPlate(s.plateSnapshot, viewer, s.ownerId)`, ordered by `entryTime` descending, including zone (A-65, KB-15)
- [X] T013 [P] [US2] Create `src/app/api/sessions/route.ts`: `GET` with `requireRole('STAFF','MANAGER')`, then `listSessions(db, { status: q.get('status') ?? undefined }, user)` (A-65, KB-15)
- [X] T014 [P] [US2] Create `src/app/api/access-logs/route.ts`: `GET` with `requireRole('MANAGER')`. Parse `limit` with `z.coerce.number().int().min(1).max(500).default(200)` (place the schema in `src/server/services/accounts.ts` as `accessLogQuerySchema` and export it), then `listAccessLogs(db, { limit })` (A-65, KB-15)
- [X] T015 [P] [US2] Create `src/app/api/payments/route.ts`: `GET` with `requireRole('MANAGER','CUSTOMER')`. A CUSTOMER gets `customerHistory(db, user.id)`. A MANAGER gets `paymentsQuerySchema` (in `src/server/services/history.ts`: optional `from`/`to` strings, each refined to a valid date, transformed to `Date`) and then `allPayments(db, { from, to })` (A-65, KB-15)
- [X] T016 [US2] Refactor `src/app/staff/sessions/page.tsx` to call `listSessions(db, { status: 'OPEN' }, user)` instead of `db.parkingSession.findMany`. Render `session.plate` and `session.zoneName`; the screen output is unchanged (FR-013) (A-65, KB-15)

**Checkpoint**: `npx vitest run tests/read-apis.test.ts` green.

## Phase 5: User Story 3 - Faster filtering on time and account (P3)

**Goal**: G-07. **Independent Test**: the four indexes exist and migrations match the schema.

- [X] T017 [US3] Write a failing test in new `tests/indexes.test.ts`: for each of `reservations_customer_id_status_idx`, `parking_sessions_entry_time_idx`, `access_logs_created_at_idx` and `access_logs_user_id_idx`, `db.$queryRawUnsafe("SELECT name FROM sqlite_master WHERE type='index' AND name=?", name)` returns one row (A-65, G-07)
- [X] T018 [US3] In `prisma/schema.prisma` add `@@index([customerId, status])` to `Reservation`, `@@index([entryTime])` to `ParkingSession`, and `@@index([createdAt])` and `@@index([userId])` to `AccessLog`. Create `prisma/migrations/20261123100000_a65_indexes/migration.sql` with the four `CREATE INDEX "<name>" ON "<table>"("<cols>");` statements using the names above (A-65, G-07)
- [X] T019 [US3] Run `npx prisma generate` and the `prisma migrate diff --from-migrations ... --exit-code` command from quickstart.md; expect no drift. Delete the temporary shadow DB file afterwards (A-65, G-07)

**Checkpoint**: `npx vitest run tests/indexes.test.ts tests/schema.test.ts` green.

## Phase 6: Polish

- [X] T020 Full gate: `npm test`, `npm run lint`, `npm run build` (the pre-existing simulator timeout is known and is not caused by A-65)
- [X] T021 [P] Add Quality Evidence rows for G-08, KB-15 and G-07 to `docs/m3/workbook-rows.md`
- [X] T022 Run `codegraph sync`; commit per story with `(A-65, G-08)`, `(A-65, KB-15)` and `(A-65, G-07)`. The P03 v0.4 and risk-register updates for G-08 and G-07 go to branch 3 (docs) later, because PR #10 is open for review

## Dependencies

- US1 → US2 → US3 by priority. US2 and US3 do not depend on US1 code, but US2 appends to the test file US1 creates.
- In US1: T002 → T003, T004 → T005, T006 → T007; T008 before T009; T010 anytime.
- In US2: T011 → T012 → T013-T016 (T013-T015 in parallel).

## Implementation Strategy

MVP = US1 (Q34, client requirement). Estimate from Baseline V2.0: 7,33 h for all of A-65.

**Completion note (23/11)**: `codegraph sync` ran after each story. The analysis step (speckit-analyze criteria) was run inline: all 13 FRs map to tasks, one justified constitution deviation (delivery workflow rule 4, as A-28), no CRITICAL findings. A bug that the tests did not catch was fixed during implementation: the lookup page used a non-existent i18n key `entry.methods.*`; it now uses `entry.methodPlate/Qr/Rfid`, and every key on the page was checked against both language files. The full suite has 4 simulator timeouts that also exceed 5 s on `main` (see `docs/m3/workbook-rows.md`). P03 v0.4 and risk-register updates for G-07/G-08 go to the docs branch later (T022).
