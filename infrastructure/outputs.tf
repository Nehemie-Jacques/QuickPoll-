output "cloudfront_url" {
  value = module.cloudfront.distribution_domain_name
}

output "alb_dns_name" {
  value = module.alb.dns_name
}

output "ecr_repository_url" {
  value = module.ecr.repository_url
}

output "polls_table_name" {
  value = module.dynamodb.polls_table_name
}

output "votes_table_name" {
  value = module.dynamodb.votes_table_name
}
