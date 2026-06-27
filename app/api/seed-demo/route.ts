import { NextResponse } from "next/server";
import { seedDemoReceipts } from "@/lib/dynamodb";

export const dynamic = "force-dynamic";

export async function POST() {
  const count = await seedDemoReceipts();
  return NextResponse.json({ insertedOrChecked: count });
}

export async function GET() {
  const count = await seedDemoReceipts();
  return NextResponse.json({ insertedOrChecked: count });
}
