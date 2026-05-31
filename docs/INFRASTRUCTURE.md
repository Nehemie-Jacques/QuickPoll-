# Infrastructure

Terraform modules under `infrastructure/modules/`:

| Module | Purpose |
|--------|---------|
| **networking** | VPC `/16`, 2 AZ, public subnets (ALB) + private subnets (ECS), NAT |
| **ecr** | App repository, lifecycle (10 images max, untagged after 1 day) |
| **dynamodb** | `polls` + `votes` tables, TTL, PITR, SSE |
| **ecs** | Fargate cluster, task/service, task role (DynamoDB least-privilege), CloudWatch logs |
| **alb** | Public ALB, target group, HTTP + optional HTTPS |
| **cloudfront** | CDN in front of ALB, cache `/_next/static/*`, HTTPS redirect |

## Deploy infrastructure

```bash
cd infrastructure
terraform init
terraform plan -var="creator_jwt_secret=YOUR_SECRET"
terraform apply
```

Set `image_tag` to the Git commit SHA when deploying a new release.

## ECS task IAM

The task role allows only:

- `dynamodb:GetItem`, `PutItem`, `UpdateItem`, `Query`
- On the two QuickPoll table ARNs
