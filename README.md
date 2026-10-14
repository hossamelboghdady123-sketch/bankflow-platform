# BankFlow — Cloud-Native Banking Platform

A DevOps portfolio project demonstrating containerization, CI/CD preparation, Infrastructure as Code, and cloud deployment on AWS.

## Project Overview

BankFlow is a web-based banking application built with a React frontend and a Spring Boot backend. The platform uses PostgreSQL for persistent data storage and Docker Compose to orchestrate its services.

The project demonstrates how to package an application, provision cloud infrastructure with Terraform, and prepare a repeatable deployment workflow.

## Architecture

```text
                 Users
                   |
                HTTP :80
                   |
                   v
          React Frontend + Nginx
                   |
              /api requests
                   |
                   v
          Spring Boot REST API
                   |
                   v
               PostgreSQL
```

### AWS Infrastructure

- **AWS Lightsail** — Virtual server hosting.
- **Terraform** — Infrastructure provisioning as Code.
- **Ubuntu 24.04** — Server operating system.
- **Static IP** — Persistent public IP address.
- **Docker Compose** — Multi-container application deployment.
- **GitHub** — Source code repository.

## Technology Stack

| Layer | Technologies |
|---|---|
| Frontend | React, Vite, Nginx |
| Backend | Java 17, Spring Boot, Maven |
| Database | PostgreSQL |
| Containers | Docker, Docker Compose |
| Infrastructure as Code | Terraform, AWS Provider |
| Cloud | AWS Lightsail |
| Version Control | Git, GitHub |

## Repository Structure

```text
bankflow-platform/
├── backend/
│   └── bankflow-api/
├── frontend/
│   ├── nginx.conf
│   └── ...
├── terraform/
│   └── lightsail-bankflow/
│       ├── main.tf
│       ├── variables.tf
│       ├── versions.tf
│       ├── outputs.tf
│       └── bootstrap.sh.tftpl
├── docker-compose.aws.yml
└── README.md
```

## Run Locally

### Prerequisites

- Git
- Docker
- Docker Compose

### Steps

1. Clone the repository:

   ```bash
   git clone https://github.com/hossamelboghdady123-sketch/bankflow-platform.git
   cd bankflow-platform
   ```

2. Create a local environment file:

   ```bash
   printf 'BANKFLOW_DB_PASSWORD=%s\n' 'REPLACE_WITH_A_STRONG_PASSWORD' > .env
   chmod 600 .env
   ```

3. Start the application:

   ```bash
   docker compose --env-file .env -f docker-compose.aws.yml up -d --build
   ```

4. Inspect the running containers:

   ```bash
   docker compose --env-file .env -f docker-compose.aws.yml ps
   ```

5. View service logs:

   ```bash
   docker compose --env-file .env -f docker-compose.aws.yml logs --tail=100
   ```

The frontend is configured to use Nginx on port 80. Confirm that the containers start successfully before testing the application.

## Infrastructure Deployment

The Terraform configuration provisions AWS Lightsail infrastructure.

From the Terraform directory:

```bash
cd terraform/lightsail-bankflow
terraform init
terraform fmt -check
terraform validate
terraform plan
```

Review the plan before applying infrastructure changes:

```bash
terraform apply
```

The configuration uses variables for the AWS region, availability zone, instance name, and administrator IP range.

**Security:** Keep Terraform state files, generated credentials, private keys, and `.env` files out of Git. Restrict SSH access to your own public IP address.

## DevOps Skills Demonstrated

- Application containerization
- Multi-container orchestration
- Infrastructure as Code with Terraform
- AWS infrastructure provisioning
- Linux server administration
- Reverse proxy configuration with Nginx
- Environment-based configuration
- Git-based version control
- Application deployment troubleshooting

## Deployment Status

AWS Lightsail infrastructure has been provisioned. The public application endpoint still requires successful deployment and end-to-end verification before it can be considered production-ready.

## Future Improvements

- Automated CI/CD pipeline
- Automated application and security testing
- HTTPS with a domain name and TLS certificate
- Centralized logs and monitoring
- Automated deployment verification

## Author

**Hossam Elboghdady**

GitHub: [hossamelboghdady123-sketch](https://github.com/hossamelboghdady123-sketch)
