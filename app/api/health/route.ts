import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

function maskTableName(value: string | undefined) {
  if (!value) return null;
  if (value.length <= 6) return value;
  return `${value.slice(0, 4)}…${value.slice(-2)}`;
}

export async function GET() {
  const demoMode = process.env.PROOFLEDGER_DEMO_MODE === "1";
  const table = process.env.PROOFLEDGER_TABLE ?? "ProofLedgerEvents";
  const region = process.env.AWS_REGION ?? null;

  return NextResponse.json({
    app: "ProofLedger AI",
    status: "ok",
    purpose: "Evidence memory for AI-agent decisions",
    database: "Amazon DynamoDB",
    tableConfigured: Boolean(table),
    tableNameMasked: maskTableName(table),
    regionConfigured: Boolean(region),
    region,
    demoMode,
    claimBoundary: "hackathon_prototype_no_business_action",
    strongestAction: "open_human_review",
    timestamp: new Date().toISOString()
  });
}
