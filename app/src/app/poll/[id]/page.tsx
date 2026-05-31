import Link from "next/link";
import { notFound } from "next/navigation";
import { getPollResolved, isPollOpen } from "@/lib/poll-status";
import { VoteForm } from "@/components/voting/VoteForm";
import { Card } from "@/components/ui/Card";

type PageProps = { params: Promise<{ id: string }> };

export default async function VotePage({ params }: PageProps) {
  const { id } = await params;
  const poll = await getPollResolved(id);

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
      <div className="flex min-h-[50vh] items-center justify-center px-4">
        <Card className="max-w-md text-center">
          <div className="text-5xl">🕐</div>
          <h1 className="font-display mt-4 text-xl font-bold">
            This poll has {poll.status === "expired" ? "expired" : "closed"}
          </h1>
          {(poll.settings.showResultsBeforeClose ||
            poll.status !== "active") && (
            <Link
              href={`/poll/${id}/results`}
              className="mt-6 inline-block text-violet-400 hover:underline"
            >
              View results →
            </Link>
          )}
        </Card>
      </div>
    );
  }

  return <VoteForm poll={safePoll} />;
}
