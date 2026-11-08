# Smart Parking MVP Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the demo MVP of the Smart Parking Management System, a responsive bilingual web app covering the end-to-end workflows in spec §9. Customers check availability, register vehicles and reserve spots. Staff record entry/exit with exceptions and simulated payment. Managers configure lots and tariffs, manage accounts, view reports, run the simulator and purge old data.

**Architecture:** One Next.js App Router app. Domain logic lives in plain TypeScript service functions under `src/server/services/`. Each service takes a Prisma client as its first argument, so Vitest can test it against a real SQLite test DB. API route handlers under `src/app/api/` are thin wrappers that authenticate, validate with zod, call a service, and publish an SSE "availability changed" event. Pages are server components that read through services; interactive parts are client components that call the API routes. Mutations that change occupancy run inside one in-process lock, so concurrent events cannot oversell a zone.

**Tech Stack:** Next.js 15 (App Router, TypeScript), React 19, Prisma 6 + SQLite, Tailwind CSS + shadcn/ui, zod 3, jose 5 (JWT session cookie), bcryptjs, qrcode, recharts 2, Vitest 3.

**Spec:** `docs/superpowers/specs/2026-11-08-smart-parking-mvp-design.md`. Requirement IDs (FR-xx, EX-xx, D-xx) below refer to it. Read it before starting any task.

## Global Constraints

- Roles: `CUSTOMER`, `STAFF`, `MANAGER`. No separate admin role (spec §4).
- User groups: `STUDENT`, `LECTURER_STAFF`, and `GUEST` for vehicles with no owner (D-10, D-36).
- Vehicle types: `MOTORBIKE`, `CAR` (CIL Q8).
- Fee is a flat price per entry, looked up by (vehicle type × fee group). No hourly fee, no monthly pass (D-03).
- No operating-hours field anywhere (D-04).
- Free count = capacity − OPEN sessions − PENDING reservations, never shown below 0 (FR-17, D-21).
- Reservation hold = arrival time + 30 minutes. Booking is same-day only (FR-23, D-19).
- Retention cutoff is 12 calendar months before now (FR-32).
- Plate mask: keep the prefix and last 2 characters, e.g. `51F-123.45` → `51F-***.45` (D-13).
- Every user-visible string goes through the i18n dictionary, in both `vi` and `en` (FR-05, D-11, D-38).
- Responsive layout that works at 375px width (CIL Q12).
- Table and column names are snake_case via Prisma `@@map` / `@map`, PK `id`, FK `<singular>_id` (spec §7).
- Entry/exit must finish in ≤ 2 s at pilot size (FR-16).
- Pin major versions: `next@15`, `prisma@6`, `@prisma/client@6`, `vitest@3`, `zod@3`, `jose@5`, `recharts@2`. Do **not** use Prisma 7 (it needs driver adapters).
- Seed: 1 lot; zones A = 150 motorbike, B = 150 motorbike, C = 30 car; tariff 2,000 VND motorbike and 10,000 VND car for all 3 groups; ≥15 customers, 2 staff, 2 managers (D-17, D-18, D-40).

## Review Focus

1. **Plate typed with different case or spacing** (`51f-123.45`, ` 51F-123.45 `, `51F 123.45`). Expect the same vehicle every time, because all input goes through `normalizePlate`. Test owner: Task 4 (`normalizePlate`) and Task 9 (entry by lowercase plate finds the existing vehicle).
2. **Manager lowers capacity below current occupancy.** Expect free to show `0` (never negative) and new entries to be rejected with `ZONE_FULL`. Test owner: Task 7.
3. **Locked account still holding a valid cookie.** Expect the next request to be treated as logged out. Test owner: Task 5 (`resolveSessionUser` returns null for a locked user).
4. **Same vehicle reserved twice, or reserved while parked.** Expect rejection with `VEHICLE_ALREADY_RESERVED` / `VEHICLE_PARKED`. Test owner: Task 11.
5. **Report range with no data, or from > to.** Expect zeros and a `null` no-show rate (shown as "—") rather than NaN, and `VALIDATION` when from > to. Test owner: Task 15.

---

## File Structure

```
.gitignore, .env.example, README.md, package.json, vitest.config.ts, middleware.ts (src/)
prisma/schema.prisma            data model (Task 3)
prisma/seed.ts                  demo seed (Task 3)
src/lib/plate.ts                normalize / mask / present plates (Task 4)
src/lib/time.ts                 day boundaries, add minutes/months (Task 4)
src/lib/types.ts                string-union domain types (Task 3)
src/i18n/{vi,en}.ts, src/i18n/index.ts   dictionaries + t() (Task 6)
src/server/db.ts                Prisma singleton (Task 3)
src/server/errors.ts            DomainError + codes (Task 4)
src/server/lock.ts              in-process mutex (Task 4)
src/server/bus.ts               availability-changed event bus (Task 4)
src/server/api.ts               route-handler wrapper (Task 5)
src/server/auth/*.ts            password, session, rbac (Task 5)
src/server/services/accessLog.ts     (Task 5)
src/server/services/auth.ts          register / authenticate (Task 5)
src/server/services/availability.ts  (Task 7)
src/server/services/vehicles.ts      (Task 8)
src/server/services/entry.ts         (Task 9)
src/server/services/fees.ts          (Task 10)
src/server/services/exit.ts          (Task 10)
src/server/services/reservations.ts  (Task 11)
src/server/services/history.ts       (Task 12)
src/server/services/lots.ts, tariffs.ts (Task 13)
src/server/services/accounts.ts      (Task 14)
src/server/services/purge.ts         (Task 14)
src/server/services/reports.ts       (Task 15)
src/server/services/simulator.ts     (Task 16)
src/instrumentation.ts          reservation-expiry interval (Task 11)
src/app/...                     pages + API routes (per task)
src/components/...              shared UI (AppShell, LangToggle, LiveAvailability, PlateText)
tests/helpers/db.ts             resetDb + makeFixture (Task 3)
tests/*.test.ts                 one file per service
```

---

### Task 1: Create git repository and connect to GitHub

**Files:**
- Create: `.gitignore`

- [ ] **Step 1: Initialise the repo**

```bash
cd /Users/codeleap/Uni/QLDAPM/parking-management-system
git init -b main
```

- [ ] **Step 2: Write `.gitignore`**

```
node_modules/
.next/
out/
*.db
*.db-journal
.env
.env*.local
.claude/settings.local.json
.DS_Store
coverage/
```

- [ ] **Step 3: Ask the user whether `resources/` (course documents) goes into the repo.** If no, add `resources/` to `.gitignore`. Wait for the answer.

- [ ] **Step 4: Initial commit**

```bash
git add -A
git commit -m "chore: initial commit with spec, plan and project docs"
```

Expected: `git log --oneline` shows 1 commit.

- [ ] **Step 5: STOP — user connects GitHub manually.** Tell the user:
  > Create an empty GitHub repo (no README), then run:
  > `! git remote add origin <url> && git push -u origin main`

  Continue only after `git remote -v` shows `origin`.

---

### Task 2: Scaffold the Next.js app with tooling

**Files:**
- Create: Next.js scaffold files, `vitest.config.ts`, `.env.example`, `tests/smoke.test.ts`
- Modify: `.gitignore` (merge the scaffold's entries), `package.json` scripts

- [ ] **Step 1: Scaffold in a sibling directory.** create-next-app refuses non-empty folders, so scaffold elsewhere and copy:

```bash
cd /Users/codeleap/Uni/QLDAPM
npx create-next-app@15 parking-scaffold --ts --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm --no-turbopack --yes
rsync -a --exclude .git --exclude .gitignore --exclude README.md parking-scaffold/ parking-management-system/
rm -rf parking-scaffold
cd parking-management-system
```

- [ ] **Step 2: Install dependencies**

```bash
npm i prisma@6 @prisma/client@6 zod@3 jose@5 bcryptjs qrcode recharts@2
npm i -D vitest@3 vite-tsconfig-paths tsx @types/bcryptjs @types/qrcode
npx shadcn@latest init -d
npx shadcn@latest add button input label card table select badge dialog tabs sonner textarea
```

- [ ] **Step 3: Write `vitest.config.ts`.** Use the `vite-tsconfig-paths` plugin, `test.environment: 'node'`, `test.env.DATABASE_URL = 'file:./test.db'`, `test.env.AUTH_SECRET = 'test-secret-test-secret-test-secret-32'`, `fileParallelism: false`, `globalSetup: './tests/global-setup.ts'`.
`tests/global-setup.ts` runs `npx prisma db push --force-reset --skip-generate` with `DATABASE_URL=file:./test.db` via `execSync`. It needs the schema from Task 3, so until then make it a no-op guarded by `existsSync('prisma/schema.prisma')`.

- [ ] **Step 4: Add `package.json` scripts**

```json
"test": "vitest run",
"db:reset": "prisma migrate reset --force",
"db:seed": "tsx prisma/seed.ts"
```

and `"prisma": { "seed": "tsx prisma/seed.ts" }`.

- [ ] **Step 5: Write `.env.example`**

```
DATABASE_URL="file:./dev.db"
AUTH_SECRET="change-me-to-a-32+char-random-string"
```

Copy it to `.env`.

- [ ] **Step 6: Smoke test.** `tests/smoke.test.ts`: `expect(1 + 1).toBe(2)`. Run `npm test` → PASS. Run `npm run build` → succeeds.

- [ ] **Step 7: Commit** `chore: scaffold Next.js app with Prisma, shadcn/ui and Vitest`

---

### Task 3: Data model, Prisma singleton, test helpers, seed

**Files:**
- Create: `prisma/schema.prisma`, `prisma/seed.ts`, `src/server/db.ts`, `src/lib/types.ts`, `tests/helpers/db.ts`, `tests/schema.test.ts`

**Interfaces — Produces:**
- `db` (PrismaClient singleton on `globalThis`) from `@/server/db`
- `type Db = PrismaClient | Prisma.TransactionClient` from `@/server/db`
- Types from `@/lib/types`:
  - `Role = 'CUSTOMER'|'STAFF'|'MANAGER'`
  - `UserGroup = 'STUDENT'|'LECTURER_STAFF'`
  - `FeeGroup = UserGroup|'GUEST'`
  - `VehicleTypeCode = 'MOTORBIKE'|'CAR'`
  - `IdMethod = 'PLATE'|'QR'|'RFID'`
  - `SessionStatus = 'OPEN'|'CLOSED'`
  - `ReservationStatus = 'PENDING'|'CANCELLED'|'NO_SHOW'|'FULFILLED'`
  - `LotStatus = 'ACTIVE'|'SUSPENDED'`
  - `SessionEventType = 'PLATE_MISMATCH_CONFIRMED'|'LOST_CARD'`
  - `AccessAction = 'LOGIN'|'LOGOUT'|'VIEW_FULL_PLATE'|'ENTRY'|'EXIT'|'MANUAL_CONFIRM'|'LOT_CHANGE'|'TARIFF_CHANGE'|'ACCOUNT_CHANGE'|'PURGE'`
- `resetDb(): Promise<void>` and `makeFixture(opts?: {motoCapA?: number; carCapC?: number; tariffs?: Partial<Record<\`${VehicleTypeCode}_${FeeGroup}\`, number>>}): Promise<Fixture>` from `tests/helpers/db.ts`, where `Fixture = {lot, zoneA, zoneB, zoneC, staff, manager, student, lecturer}`. Defaults: zone A moto capacity 2, zone B moto 2, zone C car 1. Tariff defaults: moto 2000, car 10000 for all groups. Users are created with password `password123`.

- [ ] **Step 1: Write `prisma/schema.prisma`.** SQLite has no enums, so status/type fields are `String` checked by the TS unions above. Models and fields (camelCase in Prisma, snake_case via `@map`/`@@map`):
  - `Role { code @id }` → `roles`
  - `VehicleType { code @id, nameVi, nameEn }` → `vehicle_types`
  - `User { id cuid, email @unique, passwordHash, name, roleCode → Role, userGroup String?, locked Boolean @default(false), createdAt }` → `users`
  - `ParkingLot { id, name, address, status @default("ACTIVE") }` → `parking_lots`
  - `Zone { id, lotId → ParkingLot, name }` → `zones`
  - `ZoneCapacity { zoneId, vehicleTypeCode, capacity Int, @@id([zoneId, vehicleTypeCode]) }` → `zone_capacities`
  - `Vehicle { id, plate @unique, qrCode @unique, rfidCode @unique, vehicleTypeCode, ownerId String? → User, createdAt }` → `vehicles`
  - `ParkingSession { id, vehicleId String? → Vehicle (nullable for purge), plateSnapshot, zoneId, vehicleTypeCode, feeGroup, idMethod, entryTime, exitTime DateTime?, entryStaffId → User, exitStaffId String? → User, status, reservationId String? @unique → Reservation }` → `parking_sessions`, `@@index([status, zoneId])`
  - `SessionEvent { id, sessionId, type, staffId, note String?, createdAt }` → `session_events`
  - `Reservation { id, customerId → User, vehicleId → Vehicle, zoneId, vehicleTypeCode, arrivalTime, holdUntil, status, createdAt }` → `reservations`, `@@index([status, zoneId])`
  - `Tariff { vehicleTypeCode, feeGroup, price Int, @@id([vehicleTypeCode, feeGroup]) }` → `tariffs`
  - `Payment { id, sessionId @unique, amount Int, status @default("CONFIRMED"), paidAt, confirmedById → User }` → `payments`
  - `AccessLog { id, userId String? → User, action, target String?, createdAt }` → `access_logs`

  Run `npx prisma migrate dev --name init`.

- [ ] **Step 2: Write `src/server/db.ts`** (singleton on `globalThis.__prisma`) and `src/lib/types.ts`.

- [ ] **Step 3: Write `tests/helpers/db.ts`.** `resetDb` deletes all rows child-first: payments, session_events, parking_sessions, reservations, access_logs, vehicles, tariffs, zone_capacities, zones, parking_lots, users. It then upserts the role and vehicle-type reference rows. Write `makeFixture` per the Interfaces block above.

- [ ] **Step 4: Write failing test `tests/schema.test.ts`**

```ts
it('enforces unique plate', async () => {
  await resetDb(); const f = await makeFixture();
  await db.vehicle.create({ data: { plate: '51F-123.45', qrCode: 'Q1', rfidCode: 'R1', vehicleTypeCode: 'MOTORBIKE' } });
  await expect(db.vehicle.create({ data: { plate: '51F-123.45', qrCode: 'Q2', rfidCode: 'R2', vehicleTypeCode: 'MOTORBIKE' } })).rejects.toThrow();
});
it('fixture has 3 zones with capacities', async () => {
  await resetDb(); const f = await makeFixture();
  expect(await db.zoneCapacity.count()).toBe(3);
});
```

- [ ] **Step 5: Run `npm test`.** Expected: PASS. Global setup pushes the schema to `prisma/test.db`.

- [ ] **Step 6: Write `prisma/seed.ts`.** Clear all tables in the same order as `resetDb`, then create:
  - Reference rows.
  - Lot: name `Bãi xe thí điểm`, address `Cơ sở chính`, ACTIVE.
  - Zones `A` (MOTORBIKE 150), `B` (MOTORBIKE 150), `C` (CAR 30).
  - 6 tariffs: MOTORBIKE 2000 and CAR 10000 for STUDENT, LECTURER_STAFF and GUEST.
  - `manager1@demo.local`, `manager2@demo.local` (MANAGER) and `staff1@demo.local`, `staff2@demo.local` (STAFF).
  - `customer01@demo.local` … `customer15@demo.local` (CUSTOMER). Odd numbers are STUDENT, even numbers LECTURER_STAFF.
  - One motorbike per customer, created via `addVehicle` from Task 8. Until Task 8 exists, leave a `// TODO(Task 8)` line; Task 8 must remove it.
  - All passwords `password123`.

  Run `npx prisma db seed` → succeeds.

- [ ] **Step 7: Commit** `feat: data model, seed and test helpers`

---

### Task 4: Core utilities — plates, time, errors, lock, bus

**Files:**
- Create: `src/lib/plate.ts`, `src/lib/time.ts`, `src/server/errors.ts`, `src/server/lock.ts`, `src/server/bus.ts`, `tests/plate.test.ts`, `tests/lock.test.ts`

**Interfaces — Produces:**
- `normalizePlate(raw: string): string`: trim, uppercase, remove all whitespace.
- `maskPlate(plate: string): string`: see algorithm below.
- `presentPlate(plate: string, viewer: {id: string; role: Role} | null, ownerId: string | null): string`: full plate for STAFF/MANAGER or when `viewer.id === ownerId`, else `maskPlate(plate)`. `'[purged]'` passes through unchanged.
- `endOfLocalDay(d: Date): Date`, `startOfLocalDay(d: Date): Date`, `addMinutes(d: Date, m: number): Date`, `subMonths(d: Date, m: number): Date`, `HOLD_MINUTES = 30`, `RETENTION_MONTHS = 12`.
- `class DomainError extends Error { code: ErrorCode; status: number }`. `ErrorCode` includes: `VALIDATION`, `UNAUTHENTICATED`, `FORBIDDEN`, `INVALID_CREDENTIALS`, `ACCOUNT_LOCKED`, `EMAIL_TAKEN`, `PLATE_TAKEN`, `NOT_FOUND`, `UNKNOWN_CODE`, `ZONE_FULL`, `ALREADY_OPEN`, `LOT_SUSPENDED`, `NO_OPEN_SESSION`, `PLATE_MISMATCH`, `RESERVATION_WINDOW`, `NOT_CANCELLABLE`, `VEHICLE_ALREADY_RESERVED`, `VEHICLE_PARKED`, `NOT_OWNER`.
- `withLock<T>(fn: () => Promise<T>): Promise<T>`: global promise-chain mutex stored on `globalThis`.
- `publishAvailabilityChanged(): void` and `onAvailabilityChanged(cb: () => void): () => void` (unsubscribe). Built on a `globalThis` EventEmitter.

`maskPlate` algorithm: split at the first `-`. If it exists, `prefix` = text up to and including `-` and `rest` = the remainder; otherwise `prefix` = first 3 chars and `rest` = the remainder. In `rest`, keep the last 2 characters. Replace every other letter or digit with `*` and keep separators (`.`, `-`). If `rest.length <= 2`, return the plate unchanged.

- [ ] **Step 1: Write failing tests `tests/plate.test.ts`**

```ts
expect(normalizePlate(' 51f 123.45 ')).toBe('51F123.45');
expect(normalizePlate('51f-123.45')).toBe('51F-123.45');
expect(maskPlate('51F-123.45')).toBe('51F-***.45');
expect(maskPlate('29A12345')).toBe('29A***45');
const staff = { id: 's', role: 'STAFF' as const }, cust = { id: 'c', role: 'CUSTOMER' as const };
expect(presentPlate('51F-123.45', staff, null)).toBe('51F-123.45');
expect(presentPlate('51F-123.45', cust, 'c')).toBe('51F-123.45');
expect(presentPlate('51F-123.45', cust, 'other')).toBe('51F-***.45');
expect(presentPlate('[purged]', cust, null)).toBe('[purged]');
```

- [ ] **Step 2: Run** `npx vitest run tests/plate.test.ts` → FAIL (module not found).
- [ ] **Step 3: Implement `plate.ts`, `time.ts`, `errors.ts`.**
- [ ] **Step 4: Write failing test `tests/lock.test.ts`.** Start 10 `withLock` calls; each reads a shared counter, awaits `setTimeout(1)`, then writes counter+1. Expect the final counter to be `10`.
- [ ] **Step 5: Implement `lock.ts` and `bus.ts`.** Run `npm test` → PASS.
- [ ] **Step 6: Commit** `feat: plate masking, time helpers, errors, lock and event bus`

---

### Task 5: Authentication, RBAC, access log

**Files:**
- Create: `src/server/auth/password.ts`, `src/server/auth/session.ts`, `src/server/auth/rbac.ts`, `src/server/services/auth.ts`, `src/server/services/accessLog.ts`, `src/server/api.ts`, `src/middleware.ts`, `src/app/api/auth/{register,login,logout}/route.ts`, `tests/auth.test.ts`

**Interfaces:**
- Consumes: `db`, `Db`, `DomainError`, types.
- Produces:
  - `hashPassword(p: string): Promise<string>`, `verifyPassword(p: string, hash: string): Promise<boolean>` (bcryptjs, cost 10).
  - `registerCustomer(db: Db, input: {email: string; password: string; name: string; userGroup: UserGroup}): Promise<User>`. Lowercases the email; throws `EMAIL_TAKEN` (409). zod: valid email, password ≥ 8 chars, name 1–100 chars (FR-01, D-35).
  - `authenticate(db: Db, email: string, password: string): Promise<User>`. Throws `INVALID_CREDENTIALS` (401) or `ACCOUNT_LOCKED` (403) (FR-04). On success it logs `LOGIN`.
  - `type CurrentUser = {id: string; role: Role; name: string; userGroup: UserGroup | null}`
  - `signSession(user: CurrentUser): Promise<string>` and `verifySession(token: string): Promise<{userId: string; role: Role} | null>` (jose HS256, `AUTH_SECRET`, 7-day expiry).
  - `resolveSessionUser(db: Db, token: string | undefined): Promise<CurrentUser | null>`. Returns null when the token is invalid, the user is missing, or the user is locked.
  - `getCurrentUser(): Promise<CurrentUser | null>` reads cookie `session` via `cookies()`.
  - `assertRole(user: CurrentUser | null, roles: Role[]): CurrentUser` throws `UNAUTHENTICATED` (401) / `FORBIDDEN` (403). `requireRole(...roles: Role[]): Promise<CurrentUser>` = `assertRole(await getCurrentUser(), roles)`.
  - `logAccess(db: Db, entry: {userId: string | null; action: AccessAction; target?: string}): Promise<void>`
  - `handle(fn: (req: Request, ctx: any) => Promise<unknown>)` wraps a route handler. It returns `Response.json(result)`, maps `DomainError` → `{error: code}` with its status, and maps `ZodError` → 400 `{error: 'VALIDATION'}`.
- Routes:
  - `POST /api/auth/register` → creates a customer and sets the cookie.
  - `POST /api/auth/login` → sets cookie `session` (httpOnly, sameSite lax, path /).
  - `POST /api/auth/logout` → logs `LOGOUT` and clears the cookie.
- `src/middleware.ts`: for `/customer/*`, `/staff/*`, `/manager/*`, verify the JWT (jose works in edge). No or invalid token → redirect to `/login`. Wrong role → redirect `/`. `/staff/*` allows STAFF and MANAGER; `/customer/*` allows CUSTOMER; `/manager/*` allows MANAGER.

- [ ] **Step 1: Write failing tests `tests/auth.test.ts`**

```ts
it('registers and authenticates a customer', async () => {
  await resetDb(); await makeFixture();
  await registerCustomer(db, { email: 'A@x.com', password: 'password123', name: 'An', userGroup: 'STUDENT' });
  const u = await authenticate(db, 'a@x.com', 'password123');
  expect(u.roleCode).toBe('CUSTOMER');
  expect(await db.accessLog.count({ where: { action: 'LOGIN' } })).toBe(1);
});
it('rejects duplicate email', /* EMAIL_TAKEN */);
it('rejects wrong password with INVALID_CREDENTIALS');
it('rejects locked account with ACCOUNT_LOCKED');
it('resolveSessionUser returns null for locked user with valid token', async () => {
  /* sign token for fixture.student, set locked=true, expect null */
});
it('assertRole: customer on staff action -> FORBIDDEN, null -> UNAUTHENTICATED, manager on staff action -> ok');
```

- [ ] **Step 2: Run** → FAIL.
- [ ] **Step 3: Implement** password, session, rbac, auth service, accessLog, api wrapper, routes, middleware.
- [ ] **Step 4: Run `npm test`** → PASS.
- [ ] **Step 5: Commit** `feat: auth with JWT cookie, RBAC and access log`

---

### Task 6: i18n, app shell, login and register pages

**Files:**
- Create: `src/i18n/vi.ts`, `src/i18n/en.ts`, `src/i18n/index.ts`, `src/app/api/lang/route.ts`, `src/components/AppShell.tsx`, `src/components/LangToggle.tsx`, `src/components/I18nProvider.tsx`, `src/app/login/page.tsx`, `src/app/register/page.tsx`, `src/app/page.tsx`, `tests/i18n.test.ts`
- Modify: `src/app/layout.tsx`

**Interfaces — Produces:**
- `type Lang = 'vi' | 'en'`. `vi.ts` exports `const vi = {...} as const`; `en.ts` exports `const en: Dict` with the same shape (`type Dict = typeof vi`).
- `getLang(): Promise<Lang>` (cookie `lang`, default `'vi'`). `getDict(lang): Dict`. `t(dict, 'path.to.key')`.
- Client: `<I18nProvider lang dict>` + `useT(): (key: string) => string`.
- `POST /api/lang` `{lang}` sets the cookie. `<LangToggle/>` renders `VI | EN` and calls it, then `router.refresh()`.
- `<AppShell user nav>`: top bar with app name, role-based nav links, `LangToggle` and logout. It is on every page, including login/register (D-38), and collapses to a menu below `md`.
- Error messages: keys `errors.<ErrorCode>` for every `ErrorCode` in both dictionaries.
- `/` redirects by role: CUSTOMER → `/customer`, STAFF → `/staff`, MANAGER → `/manager`, none → `/login`.
- `/register` form: email, password, name, user group select (Student / Lecturer-Staff) (FR-01).

- [ ] **Step 1: Write failing test `tests/i18n.test.ts`.** It recursively collects keys from `vi` and `en` and expects equal sorted key lists. It also checks that every `ErrorCode` value has an `errors.<code>` key.
- [ ] **Step 2: Run** → FAIL.
- [ ] **Step 3: Implement** dictionaries, provider, toggle, shell, pages. Every later task adds its strings to both files.
- [ ] **Step 4: Run `npm test`** → PASS. Then `npm run dev` and manually check: register → redirect to `/customer`, toggle switches language, logout works, phone width (375px) has no horizontal scroll.
- [ ] **Step 5: Commit** `feat: bilingual shell, login and register`

---

### Task 7: Availability service, SSE stream, live view

**Files:**
- Create: `src/server/services/availability.ts`, `src/app/api/availability/route.ts`, `src/app/api/availability/stream/route.ts`, `src/components/LiveAvailability.tsx`, `src/app/customer/page.tsx`, `src/app/staff/page.tsx`, `src/app/manager/page.tsx`, `tests/availability.test.ts`

**Interfaces — Produces:**
- `type TypeAvailability = {vehicleType: VehicleTypeCode; capacity: number; open: number; reserved: number; free: number}`
- `type ZoneAvailability = {zoneId: string; zoneName: string; byType: TypeAvailability[]}`
- `type LotAvailability = {lotId: string; lotName: string; status: LotStatus; zones: ZoneAvailability[]}`
- `getAvailability(db: Db, now?: Date): Promise<LotAvailability[]>`. `reserved` = PENDING reservations with `holdUntil > now`. `free = max(0, capacity − open − reserved)`.
- `getFree(db: Db, zoneId: string, vehicleType: VehicleTypeCode, now?: Date): Promise<number>` (same formula for one zone and type).
- `GET /api/availability` (any logged-in role) → `LotAvailability[]`.
- `GET /api/availability/stream`: SSE (`text/event-stream`, `runtime = 'nodejs'`, `dynamic = 'force-dynamic'`). It sends `data: <json LotAvailability[]>\n\n` on connect and after every `onAvailabilityChanged`, plus a `: ping` every 25 s. It unsubscribes when the request aborts.
- `<LiveAvailability initial={LotAvailability[]}/>` (client): opens an `EventSource` on the stream and renders one card per lot (with a "Suspended" badge when `status === 'SUSPENDED'`, FR-19a), and a table per zone × type showing free / capacity.
- The `/customer`, `/staff` and `/manager` home pages render `LiveAvailability`.

- [ ] **Step 1: Write failing tests `tests/availability.test.ts`**

```ts
it('free = capacity - open - pending reservations', async () => {
  // fixture zoneA moto cap 2; create 1 OPEN session in A and 1 PENDING reservation in A (holdUntil = now+30m)
  const a = await getAvailability(db, now);
  const moto = a[0].zones.find(z => z.zoneName === 'A')!.byType.find(t => t.vehicleType === 'MOTORBIKE')!;
  expect(moto).toMatchObject({ capacity: 2, open: 1, reserved: 1, free: 0 });
});
it('ignores CLOSED sessions and non-PENDING / expired reservations');
it('never returns negative free when capacity lowered below occupancy', async () => {
  // 2 OPEN in A, then update capacity to 1 -> free 0
});
it('reports SUSPENDED lot status with normal counts');
```

- [ ] **Step 2: Run** → FAIL.
- [ ] **Step 3: Implement** the service, routes, component and pages.
- [ ] **Step 4: Run `npm test`** → PASS. In the browser, open `/customer` and confirm the cards render.
- [ ] **Step 5: Commit** `feat: availability service with SSE live view`

---

### Task 8: Customer vehicles (QR + RFID, plate uniqueness, Guest claim)

**Files:**
- Create: `src/server/services/vehicles.ts`, `src/app/api/vehicles/route.ts`, `src/app/api/vehicles/[id]/route.ts`, `src/app/customer/vehicles/page.tsx`, `src/components/PlateText.tsx`, `tests/vehicles.test.ts`
- Modify: `prisma/seed.ts` (remove the TODO from Task 3; add one vehicle per customer)

**Interfaces — Produces:**
- `generateCode(prefix: 'QR' | 'RF'): string` → `${prefix}-` + 10 uppercase base32 chars from `crypto.randomBytes`.
- `addVehicle(db: Db, input: {ownerId: string; plate: string; vehicleType: VehicleTypeCode}): Promise<Vehicle>`:
  - Normalises the plate.
  - Plate does not exist → create with new `qrCode` and `rfidCode` (D-32).
  - Plate exists with `ownerId === null` → set `ownerId` (claim, D-33) and keep its codes and type.
  - Plate exists with another owner → `PLATE_TAKEN` (409).
  - Plate exists with the same owner → `PLATE_TAKEN`.
- `listVehicles(db: Db, ownerId: string): Promise<Vehicle[]>`
- `removeVehicle(db: Db, ownerId: string, vehicleId: string): Promise<void>`. `NOT_OWNER` if the vehicle is not the user's. If the vehicle has sessions or reservations, set `ownerId = null` instead of deleting.
- `findVehicleByIdentifier(db: Db, method: IdMethod, identifier: string): Promise<Vehicle | null>`. PLATE uses `normalizePlate`; QR/RFID match the trimmed, uppercased code.
- `<PlateText plate ownerId/>` renders `presentPlate` for the current viewer.
- Routes (CUSTOMER only): `GET/POST /api/vehicles`, `DELETE /api/vehicles/[id]`.
- Page `/customer/vehicles`: list of vehicles with plate (full), type, QR image (`qrcode.toDataURL(qrCode)`), QR text value (D-37), RFID code; an add form (plate, type); and a remove button.

- [ ] **Step 1: Write failing tests `tests/vehicles.test.ts`**

```ts
it('adds vehicle with QR- and RF- codes', async () => {
  const v = await addVehicle(db, { ownerId: f.student.id, plate: '51f-123.45', vehicleType: 'MOTORBIKE' });
  expect(v.plate).toBe('51F-123.45'); expect(v.qrCode).toMatch(/^QR-[A-Z2-7]{10}$/); expect(v.rfidCode).toMatch(/^RF-/);
});
it('claims existing guest vehicle', /* create vehicle ownerId null, addVehicle -> same id, ownerId set */);
it('rejects plate owned by another customer with PLATE_TAKEN');
it('allows multiple vehicles per customer');
it('findVehicleByIdentifier finds by plate case-insensitively, by QR and by RFID');
```

- [ ] **Step 2: Run** → FAIL. **Step 3: Implement** the service, routes, page and seed change. **Step 4: Run `npm test`** → PASS. Run `npx prisma db seed` → succeeds.
- [ ] **Step 5: Commit** `feat: customer vehicles with QR/RFID codes`

---

### Task 9: Entry service (EX-01, EX-04, EX-05, reservation fulfilment) + staff entry screen

**Files:**
- Create: `src/server/services/entry.ts`, `src/app/api/events/entry/route.ts`, `src/app/staff/entry/page.tsx`, `tests/entry.test.ts`

**Interfaces:**
- Consumes: `findVehicleByIdentifier`, `generateCode`, `getFree`, `withLock`, `publishAvailabilityChanged`, `logAccess`.
- Produces: `recordEntry(db: Db, input: {method: IdMethod; identifier: string; zoneId: string; vehicleType?: VehicleTypeCode; staffId: string; now?: Date}): Promise<ParkingSession>`. Algorithm, all inside `withLock` and `db.$transaction`:
  1. Load the zone and its lot. If the lot is SUSPENDED → `LOT_SUSPENDED` (409) (EX-05).
  2. Find the vehicle by identifier.
     - Not found and method is QR/RFID → `UNKNOWN_CODE` (404).
     - Not found and method is PLATE → `vehicleType` is required (`VALIDATION` otherwise); create a Guest vehicle with no owner and new codes (FR-12, D-36).
     - Found → the type comes from the vehicle and `input.vehicleType` is ignored.
  3. Vehicle has an OPEN session → `ALREADY_OPEN` (409) (EX-04).
  4. Look for a PENDING reservation of this vehicle with `holdUntil > now`.
     - In this zone → it is "own".
     - In a different zone → set it CANCELLED (D-34) and treat the entry as a walk-in.
  5. `free = getFree(zone, type)`. If there is no own reservation and `free <= 0` → `ZONE_FULL` (409) (EX-01).
  6. Create the session: OPEN, `plateSnapshot = vehicle.plate`, `feeGroup = owner?.userGroup ?? 'GUEST'`, `idMethod`, `entryStaffId`, `entryTime = now`. If there is an own reservation, also set `reservationId` and mark the reservation FULFILLED.
  7. After commit: `logAccess(ENTRY, target = session.id)` and `publishAvailabilityChanged()`.
- `POST /api/events/entry` (STAFF, MANAGER), body `{method, identifier, zoneId, vehicleType?}` → session. This is the single entry API (FR-15).
- Page `/staff/entry`:
  - Method tabs: Plate / QR / RFID. The identifier input accepts typed or pasted text (D-25).
  - Zone select; vehicle-type select shown for the Plate method.
  - Submit button: 3 operations max (FR-11).
  - Success toast, or an error toast with `errors.<code>`.

- [ ] **Step 1: Write failing tests `tests/entry.test.ts`**

```ts
it('opens session for registered vehicle by QR with owner feeGroup and plate snapshot');
it('creates guest vehicle for unknown plate with feeGroup GUEST');
it('finds existing vehicle when plate typed lowercase with spaces');
it('UNKNOWN_CODE for unknown QR');
it('EX-01 ZONE_FULL when zone A (cap 2) has 2 open sessions');
it('EX-04 ALREADY_OPEN on second entry of same vehicle');
it('EX-05 LOT_SUSPENDED when lot suspended');
it('fulfils own pending reservation even when free is 0', async () => {
  // A cap 2: 1 open + 1 pending (this vehicle) -> free 0; entry into A succeeds; reservation FULFILLED; session.reservationId set
});
it('early arrival (before arrivalTime, before holdUntil) still fulfils');
it('entry into other zone cancels reservation and counts as walk-in');
it('20 concurrent entries into zone with cap 2 -> exactly 2 succeed', async () => {
  const results = await Promise.allSettled(Array.from({length: 20}, (_, i) =>
    recordEntry(db, { method: 'PLATE', identifier: `59X-${i}`, zoneId: f.zoneA.id, vehicleType: 'MOTORBIKE', staffId: f.staff.id })));
  expect(results.filter(r => r.status === 'fulfilled')).toHaveLength(2);
});
```

- [ ] **Step 2: Run** → FAIL. **Step 3: Implement.** **Step 4: Run `npm test`** → PASS.
- [ ] **Step 5: Commit** `feat: vehicle entry with exceptions and reservation fulfilment`

---

### Task 10: Fees, exit service (EX-02, EX-03), payment, staff exit + session screens

**Files:**
- Create: `src/server/services/fees.ts`, `src/server/services/exit.ts`, `src/app/api/events/exit/preview/route.ts`, `src/app/api/events/exit/confirm/route.ts`, `src/app/staff/exit/page.tsx`, `src/app/staff/sessions/page.tsx`, `src/app/staff/sessions/[id]/page.tsx`, `tests/fees.test.ts`, `tests/exit.test.ts`

**Interfaces — Produces:**
- `computeFee(db: Db, vehicleType: VehicleTypeCode, feeGroup: FeeGroup): Promise<number>`: tariff price; a missing tariff → `NOT_FOUND`.
- `type ExitPreview = {sessionId: string; plateSnapshot: string; zoneName: string; vehicleType: VehicleTypeCode; feeGroup: FeeGroup; entryTime: Date; fee: number; plateMismatch: boolean}`
- `previewExit(db: Db, input: {method: IdMethod; identifier: string; observedPlate: string}): Promise<ExitPreview>`. Finds the vehicle and its OPEN session; none → `NO_OPEN_SESSION` (404). `plateMismatch = normalizePlate(observedPlate) !== session.plateSnapshot` (D-26).
- `confirmExit(db: Db, input: {sessionId: string; observedPlate: string; confirmMismatch: boolean; lostCard: boolean; note?: string; staffId: string; now?: Date}): Promise<{session: ParkingSession; payment: Payment}>`. Runs inside `withLock` + transaction:
  - Session not OPEN → `NO_OPEN_SESSION`.
  - Mismatch and `!confirmMismatch` → `PLATE_MISMATCH` (409).
  - Mismatch confirmed → `SessionEvent PLATE_MISMATCH_CONFIRMED`; the note includes the observed plate (EX-02).
  - `lostCard` → `SessionEvent LOST_CARD` (EX-03, D-09).
  - Create `Payment {amount: computeFee(session.vehicleTypeCode, session.feeGroup), status: CONFIRMED, paidAt: now, confirmedById: staffId}` (FR-27, D-06).
  - Close the session: `exitTime = now`, `exitStaffId`, status CLOSED.
  - After commit: `logAccess(EXIT)`, plus `MANUAL_CONFIRM` when any session event was written; then publish.
  - Exits work regardless of lot status (D-27).
- Routes (STAFF, MANAGER): `POST /api/events/exit/preview`, `POST /api/events/exit/confirm`.
- Page `/staff/exit`:
  1. Method tabs + identifier + "observed plate" input (always required) + a "Lost card" checkbox. When checked, the method is forced to Plate and a note field appears.
  2. Preview card shows the fee. A mismatch shows a warning plus a "Confirm manually" checkbox that must be ticked.
  3. "Confirm simulated payment & close" button.
- Page `/staff/sessions`: OPEN sessions list (plate full for staff, zone, entry time). Clicking a row goes to `/staff/sessions/[id]`, the detail page with vehicle info, events and payment. Opening the detail page calls `logAccess(VIEW_FULL_PLATE, target = session.id)` (D-31).

- [ ] **Step 1: Write failing tests**

`tests/fees.test.ts`:
```ts
// fixture tariffs: MOTORBIKE_STUDENT 3000, MOTORBIKE_LECTURER_STAFF 5000, MOTORBIKE_GUEST 7000, CAR_GUEST 20000
expect(await computeFee(db, 'MOTORBIKE', 'STUDENT')).toBe(3000);
expect(await computeFee(db, 'MOTORBIKE', 'LECTURER_STAFF')).toBe(5000);
expect(await computeFee(db, 'MOTORBIKE', 'GUEST')).toBe(7000);
expect(await computeFee(db, 'CAR', 'GUEST')).toBe(20000);
```

`tests/exit.test.ts`:
```ts
it('closes session and creates CONFIRMED payment with group fee');
it('preview flags plateMismatch when observed plate differs');
it('EX-02 confirm without confirmMismatch -> PLATE_MISMATCH; with it -> closed + PLATE_MISMATCH_CONFIRMED event');
it('EX-03 lostCard via PLATE -> LOST_CARD event + payment + closed');
it('NO_OPEN_SESSION when vehicle has no open session');
it('exit allowed while lot SUSPENDED');
it('fee uses feeGroup snapshotted at entry even if vehicle later claimed by a customer');
```

- [ ] **Step 2: Run** → FAIL. **Step 3: Implement.** **Step 4: Run `npm test`** → PASS. In the browser: enter by plate on `/staff/entry`, exit on `/staff/exit`, and see the payment.
- [ ] **Step 5: Commit** `feat: exit flow with plate check, lost card and simulated payment`

---

### Task 11: Reservations + expiry + customer reservations page

**Files:**
- Create: `src/server/services/reservations.ts`, `src/app/api/reservations/route.ts`, `src/app/api/reservations/[id]/cancel/route.ts`, `src/app/customer/reservations/page.tsx`, `src/instrumentation.ts`, `tests/reservations.test.ts`

**Interfaces — Produces:**
- `createReservation(db: Db, input: {customerId: string; vehicleId: string; zoneId: string; arrivalTime: Date; now?: Date}): Promise<Reservation>`. Runs inside `withLock` + transaction:
  1. Run `expireReservations` first.
  2. Vehicle not owned by the customer → `NOT_OWNER`.
  3. Arrival not in `[now, endOfLocalDay(now)]` → `RESERVATION_WINDOW` (D-19).
  4. Lot SUSPENDED → `LOT_SUSPENDED` (D-27).
  5. Vehicle already has a PENDING reservation → `VEHICLE_ALREADY_RESERVED`.
  6. Vehicle has an OPEN session → `VEHICLE_PARKED`.
  7. `getFree(zone, vehicle type) <= 0` → `ZONE_FULL` (FR-21).
  8. Create the reservation: PENDING, `holdUntil = arrival + 30 min`, `vehicleTypeCode` from the vehicle.
  9. Publish.
- `cancelReservation(db: Db, input: {customerId: string; reservationId: string; now?: Date}): Promise<Reservation>`. Must be the customer's own PENDING reservation with `now < arrivalTime`, otherwise `NOT_CANCELLABLE`. Sets CANCELLED and publishes (FR-22).
- `expireReservations(db: Db, now?: Date): Promise<number>`. Sets PENDING reservations with `holdUntil <= now` to NO_SHOW and returns the count (FR-23).
- `listReservations(db: Db, customerId: string): Promise<Reservation[]>`
- `getAvailability` (Task 7) and `recordEntry` (Task 9) must call `expireReservations` first. Add that call and a test in each.
- `src/instrumentation.ts`: in `register()`, when `process.env.NEXT_RUNTIME === 'nodejs'`, run `setInterval` every 30 s: `if (await expireReservations(db) > 0) publishAvailabilityChanged()`. Guard against double registration with a `globalThis` flag.
- Routes (CUSTOMER): `GET/POST /api/reservations`, `POST /api/reservations/[id]/cancel`.
- Page `/customer/reservations`: create form (vehicle select from own vehicles, zone select filtered to zones with capacity for that vehicle's type, time input for today). The list shows status, arrival, hold-until and a cancel button while cancellable.

- [ ] **Step 1: Write failing tests `tests/reservations.test.ts`**

```ts
it('creates PENDING with holdUntil = arrival + 30 min and reduces free by 1');
it('RESERVATION_WINDOW for arrival in the past or tomorrow');
it('LOT_SUSPENDED when lot suspended; existing PENDING kept on suspend');
it('ZONE_FULL when no free spot');
it('VEHICLE_ALREADY_RESERVED on second reservation for same vehicle');
it('VEHICLE_PARKED when vehicle has open session');
it('cancel before arrival -> CANCELLED; at/after arrival -> NOT_CANCELLABLE');
it('expireReservations marks NO_SHOW at holdUntil and frees the spot', async () => {
  // arrival = now, hold = now+30m; expire at now+31m -> 1; availability free back to capacity
});
it('walk-in rejected when last free spot is reserved (ZONE_FULL)');
```

- [ ] **Step 2: Run** → FAIL. **Step 3: Implement.** **Step 4: Run `npm test`** → PASS.
- [ ] **Step 5: Commit** `feat: reservations with same-day window, cancel and no-show expiry`

---

### Task 12: Customer history and manager payments list

**Files:**
- Create: `src/server/services/history.ts`, `src/app/customer/history/page.tsx`, `src/app/manager/payments/page.tsx`, `tests/history.test.ts`

**Interfaces — Produces:**
- `customerHistory(db: Db, customerId: string): Promise<Array<{sessionId: string; plate: string; zoneName: string; entryTime: Date; exitTime: Date | null; amount: number | null; paidAt: Date | null}>>`. Sessions whose owner snapshot at entry (`parking_sessions.owner_id`) is the customer, newest first (FR-28); never scoped by current vehicle owner.
- `allPayments(db: Db, opts: {from?: Date; to?: Date}): Promise<Array<{paymentId: string; plateSnapshot: string; amount: number; paidAt: Date; confirmedByName: string; zoneName: string}>>`, newest first.
- Pages render tables. The customer sees own plates in full (D-39). The manager sees full plates; `[purged]` is shown as-is.

- [ ] **Step 1: Failing tests.** History returns only the customer's sessions, with amounts; `allPayments` filters by `paidAt` range.
- [ ] **Step 2–4:** Run → FAIL, implement, run → PASS.
- [ ] **Step 5: Commit** `feat: customer history and manager payments list`

---

### Task 13: Manager lot, zone, capacity, status and tariff management

**Files:**
- Create: `src/server/services/lots.ts`, `src/server/services/tariffs.ts`, `src/app/api/lots/route.ts`, `src/app/api/lots/[id]/route.ts`, `src/app/api/zones/route.ts`, `src/app/api/zones/[id]/route.ts`, `src/app/api/tariffs/route.ts`, `src/app/manager/lots/page.tsx`, `src/app/manager/tariffs/page.tsx`, `tests/lots.test.ts`

**Interfaces — Produces** (all MANAGER; each mutation calls `logAccess` and `publishAvailabilityChanged`):
- `createLot(db, actorId, {name, address}): Promise<ParkingLot>` and `updateLot(db, actorId, lotId, {name?, address?, status?: LotStatus}): Promise<ParkingLot>`. Both log `LOT_CHANGE` (FR-07, FR-10).
- `createZone(db, actorId, {lotId, name, capacities: Partial<Record<VehicleTypeCode, number>>}): Promise<Zone>` and `updateZone(db, actorId, zoneId, {name?, capacities?})`. Capacity is an integer ≥ 0 (zod) and is upserted into `zone_capacities`. Logs `LOT_CHANGE` (FR-08).
- `listTariffs(db): Promise<Tariff[]>` and `setTariff(db, actorId, {vehicleType, feeGroup, price}): Promise<Tariff>`. Price is an integer ≥ 0. Logs `TARIFF_CHANGE` (FR-09).
- Page `/manager/lots`: list lots → zones with capacity per type, inline edit, an add-zone form, an add-lot form, and an Active/Suspended toggle per lot.
- Page `/manager/tariffs`: 2 × 3 grid (type × STUDENT / LECTURER_STAFF / GUEST) with editable prices.

- [ ] **Step 1: Failing tests `tests/lots.test.ts`**

```ts
it('creates second lot and zone; getAvailability returns 2 lots');
it('updating capacity changes free count and logs LOT_CHANGE');
it('suspend then reactivate lot toggles status; entry allowed again after reactivation');
it('setTariff changes computeFee result and logs TARIFF_CHANGE');
it('rejects negative capacity/price with VALIDATION');
```

- [ ] **Step 2–4:** Run → FAIL, implement, run → PASS.
- [ ] **Step 5: Commit** `feat: manager lot, zone, capacity, status and tariff management`

---

### Task 14: Manager accounts, access log page, purge

**Files:**
- Create: `src/server/services/accounts.ts`, `src/server/services/purge.ts`, `src/app/api/accounts/route.ts`, `src/app/api/accounts/[id]/route.ts`, `src/app/api/purge/route.ts`, `src/app/manager/accounts/page.tsx`, `src/app/manager/access-log/page.tsx`, `tests/accounts.test.ts`, `tests/purge.test.ts`

**Interfaces — Produces:**
- `listUsers(db): Promise<User[]>`
- `createStaffAccount(db, actorId, {email, password, name, role: 'STAFF' | 'MANAGER'}): Promise<User>`
- `setLocked(db, actorId, userId, locked: boolean): Promise<User>`. A manager cannot lock themselves (`VALIDATION`). All three log `ACCOUNT_CHANGE` (D-24).
- `listAccessLogs(db, {limit: 200}): Promise<Array<AccessLog & {userName: string | null}>>`, newest first.
- `purgeOldData(db: Db, actorId: string, now?: Date): Promise<{sessionsMasked: number; vehiclesDeleted: number}>`. With `cutoff = subMonths(now, 12)`:
  - Sessions with `entryTime < cutoff` and `plateSnapshot !== '[purged]'` get `plateSnapshot = '[purged]'`.
  - Vehicles with `ownerId = null` and no session with `entryTime >= cutoff` and no reservation are deleted, after setting `vehicleId = null` on their old sessions.
  - Logs `PURGE` with target `"<n> sessions, <m> vehicles"` (FR-32, D-29).
- Page `/manager/accounts`: user table (email, name, role, group, locked) with a lock/unlock button and a create Staff/Manager form.
- Page `/manager/access-log`: table (time, user, action, target) and a "Purge data older than 12 months" button with a confirm dialog that shows the result counts.

- [ ] **Step 1: Failing tests**

`tests/accounts.test.ts`: create a STAFF account, then authenticate as it; locking → `authenticate` throws `ACCOUNT_LOCKED`; a manager locking themselves → `VALIDATION`; `ACCOUNT_CHANGE` is logged.

`tests/purge.test.ts`:
```ts
it('masks sessions older than 12 months, keeps newer ones', /* session entry 13 months ago -> '[purged]'; 11 months ago unchanged */);
it('deletes unowned vehicle with only old sessions; keeps owned vehicle and unowned vehicle with recent session');
it('logs PURGE');
it('second purge reports 0 sessionsMasked');
```

- [ ] **Step 2–4:** Run → FAIL, implement, run → PASS.
- [ ] **Step 5: Commit** `feat: account management, access log view and data purge`

---

### Task 15: Reports dashboard

**Files:**
- Create: `src/server/services/reports.ts`, `src/app/api/reports/route.ts`, `src/app/manager/reports/page.tsx`, `tests/reports.test.ts`

**Interfaces — Produces:**
- `type Report = {utilisationByHour: Array<{hour: number; rate: number}>; peakHours: Array<{hour: number; entries: number}>; revenue: {total: number; byDate: Array<{date: string; amount: number}>}; noShowRate: number | null}`
- `buildReport(db: Db, input: {from: Date; to: Date}): Promise<Report>`. `from`/`to` are local dates (inclusive days); `from > to` → `VALIDATION`. Definitions (D-30):
  - `utilisationByHour`, for hours 0–23: for each day d in range, `occupied(d,h)` = number of sessions with `entryTime <= d h:30` and (`exitTime` null or `> d h:30`). `rate = average over days of occupied ÷ total capacity` (sum of all `zone_capacities`), rounded to 4 decimals. Capacity 0 → rate 0.
  - `peakHours`: count entries per hour of day over sessions with `entryTime` in range; top 3 by count, ties broken by lower hour.
  - `revenue`: CONFIRMED payments with `paidAt` in range, grouped by local date `YYYY-MM-DD`, plus `total`.
  - `noShowRate`: over reservations with `arrivalTime` in range, `NO_SHOW ÷ (all − CANCELLED)`; denominator 0 → `null`.
- `GET /api/reports?from=YYYY-MM-DD&to=YYYY-MM-DD` (MANAGER). Default is today–today (D-20).
- Page `/manager/reports`: two date inputs plus 4 cards — a utilisation bar chart by hour (recharts), a peak-hours list, a revenue total with a per-day bar chart, and the no-show rate as a % or "—".

- [ ] **Step 1: Failing tests `tests/reports.test.ts`**

```ts
// capacity total = 5 (fixture: A2 + B2 + C1). One day D:
// session S1 08:00-10:00, S2 09:00-open, payments 2000 + 3000 on D, reservations: 1 NO_SHOW, 1 FULFILLED, 1 CANCELLED
it('utilisation hour 9 = 2/5 = 0.4, hour 8 = 0.2, hour 11 = 0.2');
it('peakHours top entry hours = [8, 9]');
it('revenue total 5000, byDate [{date: D, amount: 5000}]');
it('noShowRate = 1 / (3 - 1) = 0.5');
it('empty range -> zeros and noShowRate null');
it('from > to -> VALIDATION');
```

- [ ] **Step 2–4:** Run → FAIL, implement, run → PASS.
- [ ] **Step 5: Commit** `feat: manager reports with four metrics`

---

### Task 16: Simulator

**Files:**
- Create: `src/server/services/simulator.ts`, `src/app/api/simulator/route.ts`, `src/app/manager/simulator/page.tsx`, `tests/simulator.test.ts`

**Interfaces — Produces** (MANAGER; `actorId` is used as the staff id for events):
- `randomPlate(): string` → format `NNL-NNN.NN` (e.g. `59X-482.17`), with the letter from `A–Z`.
- `simulateLive(db: Db, actorId: string, n: number): Promise<{entries: number; exits: number; rejected: number}>`. For i in 0..n−1: if there are OPEN sessions and `Math.random() < 0.4`, pick a random open session and run `previewExit` + `confirmExit` with the correct plate. Otherwise `recordEntry` with method PLATE, a random plate, a random zone and a type the zone has capacity for. A `DomainError` counts as `rejected`. Every event goes through the same `recordEntry`/`confirmExit` services the API uses (FR-15). `n` is 1–500.
- `triggerException(db: Db, actorId: string, ex: 'EX01'|'EX02'|'EX03'|'EX04'|'EX05'): Promise<{exception: string; outcome: string; instructions?: {identifier: string; method: IdMethod; observedPlate?: string}}>` (D-28):
  - EX01: fill a random zone/type to capacity with guest entries, then attempt one more → `outcome = 'ZONE_FULL'`.
  - EX04: enter a random plate twice → `'ALREADY_OPEN'`.
  - EX05: suspend the first lot, attempt an entry → `'LOT_SUSPENDED'`, then reactivate the lot.
  - EX02: open a session for a random plate P; return instructions (method PLATE, identifier P, observedPlate = P with its last digit changed) for Staff to resolve on `/staff/exit`.
  - EX03: open a session via QR for a seeded customer vehicle; return instructions (method PLATE, identifier = the plate, tick "Lost card").
- `generateHistory(db: Db, actorId: string, days: number): Promise<{sessions: number; reservations: number; payments: number}>`. Writes directly with Prisma (no lock, past timestamps only):
  - For each of the past `days` days (1–60): 30–80 closed sessions with random entry between 06:00–20:00, duration 15–240 min, random zone/type, `feeGroup` from a random seeded customer vehicle or GUEST, and a CONFIRMED payment at exit time with `computeFee`.
  - 5–10 reservations per day with mixed statuses NO_SHOW / FULFILLED / CANCELLED.
  - Also 20 closed sessions about 13 months ago (D-29).
  - Then `publishAvailabilityChanged()`.
- `POST /api/simulator` body `{action: 'live', n} | {action: 'exception', ex} | {action: 'history', days}`.
- Page `/manager/simulator`:
  - Number input + "Fire N events" button, defaulting to 120 (≥ 100 for O2).
  - 5 buttons EX-01..EX-05 showing outcome and instructions.
  - Days input + "Generate history" button.

- [ ] **Step 1: Failing tests `tests/simulator.test.ts`**

```ts
it('randomPlate matches /^\\d{2}[A-Z]-\\d{3}\\.\\d{2}$/');
it('simulateLive(120) records entries+exits+rejected = 120; every session has plateSnapshot, zone, entryStaffId, idMethod');
it('availability free never negative after simulateLive');
it('FR-16: with seed-size capacities (A150/B150/C30) each recordEntry/confirmExit call takes < 2000 ms (measure max over simulateLive(100))');
it('EX01 -> ZONE_FULL, EX04 -> ALREADY_OPEN, EX05 -> LOT_SUSPENDED and lot ACTIVE afterwards');
it('EX02 instructions lead previewExit to plateMismatch true');
it('generateHistory(3) creates payments and NO_SHOW reservations and >= 20 sessions older than 12 months');
```

- [ ] **Step 2–4:** Run → FAIL, implement, run → PASS.
- [ ] **Step 5: Commit** `feat: simulator for live events, exceptions and history`

---

### Task 17: README, demo walkthrough, final verification

**Files:**
- Create: `README.md`
- Modify: any file needed to fix issues found in the walkthrough

- [ ] **Step 1: Write `README.md`.** Cover:
  - Prerequisites: Node ≥ 20.
  - Setup: `npm i`, `cp .env.example .env`, `npx prisma migrate reset --force` (migrates and seeds), `npm run dev`.
  - `npm test`.
  - A demo accounts table: 2 managers, 2 staff, 15 customers, password `password123`.
  - A short API list.
  - The spec §9 demo script.

- [ ] **Step 2: Run the full suite.** `npm test` → all PASS. `npm run build` → succeeds with no type errors.

- [ ] **Step 3: Manual walkthrough of spec §9 steps 1–10** on `npm run dev`, with one browser per role:
  1. Customer signs up, adds a vehicle, sees its QR, watches live availability.
  2. Customer reserves zone A → the free count drops live in the staff browser.
  3. Staff enters by pasted QR → reservation FULFILLED.
  4. Staff enters a walk-in car by plate in zone C (Guest).
  5. Staff exits the motorbike → fee → confirm → it appears in the customer's history.
  6. EX-01..EX-05 via the simulator (EX-02/03 resolved on `/staff/exit`).
  7. Manager edits tariff and capacity, suspends the lot (badge + EX-05), reactivates it.
  8. Simulator: 120 events + 7 days of history; reports with a date range.
  9. Access log shows LOGIN / VIEW_FULL_PLATE / PURGE; purge masks rows.
  10. VI ↔ EN toggle on every page at 375px width.

  Fix anything broken, re-run `npm test`.

- [ ] **Step 4: Commit and push**

```bash
git add -A
git commit -m "docs: README with setup, demo accounts and demo script"
git push
```
