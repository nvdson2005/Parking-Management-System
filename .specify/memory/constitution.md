# Smart Parking MVP Constitution

## Core Principles

### I. Shared service layer is the entry/exit API (KB-01, A-22, CP-02)

Entry and exit events (FR-15) go through one shared set of service functions
in `src/server/services/` (`recordEntry`, exit preview, exit confirm). The HTTP
routes `/api/events/entry`, `/api/events/exit/preview` and
`/api/events/exit/confirm` and the device simulator (`services/simulator.ts`)
both call these same functions in-process. The simulator does not call HTTP.

**Rationale:** Decision A-22 accepted KB-01 as "API shared at the service
layer". The same business rules apply to Staff and simulator. CP-02 review
(P18 §10.2, 24/11/2026) passed with this decision recorded and the entry/exit
contract frozen (P18 §7).

**Rules:**
- No business rule is duplicated in the simulator or in a route handler.
- A new entry/exit rule goes into the service, never into one caller only.
- Moving the simulator to HTTP needs a new decision against KB-01.

**Reference:** `docs/m2-report/products/CO3011_M2_KienTrucAPI_v0.1.md` (§10 KB-01, §10.2); `docs/m3/A-43-simulator-review.md` (criterion 6); PD-P04 criterion 6.

## Governance

This constitution records decisions the team has accepted and that later
specs, plans and reviews rely on. Amend it only with a recorded decision
(A-xx / CP-xx) and update the reference line.

**Version**: 1.0.0 | **Ratified**: 2026-11-24 | **Last Amended**: 2026-11-24
