import { NextResponse } from "next/server";
import { incrementTotalVotes } from "@/lib/dynamodb/polls";
import { createVote } from "@/lib/dynamodb/votes";
import { getPollResolved } from "@/lib/poll-status";
import { checkVoteAllowed } from "@/lib/vote-guard";
import { notifyFirstVote } from "@/lib/ses-notify";
import { signCreatorToken } from "@/lib/creator-token";
import { manageUrl } from "@/lib/urls";
import { voterIdFromRequest } from "@/lib/voter-id";
import type { VotePayload } from "@/types/vote";

type RouteContext = { params: Promise<{ id: string }> };

export async function POST(request: Request, context: RouteContext) {
  const { id } = await context.params;

  try {
    const poll = await getPollResolved(id);
    if (!poll) {
      return NextResponse.json({ error: "Poll not found" }, { status: 404 });
    }

    const body = (await request.json()) as VotePayload;
    const voterId = voterIdFromRequest(request);

    const guard = await checkVoteAllowed(poll, voterId, body.password);
    if (!guard.allowed) {
      return NextResponse.json({ error: guard.reason }, { status: 403 });
    }

    let vote;
    try {
      vote = await createVote(poll, voterId, body);
    } catch (err) {
      if (
        err &&
        typeof err === "object" &&
        "name" in err &&
        (err as { name: string }).name === "ConditionalCheckFailedException"
      ) {
        return NextResponse.json({ error: "already_voted" }, { status: 403 });
      }
      throw err;
    }

    const totalVotes = await incrementTotalVotes(poll.id);

    if (totalVotes === 1 && poll.settings.notifyEmail) {
      const token = await signCreatorToken(poll.id);
      notifyFirstVote(
        poll.settings.notifyEmail,
        poll.title,
        manageUrl(poll.id, token, request),
      ).catch(console.error);
    }

    return NextResponse.json({ vote, totalVotes });
  } catch (error) {
    console.error("POST vote", error);
    return NextResponse.json({ error: "Vote failed" }, { status: 500 });
  }
}
