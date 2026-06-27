# Public Copy Blocks

## One-line description

ProofLedger AI stores AI-agent recommendations as DynamoDB receipts and shows whether each one should be held, blocked, or sent to human review only.

## Short description

ProofLedger AI is an evidence memory app for AI-agent decisions. It records each recommendation as an append-only DynamoDB receipt, checks evidence completeness and action boundaries, and gives reviewers a Vercel dashboard for HOLD, BLOCK, and HUMAN_REVIEW_ONLY decisions.

## Boundary sentence

ProofLedger never executes refunds, settles claims, updates customer records, or approves production actions. Its strongest result is human review only.
