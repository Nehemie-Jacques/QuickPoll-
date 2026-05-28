import { NextResponse } from "next/server";
import { getPoll } from "@/lib/dynamodb/polls";
import { generateQrPng } from "@/lib/qrcode";
import { pollVoteUrl } from "@/lib/app-url";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: RouteContext) {
  const { id } = await context.params;
  const poll = await getPoll(id);

  if (!poll) {
    return NextResponse.json({ error: "Poll not found" }, { status: 404 });
  }

  const png = await generateQrPng(pollVoteUrl(id));

  return new NextResponse(new Uint8Array(png), {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
