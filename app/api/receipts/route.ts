import { NextResponse } from "next/server";
import { z } from "zod";
import { buildReceipt } from "@/lib/validator";
import { listReceipts, putReceipt } from "@/lib/dynamodb";
import type { AgentDecisionPacket } from "@/lib/types";

export const dynamic = "force-dynamic";

const evidenceSchema = z.object({
  kind: z.string(),
  present: z.boolean(),
  ref: z.string().optional(),
  publicSafe: z.boolean()
});

const packetSchema = z.object({
  tenantId: z.string(),
  subjectId: z.string(),
  caseKind: z.enum(["refund_exception", "claim_exception", "generic_decision"]),
  agentName: z.string(),
  recommendation: z.string(),
  requestedAction: z.enum(["issue_refund", "settle_claim", "update_record", "open_human_review", "none"]),
  amountCents: z.number().int().nonnegative().optional(),
  currency: z.string().optional(),
  evidence: z.array(evidenceSchema),
  policy: z.object({
    autoActionCapCents: z.number().int().nonnegative(),
    requiresHumanReviewAboveCents: z.number().int().nonnegative()
  }),
  externalActionEnabled: z.boolean(),
  redactionStatus: z.enum(["PUBLIC_SAFE", "NEEDS_REDACTION", "PRIVATE_MATERIAL_PRESENT"]),
  createdAt: z.string(),
  previousReceiptHash: z.string().optional()
});

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status") ?? undefined;
  const receipts = await listReceipts(status);
  return NextResponse.json({ receipts });
}

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = packetSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "invalid_packet", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const receipt = buildReceipt(parsed.data as AgentDecisionPacket);
  await putReceipt(receipt);

  return NextResponse.json({ receipt }, { status: 201 });
}
