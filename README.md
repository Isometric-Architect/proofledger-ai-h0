# ProofLedger AI

Evidence memory for AI-agent decisions.

ProofLedger AI is a Vercel + AWS DynamoDB app for storing AI-agent recommendations as evidence receipts before any business action is allowed.

The demo domain is a high-value refund exception workflow. An AI agent may prepare a recommendation, but ProofLedger records the evidence, checks action boundaries, and shows a human-review dashboard.

The strongest decision is:

```text
HUMAN_REVIEW_ONLY
```

ProofLedger does not issue refunds, settle claims, change customer records, merge code, deploy software, or certify production readiness.

## H0 Alignment

- Hackathon: H0 — Hack the Zero Stack with Vercel v0 and AWS Databases
- Track: Monetizable B2B App
- Frontend: Next.js on Vercel, with UI scaffoldable by v0
- Database: Amazon DynamoDB
- Core object: AI decision receipt
- Public-safety mode: synthetic data only

## What It Does

ProofLedger AI stores and displays:

- AI-agent recommendation packets
- evidence completeness status
- policy findings
- requested action vs allowed action
- receipt hash and previous receipt hash
- subject timeline for a case
- human-review status

It returns:

```text
HOLD
BLOCK
HUMAN_REVIEW_ONLY
```

## Quick Start

Install dependencies:

```bash
npm install
```

Copy environment variables:

```bash
cp .env.example .env.local
```

For local UI-only demo:

```bash
PROOFLEDGER_DEMO_MODE=1 npm run dev
```

For H0 final submission, use DynamoDB:

```bash
npm run create-table
npm run dev
```

Then open:

```text
http://localhost:3000/seed-demo
http://localhost:3000
http://localhost:3000/api/health
```

The `/seed-demo` page writes or checks the synthetic receipt records. The `/api/health` endpoint confirms the intended DynamoDB-backed deployment without exposing credentials.

## Required Environment Variables

```text
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=<set-in-vercel-only>
PROOFLEDGER_TABLE=ProofLedgerEvents
PROOFLEDGER_DEMO_MODE=0
```

For Vercel, set these in Project Settings → Environment Variables. Do not commit credentials.

## Demo Scenarios

1. `HOLD`: delivery proof is missing.
2. `BLOCK`: high-value refund action is enabled before review.
3. `HUMAN_REVIEW_ONLY`: evidence is complete and only human review is allowed.
4. `BLOCK`: receipt is reused for the wrong subject.

## DynamoDB Design

The app uses a single table:

```text
ProofLedgerEvents
```

Primary key:

```text
PK = TENANT#demo
SK = RECEIPT#<timestamp>#<receipt_hash>
```

Indexes:

```text
GSI1PK = STATUS#HOLD/BLOCK/HUMAN_REVIEW_ONLY
GSI1SK = <created_at>

GSI2PK = SUBJECT#<subject_id>
GSI2SK = RECEIPT#<timestamp>#<receipt_hash>
```

This supports a review queue and a subject evidence timeline.


## H0 Demo Checklist

Before recording the video, capture these screens:

1. Vercel dashboard URL running ProofLedger AI.
2. DynamoDB table named `ProofLedgerEvents`.
3. DynamoDB items with `PK`, `SK`, `GSI1PK`, `GSI2PK`, and `receiptHash`.
4. ProofLedger dashboard with HOLD, BLOCK, and HUMAN_REVIEW_ONLY receipts.
5. Subject timeline page for one refund case.
6. `/api/health` JSON showing `database: Amazon DynamoDB`.

Do not show AWS credentials, access keys, real customer data, or private verifier material.

## Public Safety Boundary

This repository may include synthetic packets, public-safe receipt schemas, dashboard code, tests, and documentation.

It must not include real customer data, credentials, private validation banks, hidden thresholds, verifier seeds, private negative controls, or production approval keys.

## Claim Ceiling

This is a hackathon prototype. It is not production approval, compliance certification, security certification, legal advice, financial authorization, field validation, or an autonomous action system.

## Submission v0.2 additions

This version adds a subject timeline page, a safe `/api/health` endpoint, DynamoDB verification script, static demo fallback, and final H0 submission runbook.

Useful commands:

```bash
npm run create-table     # create DynamoDB table and wait until it exists
npm run seed             # call the app seed endpoint
npm run verify-db        # write and query a direct DynamoDB verification receipt
npm run static-demo      # generate demo/index.html for backup recording
npm run audit            # check required files and public-safety boundaries
```

The final H0 submission should use real DynamoDB mode:

```text
PROOFLEDGER_DEMO_MODE=0
```

Demo mode is only for UI rehearsal:

```text
PROOFLEDGER_DEMO_MODE=1
```

See `docs/H0_FINAL_SUBMISSION_RUNBOOK.md` for the final submission checklist.
