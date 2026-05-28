import { NextResponse } from "next/server";
import { verifyCreatorToken } from "@/lib/creator-token";
import { getPoll } from "@/lib/dynamodb/polls";
import { listVotesByPoll } from "@/lib/dynamodb/votes";
import { votesToCsv } from "@/lib/csv-export";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(request: Request, context: RouteContext) {
  const { id } = await context.params;
  const token = new URL(request.url).searchParams.get("token");

  if (!token) {
    return NextResponse.json({ error: "token required" }, { status: 401 });
  }

  const verified = await verifyCreatorToken(token);
  if (!verified || verified.pollId !== id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const poll = await getPoll(id);
  if (!poll) {
    return NextResponse.json({ error: "Poll not found" }, { status: 404 });
  }

  const votes = await listVotesByPoll(id);
  const csv = votesToCsv(votes);

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="quickpoll-${id}.csv"`,
    },
  });
}
