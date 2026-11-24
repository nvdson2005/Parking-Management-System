# Data Model: CR-03 UI fixes

No database change. Shapes that change in memory or on the wire:

## LiveAvailability props

| Field | Type | Notes |
|---|---|---|
| `initial` | `LotAvailability[]` | unchanged |
| `role` | `'CUSTOMER' \| 'STAFF' \| 'MANAGER'` | new; from the server session on the role page |
| `renderedAt` | `string` (ISO) | new; the server render time, used as the first `updatedAt` |

Derived per row (zone × vehicle type): `used = open + reserved` (Staff and Manager only); `full = free === 0`.

State: `updatedAt: Date`, set to the receive time on each SSE message.

## DomainError

| Field | Type | Notes |
|---|---|---|
| `code`, `status`, `message` | unchanged | |
| `details` | `Record<string, unknown> \| undefined` | new, optional; currently used only by `EARLY_ARRIVAL` |

## Early-arrival details

| Field | Type | Notes |
|---|---|---|
| `arrivalTime` | ISO 8601 string | the reservation's booked arrival time |
| `zoneName` | string | the reserved zone's name |

## Default arrival (helper)

`defaultArrival(now: Date): Date | null`. Let `earliest = now + 1 min`. Return the first 5-minute mark ≥ `earliest`, with seconds set to 0. If that mark is after 23:59 of `now`'s local day, return 23:59 when `earliest` ≤ 23:59; otherwise return `null` (today closed).
