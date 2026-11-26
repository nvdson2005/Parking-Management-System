# Contract: `POST /api/events/entry`, early arrival

The success response is unchanged. Other errors are unchanged: `{ "error": "<CODE>" }`.

When a vehicle with an active reservation arrives before its booked time and `confirmEarly` is not set:

```http
HTTP/1.1 409 Conflict
Content-Type: application/json

{
  "error": "EARLY_ARRIVAL",
  "details": {
    "arrivalTime": "2026-11-24T09:30:00.000Z",
    "zoneName": "A"
  }
}
```

- `details` is optional for clients; a client that ignores it behaves as before.
- No plate is included (Principle III).
- Resending the same body with `"confirmEarly": true` admits the vehicle, as before.
- `handle()` adds `details` only when the thrown `DomainError` has it, so all other error bodies keep their current shape.
