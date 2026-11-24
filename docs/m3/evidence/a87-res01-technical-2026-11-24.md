# RES-01 technical dry-run evidence, 24 November 2026

This is a RES-01 technical run for A-87 preparation, **not** RES-02's formal A-87/CP-05 verdict or the lecturer's A-88 acceptance.

| Field | Observed value |
|---|---|
| Operator | Codex, on behalf of RES-01 |
| Candidate | `main` `26a623c15df6686ee329c496a3788fed3850d9a2` |
| Build | Existing production `.next` compiled on PR #21 integration head `0fe871a38870c0974ec6951242547f4f547a6035`; `git diff 0fe871a..26a623c` was empty, so the merge tree is identical |
| Server | `next start -p 3107`, localhost, Node 25.9.0, macOS |
| Database | New isolated SQLite `file:/private/tmp/res01-a87-26a623c.db`; nine migrations applied with `prisma migrate deploy`, then demo seed. No project or production database was reset. |
| Time | Started 24/11/2026 09:30:52 UTC (16:30:52 Vietnam time) |
| Raw timing data | [200-event CSV](a49-at100-2026-11-24T09-30-52-859Z.csv), [summary JSON](a49-at100-2026-11-24T09-30-52-859Z.json) |

## Normal 100-visit run

Ran `scripts/a49-at100-latency.mjs` with seed 1686 against the production server: 80 motorbike and 20 car visits, 100 entries and 100 exits, 200 sequential events. Recording time included exit preview plus confirmation. Display time used the SSE availability stream and was measured from the event request, an upper bound on time since recording.

| Measure | Observed | Threshold | Technical result |
|---|---:|---:|---|
| Recording, all 200 events | p95 7.8 ms; max 15.9 ms; 0 over | ≤3,000 ms | Pass |
| Availability update, all 200 events | p95 8.0 ms; max 11.8 ms; 0 missing or over | ≤5,000 ms | Pass |
| Closed records with entry, exit, vehicle type, zone and plate | 100/100 | 100/100 | Pass |
| Independent capacity − open − pending comparison | A/B/C matched after event 100 and at end (6/6 cells) | Exact | Pass |

The run was local and sequential with one operator. It does not establish multi-user or remote-network latency.

## Exceptions and separate full-lot refusal

On the same scratch database, Manager simulator requests produced EX-05 `LOT_SUSPENDED`, EX-04 `ALREADY_OPEN`, EX-02 `SESSION_OPEN` with mismatch instructions, EX-03 `SESSION_OPEN` with lost-card instructions, and EX-01 `ZONE_FULL` with `needsReset: true`. EX-02 and EX-03 were generated but their Staff resolution steps were **not** executed in this run. The prior A-68 evidence covers those steps on a different build; QA must rerun or explicitly accept that coverage for A-87.

After EX-01, zone C had 30/30 car sessions open. A separate `POST /api/events/entry` for a new car plate, authenticated as Manager through the same endpoint Staff uses, returned `ZONE_FULL`; the open count remained 30 before and after. This verifies the refusal and unchanged session count, not an independent browser display update for that refusal.

## Browser observations

Google Chrome 158 (reported by `navigator.userAgentData`), operator Codex, on the same candidate and server. At each width, Staff `/staff/entry` and Customer `/customer` were inspected. Entry controls were visible; Customer hours `06:00–22:00`, Student motorcycle/car per-visit rates, and the group-request button were visible. Document `scrollWidth` did not exceed viewport width. Screenshots:

| Width | Staff entry | Customer | Observation |
|---:|---|---|---|
| 360 px | [image](a87-chrome-360-entry.png) | [image](a87-chrome-360-customer.png) | No page overflow; controls visible |
| 768 px | [image](a87-chrome-768-entry.png) | [image](a87-chrome-768-customer.png) | No page overflow; controls visible |
| 1920 px | [image](a87-chrome-1920-entry.png) | [image](a87-chrome-1920-customer.png) | No page overflow; controls visible |

These are **partial** SC-003 observations: the full entry/exit and Customer workflows were not submitted at every width, and Edge and Firefox were unavailable on this machine. The screenshots reproduce known demo defects: the Staff entry zone select shows a raw ID, vehicle type shows `MOTORBIKE`, the font falls back to serif, and a full Customer car zone shows `0` without the required “Hết chỗ” label. Group B is assigned to RES-04 in CR-03; the full-lot label is group A/FR-21. Neither defect is silently counted as a pass.

## Remaining acceptance work

RES-02 must record the formal CP-05 and A-87 outcome with the exact tested SHA, EX-02/EX-03 Staff resolutions, exclusions and any retests. Run Edge and Firefox at 360/768/1920 px and complete core UI workflows at each cell. A-88 requires the actual lecturer verdict and accepted exceptions. This technical run cannot close those gates.
