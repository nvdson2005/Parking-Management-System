# Quickstart: validate the exit preview fix (A-68 D-04)

## Automated

```bash
npx vitest run tests/exit-preview-details.test.ts   # new render test
npx vitest run tests/i18n.test.ts                    # vi/en key parity
npm test && npm run lint && npm run build            # before closing
```

Expected:

- On the current code (before the fix) the new test fails: the entry plate is under "Biển số quan sát" and the typed plate is absent.
- After the fix: on a mismatch both plates are shown with their labels and the observed plate carries the mismatch mark; on a match both plates are shown and there is no mark; the English labels are "Plate at entry" and "Observed plate".

## Manual (AT-EX02 retest)

Prerequisites: dev server running (`npm run dev`), seeded data, logged in as `staff1`.

1. Entry: record plate `66F-403.45`, zone A, motorbike.
2. Exit: identify by plate `66F-403.45`, type observed plate `66F-403.46`, press "Xem phí".
   - Expect "Biển số lúc vào: 66F-403.45", "Biển số quan sát: 66F-403.46" marked in red, the mismatch warning, and the confirm button disabled until "Xác nhận thủ công" is ticked.
3. Tick the box and confirm. Expect success; the session detail shows the `PLATE_MISMATCH_CONFIRMED` event as before.
4. Repeat with observed plate `66F 403 45`. Expect both plates, no mark, no warning.
5. Switch to English and preview once. Expect "Plate at entry" and "Observed plate".
6. After a preview, change one character of the observed plate. Expect the preview to disappear (it is shown again only after "Xem phí").
7. Tick "Mất thẻ", identify by plate, type an observed plate and preview. Expect both plates shown the same way.

Record the results (with screenshots) as the D-04 retest.
