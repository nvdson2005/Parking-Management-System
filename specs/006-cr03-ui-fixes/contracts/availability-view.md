# Contract: availability screen (UI)

Shared by `/customer`, `/staff` and `/manager`. Each row is one zone and vehicle type.

| Column / element | Customer | Staff | Manager |
|---|---|---|---|
| Zone, vehicle type | yes | yes | yes |
| Free | yes | yes | yes |
| Used (= parked + active reservations) | no | yes | yes |
| Capacity | yes | yes | yes |
| "Hết chỗ" / "Full" badge when free = 0 | yes | yes | yes |
| "Cập nhật lúc HH:mm:ss" / "Updated at HH:mm:ss" per lot card | yes | yes | yes |
| "Tạm ngưng" badge when the lot is suspended | yes (unchanged) | yes | yes |

Updates arrive through `/api/availability/stream`, whose payload is unchanged. Every message refreshes the counts and the update time.
