import { NextResponse } from "next/server";
import { createPoll } from "@/lib/dynamodb/polls";
import { signCreatorToken } from "@/lib/creator-token";
import { serializePoll } from "@/lib/api/poll-presenter";
import { manageUrl, voteUrl } from "@/lib/urls";
import type { CreatePollInput } from "@/types/poll";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as CreatePollInput;

    if (!body.title?.trim()) {
      return NextResponse.json({ error: "title required" }, { status: 400 });
    }
    if (!body.type) {
      return NextResponse.json({ error: "type required" }, { status: 400 });
    }

    const poll = await createPoll(body);
    const creatorToken = await signCreatorToken(poll.id);

    return NextResponse.json(
      {
        pollId: poll.id,
        creatorToken,
        voteUrl: voteUrl(poll.id, request),
        manageUrl: manageUrl(poll.id, creatorToken, request),
        poll: serializePoll(poll),
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("POST /api/polls", error);
    return NextResponse.json(
      { error: "Failed to create poll" },
      { status: 500 },
    );
  }
}
