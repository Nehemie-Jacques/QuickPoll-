export type PollType = "single_choice" | "multiple_choice" | "rating" | "yes_no";

export type ExpirationPreset = "1h" | "6h" | "24h" | "7d" | "custom" | "none";

export interface PollOption {
  id: string;
  label: string;
}

export interface PollSettings {
  password?: string;
  allowComments: boolean;
  showResultsBeforeClose: boolean;
  requireAlias: boolean;
  maxChoices?: number;
  notifyEmail?: string;
}

export interface Poll {
  id: string;
  title: string;
  description?: string;
  type: PollType;
  options: PollOption[];
  accentColor: string;
  expiresAt: string | null;
  closedAt: string | null;
  settings: PollSettings;
  voteCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePollInput {
  title: string;
  description?: string;
  type: PollType;
  options: Omit<PollOption, "id">[];
  accentColor?: string;
  expiration: ExpirationPreset;
  customExpiresAt?: string;
  settings: Omit<PollSettings, "password"> & { password?: string };
  notifyEmail?: string;
}

export interface CreatePollResponse {
  poll: Poll;
  voteUrl: string;
  manageUrl: string;
}

export interface PollResults {
  pollId: string;
  totalVotes: number;
  breakdown: Record<string, number>;
  ratingAverage?: number;
  activity: { timestamp: string; count: number }[];
  comments: { alias?: string; text: string; createdAt: string }[];
}
