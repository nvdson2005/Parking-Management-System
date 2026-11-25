# PR #17 integration and fee-group approval

## Decision

Integrate the final PR #17 feature branch onto the latest `main`. A Customer's pending fee-group request is the exact group a Manager may approve. A Manager's attempt with no pending request or a different target returns `VALIDATION` without changing the account, clearing the request, logging an approval, or notifying the Customer. The approved update clears the request, writes its audit row, and creates the notification in one transaction. Existing open sessions keep their original fee group.

The Manager accounts page presents an approval button only for a pending request. It shows the current group as text. There is no separate rejection workflow in the agreed Phase 5 scope.

## Acceptance

- A Customer requests the other group; their group remains unchanged until Manager approval.
- A Manager can approve that exact pending group once; the request is cleared and the existing audit and notification behavior remains.
- A Manager cannot apply a group without a request or apply a different group from the request, through either the service or API.
- No-request and mismatched-target failures leave the group, request, audit rows, and notifications unchanged.
- The merged build passes the group-change tests, full suite, lint, build, and migrations on a disposable database.

The Phase 5 FR-003 decision and Q38 interaction log already establish this behavior. No new schema or dependency is needed.
