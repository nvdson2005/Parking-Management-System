# Round 3 Lecturer Alignment: Design

Date: 2026-11-15 · Branch: `refactor/round3-lecturer-alignment` · Status: draft for approval

Source analysis: `changelog/round3-assumptions-vs-implementation.md`.

## Intent

The lecturer's Round 3 replies confirmed most of our assumptions but changed or added four things. The product must match them before acceptance, where the 5 exceptions and the report figures are checked against a 100-session scenario. This refactor closes those four gaps and adds the one new mechanism they require: a user notification.

## Goals

1. **Early arrival needs staff confirmation.** A vehicle with a pending reservation that is admitted before `arrivalTime` is admitted only after an explicit staff confirmation. The reservation becomes `FULFILLED` only at that admission.
2. **One active reservation per account**, not per vehicle.
3. **Utilisation is reported per zone and vehicle type**, in addition to the existing overall series.
4. **Suspending a lot cancels its pending reservations and notifies the affected customers** through an in-app bell with an unread count.

## Non-goals and anti-goals

- No webhook, email, SMS or push (decided: left out).
- No SSE or WebSocket delivery for notifications (decided: polling).
- No notification preferences, no purge of old notifications, no restore of reservations when a lot is reactivated.
- Do not change plate-mismatch, lost-card, entry, exit, fee, retention or revenue behaviour.
- Not covered here: renaming `MANAGER` to "Admin" in docs, and whether staff can read reservations (to be verified separately).
- Anti-goal: a notification that leaks a plate. Notifications carry the lot name and arrival time only.
- Anti-goal: breaking current consumers of `/api/reports`. The new report data is additive.

## Constraints (from `AGENTS.md`)

- Layering: thin `route.ts` → `src/server/services/*` → Prisma. New codes go in both `ErrorCode` and `STATUS_MAP` (`src/server/errors.ts`).
- `withLock()` is non-reentrant. Anything that must not race with entry or reservation runs inside it. Never call a lock-taking service from inside a lock body.
- `src/i18n/{en,vi}.ts` must keep identical key sets (a test enforces it). Every new error code, event type and notification type needs both languages.
- `src/middleware.ts` runs on Edge and must not import Prisma or `session.ts`.
- Run `codegraph sync` after code changes. The test DB is reset by `tests/global-setup.ts` via `prisma db push`.

## Approaches considered

**Notification delivery** (the only real fork; the others are single-path):

| | Approach | Verdict |
|---|---|---|
| A | `Notification` table plus polling bell | **Chosen.** Durable, same architecture as production apps minus the queue, simple to test against the service layer. Up to ~30 s delay. |
| B | Same table, per-user SSE push | Rejected. The current stream is global; per-user filtering and `globalThis` bus handling under HMR add risk the requirement doesn't justify. |
| C | No table, derive from cancelled reservations, read state in `localStorage` | Rejected. Unread state is lost across devices and it doesn't generalise. |

The user also considered a webhook. It is a server-to-server channel, with no per-user target to deliver to, so it is out of scope.

**Early arrival** options were: keep today's silent link, treat early vehicles as walk-ins, or require a staff confirm flag. The confirm flag was chosen because it matches the lecturer's wording (staff check, then admit) and reuses the `confirmMismatch` pattern in `exit.ts`. It applies to **any** early arrival; no tolerance window (decided by the user).

## Design

### 1. Early arrival (`entry.ts`, entry route, `EntryForm.tsx`)

- `recordEntry` input gains `confirmEarly?: boolean` (default false).
- In the branch where the vehicle's pending reservation is for this zone: if `now < reservation.arrivalTime` and `!confirmEarly`, throw `EARLY_ARRIVAL` (409). Nothing is written.
- With `confirmEarly: true`, admit as today, set the reservation `FULFILLED`, and record a `SessionEvent` of new type `EARLY_ARRIVAL_CONFIRMED`. The note carries the reservation's arrival time. Add `MANUAL_CONFIRM` to the access log, as exit does for overrides.
- The wrong-zone branch (cancel and treat as walk-in) is unchanged and takes precedence: the flag concerns only the same-zone reservation.
- Staff entry form: on `EARLY_ARRIVAL`, show the same confirm step as the exit mismatch flow, then resubmit with `confirmEarly: true`.

### 2. One reservation per account (`reservations.ts`)

- In `createReservation`, check for any `PENDING` reservation by `customerId` first; if found, throw new `RESERVATION_LIMIT` (409).
- The existing per-vehicle check stays as a defensive second check, so `VEHICLE_ALREADY_RESERVED` remains reachable only if ownership changed.
- Existing tests that assert `VEHICLE_ALREADY_RESERVED` for the same account will now see `RESERVATION_LIMIT`. Update them.

### 3. Utilisation breakdown (`reports.ts`, `/api/reports`, `ReportsCharts.tsx`, manager reports page)

- `Report` gains `utilisationBySlice: Array<{ zoneId; zoneName; vehicleTypeCode; byHour: Array<{hour; rate}> }>`. One entry per `zoneCapacity` row with capacity > 0. `rate` is the average, over the days in range, of occupied sessions in that zone and type at the hour sample divided by that slice's capacity, using the same sampling as today (hh:30).
- `utilisationByHour` stays as the overall series, unchanged.
- The manager reports page gets a selector: Overall, or a zone and vehicle-type pair. Rates are displayed as percentages. The API keeps fractions.

### 4. Suspension cancels reservations and notifies (`lots.ts`, new `notifications.ts`)

- `updateLot`, when the status changes from `ACTIVE` to `SUSPENDED`, runs inside `withLock` and one transaction:
  1. update the lot;
  2. cancel every `PENDING` reservation in that lot's zones with `status: CANCELLED`, `cancelReason: 'LOT_SUSPENDED'`;
  3. insert one `Notification` per cancelled reservation for its customer.
- Setting `SUSPENDED` on an already-suspended lot does nothing extra. Reactivation restores nothing. Open sessions are untouched (exits keep working).
- After commit: `logAccess` (existing `LOT_CHANGE`) and `publishAvailabilityChanged()`.

### 5. Notifications (new model, service, API, bell)

- Model `Notification`: `id`, `userId`, `type`, `params` (JSON text), `createdAt`, `readAt?`, indexed on `(userId, readAt, createdAt)`. New migration. Only `LOT_SUSPENDED` is produced now; the shape is generic.
- `type` is an i18n key suffix and `params` hold the interpolation values (lot name, arrival time). No stored sentence, so vi/en parity holds and text renders in the viewer's language.
- Service `notifications.ts`: `createNotification`, `listNotifications(db, userId, limit)` returning items plus `unreadCount`, `markRead(db, userId, ids?)` (no ids means all of that user's). A user can only read or mark their own.
- API: `GET /api/notifications`, `POST /api/notifications/read`. Both require a session, any role.
- UI: a bell in `AppShell` for signed-in users. It polls every ~30 s, pauses while the tab is hidden, refetches when opened, and shows an unread badge and a dropdown with mark-read.
- The customer reservations page already shows cancellations; add the `LOT_SUSPENDED` cancel reason text.

## Testing and acceptance

- Service-level tests against the test DB (existing pattern): early arrival (blocked without the flag, admitted with it, event and log written, other-zone path unaffected); account limit (second vehicle blocked); report breakdown (per-slice rates match a hand count; overall unchanged); suspension (pending cancelled, notifications created, repeat suspend a no-op, exits still work); notifications service (own-only access, unread count, mark read).
- i18n parity test must pass. `npm run build` and `npm run lint` must pass.
- Acceptance: the lecturer's items map one-to-one to the four goals above.

## Settled from the existing code (reviewer questions)

- **New bookings and entries on a suspended lot are already rejected.** `createReservation` and `recordEntry` both throw `LOT_SUSPENDED`, so customers can't re-book after a suspension. No change is needed there, but the new tests assert it.
- **`arrivalTime` is a single instant.** `holdUntil = arrivalTime + HOLD_MINUTES (30)`. The early check is `now < arrivalTime`. A late arrival past `holdUntil` is already swept to `NO_SHOW` by `expireReservations` and is unaffected.
- **"Active" means `PENDING`.** `createReservation` and `recordEntry` call `expireReservations` first inside the lock, so stale holds are swept lazily and the account-limit check can't be blocked by an unswept expired row.
- **Who can confirm early arrival:** the entry route is `requireRole('STAFF', 'MANAGER')`. The route currently whitelists body fields, so it must be extended to pass `confirmEarly` (as a boolean; anything else means false). The wrong-zone branch ignores the flag.
- **Report denominator:** days in the requested range, as today.

## Left to the builder

Exact i18n wording; the confirm UI layout; bell visual design; how to pre-bucket sessions in the report for speed; whether the simulator should emit the new event types and cancel reasons; the order of tasks.

## Calls made without the user (check these)

- `RESERVATION_LIMIT` as a new code; account check before vehicle check.
- One notification per cancelled reservation, not per customer.
- Bell visible to all roles, not customers only.
- `params` stored as JSON text, not a native JSON column.
- Slices with zero capacity are omitted from the breakdown.
- Poll interval ~30 s.
- The notification's arrival time is stored as an ISO UTC string and formatted in the viewer's local time zone in the browser.
- Only reservations that are `PENDING` at the moment of suspension produce notifications; already expired or cancelled ones do not.
