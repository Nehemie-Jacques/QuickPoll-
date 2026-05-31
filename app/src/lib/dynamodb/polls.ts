import {
  GetCommand,
  PutCommand,
  UpdateCommand,
  DeleteCommand,
} from "@aws-sdk/lib-dynamodb";
import type { CreatePollInput, Poll, PollResults, PollStatus } from "@/types/poll";
import { docClient, POLLS_TABLE } from "./client";
import { generateOptionId, generatePollId } from "@/lib/nanoid";

function expirationToDate(
  expiration: CreatePollInput["expiration"],
  customExpiresAt?: string,
): string | null {
  if (expiration === "none") return null;
  if (expiration === "custom" && customExpiresAt) return customExpiresAt;
  const now = Date.now();
  const offsets: Record<string, number> = {
    "1h": 60 * 60 * 1000,
    "6h": 6 * 60 * 60 * 1000,
    "24h": 24 * 60 * 60 * 1000,
    "7d": 7 * 24 * 60 * 60 * 1000,
  };
  const ms = offsets[expiration];
  if (!ms) return null;
  return new Date(now + ms).toISOString();
}

export async function createPoll(input: CreatePollInput): Promise<Poll> {
  const now = new Date().toISOString();
  const poll: Poll = {
    id: generatePollId(),
    title: input.title,
    description: input.description,
    type: input.type,
    options: input.options.map((o) => ({
      id: generateOptionId(),
      label: o.label,
    })),
    accentColor: input.accentColor ?? "#7C3AED",
    status: "active",
    expiresAt: expirationToDate(input.expiration, input.customExpiresAt),
    closedAt: null,
    settings: {
      allowComments: input.settings.allowComments,
      showResultsBeforeClose: input.settings.showResultsBeforeClose,
      requireAlias: input.settings.requireAlias,
      maxChoices: input.settings.maxChoices,
      password: input.settings.password,
      notifyEmail: input.notifyEmail ?? input.settings.notifyEmail,
    },
    totalVotes: 0,
    createdAt: now,
    updatedAt: now,
  };

  await docClient.send(
    new PutCommand({
      TableName: POLLS_TABLE,
      Item: poll,
      ConditionExpression: "attribute_not_exists(id)",
    }),
  );

  return poll;
}

export async function getPoll(id: string): Promise<Poll | null> {
  const result = await docClient.send(
    new GetCommand({ TableName: POLLS_TABLE, Key: { id } }),
  );
  const item = result.Item as Poll | undefined;
  if (!item) return null;
  return normalizePoll(item);
}

function normalizePoll(raw: Poll & { voteCount?: number }): Poll {
  return {
    ...raw,
    totalVotes: raw.totalVotes ?? raw.voteCount ?? 0,
    status: raw.status ?? "active",
  };
}

export async function incrementTotalVotes(pollId: string): Promise<number> {
  const result = await docClient.send(
    new UpdateCommand({
      TableName: POLLS_TABLE,
      Key: { id: pollId },
      UpdateExpression:
        "SET totalVotes = if_not_exists(totalVotes, :zero) + :inc, updatedAt = :now",
      ExpressionAttributeValues: {
        ":inc": 1,
        ":zero": 0,
        ":now": new Date().toISOString(),
      },
      ReturnValues: "UPDATED_NEW",
    }),
  );
  return (result.Attributes?.totalVotes as number) ?? 0;
}

export async function updatePoll(
  id: string,
  updates: Partial<
    Pick<
      Poll,
      | "expiresAt"
      | "closedAt"
      | "settings"
      | "title"
      | "description"
      | "status"
    >
  >,
): Promise<Poll | null> {
  const expressions: string[] = ["updatedAt = :now"];
  const values: Record<string, unknown> = { ":now": new Date().toISOString() };

  if (updates.expiresAt !== undefined) {
    expressions.push("expiresAt = :expiresAt");
    values[":expiresAt"] = updates.expiresAt;
  }
  if (updates.closedAt !== undefined) {
    expressions.push("closedAt = :closedAt");
    values[":closedAt"] = updates.closedAt;
  }
  if (updates.status !== undefined) {
    expressions.push("#status = :status");
    values[":status"] = updates.status;
  }
  if (updates.settings !== undefined) {
    expressions.push("settings = :settings");
    values[":settings"] = updates.settings;
  }
  if (updates.title !== undefined) {
    expressions.push("title = :title");
    values[":title"] = updates.title;
  }
  if (updates.description !== undefined) {
    expressions.push("description = :description");
    values[":description"] = updates.description;
  }

  await docClient.send(
    new UpdateCommand({
      TableName: POLLS_TABLE,
      Key: { id },
      UpdateExpression: `SET ${expressions.join(", ")}`,
      ExpressionAttributeNames: updates.status
        ? { "#status": "status" }
        : undefined,
      ExpressionAttributeValues: values,
    }),
  );

  return getPoll(id);
}

export async function closePoll(id: string): Promise<Poll | null> {
  return updatePoll(id, {
    status: "closed",
    closedAt: new Date().toISOString(),
  });
}

export async function deletePoll(id: string): Promise<void> {
  await docClient.send(
    new DeleteCommand({ TableName: POLLS_TABLE, Key: { id } }),
  );
}

export async function getPollResults(pollId: string): Promise<PollResults> {
  const { listVotesByPoll } = await import("./votes");
  const votes = await listVotesByPoll(pollId);
  const breakdown: Record<string, number> = {};
  let ratingSum = 0;
  let ratingCount = 0;
  const activityMap = new Map<string, number>();

  for (const vote of votes) {
    const bucket = vote.createdAt.slice(0, 16);
    activityMap.set(bucket, (activityMap.get(bucket) ?? 0) + 1);

    if (vote.optionIds) {
      for (const oid of vote.optionIds) {
        breakdown[oid] = (breakdown[oid] ?? 0) + 1;
      }
    }
    if (vote.rating !== undefined) {
      ratingSum += vote.rating;
      ratingCount += 1;
      const key = `rating-${vote.rating}`;
      breakdown[key] = (breakdown[key] ?? 0) + 1;
    }
    if (vote.yesNo !== undefined) {
      const key = vote.yesNo ? "yes" : "no";
      breakdown[key] = (breakdown[key] ?? 0) + 1;
    }
  }

  const activity = [...activityMap.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([timestamp, count]) => ({ timestamp, count }));

  const comments = votes
    .filter((v) => v.comment)
    .map((v) => ({
      alias: v.alias,
      text: v.comment!,
      createdAt: v.createdAt,
      optionIds: v.optionIds,
      rating: v.rating,
      yesNo: v.yesNo,
    }))
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  return {
    pollId,
    totalVotes: votes.length,
    breakdown,
    ratingAverage: ratingCount > 0 ? ratingSum / ratingCount : undefined,
    activity,
    comments,
  };
}
