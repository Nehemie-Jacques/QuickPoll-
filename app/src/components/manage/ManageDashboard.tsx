"use client";

import { useCallback, useEffect, useState } from "react";
import type { Poll, PollResults } from "@/types/poll";
import type { Vote } from "@/types/vote";
import { ManageLayout } from "./ManageLayout";
import { OverviewTab } from "./OverviewTab";
import { ResponsesTable } from "./ResponsesTable";
import { ShareTab } from "./ShareTab";
import { DangerZone } from "./DangerZone";
import { Skeleton } from "@/components/ui/Skeleton";

interface ManageDashboardProps {
  pollId: string;
  token: string;
  voteUrl: string;
}

export function ManageDashboard({
  pollId,
  token,
  voteUrl,
}: ManageDashboardProps) {
  const [poll, setPoll] = useState<Poll | null>(null);
  const [votes, setVotes] = useState<Vote[]>([]);
  const [results, setResults] = useState<PollResults | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const res = await fetch(
      `/api/polls/${pollId}/manage?token=${encodeURIComponent(token)}`,
    );
    const data = await res.json();
    if (res.ok) {
      setPoll(data.poll);
      setVotes(data.votes);
      setResults(data.results);
    }
    setLoading(false);
  }, [pollId, token]);

  useEffect(() => {
    load();
  }, [load]);

  if (loading) return <Skeleton className="mx-auto mt-20 h-64 max-w-4xl" />;
  if (!poll || !results) {
    return (
      <p className="p-6 text-center text-red-600">
        Lien de gestion invalide ou expiré
      </p>
    );
  }

  return (
    <ManageLayout
      title={`Gérer : ${poll.title}`}
      overview={
        <OverviewTab
          poll={poll}
          results={results}
          token={token}
          onRefresh={load}
        />
      }
      responses={<ResponsesTable votes={votes} />}
      share={<ShareTab pollId={pollId} voteUrl={voteUrl} token={token} />}
      danger={
        <DangerZone
          pollId={pollId}
          token={token}
          showResults={poll.settings.showResultsBeforeClose}
          onRefresh={load}
        />
      }
    />
  );
}
