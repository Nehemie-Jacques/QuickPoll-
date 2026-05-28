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
  default = "dev"
}

variable "domain_name" {
  type        = string
  description = "Optional custom domain for CloudFront"
  default     = ""
}

variable "creator_jwt_secret" {
  type      = string
  sensitive = true
}

variable "ses_from_email" {
  type    = string
  default = ""
}
