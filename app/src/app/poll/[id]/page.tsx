import { notFound } from "next/navigation";
import { getPoll } from "@/lib/dynamodb/polls";
import { isPollOpen } from "@/lib/vote-guard";
import { VoteForm } from "@/components/voting/VoteForm";

type PageProps = { params: Promise<{ id: string }> };

export default async function VotePage({ params }: PageProps) {
  const { id } = await params;
  const poll = await getPoll(id);

  if (!poll) notFound();

  const open = isPollOpen(poll);
  const safePoll = {
    ...poll,
    settings: {
      ...poll.settings,
      hasPassword: Boolean(poll.settings.password),
      password: undefined,
    },
  };

  if (!open) {
    return (
      <div className="p-6 text-center">
        <h1 className="text-xl font-semibold">Ce sondage est clos</h1>
        <a href={`/poll/${id}/results`} className="mt-4 inline-block text-indigo-600">
          Voir les résultats
        </a>
      </div>
    );
  }

  return <VoteForm poll={safePoll} />;
}
