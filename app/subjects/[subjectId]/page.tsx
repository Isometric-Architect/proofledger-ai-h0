import { subjectTimeline } from "@/lib/dynamodb";
import type { DecisionReceipt } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function SubjectPage({ params }: { params: Promise<{ subjectId: string }> }) {
  const { subjectId: rawSubjectId } = await params;
  const subjectId = decodeURIComponent(rawSubjectId);
  const receipts = await subjectTimeline(subjectId);

  return (
    <>
      <header className="header">
        <a className="back-link" href="/">← Back to review queue</a>
        <h1>Subject timeline</h1>
        <p>{subjectId}</p>
      </header>
      <main className="main">
        {receipts.length === 0 ? (
          <article className="card">
            <h2>No receipts found</h2>
            <p className="muted">No evidence receipts were found for this subject.</p>
          </article>
        ) : (
          <section className="timeline">
            {receipts.map((receipt) => (
              <TimelineItem key={receipt.receiptHash} receipt={receipt} />
            ))}
          </section>
        )}
      </main>
    </>
  );
}

function TimelineItem({ receipt }: { receipt: DecisionReceipt }) {
  return (
    <article className="timeline-item">
      <div className="timeline-head">
        <span className={`status ${receipt.decision}`}>{receipt.decision}</span>
        <span className="muted">{receipt.createdAt}</span>
      </div>
      <h2>{receipt.recommendation}</h2>
      <p>
        Requested action: <code>{receipt.requestedAction}</code> · Allowed action: <code>{receipt.allowedAction}</code>
      </p>
      <p>
        Receipt hash: <code>{receipt.receiptHash}</code>
      </p>
      <div className="finding-list">
        {receipt.findings.length === 0 ? (
          <span className="badge">No blocking findings</span>
        ) : (
          receipt.findings.map((finding) => (
            <div key={finding.code} className="finding-row">
              <span className="badge">{finding.code}</span>
              <span>{finding.message}</span>
            </div>
          ))
        )}
      </div>
      <details>
        <summary>Public-safe receipt JSON</summary>
        <pre>{JSON.stringify(redactForDisplay(receipt), null, 2)}</pre>
      </details>
    </article>
  );
}

function redactForDisplay(receipt: DecisionReceipt) {
  return {
    tenantId: receipt.tenantId,
    subjectId: receipt.subjectId,
    decision: receipt.decision,
    requestedAction: receipt.requestedAction,
    allowedAction: receipt.allowedAction,
    findings: receipt.findings,
    missingEvidence: receipt.missingEvidence,
    receiptHash: receipt.receiptHash,
    previousReceiptHash: receipt.previousReceiptHash,
    redactionStatus: receipt.redactionStatus,
    createdAt: receipt.createdAt
  };
}
