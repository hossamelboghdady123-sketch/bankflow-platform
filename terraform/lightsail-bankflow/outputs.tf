output "instance_name" {
  value = aws_lightsail_instance.bankflow.name
}

output "public_ip" {
  value = aws_lightsail_static_ip.bankflow.ip_address
}

output "website_url" {
  value = "http://${aws_lightsail_static_ip.bankflow.ip_address}"
}
