variable "aws_region" {
  type    = string
  default = "eu-north-1"
}

variable "availability_zone" {
  type    = string
  default = "eu-north-1a"
}

variable "instance_name" {
  type    = string
  default = "bankflow-prod"
}

variable "admin_cidr" {
  description = "Your public IPv4 address with /32"
  type        = string

  validation {
    condition     = can(cidrhost(var.admin_cidr, 0)) && can(regex("/32$", var.admin_cidr))
    error_message = "Use your public IPv4 address followed by /32."
  }
}
