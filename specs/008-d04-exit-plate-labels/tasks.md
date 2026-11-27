# Tasks: Show both plates in the exit preview (A-68 D-04)

**Input**: Design documents from `specs/008-d04-exit-plate-labels/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/exit-preview-view.md, quickstart.md

**Tests**: required by constitution IV (a test that fails without the fix).

## Format: `[ID] [P?] [Story] Description`

## Phase 1: Setup

- [X] T001 Confirm the branch `fix/d04-exit-plate-labels` is based on `origin/main` `2c5a587`, run `codegraph sync`, and run `npx vitest run tests/exit.test.ts tests/i18n.test.ts` as the baseline (both pass)

## Phase 2: Foundational

- [X] T002 [P] Add `entryPlate: 'Biển số lúc vào'` to the `exit` block in `src/i18n/vi.ts` and `entryPlate: 'Plate at entry'` to the `exit` block in `src/i18n/en.ts` (key parity required by `tests/i18n.test.ts`)

## Phase 3: User Story 1 - Staff see which plate was recorded at entry and which plate they observed (Priority: P1) 🎯 MVP

**Goal**: the exit preview shows the entry plate under "Biển số lúc vào" / "Plate at entry" and the typed plate under "Biển số quan sát" / "Observed plate", with the observed plate marked when the plates differ.

**Independent Test**: `npx vitest run tests/exit-preview-details.test.ts`, then the manual AT-EX02 steps in quickstart.md.

### Tests for User Story 1

- [X] T003 [US1] Write `tests/exit-preview-details.test.ts` with `renderToStaticMarkup` inside `I18nProvider` (pattern of `tests/early-arrival-prompt.test.ts`), rendering `ExitPreviewDetails` from `src/app/staff/exit/ExitForm.tsx` with a preview whose `plateSnapshot` is `66F-403.45`: (a) vi, `plateMismatch: true`, `observedPlate: '66F-403.46'` → the HTML contains "Biển số lúc vào" followed by `66F-403.45`, "Biển số quan sát" followed by `66F-403.46`, and `data-mismatch="true"` on the observed value; the entry plate is not the value under "Biển số quan sát"; (b) vi, `plateMismatch: false`, `observedPlate: ' 66F 403 45 '` → both labels, observed value `66F 403 45` (trimmed), no `data-mismatch`; (c) en → "Plate at entry" and "Observed plate". Run it and record that it fails before T004 (the export does not exist and the label is wrong)

### Implementation for User Story 1

- [X] T004 [US1] In `src/app/staff/exit/ExitForm.tsx`, export the `ExitPreview` type and a component `ExitPreviewDetails({ preview, observedPlate }: { preview: ExitPreview; observedPlate: string })` that renders the `<dl>` of contracts/exit-preview-view.md in this order: `exit.entryPlate` → `preview.plateSnapshot`; `exit.observedPlate` → `observedPlate.trim()`, with `data-mismatch="true"` and `text-destructive` when `preview.plateMismatch` is true; then zone, vehicle type, fee group, entry time and fee exactly as today. Replace the inline `<dl>` in `ExitForm` with `<ExitPreviewDetails preview={preview} observedPlate={observedPlate} />`. Leave the mismatch warning, the checkbox, the confirm rule and `resetPreview()` unchanged
- [X] T005 [US1] Run `npx vitest run tests/exit-preview-details.test.ts tests/exit.test.ts tests/i18n.test.ts` (all pass), then mutation-check: remove the observed-plate row, then swap the entry-plate label back to `exit.observedPlate`, then drop the mismatch mark; each change must make a T003 case fail; restore the fix

## Phase 4: Polish & Cross-Cutting Concerns

- [X] T006 Run `npm test`, `npm run lint` and `npm run build` (constitution IV); record the counts in the PR description (done when the PR was opened)
- [X] T007 Manual AT-EX02 retest on the dev server following quickstart.md steps 1–7 (mismatch, match with separators, English, preview cleared when the observed plate changes, lost card); record the results and screenshots in `docs/final/res04/d04-retest.md`, ending with a paste-ready Quality Evidence row and the D-04 status for ISS-11
- [X] T008 Run `codegraph sync`, then the independent `review-implementation`; fix any Critical or Important finding before the PR (done: APPROVED at `16451bb`, 0 Critical, 0 Important; `codegraph sync` run at `8c4d371`)
- [X] T009 Open one PR into `main` (commits reference A-68, D-04, ISS-11); after merge, owners of A-68 (RES-05) and the CP-05 gate (RES-02) update D-04 in `docs/m3/a-68-cp05-test.md` and F2-03 (rule 2: RES-04 does not edit their files) (done: PR #38 merged at `8c4d371` on 27/11; recording D-04 as fixed in their files is left to RES-05 and RES-02)

## Phase 5: Review fix (review of `12dae51`, 27/11: a late preview response could show the current input with a stale mismatch state)

- [X] T010 [US1] Write `tests/request-guard.test.ts` for `createRequestGuard()` from `src/lib/requestGuard.ts`: a token from `begin()` is current; after `invalidate()` (an input change) the earlier token is not current; after a second `begin()` the first token is not current and the second is. Run it and record that it fails before T011
- [X] T011 [US1] Add `src/lib/requestGuard.ts` (`begin`, `invalidate`, `isCurrent`). In `src/app/staff/exit/ExitForm.tsx`: keep one guard per form (`useRef`); `resetPreview()` calls `invalidate()`; `handlePreview` takes a token and the plate it sends, and sets the preview (stored with that plate) only if the token is still current; `ExitPreviewDetails` gets the stored plate; `handleConfirm` sends the stored plate. The visible behaviour without a race is unchanged
- [X] T012 [US1] Run `npx vitest run tests/request-guard.test.ts tests/exit-preview-details.test.ts tests/exit.test.ts`, then mutation-check (`isCurrent` always true; `invalidate` a no-op): each must fail a T010 case; then `npm test`, `npm run lint`, `npm run build`
- [X] T013 Re-run step 2 of the manual retest (mismatch preview, vi) and the independent `review-implementation` on the new head; update `docs/final/res04/d04-retest.md` with the fix commit

## Phase 6: Review fix 2 (review of `ca6867b`, 27/11: the guard was tested but its use in `ExitForm` was not; a stale network error still showed a toast)

- [X] T014 [US1] Write `tests/exit-preview-controller.test.ts` with a deferred fetch: a current success returns the preview and the sent plate; a current error returns its code; after `inputChanged()` a late success, error or network failure returns `null`; a newer request makes the older answer stale; a current network failure is reported. Add a row-order case to `tests/exit-preview-details.test.ts`. Seen to fail before T015 (module missing)
- [X] T015 [US1] Add `src/lib/exitPreviewController.ts`; `ExitForm` sends every preview request through it, calls `inputChanged()` in `resetPreview()`, ignores a `null` outcome, and keeps the preview and the sent plate in one state value used for display and confirm. Fix the outdated reasoning in research R1, data-model and the `ExitPreviewDetails` comment
- [X] T016 [US1] Mutation-check the controller (no stale check on answers; stale network reported; sent plate not carried; `inputChanged` as a no-op): each fails a T014 case. Run `npm test` (or `npx vitest run` if `prisma generate` hits EPERM), `npm run lint`, `npm run build`

## Phase 7: Review fix 3 (review of `e18e574` by the owner, 27/11: an outdated request still held the preview button and could clear a newer request's loading state; the form's invalidation call and confirm plate had no form-level test)

- [X] T017 [US1] (The RED run was not recorded: the model and its test were written together; T019 mutation checks stand in for it.) Write `tests/exit-form-model.test.ts` for `createExitFormModel` with deferred requests: editing the plate during a pending request releases the button and keeps the late preview hidden; a late error or network failure changes nothing; with overlapping requests the older answer cannot end the newer loading state or set the preview; confirm sends the plate of the current preview after an edit and a new preview; a current error hides the preview; a lost card is looked up by plate. (A DOM-based test with jsdom and Testing Library was not added: installing those packages was not permitted in this session.)
- [X] T018 [US1] Add `src/lib/exitFormModel.ts` (inputs, preview requests, loading, confirm) and make `ExitForm` render it with `useSyncExternalStore`; every input change calls `setInput`. Remove `src/lib/exitPreviewController.ts` and its test (superseded)
- [X] T019 [US1] Mutation-check the model (edit without invalidation, edit keeps the button locked, a stale answer ends the loading state: each fails a T017 case; confirming with the live input instead of the compared plate is equivalent while every edit clears the preview, so no test can tell them apart). Run `npx vitest run`, `npm run lint`, `next build`

## Phase 8: Review fix 4 (review of `01fe926`, 27/11: the rewritten confirm and error paths had no test; a successful confirm could leave the Preview button locked; size over 300 lines not recorded)

- [X] T020 [US1] Add form-model cases: confirm sends `confirmMismatch`, `lostCard`, `method`, `gate`, `note` and the compared plate; a refused or failed confirm releases the confirm button and keeps the preview; a current error hides a preview already shown; a successful confirm releases the Preview button even if a preview started meanwhile (this case failed before T021)
- [X] T021 [US1] Set `previewing: false` on a successful confirm in `src/lib/exitFormModel.ts`. Mutation-check: `confirmMismatch` or `lostCard` always false, `confirming` kept after an error, an error keeping the old preview, and a confirm leaving Preview locked each fail a T020 case. Record the size deviation in plan.md Complexity Tracking; fix the stale wording in research R1, the plan and the retest record

## Dependencies & Execution Order

- T001 → T002 → T003 (test written and seen to fail) → T004 → T005 → T006 → T007 → T008 → T009. Review fixes: T010 (fails first) → T011 → T012; T014 (fails first) → T015 → T016; T017 → T018 → T019; T020 (one case fails first) → T021; then T013 (manual recheck and independent review on the final head), before the PR is merged.
- T002 touches only the i18n files and can run in parallel with T003; T003 must fail for the right reason (missing export, wrong label) before T004.

## Parallel Example

```text
T002 (i18n keys) and T003 (render test) together; then T004.
```

## Implementation Strategy

One user story, so the MVP is the whole feature: T001–T005 fix and prove the display, T006–T009 close it under the constitution and hand the evidence to the gate owners before CP-07 (27/11).
