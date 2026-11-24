# Research: CR-03 UI fixes

## R1. Last-update time on the availability screen (FR-001)

- **Decision**: The component keeps an `updatedAt` value. It starts at the time the server rendered the snapshot (passed by the page) and is set to the receive time on each SSE message. It is shown as a local time (`HH:mm:ss`) in the card header.
- **Rationale**: The SSE payload has no timestamp, and adding one changes the stream contract for every client. The pilot runs client and server on one machine, so receive time equals server time for practical purposes (see the spec's assumptions).
- **Alternatives**: Add `generatedAt` to `getAvailability` output. Rejected for now: it touches the service, the stream and the A-49 tests for no user-visible gain.

## R2. Used column only for Staff and Manager (FR-002, FR-003)

- **Decision**: `LiveAvailability` takes `role` as a prop. Each of the three role pages passes its own role; the section layout (`requireSection`) already restricts each page to that role. "Used" = `open + reserved`.
- **Rationale**: The role comes from the server; the client cannot unlock the column by itself. The counts are already in the payload, so this is a display-only choice. Hiding the column is not a privacy control, because no plate is involved.
- **Alternatives**: Read the role on the client from a cookie. Rejected: the session cookie is httpOnly.

## R3. "Full" status (FR-004)

- **Decision**: When `free === 0`, a destructive-style badge "Hết chỗ" / "Full" is shown next to the free number. The keys `availability.full`, `availability.used` and `availability.updatedAt` are added to both dictionaries.
- **Rationale**: This matches the existing "Tạm ngưng" badge style. The number stays, because Staff still compare counts.

## R4. Default arrival time (FR-006..FR-008)

- **Decision**: A pure helper `defaultArrival(now)` returns the next 5-minute mark at least 1 minute after `now`. Near midnight it is capped at 23:59 while 23:59 is still at least 1 minute away; otherwise it returns `null` (today closed). The input also gets `min` = the next minute (`now`). The form uses the helper on mount; when it returns `null`, the form shows the closed message and disables submit.
- **Rationale**: The server rule is `arrivalTime >= now && <= endOfLocalDay(now)` (`reservations.ts`). A 1-minute margin plus rounding keeps the default valid while the Customer fills the rest of the form. The helper takes `now` as an argument, so it is unit-testable.
- **Alternatives**: Default to now + 30 min. Rejected: it fails after 23:29 even though valid times remain.

## R5. Select labels (FR-009)

- **Decision**: Render a function child in `SelectValue`, `(value) => label(value)`. The label maps come from the zone options passed in, from `t('availability.vehicleTypes.X')` and from `t('gates.X')`.
- **Rationale**: `@base-ui/react` 1.9 `Select.Value` renders the raw value unless it is given `children` or the Root gets `items` (checked in `node_modules/@base-ui/react/select/value/SelectValue.d.ts`). A function child keeps the shadcn wrapper unchanged.
- **Alternatives**: Pass `items` to `Select` Root. This works too, but needs a value→label object per select. The function child is local and explicit.

## R6. Early-arrival details (FR-010, FR-011)

- **Decision**: `DomainError` gets an optional `details?: Record<string, unknown>`. `recordEntry` throws `EARLY_ARRIVAL` with `{ arrivalTime: ISO string, zoneName }` from the matched reservation, which is loaded with its zone inside the existing transaction. `handle()` returns `{ error, details }` when details are present. `EntryForm` stores the details and shows "Giờ hẹn: HH:mm · Khu: A" in the prompt.
- **Rationale**: It is the smallest change that keeps business logic in the service (Principle I). It adds no plate and no new code. Clients that ignore `details` keep working.
- **Alternatives**: The client calls `/api/staff/lookup` after the 409. Rejected: two round-trips at the gate and duplicate logic.

## R7. Font (FR-012)

- **Decision**: In `@theme inline`, set `--font-sans: var(--font-geist-sans);` and `--font-heading: var(--font-geist-sans);`.
- **Rationale**: `layout.tsx` loads Geist as `--font-geist-sans`. The current `--font-sans: var(--font-sans)` refers to itself, so it resolves to nothing and the page falls back to serif. CSS cannot be unit-tested here, so a small test reads `globals.css` and asserts that `--font-sans` does not refer to itself.
