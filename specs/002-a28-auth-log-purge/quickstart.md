# Quickstart: validating A-28

## Prerequisites

```bash
npm i && cp .env.example .env      # if not done
npx prisma migrate reset --force   # dev DB with demo data
```

## Automated checks

```bash
npx vitest run tests/malformed-body.test.ts   # KB-14: 4 routes × non-JSON, array, number, empty → 400 VALIDATION
npx vitest run tests/auth.test.ts             # KB-07: one LOGIN after registration; none after a duplicate email
npx vitest run tests/purge.test.ts            # G-05: null actor → PURGE row with no user; Manager run unchanged
npx vitest run tests/purge-schedule.test.ts   # G-05: first run after 60 s, then every 24 h; second register() is a no-op; a failing run does not throw
npm test && npm run lint && npm run build     # full gate (constitution IV)
```

Expected: each new test fails on `main` before the change and passes after it.

## Manual check (optional)

1. `npm run dev`, then wait about 1 minute after start-up.
2. Log in as a Manager and open the access log page. A new `PURGE` row appears without a user and with target `"<n> sessions, <m> vehicles"`.
3. Register a new customer account, then check the access log. A `LOGIN` row for that account appears.
4. Send a malformed body:
   ```bash
   curl -s -X POST localhost:3000/api/lang -H 'Content-Type: application/json' -d 'not json'
   # {"error":"VALIDATION"}  with HTTP 400
   ```
