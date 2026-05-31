import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

const isLocal = Boolean(process.env.DYNAMODB_ENDPOINT);

const client = new DynamoDBClient({
  region: process.env.AWS_REGION ?? "eu-west-1",
  ...(isLocal && {
    endpoint: process.env.DYNAMODB_ENDPOINT,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID ?? "local",
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ?? "local",
    },
  }),
});

export const docClient = DynamoDBDocumentClient.from(client, {
  marshallOptions: { removeUndefinedValues: true },
});

export const POLLS_TABLE =
  process.env.DYNAMODB_POLLS_TABLE ??
  process.env.POLLS_TABLE ??
  "quickpoll-polls";

export const VOTES_TABLE =
  process.env.DYNAMODB_VOTES_TABLE ??
  process.env.VOTES_TABLE ??
  "quickpoll-votes";
