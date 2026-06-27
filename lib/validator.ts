import type { AgentDecisionPacket, DecisionReceipt, DecisionStatus, Finding } from "./types";
import { sha256Hex } from "./hash";

const requiredEvidenceByCaseKind: Record<string, string[]> = {
  refund_exception: ["order_record", "payment_record", "customer_statement", "delivery_status"],
  claim_exception: ["claim_form", "identity_check", "loss_statement", "policy_record"],
  generic_decision: ["business_request", "customer_statement"]
};

export function validatePacket(packet: AgentDecisionPacket): Omit<DecisionReceipt, "receiptHash" | "PK" | "SK" | "GSI1PK" | "GSI1SK" | "GSI2PK" | "GSI2SK"> {
  const findings: Finding[] = [];
  const required = requiredEvidenceByCaseKind[packet.caseKind] ?? requiredEvidenceByCaseKind.generic_decision;
  const evidenceKinds = packet.evidence.map((item) => item.kind);
  const missingEvidence = required.filter((kind) => {
    const item = packet.evidence.find((candidate) => candidate.kind === kind);
    return !item || !item.present;
  });

  if (missingEvidence.length > 0) {
    findings.push({
      severity: "HOLD",
      code: "MISSING_REQUIRED_EVIDENCE",
      message: `Missing required evidence: ${missingEvidence.join(", ")}`
    });
  }

  const nonPublicEvidence = packet.evidence.filter((item) => item.present && !item.publicSafe);
  if (nonPublicEvidence.length > 0 || packet.redactionStatus !== "PUBLIC_SAFE") {
    findings.push({
      severity: "HOLD",
      code: "PUBLIC_REDACTION_REQUIRED",
      message: "Receipt contains material that must be redacted before public review."
    });
  }

  const amount = packet.amountCents ?? 0;
  const highValue = amount >= packet.policy.requiresHumanReviewAboveCents;

  if (packet.externalActionEnabled) {
    findings.push({
      severity: "BLOCK",
      code: "EXTERNAL_ACTION_ENABLED",
      message: "External business action is enabled before human review."
    });
  }

  if (packet.requestedAction !== "open_human_review" && packet.requestedAction !== "none" && highValue) {
    findings.push({
      severity: "BLOCK",
      code: "HIGH_VALUE_AUTO_ACTION_ATTEMPT",
      message: "High-value action must not be executed automatically."
    });
  }

  if (amount > packet.policy.autoActionCapCents && packet.requestedAction !== "open_human_review" && packet.requestedAction !== "none") {
    findings.push({
      severity: "BLOCK",
      code: "AUTO_ACTION_CAP_EXCEEDED",
      message: "Requested action exceeds the automatic action cap."
    });
  }

  if (!packet.subjectId.startsWith(packet.caseKind.split("_")[0]) && packet.caseKind !== "generic_decision") {
    findings.push({
      severity: "BLOCK",
      code: "SUBJECT_KIND_MISMATCH",
      message: "Subject ID does not match the declared case kind."
    });
  }

  const hasBlock = findings.some((finding) => finding.severity === "BLOCK");
  const hasHold = findings.some((finding) => finding.severity === "HOLD");

  let decision: DecisionStatus = "HUMAN_REVIEW_ONLY";
  if (hasBlock) decision = "BLOCK";
  else if (hasHold) decision = "HOLD";

  return {
    tenantId: packet.tenantId,
    subjectId: packet.subjectId,
    caseKind: packet.caseKind,
    agentName: packet.agentName,
    recommendation: packet.recommendation,
    requestedAction: packet.requestedAction,
    allowedAction: decision === "HUMAN_REVIEW_ONLY" ? "open_human_review" : "none",
    decision,
    findings,
    missingEvidence,
    evidenceKinds,
    amountCents: packet.amountCents,
    currency: packet.currency,
    previousReceiptHash: packet.previousReceiptHash,
    redactionStatus: packet.redactionStatus,
    createdAt: packet.createdAt
  };
}

export function buildReceipt(packet: AgentDecisionPacket): DecisionReceipt {
  const partial = validatePacket(packet);
  const receiptHash = sha256Hex({
    ...partial,
    sourcePacketHash: sha256Hex(packet)
  });

  const sk = `RECEIPT#${packet.createdAt}#${receiptHash.slice(0, 16)}`;

  return {
    ...partial,
    receiptHash,
    PK: `TENANT#${packet.tenantId}`,
    SK: sk,
    GSI1PK: `STATUS#${partial.decision}`,
    GSI1SK: packet.createdAt,
    GSI2PK: `SUBJECT#${packet.subjectId}`,
    GSI2SK: sk
  };
}
