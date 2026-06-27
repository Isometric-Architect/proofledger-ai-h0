import Link from "next/link";
import { seedDemoReceipts } from "@/lib/dynamodb";

export const dynamic = "force-dynamic";

export default async function SeedDemoPage() {
  const count = await seedDemoReceipts();

  return (
    <>
      <header className="header">
        <h1>Demo Receipts Seeded</h1>
        <p>{count} synthetic ProofLedger receipts were inserted or checked.</p>
      </header>
      <main className="main">
        <p className="muted">
          For the H0 submission, this action should write to the configured DynamoDB table.
          In demo mode, it verifies the same synthetic packets without external writes.
        </p>
        <p>
          <Link href="/">Return to dashboard</Link>
        </p>
      </main>
    </>
  );
}
