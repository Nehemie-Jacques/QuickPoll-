variable "name_prefix" { type = string }
variable "domain_name" { type = string }
variable "from_email" { type = string }

resource "aws_ses_domain_identity" "main" {
  count  = var.domain_name != "" ? 1 : 0
  domain = var.domain_name
}

output "domain_identity_arn" {
  value = try(aws_ses_domain_identity.main[0].arn, null)
}
