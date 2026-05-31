import type { Poll, PollStatus } from "@/types/poll";
import { getPoll, updatePoll } from "@/lib/dynamodb/polls";

export function computePollStatus(poll: Poll): PollStatus {
  if (poll.status === "closed") return "closed";
  if (poll.expiresAt && new Date(poll.expiresAt) < new Date()) return "expired";
  return poll.status === "expired" ? "expired" : "active";
}

export function isPollOpen(poll: Poll): boolean {
  return computePollStatus(poll) === "active";
}

/** Loads poll and persists `expired` status when past expiresAt. */
export async function getPollResolved(id: string): Promise<Poll | null> {
  const poll = await getPoll(id);
  if (!poll) return null;

  if (
    poll.status === "active" &&
    poll.expiresAt &&
    new Date(poll.expiresAt) < new Date()
  ) {
    const updated = await updatePoll(id, {
      status: "expired",
      closedAt: poll.closedAt ?? new Date().toISOString(),
    });
    return updated ?? { ...poll, status: "expired" };
  }

  return poll;
}
