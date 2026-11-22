# Quickstart: validate M3 KB fixes

Prereq: `npm i`, `.env` from `.env.example`. Tests reset `prisma/test.db` themselves.

```bash
npx vitest run tests/plate.test.ts tests/exit.test.ts tests/entry.test.ts
npm test && npm run lint && npm run build
codegraph sync
```

Manual: staff exit page, enter plate `51F12345` for a vehicle entered as `51F-123.45` (no mismatch banner); tick "lost card" and confirm (works, method locked to plate).
Docs: open P18 section 10, every KB row has a decision; header shows v1.0 and a CP-02 record.
