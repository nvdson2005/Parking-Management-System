# Implementation Plan: CR-03 UI fixes

**Branch**: `fix/cr-03-ui` | **Date**: 2026-11-24 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `specs/006-cr03-ui-fixes/spec.md`

## Summary

Five small fixes, no schema change:

1. **Availability screen** (`LiveAvailability`): last-update time, a used column for Staff and Manager, and a "full" badge when free is 0. Closes A-49 gaps G1–G3.
2. **Reservation form**: the default arrival time is valid, past times cannot be picked, and the form says when today is closed.
3. **Staff entry form**: the selects show labels, not raw values.
4. **Early arrival** (FR-51): the `EARLY_ARRIVAL` error carries the booked time and zone to the Staff prompt.
5. **Font**: `--font-sans` points to the Geist variable.

Every fix ships with a vitest test (render tests use `renderToStaticMarkup`, the pattern already used in the repo).

## Technical Context

**Language/Version**: TypeScript 5, Node 20

**Primary Dependencies**: Next.js 15 App Router, React 19, `@base-ui/react` 1.9 (Select), Tailwind 4, shadcn components, Zod

**Storage**: SQLite via Prisma 6. No schema change.

**Testing**: vitest. Service tests run on `prisma/test.db`; component tests render to static HTML with `react-dom/server`.

**Target Platform**: browsers Chrome, Edge, Firefox; single-process Node server

**Project Type**: full-stack web application (Next.js)

**Performance Goals**: no change. The availability update stays within 5 s (SC-001 of spec 002, measured in A-49).

**Constraints**: i18n key parity between vi and en; middleware stays Edge-safe (not touched); no new lock-taking calls.

**Scale/Scope**: about 8 source files, 7 test files; about 2.6 h

## Constitution Check

| Principle | Check | Result |
|---|---|---|
| I. Layered architecture | The early-arrival details are produced by the `recordEntry` service and passed through `handle()`. No business logic goes into the route or the component. `DomainError` gains an optional `details` field; no new error code. | Pass |
| II. Concurrency safety | `recordEntry` already runs inside `withLock`. Reading the reservation's zone name happens in the same transaction. No new lock and no nested lock. Availability broadcasts are unchanged. | Pass |
| III. Edge and access boundaries | Middleware untouched. The details sent to Staff (arrival time, zone name) contain no plate. The used column is shown only to STAFF and MANAGER. Each role page passes its own role; the section layout (`requireSection`) already blocks any other role from that page. | Pass |
| IV. Test-backed changes | Each change has a test that fails without it (see quickstart). New strings are added to both `en.ts` and `vi.ts`. `npm test`, `npm run lint` and `npm run build` are run before closing. | Pass |
| V. Traceable delivery | Commits reference A-49 and CR-03 (and FR IDs). Nothing under `docs/m2-report/` is edited. Work happens on the main checkout. | Pass |
| VI. Shared service layer for entry/exit (constitution v1.1.0, added 24/11) | The FR-51 details are produced inside `recordEntry`, the shared entry service, so the route and the simulator get the same error. No caller-only rule is added; the simulator does not change. | Pass |

Delivery workflow: brainstorming is skipped because the design was agreed and approved in the CR (as in specs 002 and 003). CP-02 has passed. The `codegraph` CLI was not installed during T001–T019, so navigation used grep and Read. It was installed and indexed on 24/11 (`codegraph init`, 194 files) and the blast radius of US4 was checked with `codegraph_explore` (analysis finding D1).

Post-design re-check: still Pass. The only API change adds a field to one error response (see [contracts](contracts/early-arrival-error.md)).

## Project Structure

### Documentation (this feature)

```text
specs/006-cr03-ui-fixes/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   ├── early-arrival-error.md
│   └── availability-view.md
├── checklists/requirements.md
└── tasks.md
```

### Source Code (repository root)

```text
src/
├── app/
│   ├── globals.css                      # --font-sans fix
│   ├── customer/page.tsx                # pass role to LiveAvailability
│   ├── staff/page.tsx                   # pass role
│   ├── manager/page.tsx                 # pass role
│   ├── customer/reservations/page.tsx   # default arrival, min, closed message
│   └── staff/entry/EntryForm.tsx        # select labels, early-arrival details
├── components/LiveAvailability.tsx      # updated-at, used column, full badge
├── lib/arrival.ts                       # new pure helper: default arrival time
├── server/
│   ├── errors.ts                        # DomainError optional details
│   ├── api.ts                           # handle() includes details in the body
│   └── services/entry.ts                # EARLY_ARRIVAL with arrival time and zone
└── i18n/{en,vi}.ts                      # new keys
tests/
├── live-availability.test.ts            # render: role, used, full, updated-at
├── arrival.test.ts                      # helper
├── entry.test.ts                        # + EARLY_ARRIVAL details
├── errors.test.ts                       # DomainError details; handle() passes them
├── entry-form.test.ts                   # render: select labels
├── early-arrival-prompt.test.ts         # render: booked time and zone (FR-51)
└── globals-css.test.ts                  # --font-sans not self-referencing
```

**Structure Decision**: existing single Next.js project; files are changed in place, plus one new helper and new test files.

## Complexity Tracking

No principle is violated. Deviations from the delivery workflow, justified:

| Deviation | Reason |
|---|---|
| `superpowers:brainstorming` not run | The design was agreed and approved in CR-03 (#20) by RES-01 |
| `speckit-clarify` not run | The CR decision left no open question on scope, owners or acceptance |
| `speckit-analyze` run after implementation, not before | Added when the workflow gap was noticed (24/11); its findings were fixed before the PR |
| `codegraph` not used during T001–T019 | Not installed on this machine until 24/11; installed and indexed before the review |
