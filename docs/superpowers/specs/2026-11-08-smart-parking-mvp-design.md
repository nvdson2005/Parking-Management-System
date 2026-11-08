# Smart Parking Management System — MVP Design Spec

- Date: 2026-11-08
- Status: Approved by team 2026-11-08
- Round 3 client questions (email-ready): `resources/client-round3-questions.md`
- Purpose: single source for generating a sequential implementation plan for the demo MVP (CO3011 Task 3.1 / 4.1).

---

## 0. How to read this spec

Every statement carries a source tag. Nothing here is invented by the author of the spec.

| Tag | Source |
|---|---|
| `[BRIEF]` | `resources/brief.md` |
| `[ASG <section>]` | `resources/CO3011_Assignment_2026.pdf` |
| `[CIL Qn]` | `resources/CO3011_Project_Tracking_Workbook (1).xlsx`, sheet **Client Interaction Log**, column B "ID", column G "Client response" |
| `[M1 §x.y]` | `resources/[Milestone 1] CO3011_M1_Report_v0.3.docx`, section number |
| `[M1 ASn / CNn / On]` | M1 assumption (§1.2.4), constraint (§1.2.5), objective (§1.4.3) |
| `[M2 PD-Pxx §n]` | `resources/[Milestone 2] Drafts.docx`, Product Description Pxx, section n |
| `[M2 ENT-xx]` | `resources/[Milestone 2] Drafts.docx`, PD-P03 Table 4.1 (planned entities) |
| `[D-nn]` | Team decision taken on 2026-11-08 during spec finalisation (section 2). Each carries a basis label (section 2.1) |
| `[BUILDER]` | Explicitly left to the builder; any choice is acceptable if it does not change behaviour described here |

Note on question numbering: M1 and M2 sometimes cite older draft question IDs (e.g. "Q03", "Q06"). This spec cites only the final IDs Q1–Q26 of the **Client Interaction Log** sheet. The "Impact on project" column (H6–H18) of that sheet is shifted by one row relative to the responses; this spec relies on column G (Client response) and on M1 §1.1.3 for impacts.

---

## 1. Intent

A university wants a system to manage parking for students, lecturers and staff. Today parking is managed manually, users cannot know availability in advance, and the parking office cannot track demand. `[BRIEF]`

The client's goals: digitise operations, optimise space usage, improve user experience. `[CIL Q9]`

The MVP must demonstrate coherent end-to-end workflows, not disconnected screens. `[ASG Task 3.1]` Acceptance = core workflows work end to end, exceptions are handled, agreed requirements are met. `[CIL Q11]`

The three highest-priority client functions: vehicle entry/exit management, parking availability tracking, parking lot information management. `[CIL Q1]` If time runs short these three are protected first. `[CIL Q22]` `[M1 §1.4.1]`

### 1.1 Objectives the MVP must make demonstrable `[M1 §1.4.3]`

| ID | Objective | Demonstrated by |
|---|---|---|
| O1 | Drivers know availability before arriving | Live free-count per lot/zone/vehicle type; count correct after every event |
| O2 | Entry/exit fully digitised | Every entry/exit has a complete electronic record; simulator run of ≥100 sessions |
| O3 | Management can track utilisation and demand | Reports: utilisation by hour, peak hours, revenue, no-show rate; reservations auto-expire |
| O4 | Fewer fee errors and consistent exception handling | Fee calculation tests; 5 core exceptions handled |
| O5 | Delivered scope meets acceptance | Requirement→test traceability (section 9) |

---

## 2. Decisions log (taken 2026-11-08)

| ID | Decision | Resolves |
|---|---|---|
| D-01 | MVP includes **all** M1 §1.4.1 items: Must + Should + Could | Scope |
| D-02 | Stack: **Next.js (App Router, TypeScript) full-stack, Prisma ORM, SQLite, Tailwind CSS + shadcn/ui** | Tech stack; allowed by `[CIL Q12]` `[M1 AS8]`, free/open-source per `[M1 CN5]` |
| D-03 | Fee is **per entry** (flat per session), configured by vehicle type and user group. No hourly fee, no monthly pass | Conflict: `[M1 §1.4.1, §1.4.2]` vs `[M2 AS11]` → M1 wins |
| D-04 | Lot **operating hours excluded** | Conflict: `[M1 §1.4.2]` vs `[M2 AS9, ENT-03]` → M1 wins |
| D-05 | Entry/exit events come from **staff screens and a simulator**, both via the same event API | `[M1 AS1]` `[M2 PD-P05 §4 parts 1–3]` |
| D-06 | Simulated payment is **confirmed by Staff at exit** | `[M1 §1.4.1]` |
| D-07 | Reservation is for **zone + vehicle type + arrival time**; fulfilled when that vehicle is checked in | `[M2 ENT-10]` |
| D-08 | Acceptance exceptions are **exactly the 5 core exceptions** | `[M1 O4]` `[M2 PD-P05 §4 part 5]` |
| D-09 | Lost QR/card: Staff looks up open session **by plate**, confirms manually, system logs a `LOST_CARD` session event, then normal exit/payment | Gap in `[M2 PD-P05]` |
| D-10 | User group **self-declared at sign-up**: Student or Lecturer/Staff. Vehicles not linked to an account are charged the **Guest** rate | Gap; group pricing per `[M1 §1.4.1]` `[CIL Q16]` |
| D-11 | UI **bilingual Vietnamese / English with a toggle** | `[CIL]` draft Q45 unanswered |
| D-12 | Customers may register **multiple vehicles**; each vehicle gets a QR code shown in the app | Draft Q38 unanswered; `[M2 ENT-07]` |
| D-13 | Plate mask format: keep prefix and last 2 characters, e.g. `51F-123.45` → `51F-***.45` | `[M1 CN4]` |
| D-14 | Near-real-time updates via **Server-Sent Events (SSE)** | `[M1 O1]` |
| D-15 | 12-month plate retention implemented as a **Manager "purge" action** | `[CIL Q18]` `[M1 AS6]` |
| D-16 | Demo runs **locally** with a seed script; automated tests cover core logic (section 8) | `[ASG Task 3.5]` |
| D-17 | Seed lot zones: **A = 150 motorbike, B = 150 motorbike, C = 30 car** | `[CIL Q24]` (3 zones, ~300 motorbike, 30 car) |
| D-18 | Seed tariff: **motorbike 2,000 VND, car 10,000 VND per entry, same for all groups**; Manager can change it during demo | `[CIL Q16]` |
| D-19 | Reservations may be booked for **the same day only** (arrival time between now and end of today) | — |
| D-20 | Reports use a **date range picker** (default: today) | `[CIL Q20]` |
| D-21 | Free count = capacity − open sessions − pending reservations. A walk-in entry is rejected if it would take a reserved spot | `[CIL Q15]` (reservations within general capacity) |
| D-22 | Simulator: fire N random live events, trigger each of the 5 exceptions on demand, generate past N days of history | `[M2 PD-P05 §7 #10]`, `[M1 O2]` |
| D-23 | Access log records: login/logout, viewing full plates, entry/exit and manual confirmations, lot/tariff/account changes, data purge | `[M1 CN4]` `[M2 ENT-13]` |
| D-24 | Manager account management: list users, create Staff/Manager accounts, lock/unlock any account | `[M1 §1.2.3]` |
| D-25 | Staff enters a QR code by **typing or pasting the QR value**; no camera scanning | FR-11 input method |
| D-26 | At exit Staff **always types the plate they observe**; mismatch with the session's entry plate triggers EX-02 | EX-02 trigger |
| D-27 | Suspended lot: entries rejected, **exits still allowed**, **new reservations rejected**, existing pending reservations **kept**, availability shows a **"Suspended" badge with normal counts**; reactivation restores normal behaviour | EX-05 side effects |
| D-28 | Simulator EX-02 / EX-03 triggers **set up the situation** (open session ready for mismatch / lost card); **Staff resolves it live** on the exit screen. EX-01, EX-04, EX-05 triggers fire the rejected entry directly | FR-33 |
| D-29 | Each session stores its own **plate snapshot**. Purge replaces the snapshot on sessions older than 12 months with `[purged]` and deletes unlinked Guest vehicles that have no newer session. History generator also creates some sessions ~13 months old so purge removes visible rows | FR-32 |
| D-30 | Report metric definitions: utilisation by hour = average occupied ÷ capacity per hour of day; peak hours = top 3 hours of day by number of entries; revenue = sum of confirmed payments grouped by payment date; no-show rate = NO_SHOW ÷ (all reservations − CANCELLED) | FR-29 |
| D-31 | "Viewing full plates" log entry = Staff/Manager **opening a single session or vehicle detail view**. List views show full plates to Staff/Manager without logging | D-23 |
| D-32 | System **auto-generates a simulated RFID code** for every vehicle; shown to the Customer next to the QR and to Staff | FR-11 |
| D-33 | Plate is **unique system-wide**. Customer registering a plate that exists as an unlinked Guest vehicle **claims** it (owner's group applies from the next session). Plate owned by another Customer → error | FR-06 |
| D-34 | Reservation fulfilment: entry of the reserved vehicle into the **reserved zone at any time before hold-until** (early allowed) → FULFILLED. Entry into a **different zone** → treated as walk-in against that zone's capacity, and the reservation is **auto-cancelled** | FR-24 |
| D-35 | Sign-up fields: email, password, name, user group. `[CIL Q6]` only states self-registration without SSO; no fields are specified there | FR-01 |
| D-36 | An unknown plate at entry creates an unlinked vehicle charged the Guest rate | FR-12 |
| D-37 | QR is shown as an image **plus its text value** so it can be copied (follows D-25) | FR-06 |
| D-38 | Language toggle is available on **every page** | FR-05 |
| D-39 | A Customer sees **own vehicles' plates in full**; other plates masked per D-13 | Section 4 |
| D-40 | Seed accounts: **at least 15 Customers, 2 Staff, 2 Managers** | Section 7.1 |
| D-41 | A CANCELLED reservation records why: **by the Customer** or **vehicle entered another zone** (with that zone). The Customer's reservation list shows the reason. Added after demo testing 2026-11-08 | FR-22, FR-24 |

### 2.1 Basis of each decision

| Label | Meaning |
|---|---|
| **[DOC]** | Decision applies a cited document, or settles a conflict between cited documents |
| **[DOC+TEAM]** | A document sets the requirement; the team chose the detail the document leaves open |
| **[TEAM]** | Team's own decision; **no document covers it** |

"R3" = needs client confirmation; see the Round 3 question in section 10. Only client-facing business rules go to the client. Technical and demo-setup choices stay team-owned, as the client allows the team to choose the technology `[CIL Q12]`.

| Decision | Basis | R3 |
|---|---|---|
| D-01 scope | [DOC] `[M1 §1.4.1]` | — |
| D-02 stack | [DOC+TEAM] no mandated stack `[CIL Q12]` | — |
| D-03 per-entry fee | [DOC] `[M1 §1.4.1, §1.4.2]` | — |
| D-04 no operating hours | [DOC] `[M1 §1.4.2]` | — |
| D-05 staff screen + simulator | [DOC] `[M1 AS1]` `[M2 PD-P05 §4]` | — |
| D-06 staff confirms payment at exit | [DOC+TEAM] simulated payment `[CIL Q5]`; who confirms = team | R3-Q9 |
| D-07 reservation by zone + type | [DOC+TEAM] `[M2 ENT-10]` "lot or zone"; zone chosen by team | R3-Q3 |
| D-08 5 exceptions | [DOC] `[M1 O4]` `[CIL Q21]` | — |
| D-09 lost card handling | [TEAM] | R3-Q5 |
| D-10 self-declared group, Guest rate | [DOC+TEAM] group pricing `[CIL Q16]`; how group is set = team | R3-Q2 |
| D-11 VI/EN toggle | [TEAM] draft Q45 never answered | R3-Q8 |
| D-12 multiple vehicles | [TEAM] draft Q38 never answered | R3-Q1 |
| D-13 mask format | [DOC+TEAM] masking `[M1 CN4]`; format = team | — |
| D-14 SSE | [DOC+TEAM] near-real-time `[M1 O1]`; mechanism = team | — |
| D-15 manual purge | [DOC+TEAM] 12-month retention `[CIL Q18]`; mechanism = team | R3-Q6 |
| D-16 local demo + tests | [TEAM] | — |
| D-17 zone split | [DOC+TEAM] totals `[CIL Q24]`; split = team | — |
| D-18 seed prices | [TEAM] (configurable `[CIL Q16]`) | — |
| D-19 same-day booking | [TEAM] | R3-Q3 |
| D-20 report date range | [DOC+TEAM] 4 metrics `[CIL Q20]`; range = team | — |
| D-21 pending reservations reduce free count | [DOC+TEAM] within general capacity `[CIL Q15]`; counting rule = team | R3-Q3 |
| D-22 simulator actions | [DOC+TEAM] `[M1 AS1, O2]`; actions = team | — |
| D-23 access-log scope | [DOC+TEAM] logging `[M1 CN4]`; scope = team | — |
| D-24 account management | [DOC+TEAM] `[M1 §1.2.3]`; actions = team | — |
| D-25 QR typed/pasted | [TEAM] | — |
| D-26 staff types observed plate | [DOC+TEAM] EX-02 `[M2 PD-P05 §7 #3]`; input = team | — |
| D-27 suspended-lot behaviour | [DOC+TEAM] entry rejection `[M2 PD-P05 §7 #9]`; rest = team | R3-Q4 |
| D-28 simulator EX-02/03 setup | [TEAM] | — |
| D-29 purge masks plate snapshot | [DOC+TEAM] "delete after 12 months" `[CIL Q18]`; what is deleted = team | R3-Q6 |
| D-30 metric formulas | [DOC+TEAM] metric names `[CIL Q20]`; formulas = team | R3-Q7 |
| D-31 plate-view logging trigger | [TEAM] | — |
| D-32 auto RFID code | [DOC+TEAM] RFID allowed as simulated `[CIL Q2]`; generation = team | — |
| D-33 plate unique, Guest claim | [TEAM] | R3-Q1 |
| D-34 reservation fulfilment rules | [TEAM] | R3-Q3 |
| D-35 sign-up fields | [DOC+TEAM] self-registration `[CIL Q6]`; fields = team | — |
| D-36 unknown plate → Guest vehicle | [TEAM] | R3-Q2 |
| D-37 QR text value shown | [TEAM] | — |
| D-38 toggle on every page | [TEAM] | — |
| D-39 customer sees own plates | [DOC+TEAM] masking `[M1 CN4]`; own-plate rule = team | — |
| D-40 seed accounts 15/2/2 | [TEAM] | — |
| D-41 cancel reason shown to Customer | [TEAM] | — |

---

## 3. Goals, non-goals, constraints

### 3.1 Goals
All in-scope items of `[M1 §1.4.1]`, as refined by section 2.

### 3.2 Non-goals (out of scope) `[M1 §1.4.2]`
- Real payment gateway `[CIL Q5]`
- Real hardware (cameras, RFID readers, barriers) `[CIL Q2]`
- University SSO `[CIL Q6]`
- Real multi-lot rollout (one pilot lot; data model must support many) `[CIL Q3]`
- Native mobile apps `[CIL Q12]`
- Lot operating hours `[D-04]`
- Hourly fees, monthly passes `[D-03]`
- Per-slot tracking (availability is counted per zone from entry/exit events) `[CIL Q17]`
- Separate admin role (admin functions belong to Manager) `[CIL Q25]`
- Online deployment `[D-16]`

### 3.3 Constraints
- Responsive web, works on desktop and phone `[CIL Q12]` `[M1 §1.2.3]`
- Passwords hashed, RBAC, plates partially masked for unauthorised roles, access logging `[M1 CN4]`
- Free / open-source tools only `[M1 CN5]`
- Fixed academic deadline; demo must be ready today `[M1 CN1]`
- Evaluation uses simulated data and estimated baselines `[CIL Q26]` `[M1 AS7]`

---

## 4. Roles and permissions

Three roles: **Customer**, **Staff**, **Manager**. `[CIL Q7]` `[CIL Q25]` `[M1 AS5]`

| Capability | Customer | Staff | Manager | Source |
|---|---|---|---|---|
| Self sign-up | ✔ (as Customer) | — | — | `[CIL Q6]` `[M1 §1.4.1]` |
| Login / logout | ✔ | ✔ | ✔ | `[M1 §1.4.1]` |
| Manage own vehicles + view QR | ✔ | — | — | `[D-12]` |
| View availability | ✔ | ✔ | ✔ | `[M1 §1.2.3]` |
| Create / cancel own reservation | ✔ | — | — | `[M1 §1.4.1]` |
| View own sessions and payment history | ✔ | — | — | `[M1 §1.4.1]` |
| Record entry / exit, handle exceptions, confirm payment | — | ✔ | ✔ | `[M2 PD-P05 §6]` `[D-06]` |
| See full plates | own vehicles only | ✔ | ✔ | `[M2 PD-P05 §6]` `[D-13]` |
| Manage lots, zones, capacities, status, tariffs | — | — | ✔ | `[M1 §1.4.1]` |
| Manage accounts | — | — | ✔ | `[D-24]` |
| Reports dashboard | — | — | ✔ | `[M1 §1.4.1]` |
| Access log, data purge | — | — | ✔ | `[D-23]` `[D-15]` |
| Simulator | — | — | ✔ | `[D-22]` |

Customers attempting Staff/Manager actions are refused. `[M2 PD-P05 §7 #6]`

---

## 5. Functional requirements

IDs follow the `FR-xx` / `EX-xx` scheme of `[M2 PD-P02]` (ID format paragraph). Priority per `[M1 §1.4.1]`.

### 5.1 Platform / auth (P07) — Must
- **FR-01** Sign-up with email, password, name, user group (Student | Lecturer/Staff). `[CIL Q6]` `[D-10]`
- **FR-02** Login / logout; passwords hashed. `[M1 CN4]`
- **FR-03** RBAC per section 4 on both UI routes and API. `[M1 CN4]`
- **FR-04** Locked accounts cannot log in. `[D-24]`
- **FR-05** VI/EN language toggle on every page. `[D-11]`

### 5.2 Vehicles — supports entry/exit and reservations
- **FR-06** Customer adds/removes vehicles: plate, vehicle type (motorbike | car). Each vehicle has a unique QR code value (displayed as a QR image plus its text value) and an auto-generated simulated RFID code. `[D-12]` `[D-32]` `[M2 ENT-07]`
- **FR-06a** Plates are unique system-wide. Registering a plate that exists as an unlinked Guest vehicle links it to the Customer (owner's group applies from the next session); a plate owned by another Customer is rejected with an error. `[D-33]`

### 5.3 Lot information management (P08) — Must
- **FR-07** Manager creates/edits lots: name, address, status (active | suspended). `[CIL Q14]` `[M1 §1.4.1]`
- **FR-08** Manager creates/edits zones within a lot and capacity per vehicle type per zone. `[CIL Q8]` `[CIL Q14]` `[M2 ENT-04, ENT-06]`
- **FR-09** Manager edits tariff: price per entry for each (vehicle type × user group), user groups = Student, Lecturer/Staff, Guest. `[CIL Q16]` `[D-03]` `[D-10]`
- **FR-10** Data model supports multiple lots; demo seeds one pilot lot. `[CIL Q3]` `[D-17]`

### 5.4 Entry / exit management (P05) — Must
- **FR-11** Staff entry screen: identify vehicle by plate text, or vehicle QR code value (typed/pasted, no camera), or simulated RFID code; choose vehicle type and zone; record entry in at most 3 operations. `[M2 PD-P05 §4 part 1, §7 #5]` `[CIL Q2]` `[D-25]` `[D-32]`
- **FR-12** If the plate is unknown, a vehicle record is created on entry (not linked to an account → Guest rate). `[D-10]` `[M2 ENT-07]`
- **FR-13** Each session stores: entry time, exit time, plate snapshot (copied at entry, `[D-29]`), vehicle type, zone, identification method, staff member, status. `[M2 PD-P05 §4 part 6, §7 #7]` `[M2 ENT-08]`
- **FR-14** Staff exit screen: find open session (by plate, QR value or RFID code); Staff always types the observed plate, which is compared with the session's plate snapshot (mismatch → EX-02); show fee; confirm simulated payment; close session. Exits are allowed even when the lot is suspended. `[M2 PD-P05 §4 part 2]` `[D-06]` `[D-26]` `[D-27]`
- **FR-15** Entry/exit is a single event API used by staff screens and the simulator. `[M2 PD-P05 §4 part 3]` `[D-05]`
- **FR-16** Each entry/exit completes within 2 seconds at pilot data size. `[M2 PD-P05 §7 #10]`

### 5.5 Availability tracking (P09) — Must
- **FR-17** Free count per lot × zone × vehicle type = capacity − open sessions − pending reservations. `[CIL Q17]` `[D-21]` `[M2 PD-P05 §7 #1]`
- **FR-18** Count is correct after every event, including near-simultaneous events. `[M2 PD-P05 §7 #1]`
- **FR-19** Availability views update live via SSE on every entry, exit, reservation create/cancel/expire, capacity or status change. `[D-14]` `[M1 O1]`
- **FR-19a** A suspended lot shows a "Suspended" badge with its normal counts. `[D-27]`

### 5.6 Reservations (P06) — Should
- **FR-20** Customer reserves: one of own vehicles, zone, vehicle type (from the vehicle), arrival time today. `[D-07]` `[D-19]`
- **FR-21** Reservation rejected if the zone has no free spot for that vehicle type, or if the lot is suspended (existing pending reservations are kept during suspension). `[D-21]` `[D-27]`
- **FR-22** Customer may cancel before the arrival time. `[CIL Q15]`
- **FR-23** Hold lasts until arrival time + 30 minutes; after that the reservation auto-cancels with status NO_SHOW and the spot is released. `[CIL Q15]` `[M1 O3]`
- **FR-24** Entry of the reserved vehicle into the reserved zone at any time before hold-until (early entry allowed) marks the reservation FULFILLED and uses the reserved spot. Entry of that vehicle into a different zone is a walk-in against that zone's capacity and auto-cancels the reservation. `[D-07]` `[D-34]`
- **FR-25** Reserved spots count against general zone capacity. `[CIL Q15]`

### 5.7 Simulated payment (P10) — Should
- **FR-26** Fee per session = tariff for (vehicle type, owner's user group, or Guest if no owner). `[D-03]` `[D-10]`
- **FR-27** At exit Staff confirms simulated payment; a payment record (amount, status, time) is stored. `[D-06]` `[M2 ENT-12]`
- **FR-28** Customer sees own transaction history; Manager sees all. `[M1 §1.4.1]`

### 5.8 Reports (P11) — Could
- **FR-29** Manager dashboard with 4 metrics over a chosen date range (default today): utilisation rate by hour, peak hours, revenue, no-show rate. `[CIL Q20]` `[M1 §1.4.1]` `[D-20]`
  - Utilisation by hour = average occupied ÷ capacity, per hour of day.
  - Peak hours = top 3 hours of day by number of entries.
  - Revenue = sum of confirmed payments, grouped by payment date.
  - No-show rate = NO_SHOW ÷ (all reservations − CANCELLED). `[D-30]`

### 5.9 Data protection — Must
- **FR-30** Plates masked (`D-13` format) for any viewer without the right to see full plates (section 4). `[M1 CN4]`
- **FR-31** Access log per `D-23`: account, action, target, time; Manager can view it. "Viewing full plates" is logged when Staff/Manager open a single session or vehicle detail view; list views are not logged. `[M2 ENT-13]` `[D-31]`
- **FR-32** Manager "purge" action: replaces the plate snapshot on sessions older than 12 months with `[purged]` and deletes unlinked Guest vehicles that have no newer session; the purge itself is logged. `[CIL Q18]` `[D-15]` `[D-29]`

### 5.10 Simulator (P04) — supports O1/O2 demo
- **FR-33** Manager simulator page with three actions: `[D-22]`
  1. Fire N random entry/exit events now through the FR-15 API.
  2. Trigger each of the 5 exceptions (section 6) on demand. EX-01, EX-04, EX-05: fire the rejected entry directly. EX-02, EX-03: set up an open session ready for the situation; Staff resolves it live on the exit screen. `[D-28]`
  3. Generate the past N days of sessions, reservations (incl. no-shows) and payments so reports have data, plus some sessions ~13 months old so purge removes visible rows. `[D-29]`
- **FR-34** Simulator supports a run of ≥100 sessions with every session fully recorded. `[M1 O2]`

---

## 6. Exceptions `[M1 O4]` `[D-08]`

| ID | Situation | Expected system response | Source |
|---|---|---|---|
| EX-01 | Zone full for that vehicle type | Entry rejected with clear message | `[M2 PD-P05 §7 #2]` |
| EX-02 | Plate typed by Staff at exit does not match the session's plate snapshot | Warning; Staff must confirm manually before closing; confirmation logged as session event | `[M2 PD-P05 §7 #3]` `[M2 ENT-09]` `[D-26]` |
| EX-03 | Lost QR/card | Staff looks up open session by plate, confirms manually; `LOST_CARD` session event logged; normal exit and payment | `[D-09]` |
| EX-04 | Vehicle already has an open session | Second entry rejected | `[M2 PD-P05 §7 #4]` |
| EX-05 | Lot suspended | Entry rejected with clear message; exits still allowed; new reservations rejected; pending reservations kept; "Suspended" badge on availability | `[M2 PD-P05 §7 #9]` `[D-27]` |

---

## 7. Data model (entities) `[M2 PD-P03 Table 4.1]` adjusted by decisions

| Entity | Content | Notes |
|---|---|---|
| users | email, password hash, name, role, user group, locked flag | `[M2 ENT-01, ENT-02]` `[D-10]` `[D-24]` |
| parking_lots | name, address, status | operating hours removed `[D-04]` |
| zones | lot, name | `[M2 ENT-04]` |
| vehicle_types | motorbike, car | `[M2 ENT-05]` |
| zone_capacities | zone × vehicle type → capacity | `[M2 ENT-06]` |
| vehicles | plate (unique), QR code value (unique), RFID code (unique, auto-generated), vehicle type, owner (optional) | `[M2 ENT-07]` `[D-12]` `[D-32]` `[D-33]` |
| parking_sessions | vehicle, plate snapshot, zone, entry/exit time, identification method, staff, status, reservation (optional) | `[M2 ENT-08]` `[D-29]` |
| session_events | session, type (exception / manual confirmation), staff, time, note | `[M2 ENT-09]` |
| reservations | customer, vehicle, zone, vehicle type, arrival time, hold-until, status (PENDING / CANCELLED / NO_SHOW / FULFILLED) | `[M2 ENT-10]` `[CIL Q15]` |
| tariffs | vehicle type × user group (Student, Lecturer/Staff, Guest) → price per entry | `[M2 ENT-11]` `[D-03]` `[D-10]` |
| payments | session, amount, status, time, confirmed by | `[M2 ENT-12]` |
| access_logs | user, action, target, time | `[M2 ENT-13]` |

`parking_slots` (ENT-14) is **not** created: availability is counted per zone. `[CIL Q17]`

Naming: English snake_case tables/columns, primary key `id`, foreign keys `<singular_table>_id`. `[M2 PD-P03 §5]` (Prisma model names may differ; mapping to these table names is `[BUILDER]`.)

### 7.1 Seed data
- One pilot lot, active; zones A (150 motorbike), B (150 motorbike), C (30 car). `[D-17]`
- Tariff: motorbike 2,000 VND, car 10,000 VND for all three groups. `[D-18]`
- Demo accounts: at least 15 Customers, 2 Staff, 2 Managers. `[D-40]` (credentials `[BUILDER]`, printed in README)

---

## 8. Tech stack and quality `[D-02]` `[D-16]`

- Next.js App Router + TypeScript, single app (UI + API route handlers).
- Prisma ORM + SQLite file database; migrations and seed script in repo.
- Tailwind CSS + shadcn/ui, responsive layouts. `[CIL Q12]`
- SSE endpoint for live availability. `[D-14]`
- Run locally: install, migrate, seed, `npm run dev`. `[D-16]`

Automated tests (core): `[D-16]`
- Fee calculation per vehicle type × group incl. Guest (FR-26) `[M1 O4]`
- Availability formula incl. reservations and concurrent events (FR-17/18) `[M2 PD-P05 §7 #1]`
- Each of EX-01..EX-05 `[M1 O4]`
- RBAC: Customer refused on Staff/Manager actions (FR-03) `[M2 PD-P05 §7 #6]`
- Reservation expiry → NO_SHOW and spot release (FR-23) `[M1 O3]`

Additional tests for decisions D-26..D-34: plate mismatch on exit, suspended-lot exit allowed / reservation rejected, purge masking, plate uniqueness / Guest claim, reservation fulfilment vs different-zone cancel.

`[BUILDER]`: auth library, i18n library, test runner, QR image library, chart library, folder structure, how reservation expiry is triggered (must be effective before any availability read and before reports), SSE implementation details.

---

## 9. Demo workflows (end-to-end) `[ASG Task 3.1]` `[CIL Q11]`

1. Customer signs up (choosing group), adds a motorbike, sees its QR, views live availability.
2. Customer reserves Zone A motorbike for later today → free count drops live.
3. Staff checks in the reserved vehicle by QR → reservation FULFILLED, session opens.
4. Staff checks in a walk-in car by plate (Guest) in Zone C.
5. Staff checks out the motorbike → fee shown → confirms simulated payment → Customer sees history.
6. Each exception EX-01..EX-05 demonstrated (via Staff screens or simulator triggers).
7. Manager edits tariff and capacity, suspends lot (→ EX-05), reactivates.
8. Manager runs simulator (≥100 sessions + history), opens reports with date range.
9. Manager views access log, runs purge.
10. Language toggle VI ↔ EN.

### 9.1 Traceability (summary)

| Objective | Product `[M2 PBS]` | Requirements | Tests |
|---|---|---|---|
| O1 | P09, P04 | FR-17..19, FR-33 | availability tests |
| O2 | P05, P04 | FR-11..16, FR-34 | simulator run ≥100 |
| O3 | P06, P11 | FR-20..25, FR-29 | expiry test, report demo |
| O4 | P05, P10 | FR-26..28, EX-01..05 | fee + exception tests |
| O5 | all | all | this table |
| CN4 | P07 | FR-01..05, FR-30..32 | RBAC test |

---

## 10. Pending client confirmation — Round 3

The MVP is built on the decisions in section 2. The questions below ask the client to confirm the [TEAM] / [DOC+TEAM] business rules marked "R3". They follow the round 2 format: state the team's assumption and ask for confirmation. The client asked for questions to be batched and sent by email `[CIL Q13]` `[CIL Q19]`.

If the client answers differently after the baseline, the change goes through the Change Log as a CR with impact analysis `[ASG Task 3.6, 3.7]`. Schema changes are made with a new migration, never by editing an old one `[M2 PD-P03 §6]`.

**Impact levels used below**
- **Low**: only logic, validation or UI changes; no schema change.
- **Medium**: schema change or a new screen; one module affected.
- **High**: changes a core workflow (entry/exit, availability) across several modules, the simulator and tests.

### 10.1 Questions (priority order, ready to email)

| ID | Question (VI) | Team assumption | Decisions | Follow-up of |
|---|---|---|---|---|
| R3-Q1 | Một tài khoản có được đăng ký nhiều xe không, có giới hạn số xe không? Biển số có là duy nhất trong hệ thống không? Khi người dùng đăng ký một biển số đã từng gửi xe dưới dạng khách vãng lai, xe đó có được gán cho tài khoản không? | Nhiều xe, không giới hạn; biển số duy nhất; xe vãng lai được gán cho tài khoản đăng ký; biển số đã thuộc tài khoản khác thì báo lỗi | D-12, D-33 | draft Q38 |
| R3-Q2 | Nhóm người dùng (sinh viên / giảng viên-nhân viên) được xác định thế nào? Xe không gắn với tài khoản nào (khách vãng lai) được tính phí theo mức nào? | Người dùng tự chọn nhóm khi đăng ký; xe vãng lai tính theo mức "Khách" riêng | D-10, D-36 | Q16 |
| R3-Q3 | Đặt chỗ: chỗ đã đặt có bị trừ khỏi số chỗ trống ngay khi đặt không, và xe vãng lai có bị từ chối nếu chiếm vào chỗ đã đặt không? Được đặt trước tối đa bao lâu? Nếu xe đến sớm hơn giờ hẹn, hoặc vào khu vực khác với khu vực đã đặt, thì xử lý thế nào? | Trừ ngay, từ chối xe vãng lai chiếm chỗ đã đặt; chỉ đặt trong ngày; đến sớm vẫn được tính là đã đến; vào khu vực khác thì hủy đặt chỗ và tính như xe vãng lai | D-07, D-19, D-21, D-34 | Q15 |
| R3-Q4 | Khi bãi tạm ngưng hoạt động: xe đang gửi có được ra không? Đặt chỗ mới và đặt chỗ đang chờ xử lý thế nào? | Cho xe ra; từ chối đặt chỗ mới; giữ các đặt chỗ đang chờ | D-27 | Q14 |
| R3-Q5 | Khi người gửi xe mất mã QR/thẻ, quy trình xử lý là gì? Có thu phí phạt không? | Nhân viên tra cứu lượt gửi theo biển số, xác nhận thủ công, ghi nhật ký; không thu phí phạt | D-09 | Q21 |
| R3-Q6 | "Sau 12 tháng thì xóa" nghĩa là xóa biển số khỏi lượt gửi (giữ lại số liệu thống kê) hay xóa toàn bộ lượt gửi? Xóa thủ công bởi quản lý hay tự động? | Che/xóa biển số trên lượt gửi cũ, giữ số liệu; quản lý bấm xóa thủ công | D-15, D-29 | Q18 |
| R3-Q7 | Cách tính 4 chỉ số báo cáo nhóm đề xuất như sau, thầy có đồng ý không: tỷ lệ sử dụng theo giờ = số chỗ đang dùng trung bình ÷ sức chứa; giờ cao điểm = 3 khung giờ có nhiều lượt vào nhất; doanh thu = tổng thanh toán đã xác nhận theo ngày; tỷ lệ không đến = số không đến ÷ (tổng đặt chỗ − số đã hủy) | Như câu hỏi | D-30 | Q20 |
| R3-Q8 | Giao diện cần tiếng Việt, tiếng Anh hay cả hai? | Cả hai, có nút chuyển ngôn ngữ | D-11 | draft Q45 |
| R3-Q9 | Thanh toán mô phỏng do nhân viên xác nhận khi xe ra, hay người gửi xe tự thanh toán trên ứng dụng? | Nhân viên xác nhận khi xe ra | D-06 | Q5 |

### 10.2 Regression impact if the client decides differently

| Q | Alternative answer | Affected spec items | Affected code / data / tests | Level |
|---|---|---|---|---|
| R3-Q1 | One vehicle per account, or a limit N | FR-06 | Vehicle add validation, Customer vehicle UI, seed data, 1 test | Low |
| R3-Q1 | Plates **not** unique (one plate shared by several accounts) | FR-06a, FR-12, FR-26, D-33 | `vehicles` uniqueness removed, vehicle↔owner becomes many-to-many; entry by plate must choose owner (fee group unclear); fee logic, entry screen, simulator, fee/entry tests | High |
| R3-Q1 | Guest plate must **not** be claimed automatically (Manager approval) | FR-06a | New pending-claim state + Manager approval screen + access-log entry; tests | Medium |
| R3-Q2 | Group verified/assigned by Manager | FR-01, D-10, D-24 | `users` gets verification status; Manager account screen gets group edit; sign-up form changes; fee tests | Medium |
| R3-Q2 | Unlinked vehicles charged Student rate (no Guest group) | FR-09, FR-26, D-36 | Guest column removed from `tariffs`; tariff screen; fee tests; seed | Low |
| R3-Q2 | Unregistered vehicles not allowed | FR-12, EX list | Entry rejects unknown plates → new exception beyond the agreed 5 (`[M1 O4]` list changes); simulator, entry screen, tests, traceability | High |
| R3-Q3 | Reservations do **not** hold a spot | FR-17, FR-21, FR-25, D-21 | Availability formula, reservation check, SSE triggers, availability tests | Low |
| R3-Q3 | Longer booking window (e.g. multi-day) | FR-20, D-19 | Date validation, reservation form, expiry test data, simulator history | Low |
| R3-Q3 | Early arrival not allowed / different zone keeps reservation | FR-24, D-34 | Fulfilment logic in entry handler, tests | Low |
| R3-Q3 | Reservation at lot level instead of zone | FR-20, FR-24, D-07 | `reservations` zone→lot (migration), availability per lot, reservation form, tests | Medium |
| R3-Q4 | Pending reservations cancelled on suspension | FR-21, D-27 | Status-change handler cancels reservations; SSE event; test | Low |
| R3-Q4 | Exits blocked while suspended | FR-14, EX-05 | Exit handler check, message, test (vehicles could get stuck; demo step 7 changes) | Low |
| R3-Q5 | Lost-card penalty fee | FR-09, FR-26, FR-27, EX-03 | `tariffs` (or settings) gets penalty amount; payment amount = fee + penalty; tariff screen; fee + EX-03 tests | Medium |
| R3-Q6 | Delete whole sessions after 12 months | FR-32, D-29 | Purge cascades to `session_events`, `payments`; reports lose data older than 12 months; purge test; simulator history | Medium |
| R3-Q6 | Automatic purge instead of Manager action | FR-32, D-15 | Scheduled/startup job + access-log entry as system; test | Low |
| R3-Q7 | Different metric formulas | FR-29, D-30 | Report queries, maybe simulator history data; report tests/demo | Low |
| R3-Q8 | Vietnamese only or English only | FR-05, D-11, D-38 | Remove toggle and second language (less work) | Low |
| R3-Q9 | Customer pays in the app | FR-14, FR-27, D-06 | New Customer payment screen, "unpaid" session/payment state, exit flow no longer waits for payment, payment tests, demo step 5 | Medium |

Most expensive if the answer differs: **R3-Q1 (shared plates)** and **R3-Q2 (no unregistered vehicles)**. Both are High because they change the core entry/exit workflow, which the client asked to protect first `[CIL Q22]`. These two should go first in the email.
