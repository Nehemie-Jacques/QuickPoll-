resource "aws_dynamodb_table" "polls" {
  name         = "${var.name_prefix}-polls"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "id"

  attribute {
    name = "id"
    type = "S"
  }

  ttl {
    attribute_name = "ttl"
    enabled        = true
  }

  point_in_time_recovery { enabled = true }

  server_side_encryption {
    enabled = true
  }

  tags = { Name = "${var.name_prefix}-polls" }
}

resource "aws_dynamodb_table" "votes" {
  name         = "${var.name_prefix}-votes"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "pollId"
  range_key    = "voterId"

  attribute {
    name = "pollId"
    type = "S"
  }
  attribute {
    name = "voterId"
    type = "S"
  }

  ttl {
    attribute_name = "ttl"
    enabled        = true
  }

  point_in_time_recovery { enabled = true }

  server_side_encryption {
    enabled = true
  }

  tags = { Name = "${var.name_prefix}-votes" }
}
