import fs from "node:fs";
import path from "node:path";

const root = process.argv[2] || ".";
const denyPatterns = [
  { name: "aws_access_key_value", re: /AKIA[0-9A-Z]{16}/g },
  { name: "private_key_header", re: /-----BEGIN (RSA |EC |OPENSSH |)?PRIVATE KEY-----/g },
  { name: "bearer_token", re: /Bearer\s+[A-Za-z0-9._~+\/-]{20,}/g },
  { name: "github_pat", re: /ghp_[A-Za-z0-9]{20,}/g },
  { name: "hidden_threshold", re: /hidden[_-]?threshold\s*[:=]/gi },
  { name: "verifier_seed", re: /verifier[_-]?seed\s*[:=]/gi },
  { name: "private_negative_control", re: /private[_-]?(negative[_-]?control|nc)\s*[:=]/gi }
];

const ignoredDirs = new Set(["node_modules", ".next", ".git"]);
const findings = [];

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (ignoredDirs.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else {
      const rel = path.relative(root, full).replaceAll(path.sep, "/");
      if (rel === "scripts/final-public-scan.mjs" || rel === "scripts/secret-scan.mjs") continue;
      const text = fs.readFileSync(full, "utf8");
      for (const pattern of denyPatterns) {
        const matches = [...text.matchAll(pattern.re)];
        if (matches.length) findings.push({ file: path.relative(root, full), pattern: pattern.name, count: matches.length });
      }
    }
  }
}

walk(root);
if (findings.length) {
  console.error(JSON.stringify({ decision: "BLOCK", findings }, null, 2));
  process.exit(1);
}
console.log(JSON.stringify({ decision: "PASS", finding_count: 0 }, null, 2));
