"use client";

import { SharePanel } from "@/components/results/SharePanel";
import { Button } from "@/components/ui/Button";

interface ShareTabProps {
  pollId: string;
  voteUrl: string;
  token: string;
}

export function ShareTab({ pollId, voteUrl, token }: ShareTabProps) {
  return (
    <div className="space-y-4">
      <SharePanel pollId={pollId} voteUrl={voteUrl} />
      <a
        href={`/api/polls/${pollId}/export?token=${encodeURIComponent(token)}`}
        download
      >
        <Button type="button" variant="secondary">
          Exporter CSV
        </Button>
      </a>
    </div>
  );
}
