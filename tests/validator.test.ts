import { describe, expect, it } from "vitest";
import { demoPackets } from "../lib/demo-data";
import { buildReceipt } from "../lib/validator";

describe("ProofLedger validator", () => {
  it("holds missing evidence", () => {
    const receipt = buildReceipt(demoPackets[0]);
    expect(receipt.decision).toBe("HOLD");
    expect(receipt.missingEvidence).toContain("delivery_status");
  });

  it("blocks high-value auto action", () => {
    const receipt = buildReceipt(demoPackets[1]);
    expect(receipt.decision).toBe("BLOCK");
    expect(receipt.findings.map((f) => f.code)).toContain("EXTERNAL_ACTION_ENABLED");
  });

  it("allows human review only for complete packets", () => {
    const receipt = buildReceipt(demoPackets[2]);
    expect(receipt.decision).toBe("HUMAN_REVIEW_ONLY");
    expect(receipt.allowedAction).toBe("open_human_review");
  });

  it("blocks subject kind mismatch", () => {
    const receipt = buildReceipt(demoPackets[3]);
    expect(receipt.decision).toBe("BLOCK");
    expect(receipt.findings.map((f) => f.code)).toContain("SUBJECT_KIND_MISMATCH");
  });
});
