import { describe, expect, it } from "vitest";
import { computePollStatus, isPollOpen } from "./poll-status";
import type { Poll } from "@/types/poll";

function basePoll(overrides: Partial<Poll> = {}): Poll {
  return {
    id: "abc",
    title: "Test",
    type: "single_choice",
    options: [],
    accentColor: "#7C3AED",
    status: "active",
    expiresAt: null,
    closedAt: null,
    settings: {
      allowComments: false,
      showResultsBeforeClose: true,
      requireAlias: false,
    },
    totalVotes: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...overrides,
  };
}

describe("computePollStatus", () => {
  it("returns closed when status is closed", () => {
    expect(computePollStatus(basePoll({ status: "closed" }))).toBe("closed");
  });

  it("returns expired when past expiresAt", () => {
    const poll = basePoll({
      expiresAt: new Date(Date.now() - 60_000).toISOString(),
    });
    expect(computePollStatus(poll)).toBe("expired");
  });

  it("returns active for open poll", () => {
    expect(computePollStatus(basePoll())).toBe("active");
  });
});

describe("isPollOpen", () => {
  it("is false when closed", () => {
    expect(isPollOpen(basePoll({ status: "closed" }))).toBe(false);
  });
});
