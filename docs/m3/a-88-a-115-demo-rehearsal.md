# A-88 / A-115 · RES-01 demo rehearsal

On 21 November 2026, the HTTP rehearsal passed all 25 checks in `e2e/round3.e2e.mjs` on a local Next.js development server using a fresh seeded SQLite database. A separate Manager simulator call with seed 67 and 120 events returned HTTP 200 with 73 entries, 47 exits, and zero rejections. The test copy was based on `a55f6a8`. Git showed no differences from `ae83481` in the application, schema, E2E script, or package manifest.

| Segment | Demo steps and expected result |
|---|---|
| Staff entry | Reserve a space as Customer, then attempt early entry as Staff. Show that entry requires confirmation. Confirm and show that the session opens and the reservation becomes fulfilled. |
| Staff exit | Keep the session open, then suspend the lot as Manager. Show that new entry is rejected and that the existing session can still exit. |
| Manager simulator | Run the live simulator and show its entry and exit counters. Reproduce the rehearsal on a fresh seed before comparing exact counts. Use SC-07 for the separate 100-session acceptance criterion. |

Before the 27 November demo, align these segments with RES-05's script and use the [manual guide](../manual-e2e-test-guide.md) for the browser run. Record client acceptance and exceptions for A-89 after the demo. The HTTP run covers the technical rehearsal. Browser rehearsal, formal acceptance, and the mock viva are pending.

**Mock viva artifact:** [RES-05's A-43 simulator review](A-43-simulator-review.md). Explain why 120 events and 100 sessions are different measures and how SC-07 verifies the session requirement.
