# FinCrack Backend CI/CD Pipeline

This folder contains the GitHub Actions workflows for continuous integration and deployment of the FinCrack backend.

## Workflow Structure

The CI/CD pipeline has been split into two separate workflows:

1. **Continuous Integration (ci.yml)**:
   - Testing: Runs linting and unit tests
   - Building: Builds and pushes a Docker image to Docker Hub

2. **Continuous Deployment (cd.yml)**:
   - Automatically triggered when CI workflow completes successfully
   - Deploys the application to the production server
   - Only runs after a successful CI workflow on the main branch

## Required GitHub Secrets

To use these workflows, you need to configure the following secrets in your GitHub repository:

### Database and Authentication
- `DATABASE_URL`: MongoDB connection string
- `JWT_SECRET`: Secret for JWT token generation

### Environment Variables
- `BANK_RECOMMENDATION_DEV_URL`: Dev URL for bank recommendation API
- `BANK_RECOMMENDATION_PROD_URL`: Production URL for bank recommendation API
- `SERVICE_BASE_URL_DEV`: Dev URL for service recommendation API
- `SERVICE_BASE_URL_PROD`: Production URL for service recommendation API
- `FRONTEND_DEV_URL`: Dev URL for frontend
- `FRONTEND_PROD_URL`: Production URL for frontend
- `WISHLIST_URL_DEV`: Dev URL for stock wishlist API
- `WISHLIST_URL_PROD`: Production URL for stock wishlist API
- `NEBIUS_API_KEY`: Nebius API key
- `NEBIUS_API_BASE_URL`: Nebius API base URL
- `NEBIUS_MODEL_ID`: Nebius Model ID

### Docker Hub
- `DOCKERHUB_USERNAME`: Your Docker Hub username
- `DOCKERHUB_TOKEN`: Access token for Docker Hub

### Deployment
- `DEPLOY_HOST`: Hostname/IP of your production server
- `DEPLOY_USER`: SSH username for the production server
- `DEPLOY_KEY`: SSH private key for authentication

## Prisma Handling

The CI workflow includes special handling for Prisma schema changes:
1. Removes node_modules to ensure clean state
2. Reinstalls dependencies
3. Runs `npx prisma db push` to update the database schema
4. Runs `npx prisma generate` to generate the Prisma client

## Setup Instructions

1. Go to your GitHub repository settings
2. Navigate to "Secrets and variables" > "Actions"
3. Add each of the secrets listed above
4. Ensure your production server has Docker and docker-compose installed
5. Update the deployment path in the CD workflow file if needed (`/path/to/deployment`) 