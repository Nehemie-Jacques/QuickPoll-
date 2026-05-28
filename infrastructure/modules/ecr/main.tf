variable "name_prefix" { type = string }

resource "aws_ecr_repository" "app" {
  name                 = "${var.name_prefix}-app"
  image_tag_mutability = "MUTABLE"
  force_delete         = true
}

output "repository_url" { value = aws_ecr_repository.app.repository_url }
