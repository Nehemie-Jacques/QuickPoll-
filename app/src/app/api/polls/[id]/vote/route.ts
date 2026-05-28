import { NextResponse } from "next/server";
import { getPoll, incrementVoteCount } from "@/lib/dynamodb/polls";
import { createVote } from "@/lib/dynamodb/votes";
import { buildVoterFingerprint, hashIp } from "@/lib/fingerprint";
import { checkVoteAllowed } from "@/lib/vote-guard";
import { notifyFirstVote } from "@/lib/ses-notify";
import { pollManageUrl } from "@/lib/app-url";
import type { VotePayload } from "@/types/vote";

type RouteContext = { params: Promise<{ id: string }> };

export async function POST(request: Request, context: RouteContext) {
  const { id } = await context.params;

  try {
    const poll = await getPoll(id);
    if (!poll) {
      return NextResponse.json({ error: "Poll not found" }, { status: 404 });
    }

    const body = (await request.json()) as VotePayload;
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      "unknown";
    const ipHash = hashIp(ip, process.env.IP_HASH_SALT ?? "quickpoll");
    const fingerprint = buildVoterFingerprint(
      request.headers.get("user-agent"),
      request.headers.get("accept-language"),
      ipHash,
    );

    const guard = await checkVoteAllowed(poll, fingerprint, body.password);
    if (!guard.allowed) {
      return NextResponse.json({ error: guard.reason }, { status: 403 });
    }

    const vote = await createVote(poll, fingerprint, body);
    const newCount = await incrementVoteCount(poll.id);

    if (newCount === 1 && poll.settings.notifyEmail) {
      const token = await import("@/lib/creator-token").then((m) =>
        m.signCreatorToken(poll.id),
      );
      notifyFirstVote(
        poll.settings.notifyEmail,
        poll.title,
        pollManageUrl(poll.id, token),
      ).catch(console.error);
    }

    return NextResponse.json({ vote, voteCount: newCount });
  } catch (error) {
    console.error("POST vote", error);
    return NextResponse.json({ error: "Vote failed" }, { status: 500 });
  }
}
