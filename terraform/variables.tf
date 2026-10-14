variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "eu-north-1"
}

variable "project_name" {
  description = "Project name"
  type        = string
  default     = "bankflow"
}

variable "environment" {
  description = "Deployment environment"
  type        = string
  default     = "dev"
}
