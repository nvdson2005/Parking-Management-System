# Implementation Plan: Session Entry Details

**Branch**: `008-d05-session-entry-details` | **Date**: 2026-11-28 | **Spec**: [spec.md](spec.md)

## Summary

Display the stored entry identification method and entry staff name on the existing session detail page, with English and Vietnamese labels. No data model or service change is needed.

## Technical Context

**Language/Version**: TypeScript, Next.js 15, React 19
**Primary Dependencies**: Existing Next.js App Router, Prisma 6, i18n dictionaries
**Storage**: Existing SQLite-backed ParkingSession and User records
**Testing**: `tests/plate-q46.test.ts` passed 10/10; `npm run build` passed on 28 November 2026
**Target Platform**: Web application
**Project Type**: Full-stack web application
**Performance Goals**: No additional request; one existing relation loaded with the session
**Constraints**: Preserve access control, plate masking, and access logging
**Scale/Scope**: One detail page and two locale dictionaries

## Constitution Check

- Layered architecture: display-only change in the existing page; no business logic moves.
- Concurrency and edge boundaries: not affected.
- Test-backed changes: focused test passed 10/10 and the production build passed on 28 November 2026.
- Traceable delivery: the main commit references A-68 and D-05.
- Shared entry/exit service: not affected.

## Design

- Include the existing entry-staff relation in the page's session query.
- Render the localized method value using existing entry-method translations.
- Add localized session-detail labels for identification method and entry staff.
- Leave privacy and access-log code untouched.

## Project Structure

```text
src/app/staff/sessions/[id]/page.tsx
src/i18n/en.ts
src/i18n/vi.ts
```

**Structure Decision**: Extend the existing server-rendered detail view and its paired locale dictionaries.

## Complexity Tracking

No constitution violations or new abstractions.
