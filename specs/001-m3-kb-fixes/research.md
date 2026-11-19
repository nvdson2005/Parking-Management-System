# Research: M3 KB Fixes

## KB-04 plate comparison
- Decision: move `plateCompareKey` (strips everything except A-Z0-9) to `src/lib/plate.ts`, export it, use it in `previewExit` and `confirmExit` for the mismatch test. The stored `plateSnapshot` and the `Observed plate` event note keep using `normalizePlate`.
- Rationale: vehicle lookup already uses this key, so lookup and mismatch rules agree. `vehicles.ts` imports it; no behaviour change there.
- Rejected: changing `normalizePlate` (would alter stored and displayed plates).
- Edge: a plate that is empty after stripping (only separators) can never equal a real snapshot, so it is a mismatch, not a match. Zod already rejects the empty string.

## KB-05 lost-card method
- Decision: `confirmExit` gains `method` (optional in schema). If `lostCard` is true and `method !== 'PLATE'` (including missing), throw `VALIDATION` before any write. Route forwards `body.method`; `ExitForm` sends `effectiveMethod`.
- Rationale: confirm is where the lost-card event is written, but it never sees the lookup method; preview does. Adding the field to confirm enforces the rule where it matters without a new error code.
- Rejected: server-side session lookup of how the vehicle was found (not stored for exit); new error code (constitution I allows reuse, less surface).
- Non-lost-card exits: `method` ignored, fully backward compatible.

## KB-13 known vehicle type
- Behaviour already exists in `entry.ts` (type taken from vehicle record; required only for new plate). Add tests and contract text only.

## KB-02 / KB-03
- Decision: accept both. Tests assert (a) amount charged equals tariff at confirm time, (b) close and payment are atomic (a failing payment write leaves the session OPEN).

## A-74 review
- Review FR-26..FR-28 against `exit.ts` and history endpoints; record findings in P18 section on payment; add tests only where behaviour is unlocked.

## P18
- Edit `CO3011_M2_KienTrucAPI_v0.1.md` in place: version row v1.0, section 10 decision column, VM-01/VM-02 resolved, CP-02 review record. Do not touch `docs/m2-report/data/plan.mjs` or `generated/*`.
