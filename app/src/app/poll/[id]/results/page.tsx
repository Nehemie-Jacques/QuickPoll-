import Link from "next/link";
import { notFound } from "next/navigation";
import { getPollResults } from "@/lib/dynamodb/polls";
import { computePollStatus, getPollResolved } from "@/lib/poll-status";
import { voteUrl } from "@/lib/urls";
import { ResultsView } from "@/components/results/ResultsView";
import { Card } from "@/components/ui/Card";

type PageProps = { params: Promise<{ id: string }> };

export default async function ResultsPage({ params }: PageProps) {
  const { id } = await params;
  const poll = await getPollResolved(id);

  if (!poll) notFound();

  const status = computePollStatus(poll);
  const canShow =
    poll.settings.showResultsBeforeClose ||
    status === "closed" ||
    status === "expired";

  if (!canShow) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center px-4">
        <Card className="max-w-md text-center">
          <h1 className="font-display text-xl font-bold">Results hidden</h1>
          <p className="mt-2 text-sm text-zinc-500">
            The creator will show results after the poll closes.
          </p>
          <Link href={`/poll/${id}`} className="mt-4 inline-block text-violet-400">
            Back to poll
          </Link>
        </Card>
      </div>
    );
  }

  const results = await getPollResults(id);

  return (
    <ResultsView
      pollId={id}
      initialPoll={poll}
      initialResults={results}
      voteUrl={voteUrl(id)}
    />
  );
}
