# Contract: exit preview view (Staff)

The HTTP contract of `POST /api/events/exit/preview` and `POST /api/events/exit/confirm` (P18) does **not** change. This file fixes what the screen shows.

## `ExitPreviewDetails({ preview, observedPlate })`

Exported from `src/app/staff/exit/ExitForm.tsx`; `ExitForm` renders it when a preview exists.

| Row (in order) | Label key | Value |
|---|---|---|
| 1 | `exit.entryPlate` | `preview.plateSnapshot` |
| 2 | `exit.observedPlate` | `observedPlate.trim()`; when `preview.plateMismatch` is true the value carries `data-mismatch="true"` and the destructive text style |
| 3 | `exit.zone` | `preview.zoneName` |
| 4 | `exit.vehicleType` | localised vehicle type |
| 5 | `exit.feeGroup` | localised fee group |
| 6 | `exit.entryTime` | entry time |
| 7 | `exit.fee` | fee in đồng |

Guarantees:

- The entry plate is never shown under `exit.observedPlate`.
- On a mismatch both plates are shown.
- The mismatch warning, the manual-confirmation checkbox and the confirm-button rule stay in `ExitForm` and do not change.
- `ExitForm` passes the plate it sent with the preview request (not the live input) as `observedPlate`, and confirms with that same plate.
- A response to an outdated request is discarded: `createRequestGuard()` (`src/lib/requestGuard.ts`) gives each request a token, any input change invalidates it, and only the latest valid token may set the preview (FR-006).

## i18n

| Key | vi | en |
|---|---|---|
| `exit.entryPlate` (new) | Biển số lúc vào | Plate at entry |
| `exit.observedPlate` (existing) | Biển số quan sát | Observed plate |
