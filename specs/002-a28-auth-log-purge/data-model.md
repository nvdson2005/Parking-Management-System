# Data Model: A-28

**No schema change and no migration.** The feature only changes which rows are written.

| Entity (table) | Change | Rule |
|---|---|---|
| access_logs | New rows only | LOGIN row for each successful registration (`user_id` = new user). PURGE row with `user_id = NULL` for each automatic purge run; target `"<n> sessions, <m> vehicles"`. Manager-triggered PURGE rows keep the Manager's `user_id` |
| parking_sessions | Rule start changed by Q44 | `plate_snapshot` set to `[purged]` when status is CLOSED, `exit_time` < now − 12 months and not yet masked (P03 §6; from the exit per Q44, 23/11). The plate observed at the exit in their EX-02 notes (`Observed plate: <plate>`) becomes `[purged]`; the staff note after it is kept. Same rules for manual and automatic runs |
| vehicles | Unchanged rules | Ownerless vehicle deleted only with no session at or after the cutoff, no OPEN session and no reservation; old sessions detached first (KB-10) |

## State of the scheduler (in memory, not persisted)

`globalThis.__purgeSchedule = { startTimer, intervalTimer }`, set once per process. A second `register()` call (HMR, repeated hook) sees it and returns without creating timers.
