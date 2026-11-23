# Smart Parking MVP

A demo-ready smart parking management system covering customer, staff, and
manager workflows: self-service vehicle registration with QR codes, live
availability, reservations, staff entry/exit with simulated payment, exception
handling, manager lot/tariff/capacity administration, reports, an event
simulator, an access log, and data purge. Vietnamese and English are both
supported with a per-request language toggle.

Built with Next.js 15 (App Router), React 19, Prisma + SQLite, and Zod.

## Prerequisites

- **Node.js ≥ 20**
- npm (bundled with Node)

## Setup

```bash
npm i
cp .env.example .env
npx prisma migrate reset --force   # applies migrations and seeds demo data
npm run dev
```

The app runs at http://localhost:3000.

`npx prisma migrate reset --force` runs the migrations **and** the seed script
(`prisma/seed.ts`), creating the pilot lot (zones A, B, C), tariffs, and all
demo accounts. Re-run it any time to return to a clean demo state.

After pulling changes that add a migration (for example
`prisma/migrations/20261123100000_a65_indexes`), apply it without losing your
data:

```bash
npx prisma migrate deploy   # applies new migrations only, keeps existing rows
npx prisma generate         # refresh the Prisma client
```

Plates on parking sessions that ended more than 12 months ago are masked
automatically (client answer Q35): once about 60 s after the server starts,
then every 24 h. The run appears in the access log as `PURGE` with no user.
The Manager button on `/manager/access-log` still runs it on demand.

## Tests

```bash
npm test        # vitest run — full suite
npm run lint
npm run build   # production build / type-check
npx vitest run tests/lookup.test.ts            # one file
```

The suite uses a separate `prisma/test.db` that `tests/global-setup.ts`
recreates on every run (`prisma db push --force-reset`).

Some simulator tests (`tests/simulator.test.ts`, large `simulateLive` runs) can
exceed vitest's default 5 s timeout on slower machines. If only those fail,
check them with a longer timeout:

```bash
npx vitest run tests/simulator.test.ts --testTimeout=60000
```

## Verification

The automated suite covers the API, services, RBAC, i18n key
parity, fee/exception logic and the live-availability stream. In addition, the
demo flows were walked through in a real Chromium browser (Playwright) using
separate browser contexts per role. That pass confirmed, at a **375px** viewport
with no horizontal overflow, each customer/staff/manager/auth page listed below;
the **VI ↔ EN** toggle switching every page's header between languages; a
rendered customer **QR image** with nonzero natural dimensions; and a Zone A
motorbike reservation made in the customer context dropping the live free count
on the staff page (150 → 149) via the SSE stream.

## Demo accounts

All accounts share the password **`password123`**.

| Role | Email | Count |
|---|---|---|
| Manager | `manager1@demo.local`, `manager2@demo.local` | 2 |
| Staff | `staff1@demo.local`, `staff2@demo.local` | 2 |
| Customer | `customer01@demo.local` … `customer15@demo.local` | 15 |

Each customer is seeded with one motorbike. Odd-numbered customers are in the
`STUDENT` fee group, even-numbered in `LECTURER_STAFF`.

## Pages

- **Customer:** `/customer`, `/customer/vehicles`, `/customer/reservations`, `/customer/history`
- **Staff:** `/staff`, `/staff/entry`, `/staff/exit`, `/staff/sessions`, `/staff/sessions/[id]`, `/staff/lookup` (vehicle, session and reservation lookup by plate / QR / RFID)
- **Manager:** `/manager`, `/manager/lots`, `/manager/tariffs`, `/manager/accounts`, `/manager/reports`, `/manager/simulator`, `/manager/access-log`, `/manager/payments`
- **Auth:** `/login`, `/register`

## API

| Method | Path | Role | Purpose |
|---|---|---|---|
| POST | `/api/auth/register` | public | Customer sign-up |
| POST | `/api/auth/login` | public | Log in |
| POST | `/api/auth/logout` | any | Log out |
| POST | `/api/lang` | any | Set language (`vi` / `en`) |
| GET/POST | `/api/vehicles` | Customer | List / add vehicles (QR + RFID assigned) |
| DELETE | `/api/vehicles/[id]` | Customer | Remove a vehicle |
| GET/POST | `/api/reservations` | Customer | List / create reservations |
| POST | `/api/reservations/[id]/cancel` | Customer | Cancel a reservation |
| GET | `/api/availability` | any auth | Current free/open/reserved counts |
| GET | `/api/availability/stream` | any auth | Live availability (SSE) |
| POST | `/api/events/entry` | Staff/Manager | Record an entry (QR / RFID / plate); `confirmEarly: true` admits a vehicle that arrives before its reservation time; optional `gate` (`GATE-1` default, `GATE-2`) |
| POST | `/api/events/exit/preview` | Staff/Manager | Preview exit fee |
| POST | `/api/events/exit/confirm` | Staff/Manager | Confirm exit + simulated payment; optional `gate` (`GATE-1` default, `GATE-2`) |
| GET/POST | `/api/lots`, PATCH `/api/lots/[id]` | Manager | Lot info and status (active/suspended) |
| POST `/api/zones`, PATCH `/api/zones/[id]` | Manager | Zone and capacity management |
| GET/PUT | `/api/tariffs` | Manager | View / edit tariffs |
| GET/POST | `/api/accounts`, PATCH `/api/accounts/[id]` | Manager | Staff/manager account management |
| GET | `/api/reports?from=&to=` | Manager | Reports over a date range (includes `utilisationBySlice` per zone and vehicle type) |
| GET | `/api/notifications` | any auth | Own notifications (newest first) and unread count |
| POST | `/api/notifications/read` | any auth | Mark own notifications read (`{ ids? }`, all when omitted) |
| POST | `/api/simulator` | Manager | `live` / `history` / `exception` triggers |
| POST | `/api/purge` | Manager | Mask old plate data now (it also runs automatically every 24 h) |
| GET | `/api/staff/lookup?method=PLATE\|QR\|RFID&identifier=` | Staff/Manager | Vehicle, open session and active reservation; logs `VIEW_FULL_PLATE`; 404 when no vehicle matches |
| GET | `/api/staff/reservations?zoneId=` | Staff/Manager | Active (pending, not expired) reservations, earliest arrival first |
| GET | `/api/sessions?status=OPEN\|CLOSED` | Staff/Manager | Parking sessions, newest entry first (default `OPEN`) |
| GET | `/api/access-logs?limit=` | Manager | Access log, newest first (`limit` 1-500, default 200) |
| GET | `/api/payments?from=&to=` | Manager / Customer | Manager: all confirmed payments in the range; Customer: own parking history |

## Demo script (spec §9)

Use separate browsers/profiles per role so you can watch live updates.

1. **Customer signs up** (choosing a group), adds a motorbike, sees its QR code,
   and views live availability (`/register` → `/customer/vehicles` → `/customer`).
2. **Customer reserves Zone A** (motorbike) for later today → the free count
   drops live in the staff browser.
3. **Staff checks in the reserved vehicle by QR** (`/staff/entry`, paste the QR
   code) → the reservation becomes **FULFILLED** and a session opens.
4. **Staff checks in a walk-in car by plate** (Guest) in Zone C.
5. **Staff checks out the motorbike** (`/staff/exit`) → fee is shown → confirm
   the simulated payment → the customer sees it in `/customer/history`.
6. **Exceptions EX-01..EX-05** are demonstrated via the manager simulator
   (`/manager/simulator`); EX-02 (plate mismatch) and EX-03 (lost card) are
   resolved on `/staff/exit` using the returned instructions.
7. **Manager edits tariff and capacity**, suspends the lot (status badge turns
   to suspended and entries raise EX-05 / `LOT_SUSPENDED`), then reactivates it
   (`/manager/tariffs`, `/manager/lots`).
8. **Manager runs the simulator** (≥100 live events + several days of history)
   and opens `/manager/reports` with a date range.
9. **Manager views the access log** (`/manager/access-log`, showing LOGIN /
   LOGIN_FAILED / ACCESS_DENIED / VIEW_FULL_PLATE / PURGE entries; a wrong-role
   page visit lands on `/denied` and is logged) and runs a purge, which masks old plate rows.
10. **Language toggle VI ↔ EN** works on every page (verified in-browser across
    all customer, staff, manager and auth pages); the layout fits a 375px-wide
    viewport with no horizontal overflow.
