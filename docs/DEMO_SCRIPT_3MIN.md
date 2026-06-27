# 3-Minute Demo Script

## 0:00–0:20 Problem

AI agents can prepare business decisions, but a recommendation is not approval. A high-value refund may still be missing evidence or violating policy.

## 0:20–0:45 Product

This is ProofLedger AI. It stores AI-agent recommendations as DynamoDB evidence receipts and shows a Vercel review dashboard.

## 0:45–1:15 Scenario 1: HOLD

Open the missing evidence receipt. Show that delivery proof is missing. Decision: HOLD.

## 1:15–1:45 Scenario 2: BLOCK

Open the high-value auto-action attempt. Show external action enabled before review. Decision: BLOCK.

## 1:45–2:10 Scenario 3: HUMAN_REVIEW_ONLY

Open the complete packet. Show all evidence present and allowed action is open_human_review.

## 2:10–2:30 DynamoDB

Show AWS Console table ProofLedgerEvents and receipt items. Mention GSI status queue and subject timeline.

## 2:30–2:50 Architecture

Show Vercel Next.js → API Route → validator → DynamoDB → dashboard.

## 2:50–3:00 Boundary

ProofLedger does not execute refunds or approve cases. It creates evidence memory for human review.
