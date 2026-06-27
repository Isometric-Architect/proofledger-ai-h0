# Building an AI Decision Receipt Ledger with Vercel and DynamoDB for H0

I created this post for the purposes of entering the H0: Hack the Zero Stack with Vercel v0 and AWS Databases hackathon.

AI agents can prepare decisions quickly, but a recommendation is not approval. ProofLedger AI is a small evidence memory app for those decisions.

The app uses Vercel for the frontend and API layer, and Amazon DynamoDB as an append-only receipt ledger. Each receipt stores the subject, agent, requested action, allowed action, evidence fields, policy findings, and receipt hash.

DynamoDB fits the access pattern because the app needs two simple views:

1. a review queue by status
2. a timeline by subject

The most important product boundary is simple: ProofLedger never executes the business action. It can show HOLD, BLOCK, or HUMAN_REVIEW_ONLY.
