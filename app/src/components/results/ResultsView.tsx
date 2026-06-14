"use client";

import { useEffect, useMemo, useState } from "react";
import { PageContainer } from "@/components/layout/PageContainer";
import type { Poll, PollResults } from "@/types/poll";
import { computePollStatus } from "@/lib/poll-status";
import { POLL_TYPE_LABELS } from "@/lib/poll-labels";
import { Card } from "@/components/ui/Card";
import { LiveIndicator } from "./LiveIndicator";
import { StatsRow } from "./StatsRow";
import { ResultsBreakdown } from "./ResultsBreakdown";
import { ActivityChart } from "./ActivityChart";
import { CommentsFeed } from "./CommentsFeed";
import { SharePanel } from "./SharePanel";

export function ResultsView({
  pollId,
  initialPoll,
  initialResults,
}: {
  pollId: string;
  initialPoll: Poll;
  initialResults: PollResults;
}) {
  const [poll, setPoll] = useState(initialPoll);
  const [results, setResults] = useState(initialResults);
  const [connected, setConnected] = useState(false);

  const status = computePollStatus(poll);
  const closed = status !== "active";

  useEffect(() => {
    const es = new EventSource(`/api/polls/${pollId}/stream`);
    es.onopen = () => setConnected(true);
    es.onmessage = (ev) => {
      const data = JSON.parse(ev.data);
      setPoll(data.poll);
      setResults(data.results);
    };
    es.onerror = () => setConnected(false);
    return () => es.close();
  }, [pollId]);

  const leadingLabel = useMemo(() => {
    if (poll.type === "yes_no") {
      const y = results.breakdown.yes ?? 0;
      const n = results.breakdown.no ?? 0;
      if (y >= n && y > 0) return "Yes";
      if (n > 0) return "No";
      return undefined;
    }
    let best = { label: "", count: 0 };
    for (const o of poll.options) {
      const c = results.breakdown[o.id] ?? 0;
      if (c > best.count) best = { label: o.label, count: c };
    }
    return best.count > 0 ? best.label : undefined;
  }, [poll, results]);

  return (
    <PageContainer size="lg">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold">{poll.title}</h1>
          <p className="mt-1 text-sm text-violet-400">
            {POLL_TYPE_LABELS[poll.type]}
          </p>
        </div>
        <LiveIndicator connected={connected} closed={closed} />
      </div>

      <StatsRow poll={poll} results={results} leadingLabel={leadingLabel} />

      <Card className="mt-6 space-y-4">
        <h2 className="font-display text-lg font-semibold">Results</h2>
        <ResultsBreakdown poll={poll} results={results} />
      </Card>

      <Card className="mt-6">
        <h2 className="mb-4 font-display text-lg font-semibold">Vote activity</h2>
        <ActivityChart activity={results.activity} accentColor={poll.accentColor} />
      </Card>

      {poll.settings.allowComments && (
        <Card className="mt-6">
          <h2 className="mb-4 flex items-center gap-2 font-display text-lg font-semibold">
            Voter comments
            <span className="rounded-full bg-[var(--bg-elevated)] px-2 py-0.5 text-xs text-[var(--text-secondary)]">
              {results.comments.length}
            </span>
          </h2>
          <CommentsFeed poll={poll} comments={results.comments} />
        </Card>
      )}

      <Card className="mt-6">
        <h2 className="mb-4 font-display text-lg font-semibold">Share this poll</h2>
        <SharePanel pollId={pollId} />
      </Card>
    </PageContainer>
  );
}
