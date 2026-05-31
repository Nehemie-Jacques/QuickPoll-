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
  voterId: string,
): Promise<boolean> {
  const result = await docClient.send(
    new GetCommand({
      TableName: VOTES_TABLE,
      Key: { pollId, voterId },
    }),
  );
  return !!result.Item;
}

export async function createVote(
  poll: Poll,
  voterId: string,
  payload: VotePayload,
): Promise<Vote> {
  const vote: Vote = {
    pollId: poll.id,
    voteId: voteIdGen(),
    voterId,
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
      ConditionExpression: "attribute_not_exists(voterId)",
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
