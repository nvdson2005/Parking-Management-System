# Tasks: One simulator run at a time (A-68 D-01)

**Tests**: required (constitution IV).

- [X] T001 [US1] Tests in `tests/simulator-busy.test.ts`: second live run while one runs → 409 `SIMULATOR_BUSY`, only the first run's sessions in the DB; exception and history refused during a run; new run accepted after the previous one; invalid input still 400; flag cleared after a throwing action; `SIMULATOR_BUSY` → 409
- [X] T002 [US1] `runSimulatorExclusive` and `isSimulatorBusy` in `src/server/services/simulator.ts`; wrap the three actions in `src/app/api/simulator/route.ts`
- [X] T003 [US1] `SIMULATOR_BUSY` in `src/server/errors.ts`; messages in `src/i18n/en.ts` and `src/i18n/vi.ts`; code added to `tests/i18n.test.ts`
- [ ] T004 Full gate on a Windows dev machine: `npm test`, `npm run lint`, `npm run build`; `codegraph sync`
- [ ] T005 Retest D-01 on the production build: C5 scenario (two clicks); expect one run and a 409 for the second; record in `docs/m3/a-68-cp05-test.md` and close the D-01 part of ISS-11
