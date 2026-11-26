# A-68 D-04 retest: both plates in the exit preview (spec 008, T007)

| Field | Value |
|---|---|
| Defect | A-68 D-04 (S2, owner RES-04, ISS-11): the Staff exit preview showed the plate recorded at entry under the label "Biển số quan sát" / "Observed plate" and never showed the plate Staff typed (`docs/m3/a-68-cp05-test.md`) |
| Fix | Branch `fix/d04-exit-plate-labels`, commit `08a2bd4` (spec `specs/008-d04-exit-plate-labels/`) |
| Acceptance | AT-EX02 (both plates shown); spec 008 SC-001..SC-004 |
| Tester | Phạm Duy Quý (RES-04), 26/11/2026, 17:17–17:30 |
| Environment | `npm run dev` on Windows, `dev.db` after `npx prisma migrate reset --force`; Staff `staff1@demo.local`; browser not recorded |
| Script | `specs/008-d04-exit-plate-labels/quickstart.md`, steps 1–7 |
| Timing source | Times below are read from `dev.db` (sessions, events, access log), not from the screen |

## Results

| Step | Action | Expected | Result |
|---|---|---|---|
| 1 | Entry `66F-403.45`, zone A, motorbike, gate 1 | Entry recorded | **Pass**: session in 17:17:14 |
| 2 | Exit preview, identifier `66F-403.45`, observed `66F-403.46` | "Biển số lúc vào" = entry plate, "Biển số quan sát" = typed plate in red, warning, confirm disabled | **Pass**. Screenshot from the repeat run with `66F-403.55` / `66F-403.56` (entry 17:27:32): `evidence/d04/step2-mismatch-vi.png` |
| 3 | Change one character of the observed plate | Preview disappears | **Pass** (no screenshot) |
| 4 | Observed plate typed with spaces, same plate | Both plates, no red mark, no warning, confirm enabled | **Pass** (no screenshot) |
| 5 | Mismatch, tick "Xác nhận thủ công", confirm | Success; `PLATE_MISMATCH_CONFIRMED` and `MANUAL_CONFIRM` recorded as before | **Pass**. `dev.db`: `66F-403.45` closed 17:22:01 with event note "Observed plate: 66F-403.46"; repeat `66F-403.55` closed 17:28:06 with "Observed plate: 66F-403.56"; one `MANUAL_CONFIRM` access-log row at each time; fee 2.000 đ each |
| 6 | English; car `30K-777.88` in zone C; observed `30K-777.89` | "Plate at entry" and "Observed plate" (red), English warning, confirm disabled until ticked | **Pass**: `evidence/d04/step6-mismatch-en.png` (entry 17:29:10, Car, zone C, 10.000 đ) |
| 7 | Lost card, identifier `30K-777.88`, observed `30K-777.88` | Both plates shown the same way, no mark | **Pass**: `evidence/d04/step7-lost-card-en.png` (preview only; the session was left open) |

**Verdict: Pass.** On a mismatch both plates are on screen with their own labels in both languages (SC-001, SC-002), and the observed plate is marked. The entry plate no longer appears under the observed-plate label. Manual confirmation, the event note and the access log behave as before (SC-004). AT-EX02's "both plates shown" condition is met (SC-003). D-04 can be closed once this branch is merged.

## Paste-ready row for the workbook Quality Evidence sheet (for RES-03, F3-05)

```text
A-68 D-04 retest | P05 exit preview | fix/d04-exit-plate-labels 08a2bd4 | 26/11/2026 | Pass: 7/7 steps; entry plate and observed plate under their own labels in vi and en, observed plate marked on mismatch; PLATE_MISMATCH_CONFIRMED and MANUAL_CONFIRM unchanged; render test exit-preview-details.test.ts 3/3, npm test 385/385 | RES-04 | docs/final/res04/d04-retest.md
```

**D-04 status for ISS-11:** fixed and retested on 26/11 (pending merge of `fix/d04-exit-plate-labels`). RES-05 (A-68) and RES-02 (CP-05 gate) record it in their own files.
