# Tasks: Simulator tests pass without a timeout flag (F5-01)

- [X] T001 Suite-level timeout (60 s) on `describe('simulator', …)` in `tests/simulator.test.ts`, with the reason in a comment
- [X] T002 `npm test` with no flags, twice (25/11, RES-05, Windows, base `main` `6c113a0`): 42 files / 339 tests both runs; slowest simulator cases QR/RFID 13.0 s and 10.8 s, minSessions 6.4 s and 6.0 s, EX01..EX05 5.2 s (all above the old 5 s limit); `npm run lint` clean; `npm run build` OK. Observation: `malformed-body` "POST /api/vehicles with not JSON body" took 3.3 s in run 2 (limit 5 s, not part of F5-01)
- [ ] T003 Record the result in `docs/m3/a-68-cp05-test.md` (D-06 closed, PR #18) after merge
