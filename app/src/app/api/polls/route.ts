import { NextResponse } from "next/server";
import { createPoll } from "@/lib/dynamodb/polls";
import { signCreatorToken } from "@/lib/creator-token";
import { pollManageUrl, pollVoteUrl } from "@/lib/app-url";
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
    const token = await signCreatorToken(poll.id);

    return NextResponse.json({
      poll,
      voteUrl: pollVoteUrl(poll.id),
      manageUrl: pollManageUrl(poll.id, token),
      manageToken: token,
    });
  } catch (error) {
    console.error("POST /api/polls", error);
    return NextResponse.json({ error: "Failed to create poll" }, { status: 500 });
  }
}
