"use client";

import type { Poll, PollResults } from "@/types/poll";
import { Badge } from "@/components/ui/Badge";

function choiceLabel(
  poll: Poll,
  c: PollResults["comments"][0],
): string {
  if (c.yesNo !== undefined) return c.yesNo ? "Yes" : "No";
  if (c.rating !== undefined) return `${c.rating}★`;
  if (c.optionIds?.length) {
    const labels = c.optionIds
      .map((id) => poll.options.find((o) => o.id === id)?.label)
      .filter(Boolean);
    return labels.join(", ") || "—";
  }
  return "—";
}

export function CommentsFeed({
  poll,
  comments,
}: {
  poll: Poll;
  comments: PollResults["comments"];
}) {
  if (comments.length === 0) {
    return <p className="text-sm text-[var(--text-muted)]">No comments yet</p>;
  }

  return (
    <div className="max-h-72 space-y-2 overflow-y-auto pr-1">
      {comments.map((c, i) => (
        <div
          key={i}
          className="rounded-xl border border-[var(--border-card)] bg-[var(--bg-elevated)] p-4"
        >
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-[var(--text-primary)]">
              {c.alias ?? "Anonymous"}
            </span>
            <Badge tone="violet">{choiceLabel(poll, c)}</Badge>
            <span className="ml-auto text-xs text-[var(--text-muted)]">
              {new Date(c.createdAt).toLocaleString()}
            </span>
          </div>
          <p className="mt-2 text-sm text-[var(--text-secondary)]">{c.text}</p>
        </div>
      ))}
    </div>
  );
}
