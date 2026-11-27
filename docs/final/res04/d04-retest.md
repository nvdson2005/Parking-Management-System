# A-68 D-04 retest: both plates in the exit preview (spec 008, T007)

| Field | Value |
|---|---|
| Defect | A-68 D-04 (S2, owner RES-04, ISS-11): the Staff exit preview showed the plate recorded at entry under the label "Biển số quan sát" / "Observed plate" and never showed the plate Staff typed (`docs/m3/a-68-cp05-test.md`) |
| Fix | Branch `fix/d04-exit-plate-labels`: `08a2bd4` (labels), `b97caab` (late-response guard after the review of `12dae51`); spec `specs/008-d04-exit-plate-labels/` |
| Acceptance | AT-EX02 (both plates shown); spec 008 SC-001..SC-004 |
| Tester | Phạm Duy Quý (RES-04), 26/11/2026, 17:17–17:30 (steps 1–7 on `08a2bd4`); recheck 27/11/2026, 13:15–13:18 (on `b97caab`) |
| Environment | `npm run dev` on Windows, `dev.db` after `npx prisma migrate reset --force`; Staff `staff1@demo.local`; browser not recorded |
| Script | `specs/008-d04-exit-plate-labels/quickstart.md`. Steps 3–6 were run in a different order from the quickstart (quickstart steps 6, 4, 3, 5) because the match check (quickstart step 4) cannot run after the mismatch exit has closed the session |
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

## Recheck after the review fix (27/11, `b97caab`)

The review of `12dae51` found that a late preview response could show the live input next to a stale mismatch state. `b97caab` discards outdated responses and shows the plate each preview was computed for; the follow-up commit moves the request handling into `createExitPreviewController` so that the behaviour the screen relies on is tested. The race cannot be reproduced reliably by hand (a preview takes tens of milliseconds). `tests/exit-preview-controller.test.ts` stages it with a deferred response: a late success, error or network failure after an input change is dropped, and a current success carries the sent plate (mutation-checked). The remaining untested glue is the React state in `ExitForm` (no DOM test environment in the repo). The normal flow was rechecked by hand:

| Step | Action | Expected | Result |
|---|---|---|---|
| R1 | Entry `66F-403.65`, zone A, motorbike; exit preview with observed `66F-403.66` | Both plates under their labels, observed plate in red, warning, confirm disabled | **Pass**: `evidence/d04/rerun-1-mismatch-vi.png` (entry 13:15:58; box unticked, confirm disabled) |
| R2 | Change the observed plate to `66F-403.65` | Preview disappears | **Pass**: `evidence/d04/rerun-2-preview-cleared-vi.png` |
| R3 | Preview again | Both plates, no red mark, no warning, confirm enabled | **Pass**: `evidence/d04/rerun-3-match-vi.png` |
| R4 | Confirm | Success; no mismatch event | **Pass**: `evidence/d04/rerun-4-exit-recorded-vi.png`; `dev.db`: closed 13:17:35, fee 2.000 đ, no session event |

**Verdict: Pass.** On a mismatch both plates are on screen with their own labels in both languages (SC-001, SC-002), and the observed plate is marked. The entry plate no longer appears under the observed-plate label. Manual confirmation, the event note and the access log behave as before (SC-004). AT-EX02's "both plates shown" condition is met (SC-003). D-04 can be closed once this branch is merged.

## Paste-ready row for the workbook Quality Evidence sheet (for RES-03, F3-05)

```text
A-68 D-04 retest | P05 exit preview | fix/d04-exit-plate-labels b97caab | 26–27/11/2026 | Pass: 7/7 steps on 08a2bd4, 4/4 recheck on b97caab; entry plate and observed plate under their own labels in vi and en, observed plate marked on mismatch; PLATE_MISMATCH_CONFIRMED and MANUAL_CONFIRM unchanged; render test exit-preview-details.test.ts 3/3, late-response guard test request-guard.test.ts 3/3, npm test 388/388 | RES-04 | docs/final/res04/d04-retest.md
```

**D-04 status for ISS-11:** fixed and retested on 26/11, rechecked on 27/11 after the review fix (pending merge of `fix/d04-exit-plate-labels`). RES-05 (A-68) and RES-02 (CP-05 gate) record it in their own files.
