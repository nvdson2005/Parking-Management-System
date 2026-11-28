# Milestones 3 and 4 closeout decisions

On 28 November 2026 (Vietnam time), the user replied “OK. Approve” to the internal decision batch for GitHub main `21ac6ea38088f8eca44b843181a6d2d173f9a628`. This records the user's project-side decision. Attribute independent checks and personal attestations to the people who actually performed or supplied them.

| ID | User decision and effect | Evidence or remaining dependency |
| --- | --- | --- |
| CP-02 | Approves the architecture and API review from the project side. | RES-03 review and RES-02 concurrence recorded in the [checkpoint log][gates]. |
| CP-05 C1 | Accepts the documented count comparison for project closeout. | [Checkpoint log][gates] records the count and the outstanding independent verification. |
| CP-05 C4 | Accepts the documented evidence rows for project closeout. | [Checkpoint log][gates] identifies the independent verifier sign-off. |
| CP-05 D-04 | Accepts the merged fix and its recorded retest. | [PR #38][d04] contains the fix. Retain the post-merge confirmation requirement until satisfied or formally waived. |
| CP-05 C2 | Accepts the Q23 video waiver for project closeout. | [Checkpoint log][gates] records that the video was not emailed and Q23 was unmet. |
| CP-05 ISS-06–ISS-11 | Approves the issue dispositions in the listed batch. | Preserve each issue's owner, due date, and evidence status in the [checkpoint log][gates]. |
| CP-07 | Accepts the internal dry-run result and demo decision from the project side. | [A-87 evidence][dry-run] records 13/13 passed. Evidence gaps and the assigned recheck remain open in the formal gate record. |
| F1-02 / F1-03 | Approves the workshop and M-03 record and the baseline endorsement from the project side. Recovery schedule approval is conditional on the reforecast being ready. | [PR #39][res01] targets the branch for [PR #19][parent]. |
| A-91 / A-113 / A-114 | Approves the available retrospective and reflection records from the project side. | [Retrospective][retro] lists outstanding member entries. This approval supplies no member's personal confirmation or missing text. |
| A-108 / A-92 / A-116 | Approves proceeding to final review once drafts and evidence are ready. | Final sign-off remains pending for the actual report and package versions. See the [submission checklist][submission]. |

CP-08 still requires lecturer or client evidence. A-116 submission completion still requires an LMS receipt. This record grants no GitHub review, merge, or external submission authorization.

[gates]: https://github.com/nvdson2005/Parking-Management-System/blob/21ac6ea38088f8eca44b843181a6d2d173f9a628/docs/final/res02/checkpoint-log.md
[d04]: https://github.com/nvdson2005/Parking-Management-System/pull/38
[dry-run]: https://github.com/nvdson2005/Parking-Management-System/blob/21ac6ea38088f8eca44b843181a6d2d173f9a628/docs/final/res02/a87-dry-run.md
[res01]: https://github.com/nvdson2005/Parking-Management-System/pull/39
[parent]: https://github.com/nvdson2005/Parking-Management-System/pull/19
[retro]: https://github.com/nvdson2005/Parking-Management-System/pull/40
[submission]: https://github.com/nvdson2005/Parking-Management-System/pull/41

## Implementation status at 21ac6ea

| ID | Disposition | Next evidence or action |
| --- | --- | --- |
| CP-02 | Project-side approval recorded above | Attribute the architecture review and concurrence to their recorded reviewers. |
| CP-05 | Pass with conditions | Keep C1/C4 independent verification and D-04 post-merge confirmation visible. Record the project-side C2 waiver and individual issue dispositions. [Checkpoint log][gates] |
| CP-07 | Pass with conditions | Condition A is supported by the rerun on d9c6638 and recorded smoke checks. Evidence gaps 1–9 and the recheck remain tracked. [A-87 record][dry-run] |
| A-88 / CP-08 | Internal demo completed under CP-06, client confirmation outstanding | Report the 26 November internal demo and prepare the course demo and viva. The assignment's page 7 lists submission materials and directs teams to LMS for exact instructions. |
| A-90 / recovery forecast | Open | Reconcile the reconstructed activity estimates and outstanding work with RES-03, then present the dated forecast to the user. Keep measured hours separate from estimates. |
| A-91 / A-113 / A-114 | Retrospective merged, personal confirmations pending | Attribute evidence-backed contributions and retain member confirmation as pending where the record says so. [Retrospective][retro] |
| A-108 / A-92 | Combined M3–M4 report prepared for review | Review the [A4 PDF](../output/pdf/CO3011_Smart_Parking_M3_M4_review.pdf) and determine whether LMS requires an additional separate M3 report. |
| A-110 | Scope table proposed | PR #42 remains open. Reconcile the final scope with the merged evidence and the dispositions in the proposed table. |
| A-116 | Package checklist merged, submission pending | Choose the submission SHA, confirm the repository and guide are accessible to the lecturer, verify baseline retention, check LMS naming and upload instructions, and record the receipt after submission. [Checklist][submission] |

PRs #19, #39 and #42 are open. The remote had no `baseline-v1.0` tag at the time of the snapshot check. The report indexes the preserved V1.0 artifacts. The tag is a project checklist item, while the course requires retention for comparison.

### Verification on the clean main snapshot

- `npm ci --offline`, `npm run lint`, and `npm run build` passed at `21ac6ea`. The build needed network access for its existing Google Fonts dependency.
- `npm test` passed 400/400 in 52 files at `21ac6ea`, using the snapshot’s isolated `prisma/test.db`. The earlier 396/396 result remains attributed to `d9c6638`.
- The report PDF has eight A4 pages. Text extraction confirmed the current demo account, test counts, and AI declaration. The evidence index includes branch references for documents still awaiting merge.

### Remaining schedule and decisions

The original work division allocates 2.5 h to the performance comparison (F3-04), 1.0 h to the workbook sync (F3-05), and 0.5 h to baseline approval (F1-03). These are original planning estimates. The combined report now includes the comparison, so those figures cannot be used as current remaining effort without an owner re-estimate. The V2.0 model forecast of working day 24.63 against 15 remains the baseline comparison. The submission target depends on the LMS deadline and the time needed to clear the following dependencies.

1. RES-03 reconciles the workbook and confirms remaining effort and capacity. Present that dated recovery forecast to the user.
2. Resolve PR #39 into the branch for #19, review the resulting #19 diff against main, and handle #42 independently. All three were open and mergeable at the time of the check. Freeze the submission SHA after the planned merges.
3. RES-02 and RES-04 provide or document disposition for outstanding CP-05 and CP-07 evidence. Bring decisions to the user. Record individual reflection confirmations only when supported.
4. Finish repository evidence checks, including the public repository, P13, baseline artifacts, and logs. The fresh setup sequence in README was verified against a new SQLite demo database on `21ac6ea`: nine migrations applied, client generated, and seed succeeded. Full P13 browser demo and independent sign-off remain separate.
5. Review the exact PDF after repository refinements are complete. The LMS assignment page supplies the filename, deadline, and any separate M3 deliverable. Record the submitted file and receipt after approval and upload. Track CP-08 on the project side.

### GitHub integration update

PR #39 merged into the #19 branch at `30c023e`. PR #19 then merged into main at `40d99ad`, followed by #42 at `f9f9b71`. GitHub reported all three as merged. The reviewed diffs were documentation, evidence, and planning artifacts. The 400-test result belongs to the earlier tested SHA `21ac6ea`.

### Post-merge repository checks

GitHub's comparison from `21ac6ea` to `f9f9b71` shows only documents, evidence, and planning files. No application, migration, test, or runtime dependency files changed. On the production build from the equivalent `21ac6ea` source, the built-in HTTP rehearsal (`node e2e/round3.e2e.mjs`) passed 25/25 on a freshly seeded isolated demo database. It covered reservations, early QR entry, suspension notifications, exit during suspension, and report series. The P13 browser walkthrough, visual checks and independent sign-off remain open.

- **CP-05:** D-01 (#26), D-03 (#24), and D-04 (#38) are present on main. C1 and C4 still need independent verification. The C2 project-side waiver decision is recorded above. The remaining C6 sign-off needs a post-merge D-04 check attributable to RES-04 or a documented accepted disposition.
- **CP-07:** The HTTP rerun corroborates behavior for gaps 1, 4, 5 and 7 in part. It does not supply the missing captures, validate manual no-show/cancel, or establish historical timing or the historical EX-01 setup. The nine items and RES-04 recheck remain tracked in [A-87][dry-run]. Keep new evidence tied to its run and obtain a decision before closing a condition.

### P13 browser walkthrough, 28 November 2026

Codex ran Chromium through Playwright against a fresh migrated and seeded SQLite demo database. The production build came from `21ac6ea`, whose runtime files match `f9f9b71`. Customer, Staff, and Manager authenticated in separate browser contexts. All 11 P13 role pages opened with HTTP 200 and the expected headings.

| P13 step | Observed result |
| --- | --- |
| 1 | Vehicle page rendered the QR image and displayed QR and RFID identifiers. |
| 2 | Customer submitted a Zone A reservation in the browser and received HTTP 200. The live Staff count was not observed in this run. |
| 5 | Staff saw the early-arrival prompt and confirmed QR entry. Entry returned HTTP 200. |
| 7 | Staff preview rendered separate entry and observed plates and a 2,000 ₫ fee. Payment returned HTTP 200 and Customer history showed the closed, paid session. |
| 11 | Live simulation returned 100 sessions, 100 entries, 65 exits, and zero rejects (seed 1619282114). History generated 460 sessions, 57 reservations, and 460 payments (seed 2102282470). |
| 12 | Reports rendered occupancy, peak hours, revenue, and no-show rate. |
| 14 | Customer switched to English and saw translated Vehicles and Parking History headings. |

Still open for a browser run: steps 3, 4, 6, 8, 9, 10, and 13, the live count in step 2, and any remaining visual evidence or named independent sign-off. The separate 25/25 HTTP rehearsal covers the second-vehicle reservation limit and suspension behavior in part.

### P13 remaining browser steps, same isolated demo build

| Step | Result |
| --- | --- |
| 2 | The Staff dashboard updated without a reload. Zone A free spaces changed from 138 to 139 on cancellation and back to 138 on reservation. |
| 3 | A reservation for the second registered vehicle succeeded. A subsequent reservation for the other vehicle on the same account returned 409 RESERVATION_LIMIT. |
| 4 | Staff found the reserved vehicle, saw it was outside the lot, and saw its active Zone A reservation. |
| 6 | Staff admitted a new guest car to Zone C. |
| 8 | All five simulator exceptions returned their expected outcomes. EX-02 showed the two distinct plates and required manual confirmation before payment. EX-03 previewed and closed via the lost-card path. EX-01 filled Zone C and returned ZONE_FULL with the reset notice. The checkout used an isolated database, and the database was retained for the purge check. |
| 9 | Staff saw the suspended badge. A new entry was refused with LOT_SUSPENDED, an already parked guest could exit, and the Customer saw both the cancelled reservation and the bell notification. |
| 10 | Manager reactivated the lot and changed the student motorbike tariff from 2,000 ₫ to 2,300 ₫. Staff saw the new fee on preview and completed the exit. |
| 13 | Access Log showed login and full-plate view entries. After restarting with the same historical data, the scheduled purge appeared with no user and reported 20 sessions processed. |

This completes the outstanding P13 browser checks from the prior run. The first vehicle used in the repeated reservation test was already inside after simulation, so the account-limit check used the other vehicle for the successful hold and then reproduced RESERVATION_LIMIT on the subsequent attempt. The walkthrough is Codex evidence for the user's review. Formal member sign-off remains pending.

### P13 approval and QA evidence mapping

On 28 November 2026, the user replied “ok, then map it” after being asked to approve the P13 walkthrough evidence. Recorded as project-side approval of that evidence. Named independent sign-off remains pending where required. This approval does not extend to the additional CP-07 dispositions below.

The browser run used `21ac6ea`, with runtime files matching merged `f9f9b71`. It provides fresh evidence alongside the historical runs.

| Condition | What the P13 run adds | Remaining evidence or decision |
| --- | --- | --- |
| CP-05 C1 | Zone A free count changed 138 → 139 → 138 on cancel and rebook without a reload. | RES-02 independent verification of the historical three-zone count remains due. The live update check covers a different claim. |
| CP-05 C2 / ISS-07 | No new evidence. | Project-side waiver already recorded. Keep Q23 marked unmet and preserve the formal waiver disposition. |
| CP-05 C4 | Identifies the runtime-equivalent commits and the browser run. | Independent verifier sign-off for the Quality Evidence rows remains due. |
| CP-05 C6 / D-04 | EX-02 showed different entry and observed plates in the preview and required manual confirmation before payment. | Fresh functional evidence available. Named RES-04 confirmation or authorized disposition remains due. |
| CP-07 B1 | QR rendered and QR entry succeeded. | The paid exit used plate lookup. QR exit and the missing capture remain outstanding. |
| CP-07 B2 | Reactivation and tariff edit succeeded. The new 2,300 ₫ fee applied at exit. | User can accept the browser record for these behaviors or request screenshots. |
| CP-07 B3 | Access Log showed full-plate access and automatic purge. | Capture Staff viewing a masked plate on a closed session. |
| CP-07 B4 | Manual cancellation succeeded and freed a spot live. | Manual no-show wait remains unobserved. Use automated coverage if explicitly accepted. |
| CP-07 B5 | All four reporting sections rendered. | User can accept the browser record or request the full-page screenshot. |
| CP-07 B6 | AT-100 produced 100 sessions with zero rejects. | Timings for AT-100 and TC-EXIT-07 and the missing car-exit capture remain outstanding. |
| CP-07 B7 | New entry refused during suspension, the already parked guest exited, and reactivation succeeded. | User can accept the browser record for the sequence or request visual captures. |
| CP-07 B8 | Lost-card preview and payment succeeded. The isolated DB contained a matching MANUAL_CONFIRM row. | The LOST_CARD event and its visual/log evidence were not captured in this run. |
| CP-07 B9 | Fresh EX-01 used the simulator to fill Zone C and returned ZONE_FULL. The DB was retained for the purge check. | User can accept this as a fresh replacement for the undocumented historical setup. |
| CP-07 C | Supplies fresh evidence for review. | Named RES-04 recheck remains due. The existing project-side demo decision is recorded above. |

Proposed user decision batch: accept the fresh P13 browser record for CP-07 B2, B5, B7, and B9, or request specific captures. Keep B1, B3, B4, B6, and B8 open for their remaining evidence. CP-05 and CP-07 remain pass with conditions. PDF review stays last.

### CP-07 automation assessment

On 28 November 2026 the user accepted the proposed fresh P13 evidence for B2, B5, B7, and B9 at the project level.

| Item | Can Codex gather the remaining evidence? |
| --- | --- |
| B1 | Yes. Run QR entry and exit in the browser and capture the result as fresh evidence. The original missing image remains a historical gap unless recovered. |
| B3 | Yes. Close a session, inspect it as Staff, and capture the displayed masked plate. |
| B4 | Yes for a controlled rerun. Manual cancellation was already observed. Prepare a reservation with a short remaining hold in an isolated database, let the app expire it, and verify the UI and availability. The original manual run remains unverified. |
| B6 | Yes. Time a fresh AT-100 and TC-EXIT-07 run and capture the car-exit step. Report the exact build and measurement method. Historical timings remain unverified. |
| B8 | Yes. Repeat EX-03 and verify the LOST_CARD event and MANUAL_CONFIRM audit row for the same session. |
| C | Evidence preparation can be automated. The named independent recheck or an authorized disposition remains a project decision. |

Fresh evidence can be presented for acceptance as a replacement for missing historical artifacts. CP-07 remains pass with conditions pending that decision and the independent recheck.

### CP-07 fresh evidence for B1, B3, B4, B6 and B8

On 28 November 2026, Codex ran Chrome via Playwright on the production build from `21ac6ea`, runtime-equivalent to merged `f9f9b71`, using an isolated migrated and seeded SQLite database. Browser HTTP timings are rounded milliseconds from request start to response end. The results below are from a new run.

| Gap | Result | Evidence |
| --- | --- | --- |
| B1 | QR entry and QR exit both returned HTTP 200. The exit confirmation closed session `cmwztr312000ntfzf2o9qttj7`. | [Entry](m3/evidence/cp07-fresh/b1-qr-entry.png), [QR exit preview](m3/evidence/cp07-fresh/b1-qr-exit-preview.png) |
| B3 | Staff opened the closed session detail and saw `***-**001` for the seeded vehicle. | [Masked plate](m3/evidence/cp07-fresh/b3-staff-closed-mask.png) |
| B4 | A real browser reservation reduced Zone A availability from 150 to 149. The isolated fixture's arrival and hold timestamps were shortened while status remained PENDING. The application timer changed the reservation to NO_SHOW and the Staff dashboard returned to 150 without a reload. | [Hold](m3/evidence/cp07-fresh/b4-slot-held.png), [Customer no-show](m3/evidence/cp07-fresh/b4-no-show.png), [Released slot](m3/evidence/cp07-fresh/b4-slot-released.png) |
| B6 | AT-100 returned 100 sessions, 100 entries, 69 exits and zero rejects in 570 ms (seed 68). TC-EXIT-07 car entry was 18 ms and exit confirmation was 7 ms, both below 2 s. The car preview was 4 ms and showed 10,000 ₫. | [AT-100](m3/evidence/cp07-fresh/b6-at100.png), [Car exit preview](m3/evidence/cp07-fresh/b6-car-exit-preview.png) |
| B8 | EX-03 lost-card preview and payment both returned HTTP 200. A read-only database query matched exactly one LOST_CARD session event and one MANUAL_CONFIRM access log target to the same session, `cmwztr8sm0017tfzfvj050syt`. | [Lost-card preview](m3/evidence/cp07-fresh/b8-lost-card-preview.png) |

Proposed decision: accept this fresh evidence for B1, B3, B4, B6 and B8. Retain the original run's historical gaps as historical. Condition C remains open for the named independent recheck or authorized disposition, and CP-07 remains pass with conditions.

### Final CP-07 disposition

On 28 November 2026, the user explicitly accepted the fresh evidence for B1, B3, B4, B6 and B8 and waived the RES-04 recheck for CP-07. The earlier acceptance of B2, B5, B7 and B9 completes Condition B. Condition A was already satisfied by the pinned automated and smoke recheck. Condition C is closed by the user's waiver and the previously recorded project-side demo decision. The waiver is attributed to the user. No RES-04 sign-off is claimed.

**CP-07: Pass.** This supersedes the earlier conditional CP-07 entries in this log. Historical evidence gaps remain documented alongside the replacement evidence. CP-05 and CP-08 are separate gates.

### CP-05 RES-04 waiver

On 28 November 2026, the user waived the RES-04 checklist for CP-05. This closes the requirement for RES-04's separate confirmation of the fresh D-04/CP-07 evidence. The functional evidence remains linked above, and no RES-04 sign-off is claimed.

**CP-05 remains Pass with conditions.** The existing CP-05 records still require RES-02's independent verification for C1 (historical three-zone hand count) and C4 (Quality Evidence rows). The user's earlier project-side acceptance of those records is recorded above, but does not claim that RES-02 performed an independent verification. The source checklist remains preserved as the historical record.

### Final CP-05 disposition

On 28 November 2026, the user waived the requirement to obtain and verify RES-02's independent verification for CP-05 C1 and C4. The user's earlier decisions accepting the C1 count evidence, C4 Quality Evidence rows, and ISS-06–ISS-11 dispositions are recorded above. The RES-04 checklist waiver is recorded above as well. C2 remains an explicitly accepted waiver, with Q23 still unmet and disclosed.

The C1 and C4 evidence is accepted for this project closeout under the user's authority. This record does not state or imply that RES-02 independently verified or signed those items.

**CP-05: Pass.** This supersedes earlier conditional-status entries in this log. The C2 video was not sent. CP-07 is Pass. CP-08 remains a separate project record.
