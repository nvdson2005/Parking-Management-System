# Feature Specification: CR-03 UI fixes (availability screen, demo-path defects, early-arrival details)

**Feature Branch**: `fix/cr-03-ui`

**Created**: 2026-11-24

**Status**: Implemented (T001–T019); manual retest T020 pending

**Owner**: Phạm Duy Quý (RES-04)

**Input**: User description: "CR-03 UI fixes owned by RES-04 (approved by RES-01 as option 2). Group A: availability screen shows last update time (FR-19), used spots for Staff and Manager (FR-20), 'Hết chỗ' when free is 0 (FR-21); rerun A-49 TC-AV-01 and the full-zone case. Group B: reservation form default arrival time is in the past; global font falls back to serif; Staff entry selects show raw values. Group C: early-arrival confirmation shows the booked time and zone (FR-51). Each fix lands with a test."

**Sources**: CR-03 change-impact analysis and decision record (branch `docs/cr-03-v2.1-gaps`, approved by RES-01 on 24/11/2026 as option 2); SRS v2.1 section 9; `docs/m3/quality-evidence-A-49.md` (gaps G1–G3 and the observations outside A-49 scope). The design was agreed in the CR, so no separate brainstorming round was run. `speckit-clarify` was not run for the same reason: the scope, owners and acceptance points were settled in the CR decision, and no question was left open. `speckit-analyze` was run after implementation (25/11); its findings are recorded in tasks.md.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Availability screen shows freshness, used spots and "full" (Priority: P1)

Customers, Staff and Managers watch the live availability screen. They need to know how recent the numbers are, Staff and Managers need to see how many spots are used in each zone, and everyone needs a clear "full" status when no spot is left.

**Why this priority**: FR-19, FR-20 and FR-21 are Must requirements. They are the only reason A-49 is "Partly verified" (gaps G1–G3), and the screen is shown in the 27/11 client demo.

**Independent Test**: Open the availability screen as Customer, Staff and Manager. Record an entry; the update time changes and, for Staff and Manager, the used count rises by one. Fill a zone; it shows "Hết chỗ" (Vietnamese) or "Full" (English) on every role's screen.

**Acceptance Scenarios**:

1. **Given** any role on the availability screen, **When** the screen shows counts, **Then** it also shows the time of the most recent update it received.
2. **Given** the screen is open, **When** an entry, exit, reservation, cancellation or capacity change occurs, **Then** the counts and the update time both change without a page reload.
3. **Given** a Staff or Manager user, **When** they view a zone and vehicle type, **Then** they see used spots alongside free spots and capacity, and free + used = capacity.
4. **Given** a Customer, **When** they view the same screen, **Then** they see free spots and capacity, without the used column.
5. **Given** a zone and vehicle type whose free count is 0, **When** any role views it, **Then** it is marked "Hết chỗ" in Vietnamese or "Full" in English, in addition to the number.
6. **Given** a zone that becomes full and then frees one spot, **When** the update arrives, **Then** the "full" mark disappears without a reload.

---

### User Story 2 - Reservation form works with its default values (Priority: P1)

A Customer opens the reservation form and submits it without changing the arrival time.

**Why this priority**: Today the default arrival time is already in the past, so the very first submission in the demo fails with a "reservation window" error.

**Independent Test**: As `customer01`, open the reservation page at any time before 23:59 and submit with the default arrival time. The reservation is created.

**Acceptance Scenarios**:

1. **Given** the current time leaves at least one valid arrival time before the end of today, **When** the Customer opens the form, **Then** the arrival time is pre-filled with a time in the future and within today.
2. **Given** that default, **When** the Customer submits without editing it, **Then** the reservation is created.
3. **Given** the form, **When** the Customer opens the time picker, **Then** times earlier than now cannot be chosen.
4. **Given** no valid arrival time remains today, **When** the Customer opens the form, **Then** the form says that reservations for today are closed and why, instead of failing on submit.

---

### User Story 3 - Staff entry form shows readable choices (Priority: P2)

A Staff member records an entry by choosing a zone, a vehicle type and a gate.

**Why this priority**: After a choice the selects show an internal identifier or code instead of the zone name, "Xe máy"/"Ô tô" or the gate name. Staff cannot confirm what they picked, and the screen is used in the demo.

**Independent Test**: As `staff1`, choose zone C, vehicle type car and any gate on the entry form. Each select shows the human-readable label of the choice in the current language.

**Acceptance Scenarios**:

1. **Given** the entry form, **When** Staff chooses a zone, **Then** the zone select shows the zone's display label, not its identifier.
2. **Given** plate identification, **When** Staff chooses a vehicle type, **Then** the select shows "Xe máy"/"Ô tô" (or "Motorbike"/"Car"), not the code.
3. **Given** the gate select, **When** Staff chooses a gate, **Then** it shows the gate's display name, not its code.
4. **Given** the form first loads with default choices, **When** nothing has been changed, **Then** the selects also show labels.

---

### User Story 4 - Early-arrival confirmation shows the booking (Priority: P2)

A vehicle with an active reservation arrives before its booked time. Staff must decide whether to admit it (FR-51).

**Why this priority**: FR-51 says Staff see the reservation when deciding. Today the confirmation shows only a generic warning, so Staff confirm without knowing the booked time or zone.

**Independent Test**: As `customer01`, reserve zone A for a time later today. As `staff1`, record entry of `29A-01001` now. The confirmation shows the booked arrival time and zone A. Confirming admits the vehicle; cancelling admits nothing.

**Acceptance Scenarios**:

1. **Given** a vehicle with an active reservation arriving early, **When** Staff submits the entry, **Then** the confirmation shows the booked arrival time (local time) and the reserved zone.
2. **Given** that confirmation, **When** Staff confirms, **Then** the vehicle is admitted as today (reservation fulfilled, early arrival recorded).
3. **Given** that confirmation, **When** Staff cancels, **Then** no session is created and the reservation remains active.

---

### User Story 5 - Readable font across the application (Priority: P3)

Every page uses the intended sans-serif font instead of the browser's default serif font.

**Why this priority**: Cosmetic, but visible on every page of the demo.

**Independent Test**: Open the login page and one page per role. Text renders in the intended sans-serif font.

**Acceptance Scenarios**:

1. **Given** any page, **When** it renders, **Then** body text uses the application's sans-serif font, not a serif fallback.

---

### Edge Cases

- No update received yet after the page opens: the screen shows the time of the snapshot it was rendered with.
- The update time follows the viewer's local time and the current language.
- Capacity lowered below the number of vehicles parked: free shows 0 and "full"; used may exceed capacity and is shown as is.
- A suspended lot keeps its "Tạm ngưng" badge; "full" marks are still shown per zone.
- Reservation form opened at 23:59 or later: no valid time remains, so the closed message is shown.
- Reservation form left open until the default time has passed: submitting returns the existing window error, which tells the Customer to choose a later time.
- Early arrival where the reservation is for a different zone than the one Staff selected: the confirmation shows the reserved zone so Staff can notice the difference.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001** (SRS FR-19, G1): The availability screen MUST show, for every role, the time of the most recent availability data it holds, and MUST update that time whenever new data arrives.
- **FR-002** (SRS FR-20, G2): For Staff and Manager, the availability screen MUST show used spots per zone and vehicle type, where used = vehicles parked + active reservations, next to free spots and capacity.
- **FR-003** (SRS FR-19, FR-20): For Customers, the availability screen MUST NOT show the used column; it keeps free spots and capacity.
- **FR-004** (SRS FR-21, G3): When free spots for a zone and vehicle type are 0, the availability screen MUST show a "full" status ("Hết chỗ" / "Full") for that row on every role's screen.
- **FR-005**: All new screen text MUST exist in both Vietnamese and English.
- **FR-006** (SRS FR-27): The reservation form MUST pre-fill an arrival time that is in the future and within the current local day whenever such a time exists.
- **FR-007** (SRS FR-27): The reservation form MUST NOT offer arrival times earlier than the current time.
- **FR-008** (SRS FR-27, NFR-09): When no valid arrival time remains today, the reservation form MUST say that reservations for today are closed instead of letting the Customer submit an invalid time.
- **FR-009** (P05, P06): The Staff entry form's zone, vehicle type and gate selects, and the reservation form's vehicle and zone selects, MUST display the human-readable label of the current choice in the current language.
- **FR-010** (SRS FR-51): When a vehicle with an active reservation arrives before its booked time, the confirmation shown to Staff MUST include the booked arrival time and the reserved zone.
- **FR-011**: Confirming or cancelling the early-arrival prompt MUST keep the current behaviour (admit with the early-arrival record, or admit nothing).
- **FR-012** (UI design A-13): Pages MUST render with the application's sans-serif font.
- **FR-013**: Each change MUST come with an automated test where the behaviour can be tested automatically; the full test suite, the production build and lint MUST pass.

### Key Entities

- **Availability row**: one zone and vehicle type, with capacity, vehicles parked, active reservations, free spots, and the time the data was produced or received.
- **Reservation**: the booked arrival time and zone shown to Staff on early arrival.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: In a rerun of A-49 TC-AV-01, 5/5 steps show the expected free count and an update time that changes at each step, on the Customer screen, without a reload.
- **SC-002**: On the Staff and Manager screens, free + used = capacity for 100% of rows after the same steps (unless capacity is below the vehicles parked).
- **SC-003**: In the A-49 full-zone case, the full zone shows the "full" status on the Customer and Staff screens, and the status disappears within 5 seconds of a spot being freed.
- **SC-004**: Submitting the reservation form with its default values succeeds on the first attempt in 100% of tries made before 23:58.
- **SC-005**: On the Staff entry form, 3/3 selects show human-readable labels after any choice, in both languages.
- **SC-006**: In the early-arrival case, Staff can read the booked time and zone on the confirmation before deciding.
- **SC-007**: A-49 moves from "Partly verified" to "Verified" after this change.

## Assumptions

- "Time of the most recent update" means when the screen received the latest data. Server and viewer are on the same machine in the pilot, so the difference from the server's own time is negligible.
- "Used" includes active reservations, because those spots are held and are already subtracted from free (SRS FR-17).
- Customers do not need the used count: FR-20 names Staff and Manager only.
- The default arrival time is the next whole minute that is still valid, rounded up to a short step; 23:59 is the last allowed time, matching the current window rule.
- The reservation window rule itself (from now until the end of today, Q31/AS19) does not change.
- Out of scope: Staff list of active reservations (FR-52, done by RES-03 in A-65), lecturer-confirmed items of group D (done by RES-03 in PR #11 and PR #17), reservation status labels, cards and messages (RES-05 under CR-03).
- The CR identifier collides with RES-03's CR-03 in `docs/m3/risk-register.md` section 6; RES-01 will decide the numbering. This does not change the scope above.
