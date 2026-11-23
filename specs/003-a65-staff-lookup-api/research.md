# Research: A-65

## R1. One lookup or separate vehicle and reservation reads

- **Decision**: One lookup (`GET /api/staff/lookup?method=&identifier=`) returns vehicle, open session and active reservation together. A separate list (`GET /api/staff/reservations?zoneId=`) covers "which reservations are due".
- **Rationale**: At the gate, staff start from an identifier and need all three answers at once (Q31 early arrival, EX-03 lost card). The list covers the planning view.
- **Alternatives considered**: Opening `GET /api/vehicles` and `GET /api/reservations` to staff would mix customer-scoped and staff-wide semantics in one route and risk exposing other customers' data through a role-check bug.

## R2. Identifier matching

- **Decision**: Reuse `findVehicleByIdentifier(db, method, identifier)`, which uses separator-insensitive `plateCompareKey` for plates and exact uppercase for QR and RFID.
- **Rationale**: The same rule as entry and exit (constitution, technical constraints).

## R3. Audit of full plates

- **Decision**: A successful lookup logs `VIEW_FULL_PLATE` with target `vehicle:<id>`. Lists do not log.
- **Rationale**: D-31 logs on opening a detail view. The sessions list already shows full plates to staff without logging. KB-06 accepted D-31 limited to detail views, and the lookup is a detail view.

## R4. Active reservation definition

- **Decision**: `status = PENDING` and `holdUntil > now`, after calling `expireReservations(db, now)`.
- **Rationale**: Same as the availability formula (P03 §4) and the create-reservation flow. It avoids showing stale holds before the 30 s timer runs (spec edge case).

## R5. Payments endpoint for two roles

- **Decision**: One route, `GET /api/payments`. MANAGER gets `allPayments({ from, to })`. CUSTOMER gets `customerHistory(user.id)` and ignores range parameters. STAFF gets FORBIDDEN.
- **Rationale**: KB-15 lists "payment history" as one gap (FR-28 covers both the customer and the manager view). The service functions already exist; the route only picks one by role.
- **Alternatives considered**: A separate `/api/history` route would be clearer but is one more route for the same data.

## R6. Query validation

- **Decision**: Zod schemas in the services: `lookupSchema { method: enum, identifier: string.min(1) }`, `listSessionsSchema { status: enum default OPEN }`, `accessLogQuery { limit: coerce int 1..500 default 200 }`, `paymentsQuery { from?, to? }` parsed as dates and rejected if invalid. Routes pass `searchParams.get(...) ?? undefined`.
- **Rationale**: Validation stays in services (principle I), and `handle()` maps `ZodError` to 400 VALIDATION (FR-010).

## R7. Migration

- **Decision**: Hand-written `migration.sql` with four `CREATE INDEX` statements using Prisma's default names (`reservations_customer_id_status_idx`, `parking_sessions_entry_time_idx`, `access_logs_created_at_idx`, `access_logs_user_id_idx`), plus matching `@@index` lines in the schema.
- **Rationale**: `prisma migrate dev` needs the dev database and may prompt for a reset. Writing the SQL by hand matches the existing migrations exactly. It is verified with `prisma migrate diff --from-migrations ... --to-schema-datamodel ...`, which should report no difference.
