# Research: Show both plates in the exit preview (A-68 D-04)

No item in the Technical Context was marked NEEDS CLARIFICATION. The decisions below record the choices made.

## R1. Where the observed plate comes from

- **Decision**: from the plate the form sent with the preview request, kept together with the preview (`createExitPreviewController`, FR-006), not from the live input and not from the preview API.
- **Rationale**: the form already holds the value and sends it to `/api/events/exit/preview`. Clearing the preview on every input change is not enough on its own: a response that arrives after the change would restore a preview for the earlier value (reviews of `12dae51` and `ca6867b`). The controller drops such late answers and returns the sent plate with a current one. Returning the plate from the API would change the P18 contract and the contract tests for no gain.
- **Alternatives considered**: add `observedPlate` to the `ExitPreview` response (option B in the design), rejected as a needless contract change.

## R2. How to make the preview testable

- **Decision**: export a presentational component `ExitPreviewDetails({ preview, observedPlate })` from `ExitForm.tsx` and render it in a vitest test with `renderToStaticMarkup` inside `I18nProvider`.
- **Rationale**: `ExitForm` holds state and fetches, so its preview branch cannot be reached in a static render. The same extraction was used for `EarlyArrivalPrompt` (FR-51) and `ReservationForm` in spec 006, and the review of spec 006 accepted it.
- **Alternatives considered**: a browser end-to-end test (no such harness in the repo); testing only the i18n strings (would not fail on the wrong label).

## R3. How to mark a mismatch

- **Decision**: when `plateMismatch` is true, give the observed plate's value a destructive text style and a `data-mismatch` attribute; the existing warning and checkbox stay below.
- **Rationale**: the colour makes the difference visible next to the entry plate; the attribute lets the test assert the mark without depending on Tailwind class names.
- **Alternatives considered**: a second warning text (duplicates the existing one); an icon (no icon set is used on this screen).

## R4. Labels

- **Decision**: new key `exit.entryPlate` = "Biển số lúc vào" / "Plate at entry"; reuse `exit.observedPlate` = "Biển số quan sát" / "Observed plate" for the typed plate, where it is now correct.
- **Rationale**: matches the wording of `exit.mismatchWarning` ("…biển số ghi nhận lúc vào") and of AT-EX02.
