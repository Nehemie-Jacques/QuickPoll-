import { notFound } from "next/navigation";
import { getPoll, getPollResults } from "@/lib/dynamodb/polls";
import { pollVoteUrl } from "@/lib/app-url";
import { ResultsView } from "@/components/results/ResultsView";

type PageProps = { params: Promise<{ id: string }> };

export default async function ResultsPage({ params }: PageProps) {
  const { id } = await params;
  const poll = await getPoll(id);

  if (!poll) notFound();

  const closed = Boolean(poll.closedAt);
  const expired =
    poll.expiresAt !== null && new Date(poll.expiresAt) < new Date();
  const canShow =
    poll.settings.showResultsBeforeClose || closed || expired;

  if (!canShow) {
    return (
      <div className="p-6 text-center">
        <h1 className="text-xl font-semibold">Résultats masqués</h1>
        <p className="mt-2 text-zinc-500">
          Le créateur a choisi de les afficher après la clôture.
        </p>
      </div>
    );
  }

  const results = await getPollResults(id);

  return (
    <ResultsView
      pollId={id}
      initialPoll={poll}
      initialResults={results}
      voteUrl={pollVoteUrl(id)}
    />
  );
}
