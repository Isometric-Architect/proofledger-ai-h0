# Vercel Deployment Checklist

## Required environment variables

```text
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=<set in Vercel only>
AWS_SECRET_ACCESS_KEY=<set in Vercel only>
PROOFLEDGER_TABLE=ProofLedgerEvents
PROOFLEDGER_DEMO_MODE=0
```

## After deployment

1. Open `/api/health` and confirm `database: DynamoDB` and `demoMode: false`.
2. Call `/api/seed-demo` once.
3. Open the dashboard and confirm receipt rows appear.
4. Open one subject timeline page.
5. Capture the Vercel URL and Vercel Team ID.
6. Run the local secret scan before pushing any update.

## Notes

Use short-lived or least-privilege AWS credentials for the hackathon if possible. The public repo must not contain `.env.local`, AWS keys, Vercel tokens, or customer data.
