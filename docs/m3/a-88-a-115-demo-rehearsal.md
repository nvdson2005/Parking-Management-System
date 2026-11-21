# A-88 / A-115 · RES-01 demo rehearsal

On 21 November 2026, the HTTP rehearsal passed all 25 checks in `e2e/round3.e2e.mjs` on a local Next.js development server using a fresh seeded SQLite database. A separate Manager simulator call with seed 67 and 120 events returned HTTP 200 with 73 entries, 47 exits, and zero rejections. The test copy was based on `a55f6a8`. Git showed no differences from `ae83481` in the application, schema, E2E script, or package manifest.

| Segment | Demo steps and expected result |
|---|---|
| Staff entry | Reserve a space as Customer, then attempt early entry as Staff. Show that entry requires confirmation. Confirm and show that the session opens and the reservation becomes fulfilled. |
| Staff exit | Keep the session open, then suspend the lot as Manager. Show that new entry is rejected and that the existing session can still exit. |
| Manager simulator | Run the live simulator and show its entry and exit counters. Reproduce the rehearsal on a fresh seed before comparing exact counts. Use SC-07 for the separate 100-session acceptance criterion. |

Before the 27 November demo, align these segments with RES-05's script and use the [manual guide](../manual-e2e-test-guide.md) for the browser run. Record client acceptance and exceptions for A-89 after the demo. The joint rehearsal, formal acceptance, and the mock viva are pending.

## Browser check on 21 November

Playwright signed in with the seeded Manager account and opened the Simulator page on a separate disposable database. With 120 events and seed 67, the live button returned HTTP 200. The page showed 73 sessions, 73 entries, 47 exits, and zero rejections.

Playwright also signed in with the seeded Staff account on a fresh disposable database. Plate entry opened a guest motorbike session in zone A. At exit, the observed plate without its separator matched, and the fee preview showed 2,000 VND. Confirming payment returned HTTP 200 with the session closed and the payment confirmed. The page displayed “Vehicle exit recorded and fee collected.” The earlier HTTP run covers the reservation and suspension scenarios.

**Mock viva artifact:** [RES-05's A-43 simulator review](A-43-simulator-review.md). Explain why 120 events and 100 sessions are different measures and how SC-07 verifies the session requirement.


## Acceptance and closeout preparation

- At the joint rehearsal, align the browser steps with RES-05’s script and the A-87 dry-run results.
- At the client demo, capture the date, attendees, scenarios shown, customer verdict, and each accepted exception or open action with an owner and due date. Pass the record to RES-03 for A-89.
- At the 30-minute retrospective, spend 5 minutes on the timeline, 10 on practices to keep or change, 10 on improvements and owners, and 5 confirming the notes for RES-04’s lessons section.
- For report sign-off, record the final PDF version and open issues. After RES-04 uploads it, retain the LMS receipt with the submission record.
