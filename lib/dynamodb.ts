import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand, QueryCommand, ScanCommand } from "@aws-sdk/lib-dynamodb";
import type { DecisionReceipt } from "./types";
import { demoPackets } from "./demo-data";
import { buildReceipt } from "./validator";

const tableName = process.env.PROOFLEDGER_TABLE ?? "ProofLedgerEvents";
const demoMode = process.env.PROOFLEDGER_DEMO_MODE === "1";

function requireDynamoEnv() {
  if (demoMode) return;

  const required = ["AWS_REGION", "PROOFLEDGER_TABLE"];
  const missing = required.filter((key) => !process.env[key]);
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(", ")}`);
  }
}

function documentClient() {
  requireDynamoEnv();
  const client = new DynamoDBClient({
    region: process.env.AWS_REGION
  });
  return DynamoDBDocumentClient.from(client);
}

const demoReceipts = demoPackets.map(buildReceipt);

export async function putReceipt(receipt: DecisionReceipt): Promise<void> {
  if (demoMode) {
    return;
  }

  const doc = documentClient();
  await doc.send(
    new PutCommand({
      TableName: tableName,
      Item: receipt,
      ConditionExpression: "attribute_not_exists(PK) AND attribute_not_exists(SK)"
    })
  );
}

export async function listReceipts(status?: string): Promise<DecisionReceipt[]> {
  if (demoMode) {
    return demoReceipts
      .filter((receipt) => !status || receipt.decision === status)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }

  const doc = documentClient();

  if (status) {
    const response = await doc.send(
      new QueryCommand({
        TableName: tableName,
        IndexName: "GSI1",
        KeyConditionExpression: "GSI1PK = :status",
        ExpressionAttributeValues: {
          ":status": `STATUS#${status}`
        },
        ScanIndexForward: false
      })
    );

    return (response.Items ?? []) as DecisionReceipt[];
  }

  const response = await doc.send(
    new ScanCommand({
      TableName: tableName,
      Limit: 100
    })
  );

  return ((response.Items ?? []) as DecisionReceipt[]).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function subjectTimeline(subjectId: string): Promise<DecisionReceipt[]> {
  if (demoMode) {
    return demoReceipts
      .filter((receipt) => receipt.subjectId === subjectId)
      .sort((a, b) => a.createdAt.localeCompare(b.createdAt));
  }

  const doc = documentClient();
  const response = await doc.send(
    new QueryCommand({
      TableName: tableName,
      IndexName: "GSI2",
      KeyConditionExpression: "GSI2PK = :subject",
      ExpressionAttributeValues: {
        ":subject": `SUBJECT#${subjectId}`
      },
      ScanIndexForward: true
    })
  );

  return (response.Items ?? []) as DecisionReceipt[];
}

export async function seedDemoReceipts(): Promise<number> {
  const receipts = demoPackets.map(buildReceipt);

  if (demoMode) {
    return receipts.length;
  }

  for (const receipt of receipts) {
    try {
      await putReceipt(receipt);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      const name = typeof error === "object" && error !== null && "name" in error ? String(error.name) : "";
      if (name !== "ConditionalCheckFailedException" && !message.includes("ConditionalCheckFailedException")) {
        throw error;
      }
    }
  }

  return receipts.length;
}
