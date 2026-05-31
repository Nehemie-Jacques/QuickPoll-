variable "name_prefix" { type = string }
variable "alb_dns_name" { type = string }
variable "domain_name" {
  type    = string
  default = ""
}
variable "certificate_arn" {
  type    = string
  default = ""
}
