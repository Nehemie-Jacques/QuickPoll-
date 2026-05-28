import type { PollType } from "./poll";

export interface VotePayload {
  optionIds?: string[];
  rating?: number;
  yesNo?: boolean;
  alias?: string;
  comment?: string;
  password?: string;
}

export interface Vote {
  pollId: string;
  voteId: string;
  fingerprint: string;
  type: PollType;
  optionIds?: string[];
  rating?: number;
  yesNo?: boolean;
  alias?: string;
  comment?: string;
  createdAt: string;
}

export interface VoteGuardResult {
  allowed: boolean;
  reason?: "already_voted" | "poll_closed" | "poll_expired" | "invalid_password";
}
