import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({
  region: process.env.AWS_REGION ?? "eu-west-1",
  ...(process.env.DYNAMODB_ENDPOINT && {
    endpoint: process.env.DYNAMODB_ENDPOINT,
  }),
});

export const docClient = DynamoDBDocumentClient.from(client, {
  marshallOptions: { removeUndefinedValues: true },
});

export const POLLS_TABLE = process.env.DYNAMODB_POLLS_TABLE ?? "quickpoll-polls";
export const VOTES_TABLE = process.env.DYNAMODB_VOTES_TABLE ?? "quickpoll-votes";
