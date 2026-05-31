"use client";

import { Badge } from "@/components/ui/Badge";

export function LiveIndicator({
  connected,
  closed,
}: {
  connected: boolean;
  closed?: boolean;
}) {
  if (closed) {
    return <Badge tone="muted">Closed</Badge>;
  }
  return (
    <Badge tone="live">
      <span
        className={`size-2 rounded-full bg-emerald-500 ${connected ? "qp-live-dot" : "opacity-40"}`}
      />
      Live
    </Badge>
  );
}
