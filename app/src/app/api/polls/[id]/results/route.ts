import { NextResponse } from "next/server";
import { getPoll, getPollResults } from "@/lib/dynamodb/polls";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: RouteContext) {
  const { id } = await context.params;
  const poll = await getPoll(id);

  if (!poll) {
    return NextResponse.json({ error: "Poll not found" }, { status: 404 });
  }

  const closed = Boolean(poll.closedAt);
  const expired =
    poll.expiresAt !== null && new Date(poll.expiresAt) < new Date();
  const canShow =
    poll.settings.showResultsBeforeClose || closed || expired;

  if (!canShow) {
    return NextResponse.json(
      { error: "Results hidden until poll closes" },
      { status: 403 },
    );
  }

  const results = await getPollResults(id);
  return NextResponse.json({ poll, results });
}
