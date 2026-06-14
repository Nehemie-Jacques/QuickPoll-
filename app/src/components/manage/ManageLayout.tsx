"use client";

import * as Tabs from "@radix-ui/react-tabs";
import type { ReactNode } from "react";
import type { Poll, PollStatus } from "@/types/poll";
import { Badge } from "@/components/ui/Badge";
import { computePollStatus } from "@/lib/poll-status";

export function ManageLayout({
  poll,
  overview,
  responses,
  share,
  danger,
}: {
  poll: Poll;
  overview: ReactNode;
  responses: ReactNode;
  share: ReactNode;
  danger: ReactNode;
}) {
  const status: PollStatus = computePollStatus(poll);

  const statusTone =
    status === "active" ? "live" : status === "expired" ? "warning" : "muted";

  return (
    <div className="mx-auto flex w-full min-w-0 max-w-5xl flex-col gap-6 px-4 py-6 sm:gap-8 sm:px-6 sm:py-8 lg:flex-row">
      <aside className="w-full shrink-0 lg:w-60">
        <Badge tone={statusTone} className="mb-4">
          {status}
        </Badge>
        <p className="text-xs text-[var(--text-muted)]">
          Created {new Date(poll.createdAt).toLocaleDateString()}
        </p>
        <p className="mt-1 font-display text-2xl font-bold text-[var(--text-primary)]">
          {poll.totalVotes}
        </p>
        <p className="text-xs text-[var(--text-muted)]">total votes</p>

        <Tabs.List className="mt-8 flex flex-wrap gap-1 lg:flex-col lg:gap-0">
          {[
            { value: "overview", label: "Overview" },
            { value: "responses", label: "Responses" },
            { value: "share", label: "Share" },
            { value: "danger", label: "Danger Zone" },
          ].map((t) => (
            <Tabs.Trigger
              key={t.value}
              value={t.value}
              className="rounded-lg px-3 py-2 text-left text-sm text-[var(--text-secondary)] data-[state=active]:bg-[var(--bg-elevated)] data-[state=active]:text-[var(--text-primary)] lg:w-full"
            >
              {t.label}
            </Tabs.Trigger>
          ))}
        </Tabs.List>
      </aside>

      <div className="min-w-0 flex-1">
        <h1 className="font-display mb-6 text-2xl font-bold lg:hidden">
          {poll.title}
        </h1>
        <Tabs.Content value="overview">{overview}</Tabs.Content>
        <Tabs.Content value="responses">{responses}</Tabs.Content>
        <Tabs.Content value="share">{share}</Tabs.Content>
        <Tabs.Content value="danger">{danger}</Tabs.Content>
      </div>
    </div>
  );
}
