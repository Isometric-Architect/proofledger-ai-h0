import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const receipts = JSON.parse(fs.readFileSync(path.join(root, "seed", "receipts.json"), "utf8"));

const counts = receipts.reduce((acc, r) => {
  acc[r.expectedDecision] = (acc[r.expectedDecision] || 0) + 1;
  return acc;
}, {});

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>ProofLedger AI Static Demo</title>
<style>
body{margin:0;background:#f8fafc;color:#17202a;font-family:ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}header{padding:36px 42px 28px;background:#eef3f8;border-bottom:1px solid #d9e2ec}h1{margin:0;font-size:42px;font-weight:600;letter-spacing:-.04em}header p{margin:10px 0 0;color:#5b6b7f;font-size:17px}main{padding:40px 42px}.grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:24px}.card{border:1px solid #d9e2ec;background:#fff;padding:24px;min-height:150px}.status{font-size:24px;margin-top:8px}.HOLD{color:#b66a00}.BLOCK{color:#bd2b2b}.HUMAN_REVIEW_ONLY{color:#168a46}table{margin-top:32px;width:100%;border-collapse:collapse;background:#fff;border:1px solid #d9e2ec}th,td{text-align:left;padding:14px;border-bottom:1px solid #d9e2ec;vertical-align:top}th{color:#5b6b7f;font-size:13px}.muted{color:#5b6b7f}.badge{display:inline-block;padding:4px 8px;border:1px solid #d9e2ec;border-radius:999px;font-size:12px;background:#f8fafc}code{font-size:12px}</style>
</head>
<body>
<header><h1>ProofLedger AI</h1><p>Evidence memory for AI-agent decisions.</p></header>
<main>
<section class="grid">
  <article class="card"><h2>HOLD</h2><div class="status HOLD">${counts.HOLD || 0}</div><p class="muted">Evidence or redaction is incomplete.</p></article>
  <article class="card"><h2>BLOCK</h2><div class="status BLOCK">${counts.BLOCK || 0}</div><p class="muted">A policy or action boundary was violated.</p></article>
  <article class="card"><h2>HUMAN REVIEW ONLY</h2><div class="status HUMAN_REVIEW_ONLY">${counts.HUMAN_REVIEW_ONLY || 0}</div><p class="muted">Ready for a person. No business action executed.</p></article>
</section>
<table><thead><tr><th>Status</th><th>Subject</th><th>Scenario</th><th>Requested action</th><th>Allowed action</th></tr></thead><tbody>
${receipts.map((r) => `<tr><td><span class="status ${r.expectedDecision}">${r.expectedDecision}</span></td><td>${r.subjectId}<div class="muted">${r.caseKind}</div></td><td>${r.scenario}</td><td><code>${r.requestedAction}</code></td><td><code>${r.expectedDecision === "HUMAN_REVIEW_ONLY" ? "open_human_review" : "none"}</code></td></tr>`).join("\n")}
</tbody></table>
<p class="muted">External action: disabled. Strongest allowed action: open human review. This static page is a backup demo only; final H0 submission should show the Vercel app backed by DynamoDB.</p>
</main>
</body></html>`;

fs.mkdirSync(path.join(root, "demo"), { recursive: true });
fs.writeFileSync(path.join(root, "demo", "index.html"), html);
console.log("Wrote demo/index.html");
