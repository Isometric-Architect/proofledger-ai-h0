import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const root = process.cwd();
const required = [
  "README.md",
  "package.json",
  "app/page.tsx",
  "app/api/receipts/route.ts",
  "app/api/seed-demo/route.ts",
  "app/api/subjects/[subjectId]/timeline/route.ts",
  "app/subjects/[subjectId]/page.tsx",
  "lib/validator.ts",
  "lib/dynamodb.ts",
  "scripts/create-table.mjs",
  "scripts/verify-dynamodb.mjs",
  "docs/DEVPOST_FIELDS.md",
  "docs/ARCHITECTURE.md",
  "docs/AWS_DYNAMODB_SETUP.md",
  "docs/SUBMISSION_CHECKLIST.md",
  "docs/CLAIM_CEILING.md",
  "docs/H0_FINAL_SUBMISSION_RUNBOOK.md"
];

const forbiddenDirs = new Set(["node_modules", ".next", ".git", ".vercel", "dist", "coverage"]);
const secretPatterns = [
  { name: "AWS access key", re: /AKIA[0-9A-Z]{16}/ },
  { name: "AWS secret assignment", re: /AWS_SECRET_ACCESS_KEY\s*=\s*(?!replace-me|example|your-|<|$)[^\s]+/i },
  { name: "Bearer token", re: /Bearer\s+[A-Za-z0-9._\-]{20,}/i },
  { name: "Private key header", re: /-----BEGIN (RSA |EC |OPENSSH |DSA |)?PRIVATE KEY-----/ }
];

function walk(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (forbiddenDirs.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(full));
    else out.push(full);
  }
  return out;
}

function sha(file) {
  return crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
}

const files = walk(root);
const rels = files.map((f) => path.relative(root, f)).sort();
const missing = required.filter((p) => !fs.existsSync(path.join(root, p)));
const secretHits = [];
for (const f of files) {
  const rel = path.relative(root, f);
  if (/\.(png|jpg|jpeg|gif|ico|zip|pdf|pptx)$/i.test(rel)) continue;
  const text = fs.readFileSync(f, "utf8");
  for (const p of secretPatterns) {
    if (p.re.test(text)) secretHits.push({ file: rel, pattern: p.name });
  }
}

const packageJson = JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8"));
const audit = {
  project: "ProofLedger AI",
  generatedAt: new Date().toISOString(),
  requiredFilesPresent: missing.length === 0,
  missingRequiredFiles: missing,
  secretScanPassed: secretHits.length === 0,
  secretHits,
  fileCount: files.length,
  packageName: packageJson.name,
  scripts: packageJson.scripts,
  h0RequiredEvidenceStillNeeded: [
    "Published Vercel project link",
    "Vercel Team ID",
    "AWS DynamoDB usage screenshot",
    "less than 3-minute public demo video"
  ],
  claimCeiling: "Hackathon prototype. No production, security, compliance, or business-action authorization claim."
};

fs.mkdirSync(path.join(root, "receipts"), { recursive: true });
fs.writeFileSync(path.join(root, "receipts", "submission_audit_receipt.json"), JSON.stringify(audit, null, 2));
fs.writeFileSync(path.join(root, "receipts", "artifact_manifest.json"), JSON.stringify(rels.map((rel) => ({ path: rel, sha256: sha(path.join(root, rel)) })), null, 2));

console.log(JSON.stringify(audit, null, 2));
if (missing.length || secretHits.length) process.exit(1);
