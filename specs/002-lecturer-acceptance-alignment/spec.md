# Feature Specification for Lecturer Acceptance Alignment

**Feature Branch** `docs/002-lecturer-acceptance-alignment`

**Created** 2026-11-23

**Status** Draft

**Input** The team’s 11-question email, lecturer Minh Tâm’s numbered reply of 23 November 2026, and SRS v0.2. The answer numbers below refer to that reply.

## User Scenarios & Testing

### User Story 1 - Run the single-lot acceptance demo (Priority P1)

Staff completes entry and exit for the pilot lot, rejects arrivals when the appropriate parking area is full, and confirms per-visit fees at exit. Customers see up-to-date availability.

**Why this priority** — Entry, exit, and availability are core acceptance workflows.

**Independent Test** — Use the single pilot lot for the normal 100-visit scenario. Separately fill the applicable capacity and attempt another admission.

**Acceptance Scenarios**

1. **Given** a configured per-visit rate for the vehicle type and fee group, **when** the vehicle exits, **then** Staff sees that rate applied regardless of how long the vehicle was parked.
2. **Given** a lot has no suitable parking space for an arriving vehicle, **when** Staff attempts admission, **then** the system rejects it, creates no parking session, and leaves availability unchanged.
3. **Given** the normal 100-visit simulation, **when** the team compares outcomes with the expected counts, **then** the time, record completeness, and availability criteria in SC-001 and SC-002 pass.

### User Story 2 - View lot information and manage fee-group changes (Priority P2)

A Manager maintains the lot’s published hours. A Customer can see those hours and the per-visit tariff for their current fee group before parking. The Customer can request a fee-group change, and the Manager applies any approved change.

**Why this priority** — Customers need accurate lot information, and fee-group changes affect what they pay.

**Independent Test** — Change the pilot lot’s hours as Manager and check the Customer view. Use accounts in two fee groups with different rates to verify the displayed tariff. Verify that a Customer cannot apply their own fee-group change.

**Acceptance Scenarios**

1. **Given** the Manager has saved new operating hours, **when** a Customer opens the lot information, **then** it shows the new hours.
2. **Given** the lot is active and all other requirements are met, **when** a vehicle arrives or a Customer books outside the displayed hours, **then** the published hours alone do not cause a rejection.
3. **Given** a Customer requests a different fee group, **when** the Manager makes the approved update, **then** the account reflects the new group. An attempted direct Customer update cannot change it.
4. **Given** different per-visit tariffs for two fee groups, **when** a signed-in Customer opens the pilot lot’s information before parking, **then** the application shows the configured per-visit price for each supported vehicle type in that Customer’s current fee group.

### User Story 3 - Protect plates in completed parking sessions (Priority P1)

Staff can use completed session records without seeing full plates. Managers can view complete plates where they are still retained.

**Why this priority** — This enforces the confirmed permissions and the plate retention limit.

**Independent Test** — Review a recent closed session as Staff and Manager. Then run the automatic retention process against closed sessions on either side of the 12-month cutoff.

**Acceptance Scenarios**

1. **Given** a recent closed session with a retained plate, **when** Staff and a Manager view it, **then** Staff sees a partially masked plate and the Manager can see the full plate. Existing SRS mask-format and full-plate logging requirements apply.
2. **Given** a session that closed more than 12 months ago, **when** automatic retention runs, **then** its plate is removed and its visit count, parking duration, and revenue remain available for statistics.
3. **Given** a session whose entry was more than 12 months ago but whose exit was within the last 12 months, **when** retention runs, **then** the plate remains within retention. Open sessions are ineligible.

### Edge Cases

- A suspended lot continues to follow the previously agreed suspension rules. Published operating hours are independent of operational status.
- The normal scenario measures the timing thresholds. The separate full-lot scenario proves refusal of additional vehicles.
- Managers’ full-plate access applies only while a closed session still retains its plate.

## Requirements

### Functional Requirements

| ID | Requirement | Email answer | SRS v0.2 and acceptance trace |
| --- | --- | --- | --- |
| FR-001 | The handover system MUST charge per visit at the configured rate for the applicable vehicle type and fee group. Hourly billing and hourly rounding are outside handover scope. | 1 | FR-24, FR-34, AT-06 |
| FR-002 | Managers MUST be able to maintain the pilot lot’s operating hours, and Customers MUST be able to view them. The system MUST treat those hours as informational for admission and booking. | 2 | FR-22, FR-26, AT-03 |
| FR-003 | Fee-group changes after registration MUST be made by a Manager following a Customer request. Customers MUST be prevented from applying the change directly. | 3 | FR-07, FR-08, AT-04 |
| FR-004 | The system MUST support explicit logout. A 30-minute inactivity logout is outside handover acceptance scope. | 4 | FR-03, AT-04 |
| FR-005 | Handover acceptance MUST use one pilot lot. Creating and running a second lot through the UI is outside handover acceptance scope. | 5 | NFR-11, AT-03 |
| FR-006 | The acceptance suite MUST verify refusal of new arrivals when no suitable capacity remains, using a separate full-lot test. A full-capacity rerun of the timing thresholds is optional. | 6 | FR-21, FR-46, NFR-12, AT-EX01 |
| FR-007 | The user survey and its proposed score MUST be excluded from mandatory acceptance criteria. | 7 | O5, AT-08 |
| FR-008 | A closed session’s plate MUST be removed automatically once more than 12 months have elapsed from its closing timestamp. Non-plate statistics MUST be retained. | 9 and prior Q35 | FR-45, AT-04 |
| FR-009 | Staff MUST see a partially masked plate for closed sessions. Managers MUST be able to view the full plate while it is retained. | 11 | SRS §2.3, FR-42, AT-04 |
| FR-010 | The application MUST let signed-in Customers view the configured per-visit tariff for their current fee group for each supported vehicle type in the pilot lot. The tariff MUST be available before parking. | 10 | FR-26, AT-03 |

### Key Entities

- **Pilot lot** — The single lot used for handover, with its capacity, operating status, and published operating hours.
- **Tariff** — The configured price per visit for a vehicle type and fee group.
- **Customer account** — Holds the fee group that a Manager can update after a Customer request.
- **Parking session** — Records entry and exit, the retained plate, and the non-plate information used for historical statistics.

## Success Criteria

### Measurable Outcomes

| ID | Outcome | Email answer | Acceptance trace |
| --- | --- | --- | --- |
| SC-001 | In the normal 100-visit scenario, each entry or exit is recorded within 3 seconds of receiving the event, and the availability display updates within 5 seconds of the entry or exit being recorded. | 6 | NFR-04, NFR-05, AT-01, AT-100 |
| SC-002 | In the same scenario, every closed session contains entry time, exit time, vehicle type, and area. Availability by area and vehicle type matches the manual count. All five agreed exception cases pass, including the separate full-lot refusal test. | 6 | NFR-06, NFR-07, AT-100, AT-EX01–05 |
| SC-003 | Core workflows pass on Chrome, Edge, and Firefox at 360, 768, and 1920 px. At each combination the relevant controls remain visible and usable. | 8 | NFR-08, AS27 |
| SC-004 | Against the retention cutoff, Staff sees no full plates for closed sessions, Managers can view still-retained plates, and historical counts, parking durations, and revenue remain unchanged after expired plates are removed. | 9, 11 | FR-42, FR-45, AT-04 |
| SC-005 | Two Customer accounts in different fee groups each see the correct per-visit rates for motorcycles and cars in the pilot lot before parking. | 10 | FR-26, AT-03 |

## Assumptions

- The email confirms who updates the fee group. The Customer’s request channel was unspecified, so an in-app request workflow is outside this specification.
- The decisions in this spec supersede conflicting handover criteria in SRS v0.2. Prior decisions continue to supply the exact masking and audit rules, the five exception definitions, and automatic plate removal.

## RES-01 Delivery and Review Requirements

These requirements cover RES-01’s Phase 5 contribution. The product behavior, answer numbering, and acceptance outcomes above still apply.

- **DR-001** — Record the 11 client answers in the interaction log, link the merged clarification spec, and record the dated SRS review and CP-01 outcome separately.
- **DR-002** — Maintain an auditable M-03 and CR-03 decision that names owners, estimates, affected checks, and the outcome of Q22. V2.0 approval requires a reconciled scope comparison and a named A-87 build. Preserve V1.0 as the original reference.
- **DR-003** — Keep independently reviewable RES-01 work in a separate PR. Deliver in-scope changes to an open PR directly on its head branch with owner coordination. Existing product, SRS/P18, baseline, and QA owners keep their responsibilities.
- **DR-004** — Extend A-61, A-88, and A-115 evidence for the Phase 5 outcomes. Record the tested revision, migration state, results, and any exclusions. QA owns the CP-05 and dry-run outcomes. Pending checks remain visible through the client demo and final acceptance record.
- **DR-005** — Bring measured actuals, weekly notes, the acceptance verdict, agreed exceptions, and the reflection into the final report and handoff. The 28 November report and 29 November submission targets remain distinct from measured progress or model forecasts.
