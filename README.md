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

## Tests

```bash
npm test        # vitest run — full suite (130 tests)
npm run build   # production build / type-check
```

## Verification

The automated suite (130 tests) covers the API, services, RBAC, i18n key
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
- **Staff:** `/staff`, `/staff/entry`, `/staff/exit`, `/staff/sessions`, `/staff/sessions/[id]`
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
| POST | `/api/events/entry` | Staff/Manager | Record an entry (QR / RFID / plate) |
| POST | `/api/events/exit/preview` | Staff/Manager | Preview exit fee |
| POST | `/api/events/exit/confirm` | Staff/Manager | Confirm exit + simulated payment |
| GET/POST | `/api/lots`, PATCH `/api/lots/[id]` | Manager | Lot info and status (active/suspended) |
| POST `/api/zones`, PATCH `/api/zones/[id]` | Manager | Zone and capacity management |
| GET/PUT | `/api/tariffs` | Manager | View / edit tariffs |
| GET/POST | `/api/accounts`, PATCH `/api/accounts/[id]` | Manager | Staff/manager account management |
| GET | `/api/reports?from=&to=` | Manager | Reports over a date range |
| POST | `/api/simulator` | Manager | `live` / `history` / `exception` triggers |
| POST | `/api/purge` | Manager | Mask old plate data |

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
   VIEW_FULL_PLATE / PURGE entries) and runs a purge, which masks old plate rows.
10. **Language toggle VI ↔ EN** works on every page (verified in-browser across
    all customer, staff, manager and auth pages); the layout fits a 375px-wide
    viewport with no horizontal overflow.
