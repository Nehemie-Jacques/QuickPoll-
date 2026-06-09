variable "name_prefix" { type = string }
variable "vpc_id" { type = string }
variable "private_subnet_ids" { type = list(string) }
variable "target_group_arn" { type = string }
variable "alb_security_group_id" { type = string }
variable "ecr_repository_url" { type = string }
variable "image_tag" {
  type    = string
  default = "latest"
}
variable "polls_table_name" { type = string }
variable "votes_table_name" { type = string }
variable "polls_table_arn" { type = string }
variable "votes_table_arn" { type = string }
variable "creator_jwt_secret" {
  type      = string
  sensitive = true
}
variable "app_port" {
  type    = number
  default = 3000
}
variable "cpu" {
  type    = number
  default = 512
}
variable "memory" {
  type    = number
  default = 1024
}
variable "desired_count" {
  type    = number
  default = 2
}
variable "aws_region" { type = string }

variable "ses_from_email" {
  type    = string
  default = ""
}
