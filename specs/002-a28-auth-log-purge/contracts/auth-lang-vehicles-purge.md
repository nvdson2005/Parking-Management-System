# Contract changes: A-28

Only error behaviour changes. Success responses are unchanged (P18 v1.0 §7).

## KB-14: malformed bodies

Applies to `POST /api/auth/login`, `POST /api/auth/register`, `POST /api/lang` and `POST /api/vehicles`.

| Request body | Before | After |
|---|---|---|
| Not valid JSON (for example `not json`), or empty | 500 | **400** `{ "error": "VALIDATION" }` |
| Valid JSON but not an object (`[1,2]`, `42`, `null`, `"x"`) | 500 or 400, depending on the route | **400** `{ "error": "VALIDATION" }` |
| Valid object | unchanged | unchanged |

A rejected request sets no cookie and writes no row.

`POST /api/vehicles` checks the role before reading the body, as now. An unauthenticated request still gets 401 before body parsing.

## KB-07: registration

`POST /api/auth/register` success: response unchanged. Side effect added: one `access_logs` row `{ user_id: <new user>, action: 'LOGIN' }`.

## G-05: purge

`POST /api/purge` (Manager): unchanged request and response `{ sessionsMasked, vehiclesDeleted }`; the log row names the Manager.

Automatic run: no HTTP interface. It is the same operation with a null actor, and the log row has `user_id = NULL`.
