# Design: simulator test timeout (F5-01, A-68 D-06)

Date: 2026-11-25. Author: RES-05. Reviewer: RES-01.

## Problem

`npm test` fails on slower machines because simulator tests exceed Vitest's 5 s default: QR/RFID 15.0 s and minSessions 8.2 s on `main` (RES-03, 23/11, `docs/m3/workbook-rows.md` A-65 row); 5.0 s on RES-05's machine (A-67, 23/11). The team has been running `npm test -- --testTimeout=30000`. F5-01 requires `npm test` to be green without flags.

## Options

| Option | Effect | Verdict |
|---|---|---|
| A. `testTimeout` in `vitest.config.ts` | Raises the limit for every test file; hides a slow test anywhere | Rejected: too broad |
| B. Fewer events in the slow tests | Weakens SC-07 (≥ 100 sessions) and the QR/RFID mix check | Rejected: changes what is tested |
| **C. Suite-level timeout on `describe('simulator', …)`** | Only the simulator suite gets 60 s; other files keep 5 s; the FR-16 case still asserts < 2 s per call | **Chosen** |

## Decision

`describe('simulator', { timeout: 60_000 }, …)` in `tests/simulator.test.ts`, with a comment that states why. 60 s gives about 4× headroom over the slowest measured case (15 s). `vitest.config.ts` is not changed.
