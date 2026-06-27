# ProofLedger AI — 3 Minute Demo Script

## 0:00–0:20 — Problem

AI agents can prepare refund, claim, or account-update decisions quickly. But a prepared recommendation is not an approved action. The missing piece is evidence memory: what was claimed, what evidence existed, and what action was allowed.

## 0:20–0:45 — App overview

This is ProofLedger AI. It is a Vercel dashboard backed by Amazon DynamoDB. Every AI-agent recommendation becomes a receipt. The receipt is either HOLD, BLOCK, or HUMAN_REVIEW_ONLY.

## 0:45–1:20 — HOLD scenario

Show the refund case with missing delivery status. The dashboard returns HOLD because required evidence is missing. No business action is enabled.

## 1:20–1:50 — BLOCK scenario

Show the high-value refund case where the agent attempted to issue a refund before human approval. ProofLedger returns BLOCK because the external action boundary was violated.

## 1:50–2:15 — HUMAN_REVIEW_ONLY scenario

Show the complete packet. Evidence is present, redaction is public-safe, and the allowed action is only `open_human_review`. It does not issue the refund.

## 2:15–2:35 — DynamoDB evidence

Show the DynamoDB table. Point to `PK`, `SK`, `GSI1PK`, `GSI2PK`, `receiptHash`, and the receipt items. This is the evidence ledger.

## 2:35–2:50 — Architecture

Show the architecture diagram: Vercel / Next.js dashboard, API routes, validator, DynamoDB table, status index, subject timeline index.

## 2:50–3:00 — Boundary

Close with the boundary: ProofLedger is not an auto-approval system. It stores evidence and opens human review only.
