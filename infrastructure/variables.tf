variable "project_name" {
  type    = string
  default = "quickpoll"
}

variable "aws_region" {
  type    = string
  default = "eu-west-1"
}

variable "environment" {
  type    = string
  default = "prod"
}

variable "domain_name" {
  type        = string
  description = "Optional custom domain"
  default     = ""
}

variable "certificate_arn" {
  type        = string
  description = "ACM certificate ARN (us-east-1 for CloudFront, regional for ALB)"
  default     = ""
}

variable "creator_jwt_secret" {
  type      = string
  sensitive = true
}

variable "image_tag" {
  type    = string
  default = "latest"
}

variable "ses_from_email" {
  type    = string
  default = ""
}
