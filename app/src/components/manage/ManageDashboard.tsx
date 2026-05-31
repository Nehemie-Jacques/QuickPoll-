"use client";

import { useCallback, useEffect, useState } from "react";
import * as Tabs from "@radix-ui/react-tabs";
import type { Poll, PollResults } from "@/types/poll";
import type { Vote } from "@/types/vote";
import { Skeleton } from "@/components/ui/Skeleton";
import { ManageLayout } from "./ManageLayout";
import { OverviewTab } from "./OverviewTab";
import { ResponsesTable } from "./ResponsesTable";
import { ShareTab } from "./ShareTab";
import { DangerZone } from "./DangerZone";

export function ManageDashboard({
  pollId,
  token,
  voteUrl,
}: {
  pollId: string;
  token: string;
  voteUrl: string;
}) {
  const [poll, setPoll] = useState<Poll | null>(null);
  const [votes, setVotes] = useState<Vote[]>([]);
  const [results, setResults] = useState<PollResults | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const load = useCallback(async () => {
    const res = await fetch(
      `/api/polls/${pollId}/manage?token=${encodeURIComponent(token)}`,
      { headers: { "x-manage-token": token, "x-manage-context": "1" } },
    );
    if (!res.ok) {
      setError(true);
      setLoading(false);
      return;
    }
    const data = await res.json();
    setPoll(data.poll);
    setVotes(data.votes);
    setResults(data.results);
    setLoading(false);
  }, [pollId, token]);

  useEffect(() => {
    load();
  }, [load]);

  const exportUrl = `/api/polls/${pollId}/export?token=${encodeURIComponent(token)}`;

  if (loading) {
    return <Skeleton className="mx-auto mt-20 h-64 max-w-4xl rounded-2xl" />;
  }

  if (error || !poll || !results) {
    return (
      <p className="py-20 text-center text-red-400">
        Invalid or expired creator link
      </p>
    );
  }

  return (
    <Tabs.Root defaultValue="overview">
      <ManageLayout
        poll={poll}
        overview={
          <OverviewTab
            poll={poll}
            results={results}
            token={token}
            onRefresh={load}
          />
        }
        responses={
          <ResponsesTable poll={poll} votes={votes} exportUrl={exportUrl} />
        }
        share={
          <ShareTab pollId={pollId} voteUrl={voteUrl} exportUrl={exportUrl} />
        }
        danger={
          <DangerZone
            pollId={pollId}
            pollTitle={poll.title}
            token={token}
            showResults={poll.settings.showResultsBeforeClose}
            onRefresh={load}
          />
        }
      />
    </Tabs.Root>
  );
}
