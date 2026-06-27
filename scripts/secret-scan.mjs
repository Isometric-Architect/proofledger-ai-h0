import fs from "node:fs";
import path from "node:path";

const root = process.argv[2] || ".";
const forbidden = [
  /AWS_SECRET_ACCESS_KEY\s*=\s*(?!replace-me|example|your-|<|$)[^.\s#][^\s#]+/i,
  /AKIA[0-9A-Z]{16}/,
  /-----BEGIN [A-Z ]*PRIVATE KEY-----/,
  /PRIVATE_EVAL/i,
  /HIDDEN_THRESHOLD/i,
  /VERIFIER_SEED/i,
  /CUSTOMER_SECRET/i
];

const ignoredDirs = new Set(["node_modules", ".next", ".git", ".vercel"]);
let failures = [];

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (ignoredDirs.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else {
      const rel = path.relative(root, full).replaceAll(path.sep, "/");
      if (rel === "scripts/secret-scan.mjs" || rel === "scripts/final-public-scan.mjs") continue;
      const text = fs.readFileSync(full, "utf8");
      for (const pattern of forbidden) {
        if (pattern.test(text) && !full.endsWith(".env.example")) {
          failures.push({ file: full, pattern: String(pattern) });
        }
      }
    }
  }
}

walk(root);

if (failures.length > 0) {
  console.error("Secret scan failed:");
  console.error(JSON.stringify(failures, null, 2));
  process.exit(1);
}

console.log("Secret scan passed.");
