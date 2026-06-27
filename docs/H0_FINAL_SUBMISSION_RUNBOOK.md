# ProofLedger AI — H0 Final Submission Runbook

## Goal

Submit ProofLedger AI as a Track 2 B2B application for H0: Vercel/v0 + AWS Databases.

ProofLedger AI stores AI-agent recommendations as evidence receipts in DynamoDB and shows a Vercel review dashboard. It can return HOLD, BLOCK, or HUMAN_REVIEW_ONLY. It does not execute refunds, claim settlements, account updates, merge/deploy actions, or production approvals.

## Final submission evidence to collect

1. Public GitHub repository URL.
2. Published Vercel project URL.
3. Vercel Team ID.
4. Architecture diagram from `docs/architecture_diagram.svg`.
5. AWS DynamoDB evidence screenshot showing the `ProofLedgerEvents` table and at least one receipt item.
6. Less than 3-minute demo video showing the working app and DynamoDB usage.
7. Devpost fields from `docs/DEVPOST_FIELDS.md`.

## Recommended live build path

```bash
npm install
cp .env.example .env.local
# edit .env.local with AWS_REGION, PROOFLEDGER_TABLE, AWS credentials, PROOFLEDGER_DEMO_MODE=0
npm run create-table
npm run dev
curl -X POST http://localhost:3000/api/seed-demo
npm run verify-db
npm run audit
```

Then deploy to Vercel with the same environment variables.

## Demo mode fallback

For UI rehearsal only:

```bash
PROOFLEDGER_DEMO_MODE=1 npm run dev
npm run static-demo
```

Do not present demo mode as the final H0 database evidence. The final H0 submission should show DynamoDB usage.

## 3-minute video shot list

1. Problem: AI recommendations are not approvals.
2. Dashboard: HOLD, BLOCK, HUMAN_REVIEW_ONLY queue.
3. HOLD case: missing delivery proof.
4. BLOCK case: high-value refund auto-action attempt.
5. HUMAN_REVIEW_ONLY case: complete packet ready for a person.
6. Subject timeline: receipt hash and evidence history.
7. DynamoDB console: table and receipt item.
8. Boundary: no external business action executed.

## Public-safe boundary

Allowed in the public repo:

- synthetic packets
- DynamoDB table schema
- receipt schema
- dashboard code
- demo screenshots/video
- public-safe docs

Do not include:

- real customer data
- AWS credentials or Vercel tokens
- private validator internals
- hidden thresholds
- private negative controls
- production approval keys
