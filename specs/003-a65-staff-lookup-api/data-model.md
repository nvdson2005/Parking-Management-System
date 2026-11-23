# Data Model: A-65

## Schema change (G-07): indexes only

| Table | New index | Serves |
|---|---|---|
| reservations | `(customer_id, status)` → `reservations_customer_id_status_idx` | One active reservation per account (Q31); customer reservation list |
| parking_sessions | `(entry_time)` → `parking_sessions_entry_time_idx` | Time filters, hourly reports |
| access_logs | `(created_at)` → `access_logs_created_at_idx` | Newest-first log reads |
| access_logs | `(user_id)` → `access_logs_user_id_idx` | Filter by user |

No column or data change.

## Read models (responses)

- **LookupResult**:
  - `vehicle { id, plate, vehicleTypeCode, hasOwner }`
  - `openSession { id, zoneName, entryTime, idMethod } | null`
  - `activeReservation { id, zoneName, arrivalTime, holdUntil } | null`
- **ActiveReservationItem**: `{ id, plate, zoneId, zoneName, vehicleTypeCode, arrivalTime, holdUntil }`. Ordered by `arrivalTime` ascending. "Active" means `status = PENDING` and `holdUntil > now`, after expiry.
- **SessionListItem**: `{ id, plate, zoneName, vehicleTypeCode, entryTime, exitTime, status }`. The plate goes through `presentPlate(plateSnapshot, viewer, ownerId)`. Ordered by `entryTime` descending.
- Access-log and payment responses reuse the existing `listAccessLogs`, `allPayments` and `customerHistory` shapes.

## Validation rules

- `method` ∈ {PLATE, QR, RFID}; `identifier` must be a non-empty string.
- `status` ∈ {OPEN, CLOSED}, default OPEN.
- `limit`: integer 1-500, default 200.
- `from` and `to`: optional; each must parse as a date.
- `zoneId`: optional non-empty string.
