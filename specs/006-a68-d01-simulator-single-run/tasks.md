# Tasks: One simulator run at a time (A-68 D-01)

**Tests**: required (constitution IV).

- [X] T001 [US1] Tests in `tests/simulator-busy.test.ts`: second live run while one runs → 409 `SIMULATOR_BUSY`, only the first run's sessions in the DB; exception and history refused during a run; new run accepted after the previous one; invalid input still 400; flag cleared after a throwing action; `SIMULATOR_BUSY` → 409
- [X] T002 [US1] `runSimulatorExclusive` and `isSimulatorBusy` in `src/server/services/simulator.ts`; wrap the three actions in `src/app/api/simulator/route.ts`
- [X] T003 [US1] `SIMULATOR_BUSY` in `src/server/errors.ts`; messages in `src/i18n/en.ts` and `src/i18n/vi.ts`; code added to `tests/i18n.test.ts`
- [X] T004 Full gate on a Windows dev machine (25/11, RES-05): focused 4 files / 40 tests; `npm test -- --testTimeout=30000` 43 files / 345 tests; `npm run lint` clean; `npm run build` OK. `codegraph sync` not run: the CLI is not installed on this machine and the index (`.codegraph/`) is local only, not in the repo
- [X] T005 Retest D-01 on the production build (25/11, RES-05, fresh `d01b.db`): two simultaneous `POST /api/simulator` (≥ 100 sessions, seed 68) → A 200 `100/69/0`, B 409 `SIMULATOR_BUSY`; two tabs → second tab shows the busy message; DB 171 sessions, expected free 128/126/3 = UI, `incomplete: 0`. A first attempt with a reload between clicks did not overlap (a production run takes about 6 s), so the simultaneous requests are the reproducible check. Recorded in `docs/m3/a-68-cp05-test.md` section 3.5 (PR #18)
