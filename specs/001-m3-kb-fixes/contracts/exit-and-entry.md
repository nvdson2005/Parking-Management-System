# Contract changes

## POST /api/events/exit/confirm
Request adds `method` (`PLATE` | `QR` | `RFID`).
- Required to be `PLATE` when `lostCard = true`; otherwise 400 `VALIDATION`, nothing written (KB-05).
- Ignored when `lostCard = false` (field optional, backward compatible).

## POST /api/events/exit/preview and confirm: plate comparison
`observedPlate` is compared to the session plate ignoring case, spaces, dots and dashes. A different plate still returns `plateMismatch: true` in preview and `409 PLATE_MISMATCH` in confirm without `confirmMismatch` (KB-04).

## POST /api/events/entry: vehicleType
For a plate or code that resolves to a registered vehicle, `vehicleType` is ignored and the stored type is used. Required only when the plate is new (KB-13).

## Accepted, unchanged
- Fee is computed at exit time in preview and confirm (KB-02).
- Close session and payment are one transaction (KB-03).
