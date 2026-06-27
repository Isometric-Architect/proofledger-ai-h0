# Devpost Fields Draft

## Project Name

ProofLedger AI

## Elevator Pitch

A Vercel and AWS DynamoDB app that stores AI-agent decisions as evidence receipts before any business action is allowed.

## Track

Monetizable B2B App

## AWS Database Used

Amazon DynamoDB.

## Inspiration

AI agents can prepare business actions quickly, but a recommendation is not approval. A refund, claim, onboarding step, or account update may still be missing evidence, violate policy, or reuse the wrong case context.

## What it does

ProofLedger AI is evidence memory for AI-agent decisions. It stores each recommendation as a receipt in AWS DynamoDB, checks evidence completeness and action boundaries, and shows a review dashboard on Vercel.

It returns HOLD, BLOCK, or HUMAN_REVIEW_ONLY. It never executes the business action.

## How we built it

We built a Next.js app for Vercel and used DynamoDB as an append-only receipt ledger. Each receipt includes a subject ID, status, evidence fields, policy findings, redaction status, and receipt hash. The dashboard queries receipts by status and subject timeline.

## Challenges we ran into

The hard part was keeping the boundary clear. It is easy to make an AI workflow look complete. It is harder to keep a durable record of what evidence supports the recommendation and what action is still not allowed.

## Accomplishments that we're proud of

We built a working full-stack prototype with Vercel and DynamoDB. It catches missing evidence, policy bypass, subject mismatch, unsafe external action, and public-safety redaction issues while keeping the result reviewable.

## What we learned

The database is not just storage. For AI-agent systems, it becomes the memory of what was claimed, what evidence existed, and what action was allowed.

## What's next

Next we would connect ProofLedger to real enterprise workflow systems, add reviewer identity and approval attestations, and support customer-specific policy packs.
