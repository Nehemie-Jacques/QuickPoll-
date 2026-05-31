output "polls_table_name" { value = aws_dynamodb_table.polls.name }
output "votes_table_name" { value = aws_dynamodb_table.votes.name }
output "polls_table_arn" { value = aws_dynamodb_table.polls.arn }
output "votes_table_arn" { value = aws_dynamodb_table.votes.arn }
