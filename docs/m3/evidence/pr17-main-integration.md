# PR #17 main integration and Q38 approval check (A-28, A-65)

**Date:** 24 November 2026. **Base:** `main` at `810271191d3f9f3be77f8e3c98c99774a81c5a74`. **Integration merge:** `56f2efe` merges PR #17 feature head `2c101638323c005d8976f15d3cbd8b0e421cc787` into the main-based `codex/pr17-main-integration` worktree. **Correction:** `68b5cd4` enforces the matching pending Customer request before a Manager applies the fee group. This is a candidate branch; these checks do not assert that the remote `main` has changed.

## Verification

| Check | Result |
| --- | --- |
| Regression before correction | `tests/group-change.test.ts`: 3 failures showed that service and route accepted an update without a matching request. |
| Focused regression after correction | `npx vitest run tests/group-change.test.ts tests/round5-ui.test.ts --testTimeout=60000`: 15/15 passed. |
| Combined full suite | `npm test -- --testTimeout=60000`: 339/339 passed in 42 files on the integration tree. Test setup reset only this worktree's `prisma/test.db` with explicit user consent. |
| Lint and build | `npm run lint`: passed. `npm run build`: passed with network access for Next.js fonts. After removing obsolete bilingual labels, `tests/i18n.test.ts`: 4/4 passed. |
| Fresh migration | `npx prisma migrate deploy` applied all nine migrations to a new scratch SQLite database, including both PR #17 migrations. |
| Populated upgrade | Deployed the seven `main` migrations to a second scratch database, inserted a Customer and lot, then deployed the two PR #17 migrations. The original Customer ID, email and group and lot ID/name remained; new request and hour columns were null; nine migration rows were complete. |
| Production UI | On a seeded scratch database, the Manager accounts page showed no approval control before a Customer request. Customer `customer01@demo.local` requested `LECTURER_STAFF`; the Manager page then showed the pending target and approval button. Clicking it changed the displayed group and removed the button. |

The service rejects a missing or mismatched request with `VALIDATION`; regression checks confirm the account, request, audit rows and notifications remain unchanged. Approval of the matching request clears it, retains the audit and notification behavior, and keeps an already-open session's original fee group. The API and Manager UI use the same service rule.

This verification covers the product integration and Q38 correction. The separate A-87 normal-load timing, nine browser/width combinations and A-88 client verdict remain pending.
