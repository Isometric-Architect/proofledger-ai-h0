# AWS Database Screenshot Guide

Capture one screenshot for Devpost that proves AWS Database usage.

Recommended screenshot:

1. AWS Console → DynamoDB → Tables → `ProofLedgerEvents`.
2. Show table name, region, primary key `PK` and sort key `SK`.
3. Show Global Secondary Indexes `GSI1` and `GSI2` if visible.
4. Open Explore table items and show at least one synthetic receipt item.
5. Avoid showing credentials, IAM access keys, account secrets, or real customer data.

Good visible fields:

- `PK = TENANT#demo`
- `SK = RECEIPT#...`
- `subjectId = refund_case_1003`
- `decision = HUMAN_REVIEW_ONLY`
- `allowedAction = open_human_review`
- `receiptHash = ...`

Do not show real account IDs if you prefer to crop them out. Do not show IAM secrets.
