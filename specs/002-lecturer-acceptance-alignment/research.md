# Phase 5 Planning Decisions

| Decision | Rationale | Alternative considered |
| --- | --- | --- |
| Extend the merged Phase 5 specification. | PR #15 is the authoritative map of all 11 answers. Appending RES-01 delivery requirements keeps the original product IDs usable. | A second product spec would duplicate the same answers. |
| Separate work by current PR ownership. | GitHub showed #11/#17 and #9/#16 as stacked on 24 November. RES-01’s independent records can advance from main while the owners finish those stacks. | A single combined PR would overlap migrations, SRS and project evidence. |
| Treat #11 and #17 as one build dependency for A-87. | #11 owns exit-based purge and Staff masking. #17 owns lot hours, Customer pricing and group changes. Neither alone contains all acceptance behavior. | Review head-level evidence for early feedback, then rerun affected checks on the integrated build. |
| Keep the gate record separate from implementation and estimates. | PR #10 owns CR-03/V2.0. Its latest review asks for an identified integrated build and consistent option totals of 28 h and 16 h. PR #13's latency samples and PR #18's pending A-31/T12 cannot stand in for final QA evidence. | Approve staged delivery only when the unresolved checks are recorded with an owner and QA disposition. |
| Make direct pushes race-safe. | A PR head can move or merge while RES-01 works. A normal push against a freshly verified head preserves teammate commits. | Use an owner handoff when the head cannot be updated. A merged item requires a new delta only when work remains. |
