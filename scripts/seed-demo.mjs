const baseUrl = process.env.PROOFLEDGER_BASE_URL || "http://localhost:3000";

const response = await fetch(`${baseUrl}/api/seed-demo`, { method: "POST" });
if (!response.ok) {
  const text = await response.text();
  throw new Error(`Seed failed: ${response.status} ${text}`);
}

console.log(await response.json());
