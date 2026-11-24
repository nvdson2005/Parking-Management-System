# Quickstart: validate the CR-03 UI fixes

## Automated

```bash
npm test          # full suite; new tests listed below must fail before the change and pass after it
npm run lint
npm run build
```

| Test | Proves |
|---|---|
| `tests/live-availability.test.ts` | Customer render has no used column; Staff and Manager renders show used = open + reserved; a row with free 0 shows "Hết chỗ" (vi) / "Full" (en); the update time is shown |
| `tests/arrival.test.ts` | `defaultArrival` returns a future time within today; returns `null` at 23:59; rounds to 5 minutes; `minArrivalInput` is the next whole minute |
| `tests/entry.test.ts` (added case) | `recordEntry` early arrival throws `EARLY_ARRIVAL` with `arrivalTime` and `zoneName` |
| `tests/errors.test.ts` (added case) | `handle()` returns `{ error, details }` when details are present and `{ error }` otherwise |
| `tests/entry-form.test.ts` | Entry form selects render labels (zone name, "Xe máy", gate name), not raw values |
| `tests/globals-css.test.ts` | `--font-sans` does not refer to itself |
| `tests/early-arrival-prompt.test.ts` | The early-arrival prompt shows "Giờ hẹn: HH:mm · Khu: …" (vi) / "Booked: … · Zone: …" (en); without details it keeps the generic warning |

## Manual (A-49 rerun, RES-04)

Preparation: `npx prisma migrate reset --force`, then `npm run dev`.

1. **TC-AV-01 rerun.** Staff and Customer windows side by side; repeat the 4 steps of QE section 2 (entry, reserve, cancel, exit). At each step the free count matches the hand count and "Cập nhật lúc" changes. On the Staff screen, free + used = capacity.
2. **Full-zone case.** Manager → Simulator → EX-01 fills zone C. Customer and Staff show "Hết chỗ" on zone C. Staff records an exit from zone C, and the badge disappears without a reload.
3. **Reservation default.** As `customer01`, open Reservations and submit without editing the time. The reservation is created.
4. **Entry selects.** As `staff1`, choose zone C, car and a gate. Each select shows the label.
5. **Early arrival.** With step 3's reservation pending, Staff records entry of `29A-01001` before the booked time. The prompt shows the booked time and zone; Cancel creates nothing; Confirm admits the vehicle.
6. **Font.** The pages render in the sans-serif font.

Append the results of steps 1 and 2 to `docs/m3/quality-evidence-A-49.md` and change the verdict to Verified.
