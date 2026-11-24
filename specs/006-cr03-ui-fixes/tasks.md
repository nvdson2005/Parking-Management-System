# Tasks: CR-03 UI fixes

**Input**: Design documents from `specs/006-cr03-ui-fixes/`

**Prerequisites**: [plan.md](plan.md), [spec.md](spec.md), [research.md](research.md), [data-model.md](data-model.md), [contracts/](contracts/), [quickstart.md](quickstart.md)

**Tests**: Required. Constitution IV requires a test for every change, and the input asked for test-first: write each test, see it fail, then implement.

**Order**: As requested by RES-04, the demo-path defects (group B: US5, US2, US3) come first, then the availability screen (group A: US1), then early arrival (US4). The stories are independent, so this order does not break any dependency.

**Commit rule**: Each task group is committed with its activity ID, e.g. `fix(ui): ... (A-49, CR-03, FR-19)`.

## Phase 1: Setup

- [X] T001 Confirm the branch `fix/cr-03-ui` is based on the current `main` and that `npm test` passes before any change (baseline count recorded in the PR description)

## Phase 2: Foundational

No shared prerequisite. Each story touches its own files. The `DomainError.details` change belongs to US4 only.

## Phase 3: User Story 5 – Readable font (Priority: P3, group B)

**Goal**: Pages render in the Geist sans-serif font (FR-012).

**Independent test**: `tests/globals-css.test.ts` passes, and the login page renders in sans-serif.

- [X] T002 [P] [US5] Write `tests/globals-css.test.ts`: read `src/app/globals.css` and assert that the `@theme inline` block sets `--font-sans` and `--font-heading` to `var(--font-geist-sans)` and that no custom property refers to itself (e.g. `--font-sans: var(--font-sans)`); run it and see it fail
- [X] T003 [US5] In `src/app/globals.css` `@theme inline`, set `--font-sans: var(--font-geist-sans);` and `--font-heading: var(--font-geist-sans);`; T002 passes

## Phase 4: User Story 2 – Reservation form works with its defaults (Priority: P1, group B)

**Goal**: The default arrival time is valid, past times cannot be chosen, and the form says when today is closed (FR-006..FR-008).

**Independent test**: `tests/arrival.test.ts` passes; as `customer01`, submitting with the default time creates the reservation.

- [X] T004 [P] [US2] Write `tests/arrival.test.ts` for `defaultArrival(now: Date): Date | null` in `src/lib/arrival.ts`. Rule from data-model: "Let `earliest = now + 1 min`. Return the first 5-minute mark ≥ `earliest`; if that mark is after 23:59 of `now`'s local day, return 23:59 when `earliest` ≤ 23:59, otherwise `null`". Seconds are zero in the result. Cases: 10:00:00 → 10:05; 10:03:20 → 10:05; 10:04:30 → 10:10; 23:50:00 → 23:55; 23:55:30 → 23:59; 23:58:00 → 23:59; 23:58:30 → `null`; 23:59:00 → `null`. Also test `toLocalDateTimeInput(date)` formatting (`YYYY-MM-DDTHH:mm`). Run it and see it fail
- [X] T005 [US2] Create `src/lib/arrival.ts` exporting `defaultArrival(now)` and `toLocalDateTimeInput(d)` (moved from `src/app/customer/reservations/page.tsx`); T004 passes
- [X] T006 [US2] In `src/app/customer/reservations/page.tsx`: use `defaultArrival(new Date())` for the initial value instead of `toLocalDateTimeInput(new Date())`; add `min={toLocalDateTimeInput(new Date())}` on the `datetime-local` input next to the existing `max`; when `defaultArrival` returns `null`, show the closed message `t('reservations.closedToday')` and disable submit
- [X] T007 [P] [US2] Add `reservations.closedToday` to `src/i18n/vi.ts` ("Đã hết giờ đặt chỗ cho hôm nay. Chỗ chỉ đặt được trong ngày, trước 23:59.") and `src/i18n/en.ts` ("Reservations for today are closed. You can only book for today, before 23:59."); the i18n parity test passes

## Phase 5: User Story 3 – Staff entry form shows readable choices (Priority: P2, group B)

**Goal**: The zone, vehicle type and gate selects show labels (FR-009).

**Independent test**: `tests/entry-form.test.ts` passes; on `/staff/entry` each select shows its label after a choice.

- [X] T008 [P] [US3] Write `tests/entry-form.test.ts`: render `EntryForm` with `renderToStaticMarkup` inside `I18nProvider` (vi), with zones `[{ id: 'zone-id-123', label: 'Khu A' }]`, following the pattern of the round-5 UI tests (`vi.stubGlobal('React', ...)`, mock `next/navigation`). Assert the trigger text contains "Khu A", "Cổng 1" and (with the plate tab active) "Xe máy", and does not contain `zone-id-123`, `GATE-1` or `MOTORBIKE` as visible text; run it and see it fail
- [X] T009 [US3] In `src/app/staff/entry/EntryForm.tsx` give each `SelectValue` a function child mapping value → label: zone → `zones.find(z => z.id === v)?.label`, vehicle type → `t('availability.vehicleTypes.' + v)`, gate → `t('gates.' + v)`; T008 passes

## Phase 6: User Story 1 – Availability screen shows freshness, used spots and "full" (Priority: P1, group A)

**Goal**: G1–G3 closed (FR-001..FR-005). Contract: [availability-view.md](contracts/availability-view.md).

**Independent test**: `tests/live-availability.test.ts` passes; the A-49 TC-AV-01 rerun and full-zone case pass (T020).

- [X] T010 [P] [US1] Write `tests/live-availability.test.ts`: render `LiveAvailability` with `renderToStaticMarkup` inside `I18nProvider` with a fixed `initial` (zone A motorbike capacity 10, open 3, reserved 1, free 6; zone C car capacity 2, open 2, reserved 0, free 0) and `renderedAt` fixed. Assert: role CUSTOMER has no "Đã dùng" column and no `4`-used cell; role STAFF and MANAGER show "Đã dùng" with 4 for A and 2 for C; zone C shows "Hết chỗ" for every role (vi) and "Full" (en); zone A shows no full badge; the header shows "Cập nhật lúc" with the time of `renderedAt`. Run it and see it fail
- [X] T011 [US1] In `src/components/LiveAvailability.tsx`: add props `role: 'CUSTOMER' | 'STAFF' | 'MANAGER'` and `renderedAt: string`; keep `updatedAt` state initialised from `renderedAt` and set to `new Date()` in `source.onmessage` after a successful parse; show `t('availability.updatedAt')` + local `HH:mm:ss` in each lot card header; add a "used" column (`open + reserved`) only when role is STAFF or MANAGER; show a destructive `Badge` with `t('availability.full')` next to the free value when `free === 0`
- [X] T012 [P] [US1] Add `availability.used` ("Đã dùng" / "Used"), `availability.full` ("Hết chỗ" / "Full") and `availability.updatedAt` ("Cập nhật lúc" / "Updated at") to `src/i18n/vi.ts` and `src/i18n/en.ts`
- [X] T013 [US1] Pass `role` (from the page's server-side current user) and `renderedAt={new Date().toISOString()}` to `LiveAvailability` in `src/app/customer/page.tsx`, `src/app/staff/page.tsx` and `src/app/manager/page.tsx`; T010 passes

## Phase 7: User Story 4 – Early-arrival confirmation shows the booking (Priority: P2, group C)

**Goal**: FR-010, FR-011 (SRS FR-51). Contract: [early-arrival-error.md](contracts/early-arrival-error.md).

**Independent test**: service and `handle()` tests pass; the Staff prompt shows the booked time and zone.

- [X] T014 [P] [US4] In `tests/errors.test.ts` add: a `DomainError` constructed with details exposes them; `handle()` returns body `{ error, details }` with the mapped status when details are present, and exactly `{ error }` when not. Run it and see it fail
- [X] T015 [P] [US4] In `tests/entry.test.ts` add: an early arrival without `confirmEarly` rejects with code `EARLY_ARRIVAL` and `details` `{ arrivalTime: <reservation arrivalTime ISO>, zoneName: <reserved zone name> }`, and creates no session; then with `confirmEarly: true` the vehicle is admitted (existing behaviour). Run it and see it fail
- [X] T016 [US4] In `src/server/errors.ts` add optional `details?: Record<string, unknown>` to `DomainError` (third constructor argument); in `src/server/api.ts` `handle()` include `details` in the JSON body only when present; T014 passes
- [X] T017 [US4] In `src/server/services/entry.ts` load the matched reservation's zone name in the existing transaction and throw `new DomainError('EARLY_ARRIVAL', ..., { arrivalTime: reservation.arrivalTime.toISOString(), zoneName })`; no plate in details; T015 passes
- [X] T018 [US4] In `src/app/staff/entry/EntryForm.tsx` keep the `details` from the 409 body in state and show, under `entry.earlyWarning`, `t('entry.earlyBooked')` with the local time (`HH:mm`) and zone; add `entry.earlyBooked` ("Giờ hẹn: {time} · Khu: {zone}" / "Booked: {time} · Zone: {zone}") to both `src/i18n/vi.ts` and `src/i18n/en.ts`, using the existing interpolation style of `t()`; extend T008's render test or add a case asserting the prompt text once `earlyDetails` is set (via an exported presentational `EarlyArrivalPrompt` component)

### Notes from implementation (24/11)

- T001 baseline after rebasing on `main` `26a623c`: 42 files, 339 tests passing.
- T009 also covered the **reservation form's** vehicle and zone selects (`src/app/customer/reservations/page.tsx`), which showed raw IDs for the same reason (FR-009 extended). These two selects have no automated test: the page loads its options in effects, so a static render has no options. They are covered by quickstart manual step 3. The entry-form test shows the pattern is correct.
- T013: the role passed to `LiveAvailability` is the role of the page (`/customer`, `/staff`, `/manager`). The section layouts already restrict each page to its role, so no extra session read is needed.
- Before/after check for T008: before the fix, the entry form rendered `zone-id-123`, `GATE-1` and `MOTORBIKE` in the selects.
- US4 (T014–T018) was taken as F4-02 of `docs/m3-m4-final-work-division.md` (the SRS section 9 reservation gap; FR-52 is already on `main` as `/staff/lookup`). T018's render test is a separate file, `tests/early-arrival-prompt.test.ts`. The 7 new US4 tests failed before the change. `zoneName` comes from the zone already loaded in the transaction, which is the reserved zone in that branch, so no extra query.
- T019 (24/11, after rebasing on `main` `f6cd0cc`): `npm test` 47 files, 366 tests passing; `eslint src tests` and `tsc --noEmit` clean; `npm run build` passes.
- `speckit-analyze` (24/11) fixes: D1 codegraph installed and indexed; D2 clarify skip recorded in the spec; I1 role source corrected in plan, data-model and research; I2/I3 T020 output file and T021 split (T022); C1 the picker's `min` is the next whole minute (`minArrivalInput` in `src/lib/arrival.ts`, test in `tests/arrival.test.ts`), because the current minute is already past and fails `RESERVATION_WINDOW`; L1/L2 plan file list and spec status.
- T020 run (24/11, RES-04) found body text still in serif: `font-sans` was applied on `<html>`, while the Geist variable is defined by a class on `<body>`, so it was undefined where it was used. Fixed by applying `font-sans` on `body`; `tests/globals-css.test.ts` has a case that failed before the fix (`html` vs `body`).
- T020 done 24/11 (RES-04): all checks pass; results in `docs/final/res04/a49-retest.md`; A-49 changed to Verified in `docs/m3/quality-evidence-A-49.md`. EX-01 filled zone A in run 1 and zone C in run 2; the full mark cleared 1.1–2.1 s after the freed spot (exit time from `dev.db`).

## Phase 8: Polish and verification

- [X] T019 Run `npm test`, `npm run lint` and `npm run build`; all pass (Constitution IV). Record the test count
- [X] T020 [Manual, RES-04] Follow [quickstart.md](quickstart.md) "Manual" steps 1–6 on a freshly reset `dev.db`. Record the results in `docs/final/res04/a49-retest.md` (F4-05 of `docs/m3-m4-final-work-division.md`); in `docs/m3/quality-evidence-A-49.md` change the verdict to Verified and link to that file
- [ ] T021 Open the PR for `fix/cr-03-ui` with reviewer RES-02, after T020 and `review-implementation`
- [ ] T022 After #22 or #23 merges: mark SRS v2.1 section 9 rows FR-19/20/21 and FR-51 as resolved, in a follow-up PR (the SRS file is not edited in this PR, rule 1 of the final work division)

## Dependencies

- T001 before everything.
- US5 (T002–T003), US2 (T004–T007), US3 (T008–T009), US1 (T010–T013), US4 (T014–T018) are independent of each other.
- Shared files: `src/i18n/{vi,en}.ts` (T007, T012, T018) and `EntryForm.tsx` (T009, T018). Run those tasks in sequence, not in parallel.
- Within each story: test task → implementation → the test passes.
- T019 after all stories; T020 after T019 (needs US1 for SC-001..SC-003); T021 after T020; T022 after #22/#23.

## Parallel examples

- Tests first, together: T002, T004, T008, T010, T014, T015 (all different files).
- US2 and US5 implementations in parallel: T003 with T005.

## Implementation strategy

1. **Demo-safe first**: US5, US2, US3 (group B, about 0.6 h). The demo path has no known defect after this.
2. **A-49 to Verified**: US1 (about 1 h) plus the manual rerun T020.
3. **FR-51**: US4 (about 0.5 h).
4. Stop at any phase and the app still works; each phase is a commit.
