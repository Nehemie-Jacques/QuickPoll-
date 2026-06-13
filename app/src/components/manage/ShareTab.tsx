"use client";

import { SharePanel } from "@/components/results/SharePanel";
import { Card } from "@/components/ui/Card";

export function ShareTab({
  pollId,
  voteUrl,
  exportUrl,
}: {
  pollId: string;
  voteUrl: string;
  exportUrl: string;
}) {
  return (
    <div className="space-y-6">
      <Card>
        <SharePanel pollId={pollId} voteUrl={voteUrl} exportUrl={exportUrl} />
      </Card>
      <Card>
        <h3 className="mb-3 font-display font-semibold">Embed preview</h3>
        <iframe
          src={voteUrl}
          title="Vote widget preview"
          className="h-64 w-full rounded-lg border border-[var(--border-card)] bg-[var(--bg-primary)]"
        />
      </Card>
    </div>
  );
}
