# Feature Specification: Client round 5 (Q37, Q38, Q45): opening hours, fee-group change, own fees

**Feature Branch**: `feat/res03-q37-q38-q45`
**Created**: 24/11/2026
**Status**: Implemented
**Input**: Lecturer (client) answers of 23/11 to the team's round-5 questions, recorded as Q36 to Q46 in SRS v2.1 (branch `docs/srs-v2.1-customer-feedback`, section 9 gap rows for FR-22/FR-26, FR-07 and FR-26). Q44 and Q46 are fixed in PR #11.

## User Scenarios & Testing

### User Story 1 - Opening hours, for information only (Q37, G-01, FR-22, FR-26) (P1)

1. **Given** a lot, **When** a Manager sets 06:00 and 22:00, **Then** customers see "06:00–22:00" with the lot's address and status.
2. A Manager can change both times or clear both; a single time, or a time not in HH:mm, is 400 VALIDATION.
3. An entry outside the hours is still recorded: the hours do not block entries or reservations.

### User Story 2 - A customer sees the fees of their own group (Q45, FR-26) (P1)

1. **Given** tariffs for every vehicle type and group, **Then** the customer home shows the per-entry price of each vehicle type for the customer's group only.
2. A vehicle type without a tariff shows "not set yet"; a Manager's price change shows at once.

### User Story 3 - Fee-group change (Q38, FR-07, FR-08) (P1)

1. A customer asks to move to the other group; their group does not change yet and the home shows the pending request.
2. A Manager sees the request on the accounts page and sets the group; the request is cleared, `ACCOUNT_CHANGE` is logged and the customer gets a GROUP_CHANGED notification, in one transaction.
3. Sessions already open keep the fee group they started with; the next entry uses the new group.
4. Asking for the current group, a request from a non-customer, a group for staff or managers, or an unknown group is rejected.

### Edge Cases

- Account API responses never include the password hash (found while adding the group column).
- Closing time before opening time is allowed (a lot open overnight).

## Requirements

- **FR-A (G-01)**: `parking_lots.open_time`, `close_time` TEXT NULL (HH:mm), new migration; set as a pair through `POST /api/lots` and `PATCH /api/lots/[id]`.
- **FR-B (Q45)**: `tariffsForGroup(db, group)`; customer home card.
- **FR-C (Q38)**: `users.requested_user_group` TEXT NULL, new migration; `POST /api/account/group-request` (Customer); `PATCH /api/accounts/[id]` takes `{ locked }` or `{ userGroup }`.

## Success Criteria

- Each scenario has an automated test that fails without the change; the production build run shows each flow end to end.
