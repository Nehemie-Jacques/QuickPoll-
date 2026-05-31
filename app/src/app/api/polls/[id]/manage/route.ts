import { NextResponse } from "next/server";
import { verifyCreatorToken } from "@/lib/creator-token";
import {
  createPoll,
  deletePoll,
  getPoll,
  getPollResults,
  updatePoll,
} from "@/lib/dynamodb/polls";
import { listVotesByPoll } from "@/lib/dynamodb/votes";
import { getPollResolved } from "@/lib/poll-status";
import type { CreatePollInput } from "@/types/poll";

type RouteContext = { params: Promise<{ id: string }> };

async function authorize(request: Request, pollId: string) {
  const token =
    new URL(request.url).searchParams.get("token") ??
    request.headers.get("x-manage-token");
  if (!token) return null;
  const verified = await verifyCreatorToken(token);
  if (!verified || verified.pollId !== pollId) return null;
  return token;
}

export async function GET(request: Request, context: RouteContext) {
  const { id } = await context.params;
  if (!(await authorize(request, id))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const poll = await getPollResolved(id);
  if (!poll) {
    return NextResponse.json({ error: "Poll not found" }, { status: 404 });
  }

  const [votes, results] = await Promise.all([
    listVotesByPoll(id),
    getPollResults(id),
  ]);

  return NextResponse.json({ poll, votes, results });
}

export async function PATCH(request: Request, context: RouteContext) {
  const { id } = await context.params;
  if (!(await authorize(request, id))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const body = await request.json();
  const action = body.action as string | undefined;

  if (action === "close") {
    const poll = await updatePoll(id, {
      status: "closed",
      closedAt: new Date().toISOString(),
    });
    return NextResponse.json({ poll });
  }

  if (action === "extend" && body.expiresAt) {
    const poll = await updatePoll(id, {
      status: "active",
      expiresAt: body.expiresAt,
      closedAt: null,
    });
    return NextResponse.json({ poll });
  }

  if (action === "toggle_results" && body.showResultsBeforeClose !== undefined) {
    const existing = await getPoll(id);
    if (!existing) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    const poll = await updatePoll(id, {
      settings: {
        ...existing.settings,
        showResultsBeforeClose: body.showResultsBeforeClose,
      },
    });
    return NextResponse.json({ poll });
  }

  if (action === "duplicate") {
    const existing = await getPoll(id);
    if (!existing) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    const input: CreatePollInput = {
      title: `${existing.title} (copie)`,
      description: existing.description,
      type: existing.type,
      options: existing.options.map((o) => ({ label: o.label })),
      accentColor: existing.accentColor,
      expiration: existing.expiresAt ? "custom" : "none",
      customExpiresAt: existing.expiresAt ?? undefined,
      settings: {
        allowComments: existing.settings.allowComments,
        showResultsBeforeClose: existing.settings.showResultsBeforeClose,
        requireAlias: existing.settings.requireAlias,
        maxChoices: existing.settings.maxChoices,
      },
    };
    const poll = await createPoll(input);
    return NextResponse.json({ poll }, { status: 201 });
  }

  return NextResponse.json({ error: "Unknown action" }, { status: 400 });
}

export async function DELETE(request: Request, context: RouteContext) {
  const { id } = await context.params;
  if (!(await authorize(request, id))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  await deletePoll(id);
  return NextResponse.json({ ok: true });
}
