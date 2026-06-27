import { listReceipts } from "@/lib/dynamodb";
import type { DecisionReceipt, DecisionStatus } from "@/lib/types";

export const dynamic = "force-dynamic";

const statuses: DecisionStatus[] = ["HOLD", "BLOCK", "HUMAN_REVIEW_ONLY"];

export default async function Home() {
  const receipts = await listReceipts();
  const counts = Object.fromEntries(statuses.map((status) => [status, receipts.filter((r) => r.decision === status).length])) as Record<DecisionStatus, number>;

  return (
    <>
      <header className="header">
        <h1>ProofLedger AI</h1>
        <p>Evidence memory for AI-agent decisions.</p>
      </header>

      <main className="main">
        <section className="grid">
          {statuses.map((status) => (
            <article className="card" key={status}>
              <h2>{status.replaceAll("_", " ")}</h2>
              <div className={`status ${status}`}>{counts[status]}</div>
              <p className="muted">
                {status === "HOLD" && "Evidence or redaction is incomplete."}
                {status === "BLOCK" && "A policy or action boundary was violated."}
                {status === "HUMAN_REVIEW_ONLY" && "Ready for a person. No business action executed."}
              </p>
            </article>
          ))}
        </section>

        <section className="ops-panel">
          <div>
            <h2>Submission controls</h2>
            <p className="muted">Seed synthetic receipts, inspect the health endpoint, and verify that the dashboard is reading review evidence.</p>
          </div>
          <div className="ops-actions">
            <a className="button-link" href="/seed-demo">Seed demo receipts</a>
            <a className="button-link" href="/api/health">API health JSON</a>
            <a className="button-link" href="/api/receipts">Receipts JSON</a>
          </div>
        </section>

        <ReceiptTable receipts={receipts} />

        <p className="footer-note">
          External action: disabled. Strongest allowed action: open human review.
          This is a synthetic hackathon prototype, not production approval.
        </p>
      </main>
    </>
  );
}

function ReceiptTable({ receipts }: { receipts: DecisionReceipt[] }) {
  return (
    <table className="receipt-table">
      <thead>
        <tr>
          <th>Status</th>
          <th>Subject</th>
          <th>Agent</th>
          <th>Requested</th>
          <th>Allowed</th>
          <th>Findings</th>
          <th>Receipt</th>
        </tr>
      </thead>
      <tbody>
        {receipts.map((receipt) => (
          <tr key={receipt.receiptHash}>
            <td>
              <span className={`status ${receipt.decision}`}>{receipt.decision}</span>
            </td>
            <td>
              <a href={`/subjects/${encodeURIComponent(receipt.subjectId)}`}>
                {receipt.subjectId}
              </a>
              <div className="muted">{receipt.caseKind}</div>
            </td>
            <td>{receipt.agentName}</td>
            <td>{receipt.requestedAction}</td>
            <td>{receipt.allowedAction}</td>
            <td>
              {receipt.findings.length === 0 ? (
                <span className="badge">No blocking findings</span>
              ) : (
                receipt.findings.map((finding) => (
                  <div key={finding.code}>
                    <span className="badge">{finding.code}</span>
                  </div>
                ))
              )}
            </td>
            <td>
              <code>{receipt.receiptHash.slice(0, 12)}</code>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
