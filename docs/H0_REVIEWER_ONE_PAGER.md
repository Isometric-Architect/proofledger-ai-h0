# ProofLedger AI — Reviewer One-Pager

ProofLedger AI is evidence memory for AI-agent decisions.

An AI agent may recommend a refund, claim settlement, account update, or other business action. ProofLedger stores that recommendation as a receipt in AWS DynamoDB, checks evidence completeness and action boundaries, and shows a Vercel dashboard for review.

It returns three outcomes:

- HOLD: evidence or redaction is incomplete.
- BLOCK: policy or action boundary is violated.
- HUMAN_REVIEW_ONLY: a person can review the packet, but the app still does not execute the business action.

The demo uses high-value refund exceptions with synthetic data. It shows missing evidence, unsafe auto-action, complete human-review packets, and subject mismatch.

The core engineering point is the data model. DynamoDB is used as an append-only receipt ledger with status and subject-timeline access patterns.

Claim boundary: this is a hackathon prototype. It is not production approval, compliance certification, or business-action authorization.
