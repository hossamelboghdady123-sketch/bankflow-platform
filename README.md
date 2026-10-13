# BankFlow - DevOps Portfolio Project

Sample digital banking application for learning DevOps.

## Technology Stack
- Frontend: React and Vite
- Backend: Java and Spring Boot
- Database: PostgreSQL
- Containers: Docker and Docker Compose
- CI/CD: Azure DevOps (planned)
- Infrastructure: Terraform and AWS EKS (planned)
- Deployment: Kubernetes and Helm (planned)
- Monitoring: Prometheus and Grafana (planned)
- Configuration Management: Ansible (planned)

## Project Structure
- `backend/bankflow-api/` - Spring Boot API
- `database/` - PostgreSQL Compose configuration
- `frontend/` - React application and Nginx configuration
- `docker-compose.yml` - Application containers

## Run
The frontend is available at http://localhost:5174 when the local
Docker Compose services are running.

## API Endpoints
- `GET /api/accounts`
- `GET /api/transfers`
- `POST /api/transfers`
- `GET /actuator/health`

## Security
Never commit `.env` files, passwords, tokens, or private keys.
This is a learning project, not a production banking system.

## Status
Local frontend, backend, database, and Docker setup are running.
CI/CD, Terraform, AWS EKS, Helm, monitoring, and Ansible are planned.
