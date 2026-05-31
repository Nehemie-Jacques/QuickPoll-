import type { Poll } from "@/types/poll";
import { computePollStatus } from "@/lib/poll-status";

export type PublicPoll = Omit<Poll, "settings"> & {
  settings: Omit<Poll["settings"], "password" | "notifyEmail"> & {
    hasPassword: boolean;
    allowComments: boolean;
    showResultsBeforeClose: boolean;
    requireAlias: boolean;
    maxChoices?: number;
  };
};

export type CreatorPoll = PublicPoll & {
  settings: PublicPoll["settings"] & { notifyEmail?: string };
  creatorAuthorized: true;
};

export function serializePoll(
  poll: Poll,
  options: { forCreator?: boolean } = {},
): PublicPoll | CreatorPoll {
  const status = computePollStatus(poll);
  const base = {
    ...poll,
    status,
    settings: {
      hasPassword: Boolean(poll.settings.password),
      allowComments: poll.settings.allowComments,
      showResultsBeforeClose: poll.settings.showResultsBeforeClose,
      requireAlias: poll.settings.requireAlias,
      maxChoices: poll.settings.maxChoices,
    },
  };

  if (options.forCreator) {
    return {
      ...base,
      creatorAuthorized: true,
      settings: {
        ...base.settings,
        notifyEmail: poll.settings.notifyEmail,
      },
    } as CreatorPoll;
  }

  return base as PublicPoll;
}
