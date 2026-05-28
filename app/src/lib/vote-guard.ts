import type { Poll } from "@/types/poll";
import type { VoteGuardResult } from "@/types/vote";
import { hasVoted } from "@/lib/dynamodb/votes";

export function isPollOpen(poll: Poll): boolean {
  if (poll.closedAt) return false;
  if (poll.expiresAt && new Date(poll.expiresAt) < new Date()) return false;
  return true;
}

export async function checkVoteAllowed(
  poll: Poll,
  fingerprint: string,
  password?: string,
): Promise<VoteGuardResult> {
  if (poll.closedAt) return { allowed: false, reason: "poll_closed" };
  if (poll.expiresAt && new Date(poll.expiresAt) < new Date()) {
    return { allowed: false, reason: "poll_expired" };
  }
  if (poll.settings.password && poll.settings.password !== password) {
    return { allowed: false, reason: "invalid_password" };
  }
  const voted = await hasVoted(poll.id, fingerprint);
  if (voted) return { allowed: false, reason: "already_voted" };
  return { allowed: true };
}
