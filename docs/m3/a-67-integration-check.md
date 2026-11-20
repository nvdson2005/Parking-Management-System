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
