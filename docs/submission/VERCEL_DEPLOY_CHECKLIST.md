# Vercel Deploy Checklist

1. Create GitHub repo `proofledger-ai-h0`.
2. Push this public-safe repository.
3. Import the repo into Vercel.
4. Add environment variables:

```text
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=<vercel-env-only>
AWS_SECRET_ACCESS_KEY=<vercel-env-only>
PROOFLEDGER_TABLE=ProofLedgerEvents
PROOFLEDGER_DEMO_MODE=0
```

5. Deploy.
6. Open `/api/health`.
7. Open `/seed-demo`.
8. Open `/` and confirm dashboard records load.
9. Open one subject timeline page.
10. Record the deployed URL for Devpost.

Do not commit `.env.local` or credentials.
