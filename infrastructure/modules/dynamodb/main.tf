variable "name_prefix" { type = string }

resource "aws_dynamodb_table" "polls" {
  name         = "${var.name_prefix}-polls"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "id"
  attribute { name = "id"; type = "S" }
}

resource "aws_dynamodb_table" "votes" {
  name         = "${var.name_prefix}-votes"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "pollId"
  range_key    = "fingerprint"
  attribute {
    name = "pollId"
    type = "S"
  }
  attribute {
    name = "fingerprint"
    type = "S"
  }
}

output "polls_table_name" { value = aws_dynamodb_table.polls.name }
output "votes_table_name" { value = aws_dynamodb_table.votes.name }
