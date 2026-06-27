# ProofLedger AI — Reviewer One-Pager

ProofLedger AI is an evidence memory app for AI-agent decisions.

An agent may recommend a refund, claim settlement, or account update. ProofLedger stores the recommendation as a DynamoDB receipt and checks whether it is missing evidence, violates policy, mismatches the case subject, or attempts an external business action.

The app returns only three statuses:

- HOLD
- BLOCK
- HUMAN_REVIEW_ONLY

It never executes the business action.

## Why DynamoDB matters

ProofLedger uses DynamoDB as an append-only receipt ledger. The table supports a status review queue and a subject timeline.

- `GSI1` queries receipts by decision status.
- `GSI2` reconstructs the evidence timeline for a single subject.
- `receiptHash` makes each packet reviewable and repeatable.

## Demo domain

High-value refund exception workflow.

## Claim boundary

Prototype only. Not production approval, compliance certification, legal advice, financial authorization, or autonomous business action.
