# Implementation Plan: Client round 5 (Q37, Q38, Q45)

**Branch**: `feat/res03-q37-q38-q45` (based on `fix/res03-a28-a65`, PR #11, for the migration order) | **Spec**: `spec.md`

## Technical Context

Next.js 15, Prisma 6 + SQLite, Zod, vitest. Two new migrations after `20261123190000_g04_session_source`. No new dependency.

## Constitution Check

Route handlers thin, logic in services; i18n vi/en parity; tests first; one commit per story under 300 added lines.

## Changes

| Story | Files |
|---|---|
| US1 G-01 | `prisma/schema.prisma`, `prisma/migrations/20261124090000_g01_lot_hours`, `src/server/services/lots.ts` (`hoursPaired`, `listLotInfo`), `src/app/api/lots/**`, `src/app/manager/lots/page.tsx`, `src/components/LotInfoCard.tsx`, `src/app/customer/page.tsx` |
| US2 Q45 | `src/server/services/tariffs.ts` (`tariffsForGroup`), `src/components/MyTariffCard.tsx`, `src/app/customer/page.tsx` |
| US3 Q38 | `prisma/migrations/20261124100000_q38_group_request`, `src/server/services/accounts.ts` (`requestGroupChange`, `setUserGroup`, `AccountView`), `src/app/api/account/group-request/route.ts`, `src/app/api/accounts/[id]/route.ts`, `src/components/GroupRequestForm.tsx`, `src/app/manager/accounts/page.tsx`, `src/lib/types.ts` (`GROUP_CHANGED`) |
| All | `src/i18n/{en,vi}.ts` |

## Effort

About 4.5 h in total (G-01 1.5 h, Q45 1 h, Q38 2 h). Recorded in CR-03 (P03 §11.1, risk register).
