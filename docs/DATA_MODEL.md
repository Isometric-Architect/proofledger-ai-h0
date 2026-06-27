# DynamoDB Data Model

## Table

```text
ProofLedgerEvents
```

## Primary Key

```text
PK = TENANT#<tenant_id>
SK = RECEIPT#<created_at>#<receipt_hash_prefix>
```

## GSI1: Review Queue by Status

```text
GSI1PK = STATUS#<HOLD|BLOCK|HUMAN_REVIEW_ONLY>
GSI1SK = <created_at>
```

Use this to render dashboard queues.

## GSI2: Subject Timeline

```text
GSI2PK = SUBJECT#<subject_id>
GSI2SK = RECEIPT#<created_at>#<receipt_hash_prefix>
```

Use this to show the evidence history for one case.

## Why DynamoDB

ProofLedger is an append-only event ledger with status queues and subject timelines. DynamoDB fits that access pattern with a small number of deliberate queries.
