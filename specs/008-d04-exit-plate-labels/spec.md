# Feature Specification: Show both plates in the exit preview (A-68 D-04)

**Feature Branch**: `fix/d04-exit-plate-labels`

**Created**: 2026-11-26

**Status**: Draft

**Input**: User description: "A-68 D-04 (S2, ISS-11): on the Staff exit screen the preview labels the plate recorded at entry as "Observed plate" and never shows the plate Staff typed. Show both plates in the exit preview: "Plate at entry" (plateSnapshot) and "Observed plate" (the typed plate), with the observed plate marked when they differ (EX-02, AT-EX02). Display only; no API or mismatch-logic change. Design: docs/superpowers/specs/2026-11-26-a68-d04-exit-plate-labels-design.md. Short name: d04-exit-plate-labels."

**Sources**: A-68 D-04 (`docs/m3/a-68-cp05-test.md`, S2, owner RES-04, fix before CP-07); CP-05 condition C6 and ISS-11; checkpoint log F2-03 (CP-05 stays "Pass with conditions" until D-04 is fixed or accepted); SRS v2.1 FR-47 (EX-02 plate mismatch) and NFR-09 (clear messages); acceptance scenario AT-EX02 (both plates shown). Design: `docs/superpowers/specs/2026-11-26-a68-d04-exit-plate-labels-design.md`.

## Clarifications

### Session 2026-11-26

- `speckit-clarify` ran on 26/11: no critical ambiguities. Scope, actor (Staff), both languages, the mismatch case, the lost-card case and the unchanged behaviour are stated; the display of the observed plate (as typed, trimmed) is in Edge Cases. No questions asked.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Staff see which plate was recorded at entry and which plate they observed (Priority: P1)

A Staff member records a vehicle leaving. They identify the vehicle (by plate, QR or RFID), type the plate they see at the gate, and ask for the fee preview. The preview names the plate recorded when the vehicle entered as the entry plate, and shows the plate they typed as the observed plate. When the two differ (EX-02), both are on screen next to the mismatch warning, so the Staff member can see what differs before deciding whether to confirm by hand.

**Why this priority**: This is the whole defect. Today the entry plate appears under the "observed plate" label and the typed plate is not shown, so on a mismatch the screen contradicts itself. AT-EX02 expects both plates, and the fix is a condition of CP-05 and CP-07 before the client demo on 27/11.

**Independent Test**: Open the exit screen, identify a parked vehicle, type a plate that differs from its entry plate, and preview. Both plates are shown with their own labels, and the observed plate is marked as different.

**Acceptance Scenarios**:

1. **Given** a vehicle that entered as `66F-403.45`, **When** Staff type `66F-403.46` as the observed plate and preview the exit, **Then** the preview shows "Biển số lúc vào: 66F-403.45" and "Biển số quan sát: 66F-403.46", the observed plate is visibly marked as not matching, and the existing mismatch warning and manual-confirmation checkbox are shown.
2. **Given** the same vehicle, **When** Staff type `66F-403.45` (or the same plate with different separators or spacing) and preview, **Then** both plates are shown with their labels, no mismatch mark or warning is shown, and the confirm button is available.
3. **Given** the English interface, **When** Staff preview an exit, **Then** the labels read "Plate at entry" and "Observed plate".
4. **Given** a previewed exit, **When** Staff change the observed plate, **Then** the preview is cleared as today, so the plate shown in a preview is always the one that was compared.

### Edge Cases

- A lost-card exit (EX-03) still requires an observed plate; the preview shows both plates in the same way.
- An observed plate typed with extra spaces or lower-case letters is shown as typed (trimmed); the comparison itself is unchanged and stays separator-insensitive.
- A preview response that arrives after Staff changed any input (identifier, method, observed plate, lost card) is discarded, so a preview computed for an earlier value is never shown next to the current one (review of 12dae51, 27/11).
- The entry plate in the preview belongs to an open session, so Staff may see it in full (plate-masking rules for closed sessions do not apply).

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The exit preview MUST label the plate recorded at entry as the entry plate ("Biển số lúc vào" / "Plate at entry"), not as the observed plate.
- **FR-002**: The exit preview MUST show the plate the Staff member typed, labelled as the observed plate ("Biển số quan sát" / "Observed plate").
- **FR-003**: When the system reports that the plates do not match, the observed plate MUST be visibly marked as different, in addition to the existing warning.
- **FR-004**: The mismatch check, the manual-confirmation step, the confirm button rule, the recorded event and the access log MUST behave exactly as before.
- **FR-005**: Every new label MUST exist in both Vietnamese and English.
- **FR-006**: The observed plate shown in a preview MUST be the plate that preview was computed for; a response for an earlier input MUST NOT be shown. An input change MUST release the preview button at once, and only the current request may end the loading state (review of `e18e574`, 27/11).

### Key Entities

- **Exit preview**: what Staff see before confirming an exit. Already contains the session's entry plate, zone, vehicle type, fee group, entry time, fee and whether the plates match; this feature adds the observed plate to what is displayed, from what Staff typed.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: In a preview with mismatched plates, both plates are visible with distinct labels in 100% of cases, in both languages.
- **SC-002**: No plate is shown under a label that does not describe it (the entry plate never appears under the observed-plate label).
- **SC-003**: AT-EX02 passes by hand: a Staff member can name the entry plate and the observed plate from the preview alone, without other screens.
- **SC-004**: The existing exit behaviour is unchanged: the full automated suite passes, including the existing exit and contract tests.

## Assumptions

- The observed plate is taken from what the Staff member typed; the preview data from the server is unchanged (design option C).
- The vehicle in a preview has an open session, so Staff see its plate in full, as today.
- D-05 (session detail does not show the identification method) and any change to the mismatch rule are out of scope.
- This is a display fix inside CR-03 group B ("defects on the demo path", RES-04); it adds no requirement to the SRS.
