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
    <div className="mx-auto flex max-w-5xl flex-col gap-8 px-4 py-8 lg:flex-row">
      <aside className="w-full shrink-0 lg:w-60">
        <Badge tone={statusTone} className="mb-4">
          {status}
        </Badge>
        <p className="text-xs text-zinc-500">
          Created {new Date(poll.createdAt).toLocaleDateString()}
        </p>
        <p className="mt-1 font-display text-2xl font-bold text-zinc-50">
          {poll.totalVotes}
        </p>
        <p className="text-xs text-zinc-500">total votes</p>

        <Tabs.List className="mt-8 flex flex-row gap-1 overflow-x-auto lg:flex-col lg:gap-0">
          {[
            { value: "overview", label: "Overview" },
            { value: "responses", label: "Responses" },
            { value: "share", label: "Share" },
            { value: "danger", label: "Danger Zone" },
          ].map((t) => (
            <Tabs.Trigger
              key={t.value}
              value={t.value}
              className="rounded-lg px-3 py-2 text-left text-sm text-zinc-400 data-[state=active]:bg-zinc-800 data-[state=active]:text-zinc-100 lg:w-full"
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
