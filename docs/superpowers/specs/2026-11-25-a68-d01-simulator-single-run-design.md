# Design: one simulator run at a time (A-68 D-01, ISS-11)

Date: 2026-11-25. Author: RES-05. Reviewers: RES-01 (PM), RES-02 (QA).

## Problem

A-68 D-01 (S2): during a 100-session run on `next dev` the page reloaded, the run button became enabled, and a second run started while the first was still running. The two runs competed for the same sessions and vehicles (21 rejected, 200 sessions). The C5 re-run on 25/11 (`docs/m3/a-68-cp05-test.md` section 3.3) reproduced it (220 sessions, 24 rejected) and showed that stored data and availability stay correct, so D-01 is S2, not S1. CP-05 condition C6 requires a fix before CP-07 (27/11).

## Options

| Option | Effect | Verdict |
|---|---|---|
| A. Keep the button disabled across reloads (client state in storage) | Only the browser that started the run is protected; a second tab, a second manager, or a direct API call still overlaps | Rejected: the guard belongs on the server |
| B. Run each simulator action inside `withLock()` | The second run waits and then runs, so the overlap becomes a sequence of two runs; also, the simulator calls `recordEntry`, which takes `withLock`, and the lock is non-reentrant (constitution II) | Rejected: deadlock risk, and the duplicate run still happens |
| C. A `globalThis` busy flag around every simulator action; a second request gets `409 SIMULATOR_BUSY` | The duplicate run is refused, whatever its source; the first run is untouched; the flag survives HMR | **Chosen** |

## Decision

- New service helper `runSimulatorExclusive(fn)` in `src/server/services/simulator.ts`, with `isSimulatorBusy()`. The flag is set before the action and cleared in `finally`.
- The route `POST /api/simulator` validates input first (so bad input still answers 400), then runs `live`, `exception` and `history` through the helper.
- New error code `SIMULATOR_BUSY` → 409, with Vietnamese and English messages. The simulator panel already shows `errors.<code>`, so no UI change is needed.
- Out of scope: the `next dev` rebuild that caused the reload (A-31 O-01, handled by running A-87/A-88 on the production build) and the test timeout (F5-01).
