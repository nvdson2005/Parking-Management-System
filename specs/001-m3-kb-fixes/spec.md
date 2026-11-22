# Feature Specification: M3 KB Fixes (A-22, A-63, A-74)

**Feature Branch**: `feat/m3-kb-fixes-and-docs`

**Created**: 2026-11-18

**Status**: Draft

**Input**: User description: "M3 KB fixes (A-22, A-63, A-74). Decisions: KB-02 keep fee at exit time, KB-03 keep close + payment in one transaction. Fix KB-04, KB-05, KB-13. Record A-22 decisions for KB-06, 10, 12, 17, 18, 19 in P18 section 10 and mark P18 v1.0 / CP-02. A-74 payment review against FR-26..FR-28."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Exit plate check ignores separators (Priority: P1)

A staff member records a vehicle exit and types the plate without separators (for example `51F12345` for a vehicle that entered as `51F-123.45`). The system recognises it as the same plate and does not raise a false plate-mismatch warning.

**Why this priority**: Today the vehicle is found but then flagged as a mismatch, which blocks a normal exit and wrongly pushes staff into the override flow (EX-02). It affects the core exit workflow.

**Independent Test**: Record an entry for plate `51F-123.45`, then preview and confirm the exit with observed plate `51F12345`. No mismatch is reported and the exit completes.

**Acceptance Scenarios**:

1. **Given** a vehicle entered as `51F-123.45`, **When** staff submit exit with `51F12345`, **Then** no plate mismatch is reported.
2. **Given** a vehicle entered as `51F-123.45`, **When** staff submit exit with `51F 123 45` (spaces) or lowercase, **Then** no plate mismatch is reported.
3. **Given** a vehicle entered as `51F-123.45`, **When** staff submit exit with a genuinely different plate such as `51F-999.99`, **Then** a plate mismatch is still reported and the existing confirm-mismatch flow applies.

---

### User Story 2 - Lost-card exit always uses plate lookup (Priority: P1)

When a driver has lost their card, the exit must be looked up by plate. The rule is enforced by the system itself, not only by the staff screen, so a direct API call cannot bypass it.

**Why this priority**: The lost-card exception (EX-03) relies on identifying the session by plate. Enforcing it only in the UI leaves a gap for the simulator and any other client.

**Independent Test**: Submit a lost-card exit with a card-based lookup method and confirm it is rejected; submit it with the plate method and confirm it succeeds.

**Acceptance Scenarios**:

1. **Given** a lost-card exit request, **When** the lookup method is not plate, **Then** the request is rejected with a validation error and nothing is written.
2. **Given** a lost-card exit request, **When** the lookup method is plate, **Then** the exit proceeds as today, including the lost-card penalty behaviour.
3. **Given** a normal (not lost-card) exit, **When** any supported lookup method is used, **Then** behaviour is unchanged.

---

### User Story 3 - Known vehicle type comes from the vehicle record (Priority: P2)

At entry, when the plate already belongs to a registered vehicle, the vehicle type stored on that vehicle is used and any type sent by the client is ignored. The type is required only for a new plate. This behaviour is written into the API contract and covered by a test.

**Why this priority**: The behaviour already exists but is undocumented and untested, so a future change could silently break fee and capacity accounting.

**Independent Test**: Register a car, then submit an entry for the same plate claiming motorbike; the session is recorded as a car.

**Acceptance Scenarios**:

1. **Given** a registered car, **When** an entry is submitted for its plate with type motorbike, **Then** the session uses car.
2. **Given** an unknown plate, **When** an entry is submitted without a vehicle type, **Then** it is rejected with a validation error.

---

### User Story 4 - Recorded design decisions for P18 (Priority: P1)

The project lead records an explicit decision for every KB item assigned to A-22, so the architecture and API document (P18) can be issued as v1.0 and the CP-02 design gate has a written record.

**Why this priority**: CP-02 gates the code-fix activities and is overdue. Without the record, the gate cannot be shown to have passed.

**Independent Test**: Open P18 section 10 and check that every KB-01..KB-19 row has a decision (fix code, fix spec, or accept) and an owner, and that the document is marked v1.0 with a CP-02 review record.

**Acceptance Scenarios**:

1. **Given** P18 section 10, **When** it is reviewed, **Then** KB-02 reads "accept: fee computed at exit time" and KB-03 reads "accept: close and payment in one transaction", each with the reason.
2. **Given** KB-06, 10, 12, 17, 18 and 19, **When** reviewed, **Then** each has a recorded decision and no open "decided at CP-02" placeholder.
3. **Given** KB-18, **When** reviewed, **Then** the misleading comment in the lot service is corrected to match actual behaviour (suspended lots still show normal counts plus status).
4. **Given** the document header, **When** reviewed, **Then** it shows v1.0 and a CP-02 review entry. Baseline V1.0 outputs under the M2 report folder remain unedited.

---

### User Story 5 - Payment module review (Priority: P2)

The simulated payment module is checked against FR-26..FR-28 after the KB-02 and KB-03 decisions. Gaps are recorded, and regression tests lock in the confirmed behaviour: payment amount equals the fee shown at exit, one payment per closed session, and customer and manager payment history.

**Why this priority**: Closes activity A-74 and protects the payments behaviour the decisions rely on.

**Independent Test**: Run the payment-related tests and the review notes against each of FR-26, FR-27 and FR-28.

**Acceptance Scenarios**:

1. **Given** an exit, **When** it is confirmed, **Then** exactly one payment exists with an amount equal to the fee computed at exit time.
2. **Given** a tariff change between exit preview and confirm, **When** the exit is confirmed, **Then** the documented behaviour (fee at exit time) holds and is covered by a test.
3. **Given** completed payments, **When** a customer or manager opens history, **Then** each sees only what their role allows.

### Edge Cases

- Exit plate containing only separators or empty after cleaning: rejected as validation error, not treated as a match.
- Lost-card exit for a plate with no open session: existing not-found behaviour is unchanged.
- Entry with a client-sent type for a known vehicle that conflicts with the stored type: stored type wins silently.
- Tariff changed between preview and confirm: the amount charged is the one at confirm time, which may differ from the preview. This is accepted and documented.

## Requirements *(mandatory)*

### Functional Requirements

- **KBF-001**: Exit plate comparison MUST ignore case, spaces, dots and dashes, using the same rule as vehicle lookup (KB-04).
- **KBF-002**: A genuinely different plate MUST still produce a plate-mismatch result (KB-04).
- **KBF-003**: A lost-card exit MUST be rejected unless the lookup method is plate, regardless of the client used (KB-05).
- **KBF-004**: For a known vehicle, entry MUST use the stored vehicle type and ignore the client-sent type; the type MUST be required only for a new plate (KB-13).
- **KBF-005**: The API contract MUST describe the KB-13 behaviour and the KB-05 rule.
- **KBF-006**: P18 section 10 MUST record a decision and owner for KB-02, 03, 06, 10, 12, 17, 18 and 19, and be marked v1.0 with a CP-02 review record.
- **KBF-007**: The exit fee MUST remain computed at exit time, and the session close and payment creation MUST remain one transaction (KB-02, KB-03 decisions). Tests MUST cover both.
- **KBF-008**: The inaccurate lot-suspension comment MUST be corrected (KB-18) without behaviour change.
- **KBF-009**: Payment behaviour MUST be reviewed against FR-26..FR-28, with findings recorded and regression tests added (A-74).
- **KBF-010**: Each commit MUST reference the activity ID and the KB ID.
- **KBF-011**: KB-01, 08, 09 (A-44), KB-07, 14, 16 (A-28), KB-11 (A-70) and KB-15 (A-65) MUST NOT be changed by this feature.

### Key Entities *(include if feature involves data)*

- **Parking session**: an entry-to-exit record with the plate as captured at entry, vehicle type, fee group and status.
- **Payment**: the simulated payment created when a session closes; one per closed session.
- **Vehicle**: a registered plate with an owner and a vehicle type.
- **KB item**: a documented difference between spec and code, with a decision and an owning activity.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of exits typed with any separator or case variant of the entry plate complete without a false mismatch.
- **SC-002**: 0 lost-card exits are accepted with a non-plate lookup method, from any client.
- **SC-003**: All 19 KB rows in P18 section 10 show a decision and owner; 0 rows still say "decided at CP-02".
- **SC-004**: Each in-scope KB item (02, 03, 04, 05, 13, 06, 10, 12, 17, 18, 19) has at least one commit or document change referencing its KB ID.
- **SC-005**: The full automated test suite passes with the new regression tests, with no existing test removed.

## Assumptions

- The client interaction log does not address fee timing, so the team default (fee at exit time) applies.
- KB-05 is enforced by rejecting a non-plate lookup on lost-card exits rather than silently overriding it.
- KB-06, 10, 12, 17, 18 and 19 are resolved as "accept" or "fix spec/comment", with no behaviour change, as the baseline already expected.
- RES-03 shares A-63 and may change related files; work is coordinated through this branch.
- The M2 report folder (Baseline V1.0) is not edited; P18 is a working product under `docs/m2-report/products/` and its version bump is a new revision entry.
- Nothing in this feature is client-visible beyond the exit mismatch and lost-card behaviour.
