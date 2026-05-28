"use client";

import { useEffect, useState } from "react";
import type { Poll, PollResults } from "@/types/poll";
import { Card } from "@/components/ui/Card";
import { LiveIndicator } from "./LiveIndicator";
import { StatsRow } from "./StatsRow";
import { ResultsBreakdown } from "./ResultsBreakdown";
import { ActivityChart } from "./ActivityChart";
import { CommentsFeed } from "./CommentsFeed";
import { SharePanel } from "./SharePanel";

interface ResultsViewProps {
  pollId: string;
  initialPoll: Poll;
  initialResults: PollResults;
  voteUrl: string;
}

export function ResultsView({
  pollId,
  initialPoll,
  initialResults,
  voteUrl,
}: ResultsViewProps) {
  const [poll, setPoll] = useState(initialPoll);
  const [results, setResults] = useState(initialResults);
  const [connected, setConnected] = useState(false);

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

  return (
    <div className="mx-auto max-w-2xl space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{poll.title}</h1>
        <LiveIndicator connected={connected} />
      </div>
      <StatsRow
        totalVotes={results.totalVotes}
        ratingAverage={results.ratingAverage}
      />
      <Card className="space-y-4">
        <h2 className="font-semibold">Résultats</h2>
        <ResultsBreakdown poll={poll} results={results} />
      </Card>
      <Card>
        <h2 className="mb-4 font-semibold">Activité</h2>
        <ActivityChart activity={results.activity} accentColor={poll.accentColor} />
      </Card>
      {poll.settings.allowComments && (
        <Card>
          <h2 className="mb-4 font-semibold">Commentaires</h2>
          <CommentsFeed comments={results.comments} />
        </Card>
      )}
      <Card>
        <h2 className="mb-4 font-semibold">Partager</h2>
        <SharePanel pollId={pollId} voteUrl={voteUrl} />
      </Card>
    </div>
  );
}
