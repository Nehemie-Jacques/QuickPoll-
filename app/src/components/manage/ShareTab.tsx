"use client";

import { useMemo } from "react";
import { SharePanel } from "@/components/results/SharePanel";
import { Card } from "@/components/ui/Card";
import { clientVoteUrl } from "@/lib/urls";

export function ShareTab({
  pollId,
  exportUrl,
}: {
  pollId: string;
  exportUrl: string;
}) {
  const voteUrl = useMemo(() => clientVoteUrl(pollId), [pollId]);

  return (
    <div className="space-y-6">
      <Card>
        <SharePanel pollId={pollId} exportUrl={exportUrl} />
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
