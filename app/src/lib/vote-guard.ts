import type { Poll } from "@/types/poll";
import type { VoteGuardResult } from "@/types/vote";
import { hasVoted } from "@/lib/dynamodb/votes";
import { isPollOpen } from "@/lib/poll-status";

export async function checkVoteAllowed(
  poll: Poll,
  voterId: string,
  password?: string,
): Promise<VoteGuardResult> {
  if (!isPollOpen(poll)) {
    const reason = poll.status === "expired" ? "poll_expired" : "poll_closed";
    return { allowed: false, reason };
  }
  if (poll.settings.password && poll.settings.password !== password) {
    return { allowed: false, reason: "invalid_password" };
  }
  const voted = await hasVoted(poll.id, voterId);
  if (voted) return { allowed: false, reason: "already_voted" };
  return { allowed: true };
}
