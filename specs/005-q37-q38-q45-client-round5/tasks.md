# Tasks: Client round 5 (Q37, Q38, Q45)

**Tests**: required (constitution IV).

- [X] T001 [US1] Tests in `tests/lot-hours.test.ts` (set, change, clear, other fields keep hours, create with or without hours, malformed or unpaired times, entry outside hours accepted); schema, migration `20261124090000_g01_lot_hours`, service, API, Manager form, customer card
- [X] T002 [US2] Tests in `tests/my-tariff.test.ts` (own group only, missing tariff, Manager change, card shows own prices only); `tariffsForGroup`, `MyTariffCard`
- [X] T003 [US3] Tests in `tests/group-change.test.ts` (request, rejections, API roles, Manager change with log and notification, open session keeps group, PATCH one change per request, no password hash); migration `20261124100000_q38_group_request`, services, APIs
- [X] T004 [US3] Customer request card and Manager group select; render tests in `tests/round5-ui.test.ts` (no request: ask button; pending: text, no button; `getGroupRequest`; `LotInfoCard` with and without hours). The Manager accounts page is a client page that loads through `fetch` in an effect, so it is covered by the API tests and the production-build run, not by a render test
- [X] T005 Full gate (`npm test`, lint, build, `prisma migrate diff`); production build run on a scratch DB (`docs/m3/evidence/round5-e2e.md`); `codegraph sync`
- [X] T006 README, `docs/m3/workbook-rows.md`

## Main integration and FR-003 correction

- [X] T007 Merge the final PR #17 feature branch onto current `main` in the integration worktree; preserve the other merged PRs.
- [X] T008 Add failing service and route regressions for exact pending-request approval, no request and mismatched target (FR-C, Phase 5 FR-003).
- [X] T009 Enforce exact pending-request approval atomically in `setUserGroup` and show only the requested approval action on the Manager accounts page.
- [X] T010 Run focused tests, full suite, lint, build and disposable-database migration verification on the integration head; sync CodeGraph and record the result.
