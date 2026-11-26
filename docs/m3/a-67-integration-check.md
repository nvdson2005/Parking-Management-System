# A-67 Simulator Integration Check (critical path, due 20/11)

| Field | Value |
|---|---|
| Activity | A-67, integrate the simulator with the fixed entry/exit flow (RES-01 with RES-05) |
| Checked by | Nguyễn Võ Đức Sơn (RES-01) |
| Date | 2026-11-19 |
| Code | branch `feat/m3-kb-fixes-and-docs` at `5182b97` (only documents changed after the code commits) |
| Result source | `npm test` of 19/11 after the KB fixes: 22 files, 181 tests passed. Not re-run today. |

## What was checked

| Item | Evidence | Status |
|---|---|---|
| Simulator uses the fixed exit flow | `src/server/services/simulator.ts` calls `previewExit` then `confirmExit` with `lostCard: false`. KB-05 requires `method: 'PLATE'` only when `lostCard` is true, so the simulator needs no change. | OK |
| KB-04 does not break simulated exits | `simulateLive(120)` closes sessions with `observedPlate = plateSnapshot`; `tests/simulator.test.ts` passes | OK |
| EX-03 simulation matches the new server rule | `EX03 opens a session and returns lost-card instructions` and its instructions carry `method: 'PLATE'` and `lostCard: true`; the staff form sends `method` on confirm | OK |
| KB-01 (shared API) | Accepted in P18 section 10: simulator calls the same services as the HTTP routes. No code change. | Decided |
| KB-08 (EX-01, EX-04, EX-05 behaviour) | Tests `EX05 writes LOT_CHANGE audit entries; EX01 flags needsReset` and `EX01 -> ZONE_FULL, EX04 -> ALREADY_OPEN, EX05 -> LOT_SUSPENDED and lot ACTIVE afterwards` pass | OK |
| KB-09 limits | Accepted in P18: `live` n 1–500, `history` days 1–60 | Decided |
| 100-session scenario (SC-07, FR-34) | `minSessions mode opens >= 100 sessions (SC-07)`; `FR-16 ... each call takes < 2000 ms` | OK |
| EX-05 does not touch real reservations | `EX05 leaves real pending reservations and notifications untouched` | OK |

## Not checked here

- The e2e script from commit `bf07479` was not run: it resets the dev database. `TODO(RES-01 or RES-05)`: run it on a disposable DB and record the result.
- The manager simulator page (`SimulatorPanels.tsx`) was not exercised in a browser.
- The 100-session scenario was verified through the automated test only; the acceptance run (A-87) will repeat it with the client script.

## Verdict

No integration defects found in code or tests. A-67 can be marked done once the e2e script run is recorded; otherwise it stays "integrated, e2e pending". Note for the log: RES-01 committed A-44 (`68ea467`, 12/11), an activity assigned to RES-05, so confirm with RES-05 that A-44 is closed.

## Verification on 20 November 2026

Commit `a55f6a8` ran on a local Next.js development server with a disposable seeded SQLite database.

`TZ=Asia/Ho_Chi_Minh BASE_URL=http://127.0.0.1:43187 node e2e/round3.e2e.mjs` exited 0 with all 25 checks passing. The script exercised the reservation limit, early entry confirmation, suspension and customer notifications, exit while suspended, and utilisation reporting. It does not call the simulator endpoint.

`POST /api/simulator` separately exercised the HTTP simulator as a Manager. `POST /api/simulator` with live action, 120 events, seed 67 and exit ratio 0.4 returned HTTP 200 with 73 entries, 47 exits, and zero rejections. This evidence covers HTTP and simulator integration using the development server. The browser UI, production build, and acceptance run remain separate checks. A-44 closure still needs confirmation from RES-05.

## RES-05 confirmation on 23 November 2026

Checked by Nguyễn Tuấn Thành (RES-05) on `main` at `4c8fde2`, Windows, disposable SQLite DB `a67.db` (seeded, `next dev`). Screenshots: `docs/m3/evidence/a67/`.

| Item | Evidence | Status |
|---|---|---|
| A-44 closure (A-43 items #1–#4) | `68ea467`; `simulator.ts` L66–68, L156–180, L222–225 (QR/RFID shares, minSessions mode with 20× event cap), L35–56 (`makeRng` mulberry32; `randomBytes` only in `freshSeed()` when no seed is given), L321 (EX01 `needsReset`), L354 (EX05 via `updateLot` → `LOT_CHANGE`) | Closed |
| Test re-run | `npm test -- --testTimeout=30000`: 24 files, 209 tests passed. At the default 5 s timeout, `live events use QR and RFID as well as PLATE` timed out (5,012 ms; 7.8–10.2 s when run fully). Test-environment issue, not a functional defect; reported to RES-01 | OK (note) |
| SC-01 live, N=20, seed 67 | 12 entries, 8 exits, 0 rejected (sum 20). Availability A 149 / B 149 / C 28 = 4 open sessions = 12 − 8. Availability tab updated without reload (SSE) | Pass |
| SC-07 ≥100 sessions, seed 7: session count and aggregate availability | 100 entries, 49 exits, 0 rejected. Cumulative open 4 + 100 − 49 = 55 = drop in availability (17 + 17 + 21) | Pass |
| SC-07: complete records | Not checked in this UI run. Automated evidence only: `tests/simulator.test.ts` "simulateLive(120) … every session has plateSnapshot, zone, entryStaffId, idMethod"; `tests/contract-inout.test.ts` CT-11 (all fields, timestamps) | Pass in A-68: clean 100-session run (seed 68), `incomplete: 0` on 100 sessions ([A-68](a-68-cp05-test.md) T11) |
| SC-07: independent occupancy count | The 55 above is derived from the simulator's own counters. Independent DB count done in A-68 | Pass in A-68: open 7 / 12 / 12 = 31, expected free 143 / 138 / 18 = UI ([A-68](a-68-cp05-test.md) T05) |
| SC-07: ≤ 2 s per operation | Not measured in this UI run. Automated evidence only: `tests/simulator.test.ts` "FR-16 … each recordEntry/confirmExit call takes < 2000 ms" (max over `simulateLive(100)`) | Pass with note in A-68: manual HTTP entry/exit requests 1.08–1.47 s; per-operation time inside the simulator run covered by the FR-16 test only ([A-68](a-68-cp05-test.md) T13) |
| SC-05 EX-04 | Duplicate entry rejected (`ALREADY_OPEN`) | Pass |
| SC-06 EX-05 | Entry rejected (`LOT_SUSPENDED`); `/manager/lots` shows lot active afterwards | Pass |
| SC-03 EX-02: simulator setup | Session opened; instructions PLATE, identifier vs observed plate differ by one character | Pass |
| SC-03 EX-02: staff exit | `PLATE_MISMATCH` rejection without manual confirm; close with "Confirm manually" and `PLATE_MISMATCH_CONFIRMED` session event plus `MANUAL_CONFIRM` access-log entry | Pass in A-68: UI blocks confirm without the tick, API returns 409 `PLATE_MISMATCH`, closed after manual confirm ([A-68](a-68-cp05-test.md) T07) |
| SC-04 EX-03: simulator setup | Session opened; instructions PLATE + "Lost card" (consistent with KB-05) | Pass |
| SC-04 EX-03: staff exit | Session closed by plate with "Lost card"; `LOST_CARD` event; normal fee, no penalty | Pass in A-68: `LOST_CARD`, fee 2,000 ₫ = tariff ([A-68](a-68-cp05-test.md) T08) |
| SC-02 EX-01 | Zone full (`ZONE_FULL`), reset warning shown; availability 0, not negative | Pass |
| Seed reproducibility in UI | After `npm run db:reset`, N=20 seed 67 again gave 12 / 8 / 0 and 149 / 149 / 28 | Pass |

Carried to A-68 (CP-05) and closed there on 24/11: staff exit outcomes for SC-03 and SC-04, and the SC-07 record completeness, independent occupancy count and per-operation time. Evidence: [a-68-cp05-test.md](a-68-cp05-test.md). Not covered by A-67 or A-68: production build, client acceptance run (A-87).

**Dates:** planned finish 20/11; initial HTTP verification 20/11 (RES-01, above); actual finish 23/11 (RES-05 UI confirmation, 3 days late).

**Verdict:** A-67 simulator integration done: simulator setup for SC-01..SC-07 works through the UI, and A-44 is closed. Scenario outcomes carried to A-68 (CP-05) passed there on 24/11. Effort RES-05: ___ h.