output "cloudfront_url" {
  value = "https://${module.cloudfront.distribution_domain_name}"
}

output "alb_dns_name" {
  value = module.alb.dns_name
}

output "ecr_repository_url" {
  value = module.ecr.repository_url
}

output "ecs_cluster_name" {
  value = module.ecs.cluster_name
}

output "ecs_service_name" {
  value = module.ecs.service_name
}

output "polls_table_name" {
  value = module.dynamodb.polls_table_name
}

output "votes_table_name" {
  value = module.dynamodb.votes_table_name
}
