---
name: multi-pr-review
description: Use when asked to review a batch of Smart Parking pull requests supplied as GitHub links or PR numbers.
---

# Multi PR Review

1. Accept a list of GitHub PR links, numbers, or both. Resolve bare numbers against the Smart Parking repository and review each distinct PR in input order.
2. Read each PR description and diff at its current head. Compare the changed behavior with the description, related project docs, and the applicable Spec Kit artifacts under `specs/`. Check confirmed business rules and recorded clarification answers. Flag unresolved questions or missing evidence when they prevent verifying a requirement.
3. After reviewing the entire batch, return one line per PR in chat. Use `APPROVED` when the changes meet the confirmed requirements and `REJECTED` when a blocking mismatch or verification gap remains. For each rejection, write one sentence naming the blocking issue and citing the relevant file or logic, with a line number when available.

   - #42 APPROVED
   - #51 REJECTED — `src/fees.ts:18` rounds down, contrary to the confirmed fee rule.

4. Wait for the user's explicit approval before posting inline comments or submitting a GitHub approval or change request. Post only the actions the user authorizes and recheck the PR head before posting.
