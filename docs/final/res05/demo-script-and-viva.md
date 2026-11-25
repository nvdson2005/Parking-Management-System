# F5-02 · A-115 demo script (A-88, 27/11) and mock viva plan

| Field | Value |
|---|---|
| Task | F5-02 in `docs/m3-m4-final-work-division.md` (A-115 demo script and slides; mock viva) |
| Owner | Nguyễn Tuấn Thành (RES-05). Review: RES-01 (host of A-88) |
| Used by | A-87 dry run on 26/11 (RES-02, CP-07) as the run order; A-88 client demo on 27/11; A-89 acceptance record (RES-03) |
| Builds on | RES-01 rehearsal `docs/m3/a-88-a-115-demo-rehearsal.md`; acceptance tests P21 (AT-01..AT-07, AT-EX01..AT-EX05, AT-100); A-68 evidence `docs/m3/a-68-cp05-test.md`; A-31 `docs/m3/a-31-auth-test.md` |
| Report sections | M4 §4.1 (deliver and demonstrate), §4.6 (viva readiness) |

## 1. Rules for the demo

1. **Production build only**: `npm run build` then `npm run start`. Under `next dev`, DB writes trigger rebuilds that reload pages and can start a second simulator run (A-31 O-01, A-68 D-01). The production build was measured at 14–31 ms per entry/exit request (A-68 C3).
2. **Pinned SHA**: run the candidate SHA that A-87 (F2-04) pins on 26/11. Write it in section 6 before starting.
3. **Fresh DB** for the demo, created the same morning: `prisma migrate deploy` + seed. Do not run `npm run db:reset` while anyone is signed in; sign everyone in again after a reset (A-68 D-02).
4. **One click** on simulator buttons, then wait for the result line. If PR #26 is merged, a second click answers "Bộ mô phỏng đang chạy một lượt khác…" (409); otherwise a second click starts an overlapping run.
5. **EX-01 last**: it fills a zone and needs a DB reset afterwards.
6. **Fallback**: if the app fails, play the CP-05 demo video (2:54, linked in `docs/m3/a-68-cp05-test.md` section 3.4) and show the evidence files; record the failure for A-89.

## 2. Setup checklist (morning of 27/11, about 20 minutes)

| # | Step | Who | Done |
|---|---|---|---|
| 1 | `git checkout <pinned SHA>`, `npm ci`, `npm run build` | RES-05 | [ ] |
| 2 | `$env:DATABASE_URL="file:./demo.db"`, `npx prisma migrate deploy`, `npx tsx prisma/seed.ts`, `npm run start` | RES-05 | [ ] |
| 3 | Three browser profiles (not private windows, which share cookies): **Manager** `manager1@demo.local`, **Staff** `staff1@demo.local`, **Customer** `customer01@demo.local`; password `password123` | RES-05 | [ ] |
| 4 | Close unrelated tabs and notifications; zoom 125 % for the projector; DevTools Network open in the Staff profile (for AT-100 timing) | RES-05 | [ ] |
| 5 | `scripts/a68-check.ts` ready in a second terminal (for the O1 cross-check). It comes with PR #18; if #18 is not merged at the pinned SHA, run `git restore --source origin/test/a68-cp05 -- scripts/a68-check.ts` and do not commit it | RES-05 | [ ] |
| 6 | Paper, pen and a phone for the hand count (O1) | RES-05 | [ ] |
| 7 | Video link and evidence folder open in a background tab (fallback) | RES-01 | [ ] |
| 8 | Acceptance record template ready (section 6) | RES-03 | [ ] |

## 3. Run of show (about 30 minutes; adjust to the slot the client gives)

Times are cumulative. "Driver" operates the app; "Presenter" talks.

| Time | Segment | AT / objective | Driver | Presenter | Steps and expected result |
|---|---|---|---|---|---|
| 0:00 | Opening | — | — | RES-01 | Scope (MVP + CR-03), roles, objectives O1–O5, what the client will see, how acceptance is recorded |
| 2:00 | **100-session run and availability** | AT-100, O1, O2 | RES-05 | RES-05 | Manager → Simulator, ≥ N sessions, N = 100, seed 68, one click. Fresh DB result: `100 entries, 69 exits, 0 rejected` (A-68, 3.4). Manager home: free **A 143, B 138, C 18**. Staff → open sessions; count per zone on paper (A 7, B 12, C 12); show `a68-check` output = UI. Mention every session has a complete record (`incomplete: 0`) |
| 7:00 | **Motorbike and car entry/exit** | AT-01, AT-02, O1 | RES-02 | RES-02 | Staff entry by plate for a motorbike (zone A) and for a car (vehicle type CAR, zone C), and by QR for `customer01`'s motorbike `29A-01001`; availability drops by one per entry; exit preview shows the fee; confirm; availability back. Point out ≤ 3 inputs and the response times (T13) |
| 11:00 | **Exceptions** | AT-EX02..AT-EX05, O4 | RES-05 | RES-02 | Manager simulator EX-02 → Staff exit with the observed plate: warning, confirm disabled until "Confirm manually"; closed. EX-03 → exit by plate with "Lost card": normal fee, `LOST_CARD`. EX-04 → duplicate entry refused. EX-05 → entry refused while suspended, an open session still exits, lot reactivated |
| 16:00 | **Reservation and early arrival** | AT-05, O3 | RES-04 | RES-04 | Customer reserves today, one active reservation per account; Staff early entry asks for confirmation; after confirm the reservation is fulfilled. Cancel and no-show rules in one sentence (round 3 Q5) |
| 19:00 | **Fees and simulated payment** | AT-06, O4 | RES-02 | RES-02 | Tariff table (motorbike/car × student, lecturer/staff, guest); one exit fee equals the table; Manager payments list |
| 21:00 | **Lot and tariff management** | AT-03 | RES-01 | RES-01 | Manager lots: zones and capacities, suspend/reactivate (link to EX-05); tariffs editable |
| 23:00 | **Reports** | AT-07, O3 | RES-03 | RES-03 | Manager reports: utilisation per hour, three peak hours, revenue, no-show rate; the definitions agreed in round 3 Q2 |
| 25:00 | **Roles, plate masking, access log, purge** | AT-04, O5 | RES-05 | RES-05 | Customer opens a Staff URL → `/denied` and an `ACCESS_DENIED` row; Staff sees a closed session's plate masked, Manager sees it in full with one `VIEW_FULL_PLATE` row. For the purge, first run Simulator → history, 7 days (a fresh DB has no session older than 12 months), then Access log → purge: sessions masked (`[purged]` in payments) while counts and revenue stay (A-31 checks 2–8) |
| 27:00 | **Zone full** | AT-EX01 | RES-05 | RES-05 | Simulator EX-01: `ZONE_FULL`, availability 0, never negative. Note that the zone stays full until reset |
| 28:00 | Close and acceptance | — | — | RES-01 | Ask the client for a verdict per AT; list accepted exceptions and open actions with owner and due date; RES-03 writes them in section 6 |

### Known issues to state, not hide

| ID | What the client may see | What to say |
|---|---|---|
| D-03 | Staff entry "Zone" shows internal IDs, "Vehicle type" shows `MOTORBIKE` (if RES-04's fix is not merged) | Known S2, fix in progress under ISS-11; the first zone in the list is zone A |
| D-04 | Exit preview labels the entry plate as "Observed plate" (if not merged) | Known S2, fix in progress; the mismatch warning and manual confirm work |
| D-05 | Session detail does not show the identification method | Known S3; the value is stored and checked |
| A-31 O-02 | Logout appears in the access log | Behaviour differs from the old guide; under review |

## 4. Roles on the day

| Member | Role |
|---|---|
| RES-01 | Host, opening and close, AT-03, keeps time, decides on fallback |
| RES-02 | AT-01, AT-02, AT-06, presenter for exceptions; QA observer (CP-08 notes) |
| RES-03 | AT-07; writes the acceptance record (section 6) for A-89 |
| RES-04 | AT-05; on standby for UI questions (D-03, D-04, D-05) |
| RES-05 | Sets up the machine; drives AT-100, exceptions, AT-04, AT-EX01; hand count |

## 5. Mock viva (15 minutes, before or after A-87 on 26/11)

The real viva with the lecturer is on **30/11**, the day after submission (29/11). Every member must be able to explain the whole project, not only their own part (report template, section 4.6).

Rule (work division, section 6.6): each member explains one artifact **they did not write**. Each member has 2 minutes to explain and 1 minute for one question from another member. RES-01 keeps time.

| Speaker | Explains (not their own) | Author | Question to answer |
|---|---|---|---|
| RES-01 | A-43 simulator review and SC-01..SC-07 (`docs/m3/A-43-simulator-review.md`) | RES-05 | Why are 120 events and 100 sessions different measures, and how does SC-07 check the session requirement? |
| RES-02 | P03 database design and the availability formula | RES-03 | How is "free" computed, and why can it never be negative? |
| RES-03 | A-68 / CP-05 evidence (`docs/m3/a-68-cp05-test.md`) | RES-05 | What does "pass with conditions" mean, and why did C5 keep D-01 at S2? |
| RES-04 | P20 test plan and P21 acceptance tests | RES-02 | What separates a T-test from an AT, and who signs CP-05? |
| RES-05 | SRS (latest version, PR #22/#23) and the traceability matrix P24 | RES-04 | Trace O1 from objective to requirement, activity, test and checkpoint |

Second round, optional, on 29/11 after submission: swap the artifacts (each member takes the one they were asked about) and use the submitted report, so the answers match what the lecturer will read.

Spare questions for anyone: the critical path and how A-68's one-day slip moved it; what A-117 is and why it was added; what Baseline V2.0 changed (CR-03); one risk that occurred and how it was handled.

## 6. Acceptance record (filled on 27/11 by RES-03 for A-89)

| Field | Value |
|---|---|
| Date and time | ___ |
| Candidate SHA | ___ |
| Attendees | ___ |
| Client | ___ |

| AT | Shown | Client verdict | Exception or action | Owner | Due |
|---|---|---|---|---|---|
| AT-100 | [ ] | ___ | ___ | ___ | ___ |
| AT-01 | [ ] | ___ | ___ | ___ | ___ |
| AT-02 | [ ] | ___ | ___ | ___ | ___ |
| AT-EX02 | [ ] | ___ | ___ | ___ | ___ |
| AT-EX03 | [ ] | ___ | ___ | ___ | ___ |
| AT-EX04 | [ ] | ___ | ___ | ___ | ___ |
| AT-EX05 | [ ] | ___ | ___ | ___ | ___ |
| AT-05 | [ ] | ___ | ___ | ___ | ___ |
| AT-06 | [ ] | ___ | ___ | ___ | ___ |
| AT-03 | [ ] | ___ | ___ | ___ | ___ |
| AT-07 | [ ] | ___ | ___ | ___ | ___ |
| AT-04 | [ ] | ___ | ___ | ___ | ___ |
| AT-EX01 | [ ] | ___ | ___ | ___ | ___ |

## 7. Open points before the demo

| Point | Owner | Needed by |
|---|---|---|
| Demo slot length and format (in person or online) from the client | RES-01 | 26/11 |
| Pinned SHA from A-87 (F2-04) | RES-02 | 26/11 |
| Merge state of PR #26 (D-01) and the D-03/D-04 fix | RES-01, RES-04 | 26/11 |
| Run this script end to end at A-87 and adjust times | RES-02, RES-05 | 26/11 |
| Slides: one title slide, scope and objectives, run of show (if the client asks for slides) | RES-05 | 26/11 |
| Mock viva round 1 (section 5) | All, RES-01 keeps time | 26/11 |
| Mock viva round 2 on the submitted report (optional) | All | 29/11 |
| **Real viva with the lecturer** | All | **30/11** |

Effort RES-05: ___ h (estimate 2.0 h).
