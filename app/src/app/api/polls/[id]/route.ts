import { NextResponse } from "next/server";
import { getPollResolved } from "@/lib/poll-status";
import {
  isManageContext,
  verifyManageToken,
} from "@/lib/api/request";
import { serializePoll } from "@/lib/api/poll-presenter";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(request: Request, context: RouteContext) {
  const { id } = await context.params;
  const poll = await getPollResolved(id);

  if (!poll) {
    return NextResponse.json({ error: "Poll not found" }, { status: 404 });
  }

  const fromManage = isManageContext(request);

  if (fromManage) {
    const authorized = await verifyManageToken(request, id);
    if (!authorized) {
      return NextResponse.json(
        { error: "Invalid or missing creator token" },
        { status: 403 },
      );
    }
    return NextResponse.json(serializePoll(poll, { forCreator: true }));
  }

  return NextResponse.json(serializePoll(poll));
}
