# AWS Screenshot Checklist for H0

Capture at least one screenshot that proves DynamoDB usage.

Best screenshot:

- AWS Console → DynamoDB → Tables → `ProofLedgerEvents`
- Show table name
- Show partition key `PK` and sort key `SK`
- Show GSIs `GSI1` and `GSI2`

Second screenshot, if possible:

- Explore table items
- Show synthetic receipt items
- Visible fields: `PK`, `SK`, `GSI1PK`, `GSI2PK`, `decision`, `subjectId`, `receiptHash`

Do not show:

- access keys
- secret keys
- account billing details
- real customer data
- private evaluator data
