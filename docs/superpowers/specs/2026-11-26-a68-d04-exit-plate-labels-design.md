# Design: show both plates in the exit preview (A-68 D-04, ISS-11)

Date: 2026-11-26. Author: RES-04. Reviewers: RES-01 (PM), RES-02 (QA).

## Problem

A-68 D-04 (S2, `docs/m3/a-68-cp05-test.md`): on the Staff exit screen, the preview labels the plate recorded at entry (`plateSnapshot`) as "Biển số quan sát" / "Observed plate". The same label is used for the input where Staff type the plate they see at the gate. When the plates differ (EX-02), the screen shows the entry plate under the observed-plate label, next to a warning that the plates do not match, and never shows the plate Staff typed. In A-68 the vehicle entered as `66F-403.45`, Staff typed `66F-403.46`, and the preview showed `66F-403.45` as the observed plate. AT-EX02 expects both plates to be shown. The mismatch check, the confirmation checkbox, the `PLATE_MISMATCH_CONFIRMED` event and the access log already work, so only the display is wrong. CP-05 condition C6 (ISS-11) requires a fix or PM acceptance before CP-07 (27/11).

## Options

| Option | Effect | Verdict |
|---|---|---|
| A. Rename the preview label only ("Biển số lúc vào") | The wrong label goes away, but the observed plate is still not shown next to it, so AT-EX02 is still not met | Rejected |
| B. Return the observed plate from the preview API and show both | Works, but changes the API contract (P18, contract tests) for a value the form already holds | Rejected: needless contract change |
| C. Show both plates in the preview from data the form already has: `plateSnapshot` from the API under a new label "Biển số lúc vào" / "Plate at entry", and the typed plate under "Biển số quan sát" / "Observed plate"; mark the observed plate when the plates differ | Display-only, no API or service change. Resetting the preview on every input change is not enough on its own: a late response could restore a preview for the earlier value (reviews of `12dae51` and `ca6867b`). The form therefore drops stale answers and shows the plate sent with the request (spec 008 FR-006, `createExitFormModel`) | **Chosen** |

## Decision

- Move the preview details into an exported presentational component in `src/app/staff/exit/` so it can be rendered in a test (the same pattern as `EarlyArrivalPrompt` and `ReservationForm` in spec 006).
- Two rows: "Biển số lúc vào" (`plateSnapshot`) and "Biển số quan sát" (the typed plate). When `plateMismatch` is true, the observed plate is styled as an error so the difference is visible.
- New i18n key `exit.entryPlate` in `vi.ts` and `en.ts` (the parity test requires both).
- Test first: a render test that fails on the current code (both plates and their labels on a mismatch; no wrong label on the entry plate).
- Manual retest of AT-EX02 on the dev server, recorded with the D-04 status update.
- Out of scope: D-05 (session detail does not show the identification method, S3), and any change to the mismatch logic or the API.
