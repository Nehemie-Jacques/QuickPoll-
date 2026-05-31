import { getPollResults } from "@/lib/dynamodb/polls";
import { getPollResolved } from "@/lib/poll-status";
import { serializePoll } from "@/lib/api/poll-presenter";

type RouteContext = { params: Promise<{ id: string }> };

const SSE_INTERVAL_MS = 2000;

export async function GET(request: Request, context: RouteContext) {
  const { id } = await context.params;
  const poll = await getPollResolved(id);

  if (!poll) {
    return new Response("Poll not found", { status: 404 });
  }

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      let closed = false;

      const send = async () => {
        if (closed) return;
        try {
          const current = (await getPollResolved(id)) ?? poll;
          const results = await getPollResults(id);
          const payload = JSON.stringify({
            poll: serializePoll(current),
            results,
            at: Date.now(),
          });
          controller.enqueue(encoder.encode(`data: ${payload}\n\n`));
        } catch {
          controller.enqueue(
            encoder.encode(`event: error\ndata: "refresh_failed"\n\n`),
          );
        }
      };

      await send();
      const interval = setInterval(send, SSE_INTERVAL_MS);

      request.signal.addEventListener("abort", () => {
        closed = true;
        clearInterval(interval);
        try {
          controller.close();
        } catch {
          /* already closed */
        }
      });
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
