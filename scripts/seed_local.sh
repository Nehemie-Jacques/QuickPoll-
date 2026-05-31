import { CreateTableCommand, DynamoDBClient } from '@aws-sdk/client-dynamodb'

const client = new DynamoDBClient({
  region: 'us-east-1',
  endpoint: 'http://localhost:8000',
  credentials: { accessKeyId: 'local', secretAccessKey: 'local' },
})

async function createTables() {
  // Table polls
  await client.send(new CreateTableCommand({
    TableName: 'quickpoll-polls',
    KeySchema: [{ AttributeName: 'pollId', KeyType: 'HASH' }],
    AttributeDefinitions: [
      { AttributeName: 'pollId', AttributeType: 'S' }
    ],
    BillingMode: 'PAY_PER_REQUEST',
  }))

  // Table votes
  await client.send(new CreateTableCommand({
    TableName: 'quickpoll-votes',
    KeySchema: [
      { AttributeName: 'pollId', KeyType: 'HASH' },
      { AttributeName: 'voterId', KeyType: 'RANGE' },
    ],
    AttributeDefinitions: [
      { AttributeName: 'pollId', AttributeType: 'S' },
      { AttributeName: 'voterId', AttributeType: 'S' },
    ],
    BillingMode: 'PAY_PER_REQUEST',
  }))

  console.log('✅ Tables créées avec succès')
}

createTables().catch(console.error)