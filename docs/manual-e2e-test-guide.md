# Smart Parking MVP — Run, Walkthrough & Manual E2E Test Guide

- **Applies to:** branch `feat/smart-parking-mvp` (PR #1)
- **Spec under test:** [`docs/superpowers/specs/2026-11-08-smart-parking-mvp-design.md`](superpowers/specs/2026-11-08-smart-parking-mvp-design.md)
- **Purpose:** start the app, walk through the demo flows (spec §9), and run manual end-to-end tests to check that the running app matches every functional requirement (FR-xx) and exception (EX-xx) in the spec.

How to use this document:

1. Do **Part A** once to install and start everything.
2. Do **Part B** for a 15-minute guided walkthrough. This is the demo script.
3. Do **Part C** to run the full test cases, and record **Pass / Fail / Blocked** in the *Result* column of each table.
4. Use **Part D** (traceability) to confirm every requirement has at least one passed test.
5. Read **Part E** (known limitations) before you report a failure.

---

## Part A — Run all instances

### A.1 Prerequisites

| Item | Version / note |
|---|---|
| Node.js | ≥ 20 (`node -v`) |
| npm | bundled with Node |
| Browsers | Chrome (or any Chromium) + one second browser **or** Chrome profiles. Three roles need three separate sessions (see A.4). |
| Ports | 3000 free |

### A.2 First-time setup

From the repository root (or the worktree `.worktrees/2026-11-08-smart-parking-mvp`):

```bash
npm install
cp .env.example .env
```

Edit `.env` and set `AUTH_SECRET` to any random string of **32 characters or more**. The app refuses to start pages without it.

```bash
# Example: generate a secret
openssl rand -base64 48
```

Create the database and load the demo data:

```bash
npx prisma migrate reset --force   # wipes prisma/dev.db, applies all migrations, runs prisma/seed.ts
```

> **Warning:** `migrate reset` **deletes all data** in `prisma/dev.db`. Use it to return to a clean demo state, never on data you need to keep.
> To upgrade an existing database **without** losing data, use `npx prisma migrate deploy` instead.

### A.3 Start the app

Choose one mode:

| Mode | Commands | Use when |
|---|---|---|
| Development | `npm run dev` | Day-to-day work. Pages compile on first visit, so the first click on each page is slow. |
| Production (recommended for the demo and for E2E testing) | `npm run build && npm start` | Demo and testing. It is faster, and hot reload cannot interfere with form submissions. |

The app runs at **http://localhost:3000**.

Automated checks (optional, run before testing):

```bash
npm test        # 21 files, 137 tests — resets prisma/test.db only, never dev.db
npm run lint
npm run build
```

### A.4 Open one session per role

The login is stored in one cookie per host. Two tabs in the same browser therefore share a login. Use three separate sessions:

| Role | Suggested window | URL |
|---|---|---|
| Customer | Browser 1, normal window | `http://localhost:3000` |
| Staff | Browser 1, **private/incognito** window | `http://localhost:3000` |
| Manager | Browser 2 (or a second Chrome profile) | `http://127.0.0.1:3000` |

Tip: `localhost` and `127.0.0.1` count as different hosts, so they keep separate cookies.

Arrange the Customer and Staff windows side by side. Several tests check that numbers update **live** without a page reload.

### A.5 Demo accounts (from the seed)

All passwords: **`password123`**

| Role | Accounts | Notes |
|---|---|---|
| Manager | `manager1@demo.local`, `manager2@demo.local` | |
| Staff | `staff1@demo.local`, `staff2@demo.local` | |
| Customer | `customer01@demo.local` … `customer15@demo.local` | Each has **one motorbike**. Odd numbers are **Student**, even numbers are **Lecturer / Staff**. `customer01` owns plate `29A-01001`. |

### A.6 Seeded reference data

| Data | Value | Spec |
|---|---|---|
| Lot | "Bãi xe thí điểm", address "Cơ sở chính", **Active** | FR-10, §7.1 |
| Zone A | 150 motorbike | D-17 |
| Zone B | 150 motorbike | D-17 |
| Zone C | 30 car | D-17 |
| Tariff | Motorbike **2,000 ₫**, Car **10,000 ₫** per entry, same for Student / Lecturer-Staff / Guest | D-18 |
| Hold time | Arrival time + **30 min**; then the reservation becomes **No-show** | FR-23 |
| Expiry timer | The server checks for expired holds every 30 s, and also on every availability read and report | FR-23 |

### A.7 Language

The default UI language is **Vietnamese**. Every page has a VI/EN toggle in the header. Test steps below use the **English** labels, so switch to EN first, or use this mapping:

| EN | VI |
|---|---|
| Record entry | Ghi nhận xe vào |
| Preview fee | Xem phí |
| Confirm simulated payment & close | Xác nhận thanh toán mô phỏng & đóng |
| Reserve | Đặt chỗ |
| Save | Lưu |

### A.8 Navigating the app

After login, the header shows the role's home link plus **every page of that role**. On a narrow screen (< 768 px) these links are behind the **Menu** button. Each home page repeats the same links under its title.

| Role | Header links (EN label → URL) |
|---|---|
| Customer | **Customer** `/customer` · **My vehicles** `/customer/vehicles` · **My reservations** `/customer/reservations` · **Parking history** `/customer/history` |
| Staff | **Staff** `/staff` · **Vehicle entry** `/staff/entry` · **Vehicle exit** `/staff/exit` · **Open parking sessions** `/staff/sessions` |
| Manager | **Manager** `/manager` · **Staff** `/staff` (staff screens) · **Parking lots** · **Tariffs** · **Account management** · **Payments** · **Reports** · **Simulator** · **Access log** (all under `/manager/...`) |

Wherever a step below says *Header → X* (or just names a page such as **My reservations**), click that link. Typing the URL works too.

### A.9 Reset between test runs

Some tests change data permanently:

- **EX-01 via simulator** fills a whole zone.
- **Purge** masks old plates.
- **Simulator history** adds a lot of rows.

Stop the server and run `npx prisma migrate reset --force`, then restart, whenever you need a clean state.

---

## Part B — Guided walkthrough (spec §9 demo script)

Total about 15 minutes. Windows: **C** = Customer, **S** = Staff, **M** = Manager.

| # | Window | Action | What you should see |
|---|---|---|---|
| 1 | C | Open `/register`. Sign up with a new email, a name, a password, and group **Student**. | You are taken to the Customer home with live availability: A 150 / B 150 motorbike, C 30 car. |
| 2 | C | Header → **My vehicles**. Add plate `59X1-123.45`, type **Motorbike**. | A vehicle card appears with a **QR image**, its **QR text value** (`QR-…`) and an **RFID code** (`RF-…`). Copy the QR text value. |
| 3 | S | Log in as `staff1@demo.local`. Keep the Staff home (availability) open. | Zone A motorbike shows **150** free. |
| 4 | C | Header → **My reservations**. Choose the vehicle, **Zone A**, and an arrival time later today. Click **Reserve**. | The reservation is listed as **Pending**, with *Hold until* = arrival + 30 min. **In window S, Zone A drops to 149 without a reload.** |
| 5 | S | **Vehicle entry**. Method **QR**, paste the QR value, Zone **A**. Click **Record entry**. | "Vehicle entry recorded". In window C, after a refresh, the reservation status is **Fulfilled**. Zone A stays at 149 (the reserved spot is now used by the session). |
| 6 | S | **Vehicle entry**. Method **Plate**, plate `30K-999.99`, vehicle type **Car**, Zone **C**. Click **Record entry**. | Entry is recorded. Zone C drops 30 → 29. The car is unknown, so it is charged as **Guest**. |
| 7 | S | **Vehicle exit**. Method **QR**, paste the motorbike's QR value, observed plate `59X1-123.45`. Click **Preview fee**. | The fee is **2,000 ₫**, fee group **Student**, with zone and entry time. |
| 8 | S | Click **Confirm simulated payment & close**. | "Vehicle exit recorded and fee collected". Zone A goes back to 150. |
| 9 | C | Header → **Parking history**. | One row with the plate, zone A, entry and exit times, 2,000 ₫, and *Paid at*. |
| 10 | M | Log in as `manager1@demo.local`. **Simulator → Exceptions**: click **EX-04**, then **EX-05**. | Outcomes "Duplicate entry rejected as expected." and "Lot suspended; entry rejected…". |
| 11 | M | **Tariffs**: set Motorbike/Student to `3000` and **Save**. **Parking lots**: set Zone B motorbike capacity to `120` and **Save**. Click **Suspend**, then **Reactivate**. | Changes are saved. In window S, Zone B shows 120 and the **Suspended** badge appears, then disappears, live. |
| 12 | M | **Simulator**: *Number of events* `100` → **Fire N events**. *Number of days* `7` → **Generate history**. | Result counts are shown, e.g. "x entries, y exits, z rejected." and "n sessions, m reservations, k payments." |
| 13 | M | **Reports**: From = 7 days ago, To = today → **Apply**. | Four sections are filled in: Hourly utilisation, Peak hours (top 3), Revenue (total + by date), No-show rate. |
| 14 | M | **Access log**. Click **Purge data older than 12 months** → **Confirm purge**. | "Masked N sessions and deleted M vehicles." (N > 0 after step 12). The log shows **Login**, **Purge** and other entries. |
| 15 | Any | Click the **VI/EN** toggle on several pages. | Every label switches language. Nothing stays untranslated. |

---

## Part C — Manual E2E test cases

Record each result as **P** (pass), **F** (fail, note what you observed) or **B** (blocked). Unless a precondition says otherwise, start from a freshly seeded database (A.9).

### C.1 Authentication and RBAC (FR-01 – FR-05)

| ID | Req | Steps | Expected | Result |
|---|---|---|---|---|
| TC-AUTH-01 | FR-01 | `/register`: fill email, password, full name, group **Lecturer / Staff** → **Register**. | Account is created; you land on `/customer`. | |
| TC-AUTH-02 | FR-01 | Register again with the same email. | Error "Email is already registered". | |
| TC-AUTH-03 | FR-01 | Submit the register form with any field empty. | The form blocks submission, or shows "Invalid data". | |
| TC-AUTH-04 | FR-02 | Log in as `customer01@demo.local` with a wrong password. | "Incorrect email or password". | |
| TC-AUTH-05 | FR-02 | Log in with the correct password, then **Log out**. | Redirected to `/customer` after login. After logout, opening `/customer` redirects to `/login`. | |
| TC-AUTH-06 | FR-03 | As Customer, open `/staff`, `/staff/entry` and `/manager`. | Each redirects away (to `/`). No staff or manager content is shown. | |
| TC-AUTH-07 | FR-03 | As Staff, open `/manager/lots`. As Staff, open `/customer`. | Both are refused (redirect). | |
| TC-AUTH-08 | FR-03 | As Manager, open `/staff/entry`. | Allowed: Managers can do everything Staff can (spec §4). | |
| TC-AUTH-09 | FR-03 (API) | Logged in as Customer, run in the browser DevTools console: `fetch('/api/events/entry',{method:'POST',headers:{'Content-Type':'application/json'},body:'{}'}).then(r=>r.status)` | Returns **403**. | |
| TC-AUTH-10 | FR-03 (API) | Logged out (private window), run `fetch('/api/vehicles').then(r=>r.status)`. | Returns **401**. | |
| TC-AUTH-11 | FR-04 | As Manager → **Account management**: **Lock** `customer02`. Try to log in as `customer02`. Then **Unlock** and log in again. | While locked: "This account is locked". After unlocking, login works. | |
| TC-AUTH-12 | FR-05 | On `/login`, `/register`, every Customer page, every Staff page and every Manager page, toggle VI ↔ EN. | All text switches language. The choice is kept when you navigate to another page. | |
| TC-AUTH-13 | §3.3 responsive | DevTools device toolbar at **375 px** width: visit each page from TC-AUTH-12. | No horizontal page scroll. Navigation is reachable through **Menu**. Wide tables scroll inside their own box. | |
| TC-AUTH-14 | Navigation | Log in as each role in turn and use only header links (no typed URLs). Repeat at 375 px width using **Menu**. | Every page in the A.8 table opens from the header and from the role's home page. Managers can open the staff screens through **Staff**. A Customer header shows no staff or manager links. | |

### C.2 Vehicles (FR-06, FR-06a)

| ID | Req | Steps | Expected | Result |
|---|---|---|---|---|
| TC-VEH-01 | FR-06 | As `customer01` → **My vehicles** → add `51G-555.55`, **Car**. | The new card shows a QR image, a QR text value and an RFID code. `customer01` now has 2 vehicles. | |
| TC-VEH-02 | FR-06 | Compare the QR and RFID codes of both vehicles. | All codes are different. | |
| TC-VEH-03 | FR-06 | **Remove** the car added in TC-VEH-01. | The card disappears. | |
| TC-VEH-04 | FR-06a | As `customer02`, try to add plate `29A-01001` (owned by `customer01`). | Error "License plate is already registered". | |
| TC-VEH-05 | FR-06a | As Staff, enter an unknown plate `60A-777.77` (Plate method, Motorbike, Zone A) and exit it (Part C.4). Then as `customer03`, add plate `60A-777.77`. | The add succeeds: the Guest vehicle is claimed by `customer03`. The vehicle's next session is charged at `customer03`'s group (Student). | |
| TC-VEH-06 | FR-06a | Add the same plate written differently, e.g. ` 29a-01001 ` with spaces and lowercase, as `customer02`. | Rejected as already registered. Plates are normalised (trimmed, upper-cased, spaces removed). | |

### C.3 Lot information management (FR-07 – FR-10)

All as **Manager** → **Parking lots** / **Tariffs**.

| ID | Req | Steps | Expected | Result |
|---|---|---|---|---|
| TC-LOT-01 | FR-07 | Under **Add lot**: Name `Lot 2`, Address `Campus 2` → **Add lot**. | A second lot card appears with status **Active**. | |
| TC-LOT-02 | FR-07 | In the pilot lot card, change **Name** and **Address** → **Save**. Reload the page. | The new name and address are shown and kept after the reload. **Revert** them afterwards. | |
| TC-LOT-03 | FR-07 | Click **Suspend** on the pilot lot, then **Reactivate**. | The status text switches between Suspended and Active. Availability views show and hide the **Suspended** badge live (FR-19a). | |
| TC-LOT-04 | FR-08 | In `Lot 2`: zone name `D`, Motorbike capacity `10` → **Add zone**. | Zone D is listed with capacity 10. Availability views gain a row Lot 2 / D / Motorbike = 10. | |
| TC-LOT-05 | FR-08 | Rename zone `D` to `D1` → **Save**. Reload. | The new name is kept after the reload. | |
| TC-LOT-06 | FR-08 | Set Zone C car capacity to `5` → **Save**. | Availability shows C car free = 5 − open sessions, live. | |
| TC-LOT-07 | FR-08 | Enter capacity `-1`, then `1.5`. | Rejected with "Invalid data". | |
| TC-LOT-08 | FR-09 | **Tariffs**: the grid shows Motorbike/Car × Student / Lecturer-Staff / Guest. Change Car/Guest to `15000` → **Save**. | The value is saved. The next Guest car exit is charged 15,000 ₫ (check in TC-EXIT-03). | |
| TC-LOT-09 | FR-10 | After TC-LOT-04, open the Customer home. | Both lots are listed in availability (the data model supports several lots). A lot only shows once it has a zone with capacity. | |

### C.4 Entry / exit (FR-11 – FR-16)

As **Staff** (`staff1`).

| ID | Req | Steps | Expected | Result |
|---|---|---|---|---|
| TC-ENT-01 | FR-11 | **Vehicle entry**: Method **QR**, paste `customer01`'s QR value (from their **My vehicles** page), Zone **A** → **Record entry**. | "Vehicle entry recorded". It takes at most 3 inputs (method, identifier, zone). The vehicle type comes from the vehicle record. | |
| TC-ENT-02 | FR-11 | Method **RFID** with `customer03`'s RFID code, Zone B. | Recorded. | |
| TC-ENT-03 | FR-11, FR-12 | Method **Plate**, `30K-123.45` (unknown), type **Car**, Zone **C**. | Recorded. A Guest vehicle is created (fee group Guest at exit). | |
| TC-ENT-04 | FR-11 | Method **QR** with an invented code `QR-NOTREAL`. | Error "Unknown code". | |
| TC-ENT-05 | FR-13 | **Open parking sessions** → **View details** on the TC-ENT-01 session. | It shows plate (full), zone, vehicle type, fee group, entry time, status OPEN, and the identification method. The access log gains **View full plate** (FR-31). | |
| TC-EXIT-01 | FR-14 | **Vehicle exit**: Method **QR**, `customer01`'s QR, observed plate `29A-01001` → **Preview fee**. | It shows fee **2,000 ₫**, group **Student**, zone A, entry time and vehicle type. No mismatch warning. | |
| TC-EXIT-02 | FR-14, FR-27 | **Confirm simulated payment & close**. | Success message. The session disappears from **Open parking sessions**. Manager → **Payments** lists 2,000 ₫, *Confirmed by* = `Staff 1`. | |
| TC-EXIT-03 | FR-26 | Exit the Guest car from TC-ENT-03 (Method Plate, `30K-123.45`, observed plate the same). | Fee = the Car/Guest tariff: 10,000 ₫ by default, or 15,000 ₫ if TC-LOT-08 was done first. Group **Guest**. | |
| TC-EXIT-04 | FR-26 | Enter and exit `customer02`'s motorbike (Lecturer/Staff). | Group **Lecturer / Staff**, fee = that tariff (2,000 ₫ default). | |
| TC-EXIT-05 | FR-14 | Exit a vehicle that is not parked (e.g. `customer05`'s QR). | Error "No open session". | |
| TC-EXIT-06 | FR-15 | (Observation) The simulator in C.9 drives the same entry/exit events. | Sessions created by the simulator appear in **Open parking sessions** exactly like manual ones. | |
| TC-EXIT-07 | FR-16 | With DevTools → Network open, record one entry and one exit. | The `POST /api/events/entry` and `/api/events/exit/confirm` requests each take **< 2 s**. | |

### C.5 Availability (FR-17 – FR-19a)

Keep a Customer window and a Staff window side by side on their home pages.

| ID | Req | Steps | Expected | Result |
|---|---|---|---|---|
| TC-AV-01 | FR-17 | Note Zone A motorbike Free = F. Staff records one motorbike entry into A. | Free = F − 1 in **both** windows, without reload. | |
| TC-AV-02 | FR-17, FR-25 | Customer creates a reservation for Zone A. | Free drops by 1 more (pending reservations count against capacity). | |
| TC-AV-03 | FR-19 | Customer cancels that reservation. Staff exits the vehicle from TC-AV-01. | Free returns to F, live. | |
| TC-AV-04 | FR-17 | In DevTools run `fetch('/api/availability').then(r=>r.json()).then(console.log)`. | For each zone and type: `free = max(0, capacity − open − reserved)`. | |
| TC-AV-05 | FR-18 | Manager → Simulator → fire **100** events. Then run TC-AV-04. | The formula still holds for every row. Free is never negative and never above capacity. | |
| TC-AV-06 | FR-19 | Manager changes a zone capacity. | The new capacity and free count appear live in the Customer and Staff windows. | |
| TC-AV-07 | FR-19a | Manager suspends the lot. | A **Suspended** badge appears on the lot in all availability views. Counts are still shown. Reactivate afterwards. | |

### C.6 Reservations (FR-20 – FR-25)

As `customer01` unless stated otherwise. For arrival time use a time **later today**.

| ID | Req | Steps | Expected | Result |
|---|---|---|---|---|
| TC-RES-01 | FR-20 | **My reservations** → choose the vehicle. | The zone list only offers zones that have capacity for the vehicle's type (motorbike → A, B). The vehicle type is taken from the vehicle. | |
| TC-RES-02 | FR-20 | Reserve Zone A, arrival in 1 hour. | Listed as **Pending**. *Hold until* = arrival + 30 min. | |
| TC-RES-03 | FR-20 | Try an arrival time in the past, then one tomorrow. | Both are rejected with "Outside the allowed reservation window". | |
| TC-RES-04 | FR-21 | (Plan rule) Reserve again with the same vehicle while TC-RES-02 is pending. | "Vehicle already has a reservation". | |
| TC-RES-05 | FR-21 | Manager suspends the lot. `customer03` tries to reserve. | "Lot is temporarily suspended". `customer01`'s pending reservation is **still Pending**. Reactivate afterwards. | |
| TC-RES-06 | FR-21, EX-01 | Manager sets Zone C car capacity to `1`. `customer04` adds a car and reserves Zone C. `customer06` adds a car and tries to reserve Zone C. | The second reservation is rejected with "Zone is full". | |
| TC-RES-07 | FR-22 | Cancel the TC-RES-02 reservation before its arrival time. | Status **Cancelled**. The spot is released live. | |
| TC-RES-08 | FR-22 | Try to cancel a reservation whose arrival time has passed, or one that is Fulfilled. | "This reservation cannot be cancelled". | |
| TC-RES-09 | FR-24 | Reserve Zone A, arrival in 2 hours. Staff enters that vehicle **now** by QR into **Zone A**. | Entry is accepted (early arrival is allowed). The reservation becomes **Fulfilled**. Free count does not drop a second time. | |
| TC-RES-10 | FR-24 | Reserve Zone A. Staff enters the vehicle into **Zone B**. | Entry is recorded as a walk-in in B. The reservation becomes **Cancelled**. A's reserved spot is released. | |
| TC-RES-11 | FR-21, FR-25 | Fill Zone C to its capacity using reservations only (capacity 1, one reservation). Staff tries a **walk-in** car into C. | Entry is rejected with "Zone is full" (the walk-in would take the reserved spot, D-21). | |
| TC-RES-12 | FR-23 | Reserve with arrival = now + 2 min. Wait **≥ 33 min** (hold = arrival + 30 min, plus the 30 s timer). | The status becomes **No-show** without any action. The free count goes back up live. *If time is short, mark this B: it is covered by automated tests and by the simulator's history data (no-shows in reports).* | |
| TC-RES-13 | (plan rule) | Staff enters `customer05`'s vehicle. Then `customer05` tries to reserve with it. | "Vehicle is currently parked". | |

### C.7 Payments and history (FR-26 – FR-28)

| ID | Req | Steps | Expected | Result |
|---|---|---|---|---|
| TC-PAY-01 | FR-26 | Run one exit for each group: Student motorbike, Lecturer/Staff motorbike, Guest car. | Fees match the **Tariffs** page exactly for each (type × group). | |
| TC-PAY-02 | FR-27 | Manager → **Payments**. | Each exit shows plate, zone, amount, paid-at time and *Confirmed by*. The From/To filter narrows the list. | |
| TC-PAY-03 | FR-28 | `customer01` → **Parking history**. | Only `customer01`'s sessions, newest first, with amount and paid-at. Open sessions show "Not paid". | |
| TC-PAY-04 | FR-28 (privacy) | As `customer01`, **remove** vehicle `29A-01001` (it has history). As `customer07`, add plate `29A-01001`. Compare both customers' **Parking history**. | `customer01` **still sees** their past sessions. `customer07` sees **none** of them. | |
| TC-PAY-05 | FR-28 | Manager → Payments. | Shows payments of **all** customers and guests. | |

### C.8 Reports (FR-29)

Precondition: Simulator → **Generate history** for 7 days (C.9).

| ID | Req | Steps | Expected | Result |
|---|---|---|---|---|
| TC-REP-01 | FR-29 | Open **Reports** with no parameters. | The default range is **today**. | |
| TC-REP-02 | FR-29 | From = 7 days ago, To = today → **Apply**. | **Hourly utilisation**: 24 hourly rates between 0 and 1. **Peak hours**: the 3 hours with the most entries, with counts. **Revenue**: a total plus amounts per date. **No-show rate**: a percentage. | |
| TC-REP-03 | FR-29 | Cross-check revenue: Payments page with the same date range. | Report revenue total = sum of the listed payments. | |
| TC-REP-04 | FR-29 | Set From later than To → **Apply**. | No report is computed. The metric sections are not shown and the page does not crash. | |
| TC-REP-05 | FR-29 | Pick a range with no data (e.g. a year ago, before the purge sample). | Empty-state messages ("No entries in this range.", "No revenue in this range."). No-show rate shows **—**. | |

Metric definitions to check against (D-30):

- **Utilisation:** occupied spots ÷ capacity, sampled at half past each hour.
- **Peak hours:** the top 3 hours of the day by number of entries.
- **Revenue:** confirmed payments, grouped by payment date.
- **No-show rate:** NO_SHOW ÷ (all reservations − CANCELLED).

### C.9 Simulator (FR-33, FR-34)

As **Manager** → **Simulator**.

| ID | Req | Steps | Expected | Result |
|---|---|---|---|---|
| TC-SIM-01 | FR-33.1, FR-34 | *Number of events* `100` → **Fire N events**. | Result "x entries, y exits, z rejected" with x + y + z = 100. Open sessions grow. Every new session has a full record (check one in **Session details**). | |
| TC-SIM-02 | FR-33.3 | *Number of days* `7` → **Generate history**. | "n sessions, m reservations, k payments" with all counts > 0. Reports now have data for the past 7 days. | |
| TC-SIM-03 | FR-33.3, FR-32 | After TC-SIM-02, run **Purge** (C.11). | The purge masks > 0 sessions: history also creates sessions about 13 months old. | |
| TC-SIM-04 | FR-33.2 | Exception buttons: see C.10. | | |

### C.10 Exceptions (EX-01 – EX-05)

Each exception can be tested **manually** (preferred, because it shows the staff screens) or through the **Simulator** trigger.

| ID | Exc. | Manual steps | Expected | Result |
|---|---|---|---|---|
| TC-EX-01a | EX-01 | Manager sets Zone C car capacity to `1`. Staff enters car `30A-000.01` into C, then car `30A-000.02` into C. | The second entry is rejected: "Zone is full". Restore capacity 30 afterwards. | |
| TC-EX-01b | EX-01 | Simulator → **EX-01 Zone full**. | Outcome "Zone full as expected." **Note:** this fills a whole zone with sessions, so reset the DB afterwards (A.9). | |
| TC-EX-02a | EX-02 | Staff enters `customer01` by QR. In **Open parking sessions → View details**, copy the session URL (`/staff/sessions/<id>`); it is no longer listed once closed. At exit, type observed plate `29A-01009` (wrong) → **Preview fee**. | Warning "The observed plate does not match the plate recorded at entry." Confirming **without** ticking **Confirm manually** is rejected ("License plate does not match"). | |
| TC-EX-02b | EX-02 | Tick **Confirm manually** → **Confirm simulated payment & close**. Open the session URL copied in TC-EX-02a. | The exit succeeds. The session event **Plate mismatch confirmed** is logged with the observed plate in its note. The access log shows **Manual confirm**. | |
| TC-EX-02c | EX-02 | Simulator → **EX-02 Plate mismatch**. Follow the shown *Staff instructions* (method, identifier, observed plate) on **Vehicle exit**. | The mismatch warning appears; finish as in TC-EX-02b. | |
| TC-EX-03a | EX-03 | Staff enters `customer03` by QR and copies its session URL (as in TC-EX-02a). At exit choose Method **Plate**, type the plate, observed plate the same, tick **Lost card**, optional note → Preview → Confirm. | Normal fee and exit. Reopening the session URL shows the event **Lost card**. No penalty fee (D-09). | |
| TC-EX-03b | EX-03 | Simulator → **EX-03 Lost card**. Follow the instructions ("Tick 'Lost card' on the exit screen"). | Same as TC-EX-03a. | |
| TC-EX-04a | EX-04 | Staff enters `customer05` by QR into A, then enters the same QR again (any zone). | The second entry is rejected: "A session is already open". | |
| TC-EX-04b | EX-04 | Simulator → **EX-04 Duplicate entry**. | "Duplicate entry rejected as expected." | |
| TC-EX-05a | EX-05 | Staff enters `customer09` (A). Manager **suspends** the lot. Staff tries a new entry. | Entry rejected: "Lot is temporarily suspended". | |
| TC-EX-05b | EX-05 | While still suspended, Staff **exits** `customer09`. | Exit is **allowed**: fee shown and payment confirmed. | |
| TC-EX-05c | EX-05 | While still suspended, a customer tries to reserve. | Rejected: "Lot is temporarily suspended". Existing pending reservations stay Pending. Badge **Suspended** shown. Reactivate afterwards. | |
| TC-EX-05d | EX-05 | Lot **Active**: Simulator → **EX-05 Lot suspended**. Then check the lot status. | Outcome "Lot suspended; entry rejected…". The lot is **Active** again afterwards. | |
| TC-EX-05e | EX-05 | **Suspend** the lot first, then Simulator → **EX-05**. Check the lot status. | The lot stays **Suspended** (the simulator restores the original status). See E-3 about the outcome text. | |

### C.11 Data protection (FR-30 – FR-32)

| ID | Req | Steps | Expected | Result |
|---|---|---|---|---|
| TC-DP-01 | FR-30 / D-39 | `customer01` views **My vehicles**, **My reservations** and **Parking history**. | Their own plates are shown **in full**. | |
| TC-DP-02 | FR-30 | Staff / Manager views sessions and payments. | Full plates (Staff and Manager may see full plates, §4). | |
| TC-DP-03 | FR-30 | (Masking format) See E-1. Format: `51F-123.45` → `51F-***.45`. | Covered by automated tests (`tests/plate.test.ts`). | |
| TC-DP-04 | FR-31 | Manager → **Access log** after the tests above. | Entries for **Login**, **Entry**, **Exit**, **View full plate** (only from opening a single Session details page, not from lists), **Lot change**, **Tariff change**, **Account change**, **Manual confirm**, **Purge**. Logout is **not** logged (D-23 covers login plus sensitive actions). Each entry has time, user, action and target. | |
| TC-DP-05 | FR-31 | Open the **Open parking sessions** list only (do not open details). | **No** new *View full plate* entry. | |
| TC-DP-06 | FR-32 | After TC-SIM-02 → **Access log** → **Purge data older than 12 months** → **Confirm purge**. | "Masked N sessions and deleted M vehicles." A **Purge** entry is logged with the counts. | |
| TC-DP-07 | FR-32 | Manager → **Payments**, From = 14 months ago, To = 12 months ago. | Old rows show plate `[purged]`. Newer rows keep their plates. | |
| TC-DP-08 | FR-32 | Run Purge a second time. | "Masked 0 sessions…" (nothing left to mask). | |
| TC-DP-09 | FR-32 | Staff has a vehicle parked (open session). Run Purge. | The parked vehicle can still exit normally. | |

### C.12 Account management (D-24)

| ID | Req | Steps | Expected | Result |
|---|---|---|---|---|
| TC-ACC-01 | D-24 | Manager → **Account management**: the list shows all users with role, group and locked flag. | 19 seeded users plus any you registered. | |
| TC-ACC-02 | D-24 | Create a **Staff** account `staff3@demo.local` / `password123`. Log in with it. | Login works and lands on `/staff`. | |
| TC-ACC-03 | D-24 | Create a **Manager** account. Log in with it. | Lands on `/manager`. | |
| TC-ACC-04 | FR-04 | Lock / unlock: see TC-AUTH-11. | | |

---

## Part D — Traceability (requirement → test cases)

| Requirement | Test cases | Covered by automated tests too |
|---|---|---|
| FR-01 Sign-up | TC-AUTH-01..03 | `auth.test.ts` |
| FR-02 Login/logout | TC-AUTH-04, 05 | `auth.test.ts` |
| FR-03 RBAC | TC-AUTH-06..10, 14 | `auth.test.ts`, `api.test.ts`, `nav.test.ts` |
| FR-04 Locked accounts | TC-AUTH-11, TC-ACC-04 | `accounts.test.ts` |
| FR-05 VI/EN | TC-AUTH-12, Part B #15 | `i18n.test.ts` (key parity) |
| FR-06 Vehicles + QR/RFID | TC-VEH-01..03 | `vehicles.test.ts` |
| FR-06a Unique plate / Guest claim | TC-VEH-04..06 | `vehicles.test.ts` |
| FR-07 Lots | TC-LOT-01..03 | `lots.test.ts` |
| FR-08 Zones / capacity | TC-LOT-04..07 | `lots.test.ts` |
| FR-09 Tariffs | TC-LOT-08, TC-PAY-01 | `fees.test.ts` |
| FR-10 Multi-lot | TC-LOT-09 | `lots.test.ts` |
| FR-11 Entry ≤ 3 ops | TC-ENT-01..04 | `entry.test.ts` |
| FR-12 Unknown plate → Guest | TC-ENT-03 | `entry.test.ts` |
| FR-13 Session record | TC-ENT-05 | `entry.test.ts` |
| FR-14 Exit flow | TC-EXIT-01, 02, 05, TC-EX-05b | `exit.test.ts` |
| FR-15 Single event API | TC-EXIT-06 | `simulator.test.ts` |
| FR-16 < 2 s | TC-EXIT-07 | `simulator.test.ts` (FR-16 timing) |
| FR-17 Availability formula | TC-AV-01, 02, 04 | `availability.test.ts` |
| FR-18 Correct under concurrency | TC-AV-05 | `entry.test.ts` (20 concurrent → 2) |
| FR-19 Live SSE | TC-AV-01..03, 06 | — |
| FR-19a Suspended badge | TC-AV-07, TC-LOT-03 | `availability.test.ts` |
| FR-20 Reserve | TC-RES-01..03 | `reservations.test.ts` |
| FR-21 Rejections | TC-RES-04..06, 11, TC-EX-05c | `reservations.test.ts` |
| FR-22 Cancel | TC-RES-07, 08 | `reservations.test.ts` |
| FR-23 Hold / NO_SHOW | TC-RES-12 | `reservations.test.ts`, `availability.test.ts` |
| FR-24 Fulfil / other zone | TC-RES-09, 10 | `reservations.test.ts` |
| FR-25 Reserved spots use capacity | TC-AV-02, TC-RES-11 | `availability.test.ts` |
| FR-26 Fee | TC-EXIT-03, 04, TC-PAY-01 | `fees.test.ts` |
| FR-27 Payment record | TC-EXIT-02, TC-PAY-02 | `exit.test.ts` |
| FR-28 History | TC-PAY-03..05 | `history.test.ts` |
| FR-29 Reports | TC-REP-01..05, Part B #13 | `reports.test.ts` |
| FR-30 Masking | TC-DP-01..03 | `plate.test.ts` |
| FR-31 Access log | TC-DP-04, 05 | `accounts.test.ts`, `auth.test.ts` |
| FR-32 Purge | TC-DP-06..09, TC-SIM-03 | `purge.test.ts` |
| FR-33 Simulator | TC-SIM-01..03, TC-EX-01b..05e | `simulator.test.ts` |
| FR-34 ≥ 100 sessions | TC-SIM-01 | `simulator.test.ts` |
| EX-01 Zone full | TC-EX-01a/b, TC-RES-06, 11 | `entry.test.ts` |
| EX-02 Plate mismatch | TC-EX-02a/b/c | `exit.test.ts` |
| EX-03 Lost card | TC-EX-03a/b | `exit.test.ts` |
| EX-04 Duplicate entry | TC-EX-04a/b | `entry.test.ts` |
| EX-05 Lot suspended | TC-EX-05a..e, TC-RES-05 | `entry.test.ts`, `exit.test.ts`, `simulator.test.ts` |

Objectives (spec §1.1):

| Objective | Demonstrated by |
|---|---|
| **O1** availability before arrival | C.5 |
| **O2** digitised entry/exit, ≥ 100 sessions | C.4, TC-SIM-01 |
| **O3** utilisation and demand tracking | C.8, TC-RES-12 |
| **O4** fees and exceptions | C.7, C.10 |
| **O5** acceptance | this table |

---

## Part E — Known limitations and notes for testers

These are known and should not be reported as new failures:

- **E-1 · Plate masking is not visible in the UI.** No screen shows another person's plate to a Customer: customers only see their own vehicles, and Staff and Managers see full plates by design. The mask format (`51F-***.45`) is therefore verified only by automated tests (`tests/plate.test.ts`).
- **E-2 · Plate format is not validated.** Any non-empty plate is accepted after normalisation (trim, upper-case, spaces removed). The spec does not define a plate format.
- **E-3 · EX-05 simulator message.** The outcome text always reads "…entry rejected and lot reactivated", even when the lot was already suspended and is correctly left suspended (TC-EX-05e). This is a text-only inaccuracy.
- **E-4 · Simulator EX-01 fills a whole zone** (up to 150 sessions). Prefer TC-EX-01a for live demos. Reset the DB after TC-EX-01b (A.9).
- **E-5 · No-show timing.** A hold expires 30 min after the arrival time. Expiry is applied within 30 s by the background timer, and immediately on any availability read or report. A live no-show test takes over 30 min (TC-RES-12).
- **E-6 · Utilisation sampling.** Utilisation is sampled at **:30** of each hour (plan decision implementing D-30). Short sessions that start and end within one hour without crossing :30 are not counted.
- **E-7 · Single server process.** Overselling is prevented by an in-process lock, which is valid for one `npm run dev` / `npm start` process on SQLite (the agreed local-demo setup, D-16). Do not run two server instances against the same `dev.db`.
- **E-8 · Session cookies are per host.** Use separate browser sessions per role (A.4). Otherwise logging in as one role logs out another.
- **E-9 · Pending client confirmation.** Behaviour labelled `[TEAM]` in the spec (§2.1, §10) is a team assumption awaiting the client's round-3 answers (`resources/client-round3-questions.md`). Tests check the current assumption.
- **E-10 · Extra plan rules.** TC-RES-04 and TC-RES-13 (*Vehicle already has a reservation*, *Vehicle is currently parked*) test rules added in the implementation plan, not in the spec.

---

## Part F — Sign-off

| Field | Value |
|---|---|
| Tester | |
| Date | |
| Build / commit | `git rev-parse --short HEAD` → |
| Mode (dev / production) | |
| Browser(s) | |
| Test cases run / passed / failed / blocked | / / / |
| Failures raised (IDs) | |
| Verdict: app matches spec? | Yes / No / Yes with exceptions |
