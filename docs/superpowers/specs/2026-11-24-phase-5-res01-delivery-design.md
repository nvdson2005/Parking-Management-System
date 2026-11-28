# Phase 5 RES-01 Delivery Design

**Date** 24 November 2026

**Owner** Nguyễn Võ Đức Sơn (RES-01)

The Phase 5 interpretation is already recorded in [Spec Kit](../../../specs/002-lecturer-acceptance-alignment/spec.md). This design covers the work RES-01 must deliver or review to turn those decisions into a verified pilot handover.

## Delivery paths

- Use the separate RES-01 PR from current `main` for standalone work. It owns the review trail, Client Interaction Log handoff, M-03 decision and change impact, weekly log and actuals, A-61 acceptance evidence, demo and rehearsal, and RES-01 reflection.
- Push changes that belong to an open PR directly to that PR’s head, including RES-01 sections or review fixes. Coordinate with the PR owner, preserve their commits, and use the latest head with a normal push. If the PR has merged, locate its landed changes and submit only the remaining delta from current `main`. If the head is inaccessible, provide the change to its owner.
- Keep the product stack #11 then #17 and the documentation stack #9 then #16. The product changes and migrations belong to RES-03. The SRS and P18 revisions stay with RES-04. RES-01 owns approval, the release decision, and their assigned contributions to those PRs.

## Acceptance and failure handling

Use one pinned build for the A-87 evidence and client demo. An integration candidate can support a dry run if its exact commit, migrations, and differences from the release are recorded. The QA verdict must identify the tested build, measured results, and exclusions. A missing check or unmerged mandatory capability stays open in P14.

The accepted scope is one pilot lot with per-visit pricing, informational opening hours, group-specific rates before parking, Manager-applied group changes, automatic exit-based retention, and role-appropriate plate visibility. Normal-load timing, 5/5 exceptions, the separate full-lot refusal check, and the nine browser/width combinations remain acceptance evidence.

Only reproduce and patch the simulator overlap defect if it still affects the pinned candidate after the planned single-operator rehearsal. Keep any patch with the branch that owns that defect. Record the gate decision, capacity assumptions, and product or evidence gaps before approving V2.0. Keep dated V1.0 evidence archived.
