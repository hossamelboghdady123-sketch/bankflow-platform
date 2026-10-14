resource "random_password" "db_password" {
  length  = 32
  special = false
}

resource "aws_lightsail_instance" "bankflow" {
  name              = var.instance_name
  availability_zone = var.availability_zone
  blueprint_id      = "ubuntu_24_04"
  bundle_id         = "small_3_0"

  user_data = "echo '${base64encode(templatefile("${path.module}/bootstrap.sh.tftpl", { db_password = random_password.db_password.result }))}' | base64 -d | bash"

  tags = {
    Project     = "BankFlow"
    Environment = "Production"
    ManagedBy   = "Terraform"
  }
}

resource "aws_lightsail_static_ip" "bankflow" {
  name = "bankflow-prod-ip"
}

resource "aws_lightsail_static_ip_attachment" "bankflow" {
  static_ip_name = aws_lightsail_static_ip.bankflow.name
  instance_name  = aws_lightsail_instance.bankflow.name
}

resource "aws_lightsail_instance_public_ports" "bankflow" {
  instance_name = aws_lightsail_instance.bankflow.name

  port_info {
    protocol  = "tcp"
    from_port = 22
    to_port   = 22
    cidrs     = [var.admin_cidr]
  }

  port_info {
    protocol  = "tcp"
    from_port = 80
    to_port   = 80
    cidrs     = ["0.0.0.0/0"]
  }
}
