import { NextResponse } from "next/server";
import { getPoll } from "@/lib/dynamodb/polls";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: RouteContext) {
  const { id } = await context.params;
  const poll = await getPoll(id);

  if (!poll) {
    return NextResponse.json({ error: "Poll not found" }, { status: 404 });
  }

  const { password: _password, ...safeSettings } = poll.settings;
  return NextResponse.json({
    ...poll,
    settings: {
      ...safeSettings,
      hasPassword: Boolean(poll.settings.password),
    },
  });
}
