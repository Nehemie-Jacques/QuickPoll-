import { GetCommand, PutCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { customAlphabet } from "nanoid";
import type { Vote, VotePayload } from "@/types/vote";
import type { Poll } from "@/types/poll";
import { docClient, VOTES_TABLE } from "./client";

const voteIdGen = customAlphabet(
  "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
  16,
);

export async function hasVoted(
  pollId: string,
  fingerprint: string,
): Promise<boolean> {
  const result = await docClient.send(
    new GetCommand({
      TableName: VOTES_TABLE,
      Key: { pollId, fingerprint },
    }),
  );
  return !!result.Item;
}

export async function createVote(
  poll: Poll,
  fingerprint: string,
  payload: VotePayload,
): Promise<Vote> {
  const vote: Vote = {
    pollId: poll.id,
    voteId: voteIdGen(),
    fingerprint,
    type: poll.type,
    optionIds: payload.optionIds,
    rating: payload.rating,
    yesNo: payload.yesNo,
    alias: payload.alias,
    comment: payload.comment,
    createdAt: new Date().toISOString(),
  };

  await docClient.send(
    new PutCommand({
      TableName: VOTES_TABLE,
      Item: vote,
      ConditionExpression: "attribute_not_exists(fingerprint)",
    }),
  );

  return vote;
}

export async function listVotesByPoll(pollId: string): Promise<Vote[]> {
  const result = await docClient.send(
    new QueryCommand({
      TableName: VOTES_TABLE,
      KeyConditionExpression: "pollId = :pollId",
      ExpressionAttributeValues: { ":pollId": pollId },
    }),
  );
  return (result.Items as Vote[]) ?? [];
}
