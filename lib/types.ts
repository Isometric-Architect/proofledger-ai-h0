export type DecisionStatus = "HOLD" | "BLOCK" | "HUMAN_REVIEW_ONLY";

export type RedactionStatus = "PUBLIC_SAFE" | "NEEDS_REDACTION" | "PRIVATE_MATERIAL_PRESENT";

export interface EvidenceItem {
  kind: string;
  present: boolean;
  ref?: string;
  publicSafe: boolean;
}

export interface AgentDecisionPacket {
  tenantId: string;
  subjectId: string;
  caseKind: "refund_exception" | "claim_exception" | "generic_decision";
  agentName: string;
  recommendation: string;
  requestedAction: "issue_refund" | "settle_claim" | "update_record" | "open_human_review" | "none";
  amountCents?: number;
  currency?: string;
  evidence: EvidenceItem[];
  policy: {
    autoActionCapCents: number;
    requiresHumanReviewAboveCents: number;
  };
  externalActionEnabled: boolean;
  redactionStatus: RedactionStatus;
  createdAt: string;
  previousReceiptHash?: string;
}

export interface Finding {
  severity: "INFO" | "HOLD" | "BLOCK";
  code: string;
  message: string;
}

export interface DecisionReceipt {
  tenantId: string;
  subjectId: string;
  caseKind: string;
  agentName: string;
  recommendation: string;
  requestedAction: string;
  allowedAction: "open_human_review" | "none";
  decision: DecisionStatus;
  findings: Finding[];
  missingEvidence: string[];
  evidenceKinds: string[];
  amountCents?: number;
  currency?: string;
  receiptHash: string;
  previousReceiptHash?: string;
  redactionStatus: RedactionStatus;
  createdAt: string;

  PK: string;
  SK: string;
  GSI1PK: string;
  GSI1SK: string;
  GSI2PK: string;
  GSI2SK: string;
}
