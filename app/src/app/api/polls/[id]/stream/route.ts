import { getPoll, getPollResults } from "@/lib/dynamodb/polls";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(request: Request, context: RouteContext) {
  const { id } = await context.params;
  const poll = await getPoll(id);

  if (!poll) {
    return new Response("Poll not found", { status: 404 });
  }

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      const send = async () => {
        const results = await getPollResults(id);
        const payload = JSON.stringify({ poll, results, at: Date.now() });
        controller.enqueue(encoder.encode(`data: ${payload}\n\n`));
      };

      await send();
      const interval = setInterval(send, 3000);

      request.signal.addEventListener("abort", () => {
        clearInterval(interval);
        controller.close();
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
