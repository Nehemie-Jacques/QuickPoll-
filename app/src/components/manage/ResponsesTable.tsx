"use client";

import type { Poll } from "@/types/poll";
import type { Vote } from "@/types/vote";
import { Card } from "@/components/ui/Card";

function formatChoice(poll: Poll, v: Vote): string {
  if (v.yesNo !== undefined) return v.yesNo ? "Yes" : "No";
  if (v.rating !== undefined) return `${v.rating}★`;
  if (v.optionIds?.length) {
    return v.optionIds
      .map((id) => poll.options.find((o) => o.id === id)?.label)
      .filter(Boolean)
      .join(", ");
  }
  return "—";
}

export function ResponsesTable({
  poll,
  votes,
  exportUrl,
}: {
  poll: Poll;
  votes: Vote[];
  exportUrl: string;
}) {
  if (votes.length === 0) {
    return (
      <Card className="py-16 text-center">
        <div className="mx-auto mb-4 size-16 rounded-2xl bg-violet-600/20" />
        <p className="font-medium text-zinc-300">No votes yet</p>
        <p className="mt-1 text-sm text-zinc-500">
          Share your poll to get started.
        </p>
      </Card>
    );
  }

  return (
    <div>
      <div className="mb-4 flex justify-end">
        <a href={exportUrl} download>
          <span className="text-sm text-violet-400 hover:underline">
            Export CSV ↓
          </span>
        </a>
      </div>
      <div className="overflow-x-auto rounded-xl border border-zinc-800">
        <table className="w-full text-left text-sm">
          <thead className="bg-zinc-900 text-xs uppercase tracking-wider text-zinc-500">
            <tr>
              <th className="p-3">Time</th>
              <th className="p-3">Alias</th>
              <th className="p-3">Choice</th>
              <th className="p-3">Comment</th>
            </tr>
          </thead>
          <tbody>
            {votes.map((v) => (
              <tr key={v.voteId} className="border-t border-zinc-800">
                <td className="p-3 text-zinc-400">
                  {new Date(v.createdAt).toLocaleString()}
                </td>
                <td className="p-3">{v.alias ?? "—"}</td>
                <td className="p-3">{formatChoice(poll, v)}</td>
                <td className="p-3 text-zinc-400">{v.comment ?? "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
