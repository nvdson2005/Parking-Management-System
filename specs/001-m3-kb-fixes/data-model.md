# Data Model: M3 KB Fixes

No schema or migration change. Entities involved, unchanged:

- **ParkingSession**: `plateSnapshot` (normalised at entry), `vehicleTypeCode`, `feeGroup`, `status` OPEN to CLOSED.
- **Payment**: one per closed session, `amount` = fee at confirm time, status CONFIRMED.
- **Vehicle**: unique plate (compared by `plateCompareKey`), `vehicleTypeCode`.
- **SessionEvent**: `PLATE_MISMATCH_CONFIRMED`, `LOST_CARD` written inside the exit transaction.

New pure function: `plateCompareKey(plate)` = uppercase alphanumerics only, in `src/lib/plate.ts`.
