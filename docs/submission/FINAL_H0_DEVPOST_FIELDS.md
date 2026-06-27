# ProofLedger AI — Final H0 Devpost Fields

## Project name

ProofLedger AI

## Tagline

Evidence memory for AI-agent decisions.

## Track

Track 2: Monetizable B2B App

## Elevator pitch

ProofLedger AI stores AI-agent recommendations as DynamoDB receipts and shows whether each one should be held, blocked, or sent to human review only.

## Built with

- Vercel
- v0-style Next.js UI workflow
- Next.js App Router
- Amazon DynamoDB
- AWS SDK for JavaScript
- TypeScript

## AWS Database used

Amazon DynamoDB.

## About

### Inspiration
AI agents can prepare business decisions quickly. But a recommendation is not the same as an approved action. A refund, claim, onboarding step, or account update may still be missing evidence, violate policy, or reuse the wrong case context.

### What it does
ProofLedger AI is an evidence memory app for AI-agent decisions. It stores each recommendation as a receipt in AWS DynamoDB, checks evidence completeness and action boundaries, and shows a Vercel review dashboard. The result is HOLD, BLOCK, or HUMAN_REVIEW_ONLY. The app never executes the business action.

### How we built it
We built a Next.js dashboard deployable on Vercel and designed the UI so it can be scaffolded and iterated with v0. The backend uses DynamoDB as an append-only receipt ledger. Each receipt includes a subject ID, decision status, evidence fields, policy findings, redaction status, and a receipt hash. The dashboard queries receipts by status and by subject timeline.

### Challenges we ran into
The main challenge was keeping the action boundary clear. It is easy to make an AI workflow look complete. It is harder to keep a durable record of what evidence supports the recommendation and what action is still not allowed.

### Accomplishments that we're proud of
We built a working full-stack prototype with Vercel and DynamoDB. It catches missing evidence, policy bypass, subject mismatch, unsafe external action, and public-safety redaction issues while keeping the strongest result limited to human review.

### What we learned
The database is not just storage. For AI-agent systems, it becomes the memory of what was claimed, what evidence existed, and what action was allowed.

### What's next
Next we would connect ProofLedger to real enterprise workflow systems, add reviewer identity and approval attestations, and support customer-specific policy packs.

## Claim boundary

ProofLedger AI is a hackathon prototype. It does not execute refunds, settle claims, update customer records, approve production actions, provide legal or compliance certification, or replace human review.
