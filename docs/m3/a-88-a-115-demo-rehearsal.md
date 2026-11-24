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

The earlier 21 November rehearsal predates the Phase 5 product stack. **Superseded provisional candidate (earlier 24 November review):** PR #17 head `bcbbac3d9531cf05d876cbab9ce6e1476c8b923e` contained PR #11 head `36b1c9158034761bd094a62a8c6485d8281eb3c4` as an ancestor, followed by seven PR #17 commits. At that time #11 had requested changes and conflicted with `main`; the candidate was not an A-87 pass or release approval.

**Merged-stack review later on 24 November:** PR #11 merged into `main` as `755caf6dfa66ffd29c5e985722f74a25cca41bbb`. Reviewed `main` at `8102711` (after PRs #10 and #13): PR #11's final privacy code was present. PR #17 had merged as `505b06cfeec3d0d56e04e0a3123e6c92f321d1fa` into the already-merged `fix/res03-a28-a65` branch; at that point `main` still lacked its product changes and two migrations. PR #17's final feature head was `2c101638323c005d8976f15d3cbd8b0e421cc787`.

**Integration resolved on 24 November:** [PR #21](https://github.com/nvdson2005/Parking-Management-System/pull/21) merged PR #17's feature branch onto `main` and corrected Q38 approval to require the Customer's exact pending group request. Remote `main` is now `26a623c15df6686ee329c496a3788fed3850d9a2`, containing the tested integration head `0fe871a38870c0974ec6951242547f4f547a6035`. The [integration evidence](https://github.com/nvdson2005/Parking-Management-System/blob/26a623c15df6686ee329c496a3788fed3850d9a2/docs/m3/evidence/pr17-main-integration.md) records 339 passing tests, lint, build, fresh and populated scratch-database migrations, and the Manager approval UI flow. This pins a **single integrated main candidate**, but the A-87 timed run, browser matrix and A-88 client verdict are still pending.

The earlier provisional tree contained the #11 index, session-gate and session-source migrations (`20261123100000`, `20261123180000`, `20261123190000`), then the #17 lot-hours and group-request migrations (`20261124090000`, `20261124100000`). Their presence and order were inspected in Git. PR #21's [integration evidence](https://github.com/nvdson2005/Parking-Management-System/blob/26a623c15df6686ee329c496a3788fed3850d9a2/docs/m3/evidence/pr17-main-integration.md) subsequently verified fresh and populated scratch-database upgrades and data preservation. A-87 must still record its own database path, migration state, seed, production-build result, browser versions, operator and exclusions. The 21 November development-server rehearsal does not establish the integrated acceptance verdict.

**Earlier provisional review exclusions:** No database, server, browser or timed run was executed by RES-01 on `bcbbac3`. PR #21 later supplied integration build and migration evidence on its tested head. The 100-visit measurements, exception outcomes, nine browser/width cells and client verdict remain excluded from that evidence and mandatory for A-87/A-88.

| Check | Pass evidence on the candidate | Current status |
| --- | --- | --- |
| Single pilot lot and per-visit charging | Staff entry and exit; configured vehicle type and Customer group rate charged once per visit regardless of duration. | Pending |
| Normal 100-visit run | Event-to-record time ≤3 s; recorded-to-display update ≤5 s for each entry/exit; all closed records include entry, exit, vehicle type and area; independent free counts match by area/type. | Pending measured run |
| Separate full-lot refusal | Fill suitable capacity, attempt another arrival, confirm rejection with no session and no availability change. No second timing run at full capacity is mandatory. | Pending |
| Five exceptions | Record EX-01 through EX-05 individually, including the full-lot case, with expected and observed result. | Pending integrated run |
| Hours, tariffs and group request | Execute the [A-61 Phase 5 checks](quality-evidence-A-61.md#phase-5-extension-lot-information-and-fee-groups). | Pending |
| Plate visibility and retention | Staff sees a partial mask in list, detail and response; Manager sees the full retained plate; include a short plate. After exit-based purge, old plate is gone while count, duration, revenue and unrelated notes remain; old entry with recent exit remains retained. | PR #11 final-head review passed on `main` `8102711`; A-87 integrated run pending |
| Session access and scope | Explicit logout works. No 30-minute idle timeout, second-lot UI or survey score is required for handover. | Pending logout; scope recorded |

The [A-68/CP-05 PR #18](https://github.com/nvdson2005/Parking-Management-System/pull/18) reports a 100-entry simulator run and complete records on `8472986`. Its later A-31 update reports T12 passed on PR #11's A-28 branch; QA's formal CP-05 decision is still pending. Neither run is the A-87 production-candidate run. Its D-01 overlapping-run report is a demo risk: use one operator, click once, and wait for completion at rehearsal; reproduce on the production candidate before deciding whether a product fix is required. D-03–D-05 need an owner decision or documented deferral. Do not count PR #18 as the Phase 5 integrated verdict.

### Superseded PR #11 review findings (early 24 November)

At PR #11 head `36b1c9158034761bd094a62a8c6485d8281eb3c4`, the purge selects `CLOSED` sessions by `exitTime < cutoff`, so an old entry with a recent exit is retained. The session detail uses `presentPlate` for Staff display. The following reviewed gaps prevent a privacy pass on this head; they are also recorded in [PR #11's requested-changes review](https://github.com/nvdson2005/Parking-Management-System/pull/11):

| Check | Current-head result and required follow-up |
| --- | --- |
| Short accepted plates | `maskPlate` returns the original value when at most two characters follow the prefix, so a closed `51F-12` remains fully visible. RES-03 must mask every accepted plate and test the short case. |
| Exit-confirmation response | `confirmExit` returns the complete closed session, including full `plateSnapshot`, to Staff. RES-03 must reduce or role-filter the response and test the API result. |
| Unrelated notes | The purge rewrites any event note beginning `Observed plate: `, without limiting the event type to `PLATE_MISMATCH_CONFIRMED`; a `LOST_CARD` note with that text can be changed. Detail formatting needs the same type guard. RES-03 must preserve unrelated notes and test both paths. |
| Retention specification | PR #11's own FR-002 still says entry-based retention while code and lecturer Q44 require exit-based retention. RES-03 must align the requirement before final review. |

These findings describe the earlier head only. The final-head review and its evidence follow below; the integrated A-87 run remains separate.

### Final PR #11 privacy review (24 November; A-87 still pending)

At `main` SHA `8102711`, the final #11 implementation addresses all four findings above: `maskPlate` hides at least one alphanumeric character even on a short accepted plate; list, detail and exit-confirmation response use role-aware presentation; EX-02 note masking and purge limit their rewrite to `PLATE_MISMATCH_CONFIRMED`; and its FR-002 now specifies the exit timestamp. `purgeOldData` selects closed sessions by `exitTime < cutoff`, keeps an old entry with a recent exit, and retains the session/payment rows when masking an expired plate. Tests cover Staff and Manager display, the short plate, response, unrelated `LOST_CARD` note, exit cutoff, and retained count/revenue/time. `npm test -- --testTimeout=60000` passed 316/316 (38 files), `npm run lint` passed, and a clean `npm run build` passed after allowing Next.js to fetch its fonts. The test setup reset only `prisma/test.db` with the user's explicit consent. This closes the **code review** in T009, not the timed or browser acceptance checks.

### Browser and width matrix (SC-003)

For each cell record version, exact width, core entry/exit and Customer controls used, outcome, screenshot/link, operator and candidate SHA. All nine cells are pending.

| Browser | 360 px | 768 px | 1920 px |
| --- | --- | --- | --- |
| Chrome | Pending | Pending | Pending |
| Edge | Pending | Pending | Pending |
| Firefox | Pending | Pending | Pending |

### Client verdict and handoff

After the 27 November demo, record actual date, attendees, build SHA, tested scenarios, lecturer verdict, accepted exceptions, and each open action with owner and due date. Send those facts to RES-03 for A-89; QA supplies the A-87 measurements and exclusions. The 28 November report review and 29 November submission receipt remain future checkpoints.
