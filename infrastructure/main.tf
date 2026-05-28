terraform {
  required_version = ">= 1.5.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

locals {
  name_prefix = "${var.project_name}-${var.environment}"
}

module "networking" {
  source       = "./modules/networking"
  name_prefix  = local.name_prefix
  aws_region   = var.aws_region
}

module "dynamodb" {
  source      = "./modules/dynamodb"
  name_prefix = local.name_prefix
}

module "ecr" {
  source      = "./modules/ecr"
  name_prefix = local.name_prefix
}

module "ecs" {
  source              = "./modules/ecs"
  name_prefix         = local.name_prefix
  vpc_id              = module.networking.vpc_id
  private_subnet_ids  = module.networking.private_subnet_ids
  ecr_repository_url  = module.ecr.repository_url
  polls_table_name    = module.dynamodb.polls_table_name
  votes_table_name    = module.dynamodb.votes_table_name
  creator_jwt_secret  = var.creator_jwt_secret
  ses_from_email      = var.ses_from_email
}

module "alb" {
  source            = "./modules/alb"
  name_prefix       = local.name_prefix
  vpc_id            = module.networking.vpc_id
  public_subnet_ids = module.networking.public_subnet_ids
  target_group_arn  = module.ecs.target_group_arn
}

module "cloudfront" {
  source      = "./modules/cloudfront"
  name_prefix = local.name_prefix
  alb_dns_name = module.alb.dns_name
  domain_name = var.domain_name
}

module "ses" {
  source         = "./modules/ses"
  name_prefix    = local.name_prefix
  domain_name    = var.domain_name
  from_email     = var.ses_from_email
}
