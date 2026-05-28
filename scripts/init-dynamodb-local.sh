#!/usr/bin/env bash
set -euo pipefail

ENDPOINT="${DYNAMODB_ENDPOINT:-http://localhost:8000}"

aws dynamodb create-table --endpoint-url "$ENDPOINT" \
  --table-name quickpoll-polls \
  --attribute-definitions AttributeName=id,AttributeType=S \
  --key-schema AttributeName=id,KeyType=HASH \
  --billing-mode PAY_PER_REQUEST \
  2>/dev/null || true

aws dynamodb create-table --endpoint-url "$ENDPOINT" \
  --table-name quickpoll-votes \
  --attribute-definitions \
    AttributeName=pollId,AttributeType=S \
    AttributeName=fingerprint,AttributeType=S \
  --key-schema \
    AttributeName=pollId,KeyType=HASH \
    AttributeName=fingerprint,KeyType=RANGE \
  --billing-mode PAY_PER_REQUEST \
  2>/dev/null || true

echo "Tables ready at $ENDPOINT"
