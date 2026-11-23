# Tasks: Client round 5 (Q37, Q38, Q45)

**Tests**: required (constitution IV).

- [X] T001 [US1] Tests in `tests/lot-hours.test.ts` (set, change, clear, other fields keep hours, create with or without hours, malformed or unpaired times, entry outside hours accepted); schema, migration `20261124090000_g01_lot_hours`, service, API, Manager form, customer card
- [X] T002 [US2] Tests in `tests/my-tariff.test.ts` (own group only, missing tariff, Manager change, card shows own prices only); `tariffsForGroup`, `MyTariffCard`
- [X] T003 [US3] Tests in `tests/group-change.test.ts` (request, rejections, API roles, Manager change with log and notification, open session keeps group, PATCH one change per request, no password hash); migration `20261124100000_q38_group_request`, services, APIs
- [X] T004 [US3] Customer request card and Manager group select
- [X] T005 Full gate (`npm test`, lint, build, `prisma migrate diff`); production build run on a scratch DB; `codegraph sync`
- [X] T006 README, `docs/m3/workbook-rows.md`
