# Tasks: M3 KB Fixes (A-22, A-63, A-74)

**Input**: `specs/001-m3-kb-fixes/` (spec, plan, research, data-model, contracts)
**Tests**: required (constitution IV). Write each test first and watch it fail.
**Commits**: every commit message references the A-ID and KB-ID, e.g. `fix(exit): ... (A-63, KB-04)`.

## Phase 1: Setup

- [x] T001 Run `codegraph sync` and record the baseline: confirm `git status` is clean on branch `feat/m3-kb-fixes-and-docs` apart from `.specify/` and `specs/`

## Phase 2: Foundational

- [x] T002 Move `plateCompareKey` from `src/server/services/vehicles.ts` to `src/lib/plate.ts`, export it, and import it in `vehicles.ts`; keep behaviour identical (uppercase alphanumerics only after `normalizePlate`). Add a unit test in `tests/plate.test.ts` for `51F-123.45`, `51f 123 45`, `51F12345` all giving the same key and `51F-999.99` a different one (A-63, KB-04)

**Checkpoint**: `npx vitest run tests/plate.test.ts tests/vehicles.test.ts` stays green.

## Phase 3: User Story 1 - Exit plate check ignores separators (P1)

**Independent Test**: entry `51F-123.45`, exit with `51F12345` shows no mismatch.

- [x] T003 [US1] Add failing tests in `tests/exit.test.ts`: preview and confirm with `51F12345`, `51f 123 45` report no mismatch; `51F-999.99` still reports `plateMismatch: true` and confirm throws `PLATE_MISMATCH` without `confirmMismatch` (A-63, KB-04)
- [x] T004 [US1] In `src/server/services/exit.ts` use `plateCompareKey(observedPlate) !== plateCompareKey(session.plateSnapshot)` in `previewExit` and `confirmExit`; keep `normalizePlate` for the event note text (A-63, KB-04)

## Phase 4: User Story 2 - Lost-card exit always uses plate lookup (P1)

**Independent Test**: lost-card confirm with `method: 'QR'` throws `VALIDATION`, writes nothing; with `'PLATE'` succeeds.

- [x] T005 [US2] Add failing tests in `tests/exit.test.ts`: lost-card confirm with `method: 'QR'`, `'RFID'` and with `method` missing throws `VALIDATION` and leaves the session OPEN with no payment and no `LOST_CARD` event; with `method: 'PLATE'` it closes as before; non-lost-card confirm without `method` still works. Update the existing lost-card test (~line 93) to pass `method: 'PLATE'` (A-63, KB-05)
- [x] T006 [US2] In `src/server/services/exit.ts` add optional `method` (`z.enum(['PLATE','QR','RFID'])`) to `confirmExitSchema` and the input type; before `withLock`, throw `DomainError('VALIDATION', 'Lost card requires plate lookup')` when `lostCard` and `method !== 'PLATE'` (A-63, KB-05)
- [x] T007 [P] [US2] Forward `method: body.method as IdMethod | undefined` in `src/app/api/events/exit/confirm/route.ts` (A-63, KB-05)
- [x] T008 [P] [US2] Send `method: effectiveMethod` in the confirm request body in `src/app/staff/exit/ExitForm.tsx` (A-63, KB-05)
- [x] T009 [US2] Check `src/server/services/simulator.ts` EX-03 path (instructions at ~line 417 and `SimulatorPanels.tsx`) still produces a valid lost-card flow with `method: 'PLATE'`; if a client confirm call is built there, add the field. Extend `tests/simulator.test.ts` only if code changed (A-63, KB-05)

## Phase 5: User Story 3 - Known vehicle type wins at entry (P2)

**Independent Test**: registered car, entry claims motorbike, session is a car.

- [x] T010 [US3] Add tests in `tests/entry.test.ts`: known vehicle ignores a conflicting `vehicleType`; unknown plate without `vehicleType` throws `VALIDATION`. Expect them to pass already; no source change unless one fails (A-63, KB-13)

## Phase 6: User Story 4 - P18 decisions and CP-02 record (P1)

**Independent Test**: every KB row in P18 section 10 has a decision and owner; header shows v1.0.

- [x] T011 [US4] Correct the `updateLot` doc comment at `src/server/services/lots.ts:86`: a suspended lot keeps reporting normal counts plus `status`; no behaviour change (A-22, KB-18)
- [x] T012 [US4] In `docs/m2-report/products/CO3011_M2_KienTrucAPI_v0.1.md` section 10, fill the decision column: KB-02 accept (fee at exit time, client log silent), KB-03 accept (one transaction), KB-04/05/13 fixed under A-63, KB-06 accept (no vehicle-detail screen), KB-10 accept (stricter than spec), KB-12 accept, KB-17 fix spec (also edit `docs/m2-report/products/CO3011_M2_ThietKeCSDL_v0.1.md` to add `roles`, `fee_group`, `owner_id`, `cancel_reason`, `cancel_zone_id`), KB-18 comment fixed, KB-19 accept (pilot scale). Leave KB-01/08/09 (A-44), KB-07/14/16 (A-28), KB-11 (A-70), KB-15 (A-65) with their owning activity and member
- [x] T013 [US4] In the same file resolve VM-01 and VM-02, add contract text from `specs/001-m3-kb-fixes/contracts/exit-and-entry.md` to the exit and entry endpoint sections, add a v1.0 row to the document control table dated 2026-11-18, update the "Phiên bản" line, and add a CP-02 review record (reviewer RES-02, approver RES-01, outcome, date as `TODO(RES-02): confirm review date`). Do not edit `docs/m2-report/data/plan.mjs` or `docs/m2-report/generated/*` (A-22)

## Phase 7: User Story 5 - Payment module review (P2)

**Independent Test**: payment tests and review notes cover FR-26, FR-27, FR-28.

- [x] T014 [US5] Add tests in `tests/exit.test.ts`: tariff changed between `previewExit` and `confirmExit` charges the tariff at confirm time; one payment per closed session; a forced failure in the payment write (e.g. mocked `tx.payment.create` rejecting) leaves the session OPEN (A-74, KB-02, KB-03)
- [x] T015 [US5] Review `exit.ts` payment creation and the customer and manager payment history services (`history.ts`) against FR-26..FR-28 in `docs/superpowers/specs/2026-11-08-smart-parking-mvp-design.md`; add `tests/history.test.ts` cases for any role-visibility gap found, and write findings under a new "A-74 review" subsection in `docs/m2-report/products/CO3011_M2_KienTrucAPI_v0.1.md` (A-74)

## Phase 8: Polish

- [ ] T016 Ask the user for consent to run the suite, then run `npm test`, `npm run lint`, `npm run build`; report real output. Prisma blocks `db push --force-reset` for AI agents without explicit user consent text
- [ ] T017 Run `codegraph sync`, then verify the quickstart in `specs/001-m3-kb-fixes/quickstart.md`
- [ ] T018 Check `src/i18n/en.ts` and `src/i18n/vi.ts` key parity is unchanged (no new keys expected)

## Dependencies

- T002 before T004. T003 before T004. T005 before T006. T007 and T008 after T006.
- US1, US2, US3 are independent after T002. US4 and US5 depend on the decisions already made and can run in parallel with code stories, but T014 should follow T004.
- T016 gates completion.

## Parallel examples

- T007 and T008 touch different files.
- T011 can run alongside T003..T010.

## Strategy

MVP is US1 + US2 (both P1 code fixes), plus US4 to unblock CP-02. Commit after each task or logical pair.
