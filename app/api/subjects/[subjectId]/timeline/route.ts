import { NextResponse } from "next/server";
import { subjectTimeline } from "@/lib/dynamodb";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ subjectId: string }> }
) {
  const { subjectId: rawSubjectId } = await params;
  const subjectId = decodeURIComponent(rawSubjectId);
  const receipts = await subjectTimeline(subjectId);
  return NextResponse.json({ receipts });
}
