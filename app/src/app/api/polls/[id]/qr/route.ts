import { NextResponse } from "next/server";
import { getPoll } from "@/lib/dynamodb/polls";
import { generateQrPng } from "@/lib/qrcode";
import { voteUrl } from "@/lib/urls";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(request: Request, context: RouteContext) {
  const { id } = await context.params;
  const poll = await getPoll(id);

  if (!poll) {
    return NextResponse.json({ error: "Poll not found" }, { status: 404 });
  }

  const queryUrl = new URL(request.url).searchParams.get("url");
  const target =
    queryUrl && queryUrl.startsWith("http") ? queryUrl : voteUrl(id, request);

  const png = await generateQrPng(target);

  return new NextResponse(new Uint8Array(png), {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "no-store",
      "Content-Disposition": `inline; filename="quickpoll-${id}-qr.png"`,
    },
  });
}
