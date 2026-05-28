"use client";

import type { PollResults } from "@/types/poll";
import { Card } from "@/components/ui/Card";

interface CommentsFeedProps {
  comments: PollResults["comments"];
}

export function CommentsFeed({ comments }: CommentsFeedProps) {
  if (comments.length === 0) {
    return <p className="text-sm text-zinc-500">Aucun commentaire</p>;
  }

  return (
    <div className="max-h-64 space-y-2 overflow-y-auto">
      {comments.map((c, i) => (
        <Card key={i} className="p-3">
          <p className="text-sm font-medium">{c.alias ?? "Anonyme"}</p>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">{c.text}</p>
        </Card>
      ))}
    </div>
  );
}
