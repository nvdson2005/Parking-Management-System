# Feature Specification: A-65 Staff Lookup, Read APIs and Indexes

**Feature Branch**: `fix/res03-a28-a65`

**Created**: 2026-11-23

**Status**: Draft

**Input**: User description: "A-65 (RES-03): bổ sung API theo KB-15 (P18 v1.0 §10) và Staff tra cứu theo Q34 (G-08), chỉ mục G-07 (P03 v0.4 §11.1, CR-03). (1) KB-15: endpoint đọc cho nhật ký truy cập (Manager), lượt gửi (Staff/Manager, lọc theo trạng thái), lịch sử thanh toán (Manager: tất cả có lọc thời gian; Customer: của mình). (2) G-08 / Q34: Staff tra cứu theo biển số/QR/RFID trả về xe, lượt đang mở và đặt chỗ đang hiệu lực; danh sách đặt chỗ đang hiệu lực theo khu vực; trang tra cứu cho Staff và link trong menu; lộ biển số đầy đủ thì ghi VIEW_FULL_PLATE. (3) G-07: chỉ mục reservations(customer_id,status), parking_sessions(entry_time), access_logs(created_at), access_logs(user_id) bằng migration mới."

**Sources**: client answer Q34 (round 3, 15/11/2026); P18 v1.0 §10 KB-15 (decision: accept "endpoint or component", A-65 adds endpoints); P03 v0.4 §6.1, §7, §11.1 (G-07, G-08); CR-03 (pending RES-01 approval). The design is already decided in these documents, so no separate brainstorming round was run.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Staff look up a vehicle and its reservation (Priority: P1)

A staff member at the gate needs to see, for a given plate, QR code or RFID card, which vehicle it is, whether it is currently parked, and whether it holds an active reservation. This is needed for decisions the client assigned to staff in Q34 and Q31, such as accepting an early-arriving reservation or handling a lost card. Today staff can see open sessions but cannot see vehicles or reservations at all.

**Why this priority**: The client stated it in round 3 (Q34): staff "need to see vehicle, session, reservation and lot information to do their job". It is the only part of A-65 that comes from the client, and it is listed under R-M3-07 (High).

**Independent Test**: As staff, look up a registered plate that has a pending reservation. The result shows the vehicle, no open session, the reservation with zone and arrival time, and one VIEW_FULL_PLATE row is logged. As a customer, the same lookup is refused.

**Acceptance Scenarios**:

1. **Given** a registered vehicle with an active reservation, **When** staff look it up by plate, QR or RFID, **Then** they see the vehicle (plate, type, whether it has an owner), its open session if any, and its active reservation (zone, arrival time, hold-until).
2. **Given** a plate typed with different separators or case (for example `51f 123 45` for `51F-123.45`), **When** staff look it up, **Then** the same vehicle is found.
3. **Given** an identifier that matches no vehicle, **When** staff look it up, **Then** they get a clear "not found" result and nothing is logged.
4. **Given** a successful lookup, **Then** one VIEW_FULL_PLATE access-log row is written for that staff member and vehicle, because the full plate is shown (D-31).
5. **Given** a customer or a signed-out visitor, **When** they try the lookup, **Then** it is refused (forbidden or unauthenticated).
6. **Given** staff, **When** they open the list of active reservations, optionally for one zone, **Then** they see every pending reservation that has not yet expired, ordered by arrival time, with plate, zone, vehicle type and arrival time.
7. **Given** staff, **When** they open the app, **Then** the staff menu has a link to the lookup screen, in Vietnamese and English.

---

### User Story 2 - Read endpoints for logs, sessions and payments (Priority: P2)

Other clients (the simulator, tests and any future screen) can read the access log, parking sessions and payment history through the API, with the same role rules as the existing screens. Today these are read only inside server pages (KB-15).

**Why this priority**: It is a design-review finding (KB-15). The checkpoint criterion "endpoint or component" was already accepted, so these endpoints complete the API but do not change what any user can see today.

**Independent Test**: As manager, read the access log, sessions and payments through the API and compare them with the existing screens. As staff, read sessions but not the access log or all payments. As a customer, read only your own payment history.

**Acceptance Scenarios**:

1. **Given** a manager, **When** they read the access log, **Then** they get the newest entries first (default 200, capped at 500) with the acting user's name, or none for system rows.
2. **Given** staff or a manager, **When** they read sessions with status open (default) or closed, **Then** they get those sessions, newest entry first, with zone and plate shown under the same plate rules as the screens.
3. **Given** a manager, **When** they read payments with an optional from/to time range, **Then** they get confirmed payments in that range, newest first, the same as the payments screen.
4. **Given** a customer, **When** they read payments, **Then** they get only their own parking history and payments (owner at entry), never other customers'.
5. **Given** staff or a customer, **When** they read the access log, **Then** it is refused. **Given** staff, **When** they read payments, **Then** it is refused.
6. **Given** an invalid filter value (unknown status, unparsable date, non-numeric limit), **Then** the request fails with a validation error.

---

### User Story 3 - Faster filtering on time and account (Priority: P3)

Filtering sessions by entry time, the access log by time or user, and checking one active reservation per account stay fast as the history grows.

**Why this priority**: The pilot data does not need it yet (P03 §7). It is a cheap preventive step (G-07, 0,5 h).

**Independent Test**: After applying migrations to an empty database, the four indexes exist, and the existing test suite passes unchanged.

**Acceptance Scenarios**:

1. **Given** a database built from the migrations, **Then** indexes exist on reservations by (customer, status), sessions by entry time, and the access log by time and by user.
2. **Given** the existing data, **When** the migration is applied, **Then** no row changes.

---

### Edge Cases

- A vehicle found by plate whose plate copy on old sessions is `[purged]`: the vehicle itself still shows its plate. Purged sessions are not returned as open sessions because they are closed.
- A guest (ownerless) vehicle: shown as guest; it can have an open session but never a reservation.
- An expired hold still marked PENDING (the 30 s timer has not run yet): it must not be shown as active. Expire stale holds before listing, as the availability and reservation flows already do.
- A lot that is suspended: reservations were cancelled on suspension (Q32), so none are shown as active.
- Lookup with an empty identifier: validation error.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Staff and managers MUST be able to look up a vehicle by plate (separator- and case-insensitive), QR code or RFID code (Q34, G-08).
- **FR-002**: A lookup result MUST include the vehicle (plate, type, owner yes/no), its open session if any (zone, entry time, method), and its active reservation if any (zone, arrival time, hold-until).
- **FR-003**: A successful lookup MUST write one VIEW_FULL_PLATE access-log row with the staff member as user and the vehicle as target. A failed lookup MUST write none.
- **FR-004**: Staff and managers MUST be able to list active reservations (pending and not expired), optionally filtered to one zone, ordered by arrival time. Stale holds MUST be expired before the list is built.
- **FR-005**: The staff area MUST have a lookup screen reachable from the staff menu, with all text in Vietnamese and English.
- **FR-006**: Customers and signed-out visitors MUST NOT be able to use the lookup or the active-reservation list.
- **FR-007**: Managers MUST be able to read the access log through the API, newest first, with a limit (default 200, maximum 500) (KB-15).
- **FR-008**: Staff and managers MUST be able to read parking sessions through the API, filtered by status (open by default, or closed), newest entry first (KB-15).
- **FR-009**: Managers MUST be able to read all confirmed payments through the API with an optional time range. Customers MUST be able to read only their own history (KB-15, FR-28 of SRS v0.1 / FR-37 of v0.2).
- **FR-010**: Invalid query values MUST return a validation error, never an internal error.
- **FR-011**: Plates in all new responses MUST follow the existing plate display rule: staff and managers see the full plate, owners see their own, others see a masked plate, and purged plates stay purged. Since Q46 (23/11), Staff see a masked plate on sessions that have ended; the lookup returns only the open session, so it is unchanged.
- **FR-012**: The database MUST have indexes on reservations (customer, status), sessions (entry time), and access log (time) and (user), added by a new migration without changing data (G-07).
- **FR-013**: Existing screens (staff sessions, manager access log, manager payments, customer history) MUST keep showing the same data.

### Out of Scope

- Staff editing vehicles or reservations (read-only).
- A staff screen for lot details beyond the existing availability view (P03 §6.1: availability and lot status already cover the need).
- Paging beyond a simple limit.

### Key Entities

- **Vehicle**: plate, type, optional owner. Looked up by plate, QR or RFID.
- **Parking session**: zone, entry and exit time, status, plate copy.
- **Reservation**: zone, vehicle, arrival time, hold-until, status. "Active" = pending and hold-until in the future.
- **Access-log entry**: VIEW_FULL_PLATE rows added for lookups.
- **Payment**: confirmed amount and time per closed session.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A staff member finds a vehicle's status (parked or not, active reservation or not) in one search, by any of the 3 identifier types.
- **SC-002**: 100% of successful lookups leave exactly one full-plate audit entry, and 0 failed lookups do.
- **SC-003**: 0 of the new reads are reachable by a role the client did not grant: no customer use of the lookup, no staff access to the access log or all payments.
- **SC-004**: For each new read, the data matches the corresponding existing screen on the same database in 100% of tested cases.
- **SC-005**: Expired holds are never listed as active.
- **SC-006**: The full automated suite, lint and production build pass; the migration applies cleanly to an empty database.

## Assumptions

- "Lot status" for staff is already covered by the availability view (all roles), so no new lot endpoint is added (P03 §6.1).
- Staff and managers see full plates today in the sessions list; the new lists follow the same rule. Only the lookup detail logs VIEW_FULL_PLATE, matching the session-detail behaviour (D-31).
- The access-log endpoint keeps the screen's default of 200 entries and adds a maximum of 500 to bound the response.
- Constitution delivery-workflow rule 4 (CP-02 minutes) is handled as for A-28: a recorded deviation, see the plan's complexity section.
