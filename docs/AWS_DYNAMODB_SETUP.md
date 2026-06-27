# AWS DynamoDB Setup

## Table Creation

Use:

```bash
npm run create-table
```

Expected table:

```text
ProofLedgerEvents
```

Billing mode:

```text
PAY_PER_REQUEST
```

Indexes:

```text
GSI1 = status queue
GSI2 = subject timeline
```

## Vercel Environment Variables

Set these in Vercel Project Settings:

```text
AWS_REGION
AWS_ACCESS_KEY_ID
AWS_SECRET_ACCESS_KEY
PROOFLEDGER_TABLE
PROOFLEDGER_DEMO_MODE=0
```

For final H0 submission, capture a screenshot that proves AWS Database usage. Good screenshots:

- DynamoDB table list showing ProofLedgerEvents
- DynamoDB item view showing receipt rows
- Vercel environment variable names without secret values
- Vercel deployment connected to the app
