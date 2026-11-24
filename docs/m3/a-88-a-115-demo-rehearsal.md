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

## Phase 5 acceptance run sheet (A-87, A-88, A-115)

The earlier 21 November rehearsal predates the Phase 5 product stack. **Provisional integrated candidate (24 November):** PR #17 head `bcbbac3d9531cf05d876cbab9ce6e1476c8b923e` contains PR #11 head `36b1c9158034761bd094a62a8c6485d8281eb3c4` as an ancestor, followed by seven PR #17 commits. This is an identified review build, **not an A-87 pass or release approval**: #11 still has requested changes and conflicts with `main`; #17 is approved against #11's current head. Re-pin the SHA after #11 is fixed and the stack is integrated.

The provisional tree contains the #11 index, session-gate and session-source migrations (`20261123100000`, `20261123180000`, `20261123190000`), then the #17 lot-hours and group-request migrations (`20261124090000`, `20261124100000`). Their presence and order were inspected in Git; **migration application and data preservation on this candidate are not yet independently verified**. Record the disposable database path, migration output, seed, production-build result, browser versions, operator and exclusions in the A-87 run. The 21 November development-server rehearsal and PR #17's owner-reported scratch-database run do not establish the integrated acceptance verdict.

**Evidence environment and exclusions for this candidate record:** Git tree and GitHub review only; no database, server, browser or timed run was executed by RES-01 on `bcbbac3`. Migration execution, production build, 100-visit measurements, exception outcomes, nine browser/width cells and client verdict are excluded from this provisional review and remain mandatory A-87/A-88 work.

| Check | Pass evidence on the candidate | Current status |
| --- | --- | --- |
| Single pilot lot and per-visit charging | Staff entry and exit; configured vehicle type and Customer group rate charged once per visit regardless of duration. | Pending |
| Normal 100-visit run | Event-to-record time ≤3 s; recorded-to-display update ≤5 s for each entry/exit; all closed records include entry, exit, vehicle type and area; independent free counts match by area/type. | Pending measured run |
| Separate full-lot refusal | Fill suitable capacity, attempt another arrival, confirm rejection with no session and no availability change. No second timing run at full capacity is mandatory. | Pending |
| Five exceptions | Record EX-01 through EX-05 individually, including the full-lot case, with expected and observed result. | Pending integrated run |
| Hours, tariffs and group request | Execute the [A-61 Phase 5 checks](quality-evidence-A-61.md#phase-5-extension-lot-information-and-fee-groups). | Pending |
| Plate visibility and retention | Staff sees a partial mask in list, detail and response; Manager sees the full retained plate; include a short plate. After exit-based purge, old plate is gone while count, duration, revenue and unrelated notes remain; old entry with recent exit remains retained. | Pending #11 final-head review |
| Session access and scope | Explicit logout works. No 30-minute idle timeout, second-lot UI or survey score is required for handover. | Pending logout; scope recorded |

The [A-68/CP-05 PR #18](https://github.com/nvdson2005/Parking-Management-System/pull/18) reports a 100-entry simulator run and complete records on `8472986`, but explicitly excludes the production build, A-87 client run and T12. QA's CP-05 decision is pending. Its D-01 overlapping-run report is a demo risk: use one operator, click once, and wait for completion at rehearsal; reproduce on the candidate before deciding whether a product fix is required. RES-01 must assign D-03–D-05 or record a deferral. Do not count PR #18 as the Phase 5 integrated verdict.

### Current-head privacy review (24 November; not final A-87 evidence)

At PR #11 head `36b1c9158034761bd094a62a8c6485d8281eb3c4`, the purge selects `CLOSED` sessions by `exitTime < cutoff`, so an old entry with a recent exit is retained. The session detail uses `presentPlate` for Staff display. The following reviewed gaps prevent a privacy pass on this head; they are also recorded in [PR #11's requested-changes review](https://github.com/nvdson2005/Parking-Management-System/pull/11):

| Check | Current-head result and required follow-up |
| --- | --- |
| Short accepted plates | `maskPlate` returns the original value when at most two characters follow the prefix, so a closed `51F-12` remains fully visible. RES-03 must mask every accepted plate and test the short case. |
| Exit-confirmation response | `confirmExit` returns the complete closed session, including full `plateSnapshot`, to Staff. RES-03 must reduce or role-filter the response and test the API result. |
| Unrelated notes | The purge rewrites any event note beginning `Observed plate: `, without limiting the event type to `PLATE_MISMATCH_CONFIRMED`; a `LOST_CARD` note with that text can be changed. Detail formatting needs the same type guard. RES-03 must preserve unrelated notes and test both paths. |
| Retention specification | PR #11's own FR-002 still says entry-based retention while code and lecturer Q44 require exit-based retention. RES-03 must align the requirement before final review. |

Reinspect the changed #11 head and rerun the masking, response, note and cutoff checks after the owner fixes these findings. Non-plate statistics and Manager full-plate access remain pending integrated verification.

### Browser and width matrix (SC-003)

For each cell record version, exact width, core entry/exit and Customer controls used, outcome, screenshot/link, operator and candidate SHA. All nine cells are pending.

| Browser | 360 px | 768 px | 1920 px |
| --- | --- | --- | --- |
| Chrome | Pending | Pending | Pending |
| Edge | Pending | Pending | Pending |
| Firefox | Pending | Pending | Pending |

### Client verdict and handoff

After the 27 November demo, record actual date, attendees, build SHA, tested scenarios, lecturer verdict, accepted exceptions, and each open action with owner and due date. Send those facts to RES-03 for A-89; QA supplies the A-87 measurements and exclusions. The 28 November report review and 29 November submission receipt remain future checkpoints.
