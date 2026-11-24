# Contract: A-65 read endpoints (addendum for P18 §7)

All are `GET` and wrapped by `handle()`. A missing session returns 401 `UNAUTHENTICATED`, a wrong role returns 403 `FORBIDDEN`, and a bad query returns 400 `VALIDATION`. RES-01 can copy this into P18 v1.0 (KB-15 and G-08 close).

| Endpoint | Roles | Query | 200 response | Other |
|---|---|---|---|---|
| `/api/staff/lookup` | STAFF, MANAGER | `method` = PLATE\|QR\|RFID, `identifier` | `{ vehicle: { id, plate, vehicleTypeCode, hasOwner }, openSession: { id, zoneName, entryTime, idMethod } \| null, activeReservation: { id, zoneName, arrivalTime, holdUntil } \| null }` | 404 `NOT_FOUND` when no vehicle matches. Side effect: one `VIEW_FULL_PLATE` row on 200 |
| `/api/staff/reservations` | STAFF, MANAGER | `zoneId?` | `[{ id, plate, zoneId, zoneName, vehicleTypeCode, arrivalTime, holdUntil }]`, sorted by arrival time ascending | Expires stale holds first |
| `/api/sessions` | STAFF, MANAGER | `status?` = OPEN (default)\|CLOSED | `[{ id, plate, zoneName, vehicleTypeCode, entryTime, exitTime, status }]`, sorted by entry time descending | Plate is shown per `presentPlate` |
| `/api/access-logs` | MANAGER | `limit?` 1-500, default 200 | `[{ id, userId, userName, action, target, createdAt }]`, newest first | `userName` is null for system rows |
| `/api/payments` | MANAGER | `from?`, `to?` (dates) | `[{ paymentId, plateSnapshot, amount, paidAt, confirmedByName, zoneName }]`, newest first | — |
| `/api/payments` | CUSTOMER | ignored | `[{ sessionId, plate, zoneName, entryTime, exitTime, amount, paidAt }]` (own sessions, owner at entry) | STAFF gets 403 |
