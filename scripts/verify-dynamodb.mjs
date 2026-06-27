import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

const tableName = process.env.PROOFLEDGER_TABLE || "ProofLedgerEvents";
const region = process.env.AWS_REGION || "us-east-1";
const tenant = "demo";
const subject = "refund_case_db_verify";
const now = new Date().toISOString();

function sha256(value) {
  return crypto.createHash("sha256").update(JSON.stringify(value, Object.keys(value).sort())).digest("hex");
}

const receipt = {
  PK: `TENANT#${tenant}`,
  SK: `RECEIPT#${now}#dbverify`,
  GSI1PK: "STATUS#HUMAN_REVIEW_ONLY",
  GSI1SK: now,
  GSI2PK: `SUBJECT#${subject}`,
  GSI2SK: `RECEIPT#${now}#dbverify`,
  tenantId: tenant,
  subjectId: subject,
  caseKind: "refund_exception",
  agentName: "RefundAgent",
  recommendation: "Database verification receipt for ProofLedger AI.",
  requestedAction: "open_human_review",
  allowedAction: "open_human_review",
  decision: "HUMAN_REVIEW_ONLY",
  findings: [],
  missingEvidence: [],
  evidenceKinds: ["order_record", "payment_record", "customer_statement", "delivery_status"],
  amountCents: 125000,
  currency: "USD",
  redactionStatus: "PUBLIC_SAFE",
  createdAt: now
};
receipt.receiptHash = sha256(receipt);

const client = DynamoDBDocumentClient.from(new DynamoDBClient({ region }));

await client.send(
  new PutCommand({
    TableName: tableName,
    Item: receipt,
    ConditionExpression: "attribute_not_exists(PK) AND attribute_not_exists(SK)"
  })
);

const response = await client.send(
  new QueryCommand({
    TableName: tableName,
    IndexName: "GSI2",
    KeyConditionExpression: "GSI2PK = :subject",
    ExpressionAttributeValues: { ":subject": `SUBJECT#${subject}` }
  })
);

const items = response.Items || [];
const ok = items.some((item) => item.receiptHash === receipt.receiptHash);

const out = {
  service: "ProofLedger AI",
  tableName,
  region,
  subjectId: subject,
  receiptHash: receipt.receiptHash,
  wroteReceipt: true,
  queriedTimeline: true,
  matchingReceiptFound: ok,
  itemCountForSubject: items.length,
  createdAt: now,
  claimCeiling: "DynamoDB connectivity proof only; not production readiness"
};

fs.mkdirSync(path.join(process.cwd(), "receipts"), { recursive: true });
fs.writeFileSync(path.join(process.cwd(), "receipts", "dynamodb_verification_receipt.json"), JSON.stringify(out, null, 2));

console.log(JSON.stringify(out, null, 2));
if (!ok) process.exit(1);
