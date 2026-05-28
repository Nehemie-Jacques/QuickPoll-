variable "name_prefix" { type = string }
variable "vpc_id" { type = string }
variable "private_subnet_ids" { type = list(string) }
variable "ecr_repository_url" { type = string }
variable "polls_table_name" { type = string }
variable "votes_table_name" { type = string }
variable "creator_jwt_secret" { type = string; sensitive = true }
variable "ses_from_email" { type = string }

resource "aws_ecs_cluster" "main" {
  name = "${var.name_prefix}-cluster"
}

resource "aws_lb_target_group" "app" {
  name        = "${var.name_prefix}-tg"
  port        = 3000
  protocol    = "HTTP"
  vpc_id      = var.vpc_id
  target_type = "ip"
  health_check { path = "/" }
}

output "target_group_arn" { value = aws_lb_target_group.app.arn }
output "cluster_name" { value = aws_ecs_cluster.main.name }
