# Quickstart: validating A-65

## Automated

```bash
npx vitest run tests/lookup.test.ts      # G-08 service: identifiers, open session, active reservation, VIEW_FULL_PLATE, expiry
npx vitest run tests/read-apis.test.ts   # KB-15 + G-08 routes: roles, filters, validation
npx vitest run tests/indexes.test.ts     # G-07: four indexes exist
npx vitest run tests/nav.test.ts tests/i18n.test.ts
npx prisma migrate diff --from-migrations prisma/migrations --to-schema-datamodel prisma/schema.prisma --shadow-database-url file:./shadow-check.db --exit-code   # expect exit 0 (no drift)
npm test && npm run lint && npm run build
```

## Manual

1. Log in as Staff and open the new "Lookup" link in the menu.
2. Enter the plate of a customer vehicle that has a reservation. The vehicle, "not parked" and the reservation appear. In the access log (as Manager) a `VIEW_FULL_PLATE` row appears for that staff member.
3. Enter an unknown plate. A "not found" message appears.
4. As Customer, open `/api/staff/lookup?method=PLATE&identifier=x`. The response is 403.
