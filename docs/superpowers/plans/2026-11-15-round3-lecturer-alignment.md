# Round 3 Lecturer Alignment Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Align the product with the lecturer's Round 3 replies: staff-confirmed early arrival, one active reservation per account, per-zone/per-type utilisation, and suspension that cancels pending reservations and notifies customers through a polling bell.

**Architecture:** All business rules stay in `src/server/services/*` (thin routes, `Db` first argument, `DomainError` codes). One new Prisma model (`Notification`) with a small service and two API routes; a client bell in `AppShell` polls it. Report changes are additive.

**Tech Stack:** Next.js 15 App Router, React 19, Prisma 6 + SQLite, Zod, vitest, Tailwind 4 + shadcn/`@base-ui/react`.

**Spec:** `docs/superpowers/specs/2026-11-15-round3-lecturer-alignment-design.md`

## Global Constraints

- Work on the main checkout on branch `refactor/round3-lecturer-alignment`, never in `.worktrees/`.
- New error codes go in **both** `ErrorCode` and `STATUS_MAP` (`src/server/errors.ts`), and in `ERROR_CODES` in `tests/i18n.test.ts` (it is hand-synced) and in `errors` of both `src/i18n/en.ts` and `src/i18n/vi.ts`.
- `src/i18n/en.ts` and `vi.ts` keep identical key shapes (`Dict` type + `tests/i18n.test.ts`). Every new key is added to both.
- `withLock()` is non-reentrant: never call a lock-taking service from inside a `withLock` body.
- `src/middleware.ts` (Edge) must not import Prisma or `src/server/auth/session.ts`.
- Notifications must never contain a plate. Params carry the lot name and arrival time only.
- `utilisationByHour` and every existing field of `Report` stay unchanged; new report data is additive.
- Commit messages end with `Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>`.
- After code changes, run `codegraph sync` before the final task check.
- Full-suite command: `npm test`. Single file: `npx vitest run tests/<file>.test.ts`; single test: add `-t "<name>"`.

## Review Focus

Inputs or conditions the spec implies but the obvious tests would miss, most likely first. Each has a test in the owning task.

1. **Simulator EX05 suspends and restores lot 1 via `updateLot`.** With the new behaviour that would cancel real pending reservations and notify real customers during a simulation run. Expected: the simulator leaves reservations and notifications untouched (Task 5).
2. **A user must never see or mark another user's notifications**, including by passing someone else's id to the read endpoint (Task 4).
3. **Arrival exactly at `arrivalTime`** is not early (`now < arrivalTime` is strict), and a non-boolean `confirmEarly` (e.g. the string `"true"`) is rejected as `VALIDATION`, not treated as true (Task 2).
4. **Suspension touches only that lot's `PENDING` reservations.** Other lots, and reservations already `NO_SHOW`/`CANCELLED`/`FULFILLED`, stay as they are; suspending an already-suspended lot does nothing (Task 5).
5. **The bell must not poll or crash when signed out**, and a failed poll (offline, 401) must not throw or clear existing items (Task 6).

---

### Task 1: One active reservation per account

**Files:**
- Modify: `src/server/errors.ts`, `src/server/services/reservations.ts:83-86`, `src/i18n/en.ts`, `src/i18n/vi.ts`
- Test: `tests/reservations.test.ts` (update line ~152 test, add cases), `tests/i18n.test.ts` (extend `ERROR_CODES`)

**Interfaces:**
- Produces: `ErrorCode` `'RESERVATION_LIMIT'` (HTTP 409); `errors.RESERVATION_LIMIT` in both dictionaries.

- [ ] **Step 1: Commit the design artefacts**

```bash
git add changelog docs/superpowers/specs/2026-11-15-round3-lecturer-alignment-design.md docs/superpowers/plans/2026-11-15-round3-lecturer-alignment.md
git commit -m "docs: round 3 alignment changelog, design and plan"
```

- [ ] **Step 2: Write the failing tests in `tests/reservations.test.ts`**
  - New `it('RESERVATION_LIMIT when the same account already has a PENDING reservation on another vehicle')`: student owns two motorbikes; reserve the first at `localNoon()+60min`; reserving the second (same zone, same time) rejects with `{ code: 'RESERVATION_LIMIT' }`.
  - New `it('a different account is not blocked by another account's reservation')`: lecturer reserves while student holds one → resolves.
  - New `it('cancelling frees the account to reserve again')`: reserve, `cancelReservation`, reserve the second vehicle → resolves.
  - Update the existing `'VEHICLE_ALREADY_RESERVED on second reservation for same vehicle'` test to expect `RESERVATION_LIMIT` and rename it accordingly.

- [ ] **Step 3: Run `npx vitest run tests/reservations.test.ts` and confirm the new cases fail**

- [ ] **Step 4: Implement**
  - Add `'RESERVATION_LIMIT'` to `ErrorCode` and `STATUS_MAP` (409) in `src/server/errors.ts`.
  - In `createReservation`, immediately after the `RESERVATION_WINDOW`/lot checks and **before** the per-vehicle check, add `tx.reservation.findFirst({ where: { customerId: data.customerId, status: 'PENDING' } })` and throw `DomainError('RESERVATION_LIMIT', 'Account already has an active reservation')`. Keep the per-vehicle check after it (defensive; reachable only if ownership changed).
  - Add `RESERVATION_LIMIT` to `ERROR_CODES` in `tests/i18n.test.ts`, and to `errors` in `en.ts` ("You already have an active reservation") and `vi.ts` (Vietnamese equivalent).

- [ ] **Step 5: Run `npx vitest run tests/reservations.test.ts tests/i18n.test.ts tests/errors.test.ts`**
Expected: PASS. If other tests in the file now fail because one customer reserves twice in a fixture, give the second reservation to a different customer (`f.lecturer`) rather than loosening the rule.

- [ ] **Step 6: Commit**

```bash
git add src tests
git commit -m "feat(reservations): limit accounts to one active reservation"
```

---

### Task 2: Early arrival requires staff confirmation

**Files:**
- Modify: `src/server/errors.ts`, `src/lib/types.ts` (`SessionEventType`), `src/server/services/entry.ts`, `src/app/api/events/entry/route.ts`, `src/app/staff/entry/EntryForm.tsx`, `src/i18n/en.ts`, `src/i18n/vi.ts` (`errors.EARLY_ARRIVAL`, `entry.*` confirm texts, the session `eventTypes` map)
- Test: `tests/entry.test.ts`, `tests/i18n.test.ts` (`ERROR_CODES`)

**Interfaces:**
- Produces: `ErrorCode` `'EARLY_ARRIVAL'` (409); `SessionEventType` gains `'EARLY_ARRIVAL_CONFIRMED'`; `recordEntry` input gains `confirmEarly?: boolean`.

- [ ] **Step 1: Write the failing tests in `tests/entry.test.ts`** (create reservations with `createReservation(db, {…, now})`, enter with `recordEntry(db, {…, now})`; arrival = `now + 60 min`)
  - `'EARLY_ARRIVAL without confirmEarly: nothing written'`: rejects `{ code: 'EARLY_ARRIVAL' }`; reservation still `PENDING`; zero sessions for that vehicle.
  - `'confirmEarly admits, fulfils the reservation, and records the override'`: session has `reservationId`; reservation `FULFILLED`; exactly one `sessionEvent` with `type 'EARLY_ARRIVAL_CONFIRMED'` whose `note` contains the arrival time's ISO string and `staffId` is the entering staff; one `accessLog` row `action 'MANUAL_CONFIRM'` with `target` = session id.
  - `'entering exactly at arrivalTime is not early'`: `now = arrival`, no flag → resolves, no event.
  - `'wrong-zone entry ignores confirmEarly and still cancels the reservation'`: reservation for zone A, enter zone B early without flag → resolves as walk-in; reservation `CANCELLED` with `cancelReason 'ENTERED_OTHER_ZONE'`.
  - `'non-boolean confirmEarly is VALIDATION'`: pass `confirmEarly: 'true' as unknown as boolean` → rejects `{ code: 'VALIDATION' }`.

- [ ] **Step 2: Run `npx vitest run tests/entry.test.ts` and confirm the new cases fail**

- [ ] **Step 3: Implement in `entry.ts`**
  - Add `confirmEarly: z.boolean().optional()` to `recordEntrySchema` and to the input type.
  - In the branch where `reservation.zoneId === data.zoneId`: if `now < reservation.arrivalTime && !data.confirmEarly` throw `DomainError('EARLY_ARRIVAL', 'Vehicle arrived before the reserved time')`. Nothing is mutated before this point in that branch, so the transaction rolls back cleanly.
  - After `parkingSession.create`, when the early path was confirmed, `tx.sessionEvent.create` with `type: 'EARLY_ARRIVAL_CONFIRMED'`, `note: \`Reserved arrival: ${reservation.arrivalTime.toISOString()}\``, `staffId: data.staffId`. After commit, also `logAccess(db, { userId: data.staffId, action: 'MANUAL_CONFIRM', target: session.id })` alongside the existing `ENTRY` log.
  - Add the error code in `errors.ts`, the event type in `types.ts`, `ERROR_CODES` in `tests/i18n.test.ts`, and strings in both dictionaries (`errors.EARLY_ARRIVAL`, the `eventTypes` label, and entry-form texts for the confirm prompt and button).
  - Route `src/app/api/events/entry/route.ts`: pass `confirmEarly: body.confirmEarly as boolean | undefined` (Zod in the service validates it, per the existing comment there).
  - `EntryForm.tsx`: when the response error is `EARLY_ARRIVAL`, show an inline confirm step following the pattern in `src/app/staff/exit/ExitForm.tsx` (explain, a confirm button that resubmits with `confirmEarly: true`, and a cancel); all other errors keep the current toast.

- [ ] **Step 4: Run `npx vitest run tests/entry.test.ts tests/i18n.test.ts tests/exit.test.ts tests/history.test.ts`**
Expected: PASS (exit and history also call `recordEntry`).

- [ ] **Step 5: Commit**

```bash
git add src tests
git commit -m "feat(entry): require staff confirmation for early arrival"
```

---

### Task 3: Utilisation breakdown by zone and vehicle type

**Files:**
- Modify: `src/server/services/reports.ts`, `src/app/manager/reports/page.tsx`, `src/components/ReportsCharts.tsx` (keep `UtilisationChart`), `src/i18n/en.ts`, `src/i18n/vi.ts` (`reports.*`)
- Create: `src/components/UtilisationPanel.tsx`
- Test: `tests/reports.test.ts`

**Interfaces:**
- Produces: `Report.utilisationBySlice: Array<{ zoneId: string; zoneName: string; vehicleTypeCode: VehicleTypeCode; byHour: Array<{ hour: number; rate: number }> }>` (sorted by `zoneName`, then `vehicleTypeCode`; one entry per `zoneCapacity` row with capacity > 0). `UtilisationPanel({ overall, slices })` client component.

- [ ] **Step 1: Write the failing tests in `tests/reports.test.ts`** using `seedCanonical()` (read `makeSession` first to see each session's zone and vehicle type, and state the expected values from it)
  - `'slices: one per zone/type with capacity, sorted'`: zoneA MOTORBIKE, zoneB MOTORBIKE, zoneC CAR, in that order, each with 24 `byHour` rows.
  - `'slice rate = occupied in that slice / that slice's capacity'`: assert zoneA's hour-9 rate equals its occupied sessions at 09:30 divided by 2, and zoneB/zoneC are 0 at hour 9.
  - `'overall utilisationByHour is unchanged'`: the existing hour 8/9/11 expectations (0.2, 0.4, 0.2) still hold.
  - `'capacity 0 slice is omitted'`: set a zone's capacity to 0 and assert it is absent.

- [ ] **Step 2: Run `npx vitest run tests/reports.test.ts` and confirm the new cases fail**

- [ ] **Step 3: Implement in `reports.ts`**
  - Extend the `Report` type with `utilisationBySlice`.
  - Select `zoneId` and `vehicleTypeCode` on the sessions query. Load `zoneCapacity` with its zone name.
  - For each slice compute `byHour` with the same sampling as today (hour:30 sample per day in range, entry ≤ sample < exit or open, averaged over the number of days in range, `round4`), counting only sessions matching the slice's zone and type and dividing by the slice's capacity.
  - Leave `utilisationByHour` computation as is. If an existing assertion does a whole-object `toEqual` on the report, extend it rather than weaken it.

- [ ] **Step 4: Implement the UI**
  - `UtilisationPanel`: a select with "Overall" plus one option per slice ("Zone A · Motorbike", reusing existing vehicle-type labels from the dictionaries) and the existing `UtilisationChart` showing the chosen series.
  - `page.tsx` replaces the plain `UtilisationChart` in the utilisation card with `UtilisationPanel`, passing `report.utilisationByHour` and `report.utilisationBySlice`. Add the select label and "Overall" option keys to `reports` in both dictionaries.

- [ ] **Step 5: Run `npx vitest run tests/reports.test.ts tests/i18n.test.ts` then `npm run build`**
Expected: PASS and a clean build (type-check).

- [ ] **Step 6: Commit**

```bash
git add src tests
git commit -m "feat(reports): break utilisation down by zone and vehicle type"
```

---

### Task 4: Notification model, service, API and i18n params

**Files:**
- Modify: `prisma/schema.prisma`, `src/lib/types.ts` (`NotificationType`), `src/i18n/index.ts` (`t`), `src/components/I18nProvider.tsx` (`useT`), `tests/helpers/db.ts` (`resetDb`), `src/i18n/en.ts`, `src/i18n/vi.ts` (`notifications.*`)
- Create: `prisma/migrations/<timestamp>_notifications/migration.sql` (generate with `npx prisma migrate dev --name notifications`), `src/server/services/notifications.ts`, `src/app/api/notifications/route.ts`, `src/app/api/notifications/read/route.ts`
- Test: `tests/notifications.test.ts` (new), `tests/i18n.test.ts`

**Interfaces:**
- Produces:
  - Model `Notification`: `id` (cuid), `userId` → `User`, `type String`, `params String` (JSON text, default `"{}"`), `createdAt`, `readAt DateTime?`, `@@index([userId, readAt, createdAt])`, `@@map("notifications")`.
  - `type NotificationType = 'LOT_SUSPENDED'` in `src/lib/types.ts`.
  - `createNotification(db: Db, input: { userId: string; type: NotificationType; params?: Record<string, string | number>; now?: Date }): Promise<Notification>`
  - `type NotificationView = { id: string; type: string; params: Record<string, string | number>; createdAt: Date; readAt: Date | null }`
  - `listNotifications(db: Db, userId: string, limit?: number /* default 20 */): Promise<{ items: NotificationView[]; unreadCount: number }>` (newest first; `unreadCount` counts all unread, not just the page).
  - `markNotificationsRead(db: Db, userId: string, ids?: string[]): Promise<number>` (only that user's rows; no `ids` = all of theirs; returns rows updated; already-read rows are not touched).
  - `GET /api/notifications` → `{ items, unreadCount }`; `POST /api/notifications/read` body `{ ids?: string[] }` → `{ updated: number }`. Both `requireRole('CUSTOMER', 'STAFF', 'MANAGER')`.
  - `t(dict: Dict, key: string, params?: Record<string, string | number>): string` replaces `{name}` placeholders; `useT()` returns `(key: string, params?: Record<string, string | number>) => string`. Callers without params behave as today.

- [ ] **Step 1: Write the failing tests in `tests/notifications.test.ts`** (use `resetDb()` + `makeFixture()`)
  - `'create then list returns newest first with parsed params and unreadCount'`.
  - `'unreadCount counts beyond the page limit'`: create 3, `limit 2` → 2 items, `unreadCount 3`.
  - `'markNotificationsRead with no ids marks only that user's rows'`: another user's rows stay unread.
  - `'markNotificationsRead ignores ids belonging to another user'`: returns 0, other user's row unread.
  - `'markNotificationsRead with ids marks only those'` and is idempotent (second call returns 0).
  - In `tests/i18n.test.ts` add `'t interpolates {placeholders}'` (`t(en, 'notifications.types.LOT_SUSPENDED', { lot: 'X', arrival: '10:00' })` contains both values and no braces) and `'t without params is unchanged'`.

- [ ] **Step 2: Run `npx vitest run tests/notifications.test.ts tests/i18n.test.ts` and confirm failures**

- [ ] **Step 3: Implement**
  - Add the model plus the `notifications Notification[]` relation on `User`; generate the migration; `resetDb()` deletes `notification` rows **before** `user` rows.
  - Implement `notifications.ts` per the interfaces (parse `params` from JSON in `listNotifications`).
  - Implement `t` params interpolation (replace every `{key}` present in `params`; leave unknown placeholders as is) and widen `useT`.
  - Add dictionary keys in both languages: `notifications.title`, `notifications.empty`, `notifications.markAllRead`, `notifications.types.LOT_SUSPENDED` ("Lot {lot} was suspended; your reservation for {arrival} was cancelled." and the Vietnamese equivalent).
  - Add both routes using `handle()` and `readJsonObject()`; the read route validates `ids` as an optional array of strings (Zod) and returns `{ updated }`.

- [ ] **Step 4: Run `npx vitest run tests/notifications.test.ts tests/i18n.test.ts tests/schema.test.ts` then `npm test`**
Expected: PASS; the whole suite still green (the `t` change must not break any caller).

- [ ] **Step 5: Commit**

```bash
git add prisma src tests
git commit -m "feat(notifications): notification model, service, API and i18n params"
```

---

### Task 5: Suspension cancels pending reservations and notifies customers

**Files:**
- Modify: `src/server/services/lots.ts` (`updateLot`), `src/server/services/simulator.ts` (EX05, lines ~354-365), `src/lib/types.ts` (cancel reason union if present), `src/app/customer/reservations/page.tsx` (`cancelReason` type and rendering), `src/i18n/en.ts`, `src/i18n/vi.ts` (`reservations.cancelReason.LOT_SUSPENDED`), `prisma/schema.prisma` (comment on `cancelReason` listing `LOT_SUSPENDED`)
- Test: `tests/lots.test.ts`, `tests/simulator.test.ts`

**Interfaces:**
- Consumes: `createNotification`, `NotificationType` (Task 4).
- Produces: `updateLot(db, actorId, lotId, input, opts?: { cancelPendingReservations?: boolean /* default true */ }): Promise<ParkingLot>`.

- [ ] **Step 1: Write the failing tests in `tests/lots.test.ts`** (reservations created through `createReservation` with a fixed `now`)
  - `'suspending cancels PENDING reservations in that lot with LOT_SUSPENDED and notifies each customer'`: two customers, two reservations; after `updateLot(…, { status: 'SUSPENDED' })` both are `CANCELLED` with `cancelReason 'LOT_SUSPENDED'`; each customer has one `LOT_SUSPENDED` notification whose params are `{ lot: <lot name>, arrival: <ISO> }` and contain no plate.
  - `'only PENDING reservations in that lot are touched'`: a second lot's PENDING reservation, plus `NO_SHOW`, `FULFILLED` and already-`CANCELLED` rows in the first lot, are unchanged and produce no notification.
  - `'suspending an already suspended lot is a no-op'`: no new cancellations or notifications; reactivating restores nothing.
  - `'open sessions are unaffected and can still exit'`: an `OPEN` session in the lot survives suspension (call `confirmExit` and expect success).
  - `'cancelPendingReservations:false leaves reservations and notifications alone'`.
  - `'new reservation and entry on the suspended lot are still rejected with LOT_SUSPENDED'`.

- [ ] **Step 2: Write the failing simulator test in `tests/simulator.test.ts`**: run the EX05 exception path after creating a PENDING reservation in the first lot; afterwards the reservation is still `PENDING` and no `Notification` rows exist. (Follow how the file already triggers a single exception.)

- [ ] **Step 3: Run `npx vitest run tests/lots.test.ts tests/simulator.test.ts` and confirm the new cases fail**

- [ ] **Step 4: Implement `updateLot`**
  - When `status` is being set to `SUSPENDED`, the current status is not already `SUSPENDED`, and `opts?.cancelPendingReservations !== false`: run inside `withLock` and a transaction (`db as PrismaClient`): update the lot; `updateMany` the `PENDING` reservations whose `zone.lotId` is this lot to `CANCELLED` with `cancelReason 'LOT_SUSPENDED'` (fetch them first to know the customers and arrival times); `createNotification` once per cancelled reservation with params `{ lot: lot.name, arrival: reservation.arrivalTime.toISOString() }`. Every other update path keeps today's behaviour.
  - `logAccess(… 'LOT_CHANGE' …)` and `publishAvailabilityChanged()` after commit, as today.
  - Before relying on `withLock` here, confirm no caller of `updateLot` already holds the lock (route and simulator do not; `grep -rn "updateLot(" src`).
  - Simulator EX05: pass `{ cancelPendingReservations: false }` on **both** `updateLot` calls (suspend and restore), and note in the existing comment that this is why.
  - Reservations page: add `'LOT_SUSPENDED'` to the `cancelReason` union and dictionary entries ("Cancelled: the lot was suspended" / Vietnamese).

- [ ] **Step 5: Run `npx vitest run tests/lots.test.ts tests/simulator.test.ts tests/reservations.test.ts tests/i18n.test.ts`**
Expected: PASS. The existing reservations test "existing PENDING kept on suspend" updates the lot straight through Prisma, so it stays valid; do not change it.

- [ ] **Step 6: Commit**

```bash
git add prisma src tests
git commit -m "feat(lots): suspension cancels pending reservations and notifies customers"
```

---

### Task 6: Notification bell, docs and final verification

**Files:**
- Create: `src/components/NotificationBell.tsx`
- Modify: `src/components/AppShell.tsx`, `README.md` (API table), `changelog/round3-assumptions-vs-implementation.md` (mark items resolved)

**Interfaces:**
- Consumes: `GET /api/notifications`, `POST /api/notifications/read`, `useT(key, params)`, `useLang()`.
- Produces: `NotificationBell()` client component, rendered only for a signed-in user.

- [ ] **Step 1: Implement `NotificationBell`**
  - Polls `GET /api/notifications` on mount and every 30 s via `setInterval`; skips the tick while `document.hidden`; refetches when opened.
  - A failed or non-OK poll keeps the previous items and never throws (no toast spam).
  - Shows an unread-count badge (hidden at 0) and a dropdown (use the existing `dialog`/popover primitives or a minimal absolutely-positioned panel) listing items, rendering each with `t(\`notifications.types.${type}\`, params)` where `params.arrival` is first converted from ISO to a local `HH:mm` string with `toLocaleTimeString(lang, …)`. Unknown types fall back to the key text.
  - "Mark all read" posts `{}` to `/api/notifications/read` and refetches; opening the panel does not auto-mark.
  - Clears its interval on unmount.

- [ ] **Step 2: Render it in `AppShell.tsx` inside the `user ?` branch only**, next to the language toggle, so `/login` and `/register` never poll.

- [ ] **Step 3: Update docs**: README API table (new `/api/notifications`, `/api/notifications/read`, `confirmEarly` on the entry event, report `utilisationBySlice`); in the changelog file add a "Resolved on this branch" column or note for the four items.

- [ ] **Step 4: Verify**

Run: `npm test && npm run lint && npm run build`
Expected: all green. Then `codegraph sync`.

- [ ] **Step 5: Manual check** (`npx prisma migrate reset --force && npm run dev`)
  1. As a customer, create a reservation; as a manager, suspend that lot; as the customer the bell shows 1 unread within ~30 s, the text reads correctly in both languages, "Mark all read" clears the badge, and the reservation shows "Cancelled: the lot was suspended".
  2. As staff, enter a vehicle that has a reservation for a later time: the form asks for confirmation; confirming admits it and the session detail lists "Early arrival confirmed".
  3. As a customer with two vehicles, a second reservation shows "You already have an active reservation".
  4. On the manager reports page, switching the utilisation scope changes the chart.
  5. Signed out, the bell is absent and no `/api/notifications` requests appear in the network tab.

- [ ] **Step 6: Commit**

```bash
git add src README.md changelog
git commit -m "feat(ui): notification bell; docs for round 3 alignment"
```
