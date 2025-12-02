# Tripajando

A modern travel planning web application built with React and TypeScript.

## Overview

Tripajando is a full-stack web application with a React frontend deployed on AWS CloudFront/S3. The project uses Vite 7 with rolldown for fast builds and includes infrastructure as code with Terraform.

**Tech Stack:**
- React 19 + TypeScript
- Vite 7 (with rolldown)
- React Compiler
- AWS (S3, CloudFront, Route53, ACM)
- Terraform for infrastructure
- GitHub Actions for CI/CD

## Environments

- **Production**: [https://tripajando.com](https://tripajando.com)
- **Development**: [https://dev.tripajando.com](https://dev.tripajando.com)

## Quick Start

### Prerequisites

- Node.js 22.x
- npm
- AWS CLI (for manual deployments)
- Terraform 1.x (for infrastructure management)

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
tripajando-client/
├── src/                    # Application source code
│   ├── components/         # Reusable React components
│   ├── pages/             # Page-level components
│   ├── services/          # API clients and services
│   ├── hooks/             # Custom React hooks
│   ├── contexts/          # React Context providers
│   ├── utils/             # Utility functions
│   ├── types/             # TypeScript type definitions
│   ├── assets/            # Static assets
│   └── styles/            # Global styles
├── public/                # Static files
├── terraform/             # Infrastructure as code
│   ├── environments/      # Environment-specific configs
│   │   ├── dev/          # Dev environment variables
│   │   └── prod/         # Prod environment variables
│   ├── main.tf           # Main Terraform configuration
│   ├── s3.tf             # S3 bucket configuration
│   ├── cloudfront.tf     # CloudFront distribution
│   ├── route53.tf        # DNS configuration
│   └── acm.tf            # SSL certificate
└── .github/
    └── workflows/
        └── deploy.yml     # CI/CD pipeline
```

## Development

### Available Commands

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Lint code with ESLint
```

### Environment Variables

Create a `.env` file in the root directory:

```env
VITE_AUTH0_DOMAIN=your-auth0-domain
VITE_AUTH0_CLIENT_ID=your-client-id
VITE_AUTH0_AUDIENCE=your-api-audience
VITE_API_BASE_URL=http://localhost:5000
```

## Infrastructure

### Terraform

The project uses Terraform to manage AWS infrastructure. Infrastructure is organized using workspaces:

- `default` workspace - Production environment
- `dev` workspace - Development environment

**Deploy infrastructure:**

```bash
cd terraform

# Deploy to dev
terraform workspace select dev
terraform apply -var-file="environments/dev/terraform.tfvars"

# Deploy to prod
terraform workspace select default
terraform apply -var-file="environments/prod/terraform.tfvars"
```

### AWS Resources

Each environment includes:
- S3 bucket for static hosting
- CloudFront distribution with custom domain
- ACM SSL certificate
- Route 53 DNS records
- CloudFront Origin Access Identity

## Deployment

### Automatic Deployment (GitHub Actions)

Deployments are triggered automatically:

- Push to `main` branch → Deploys to production
- Push to `dev` branch → Deploys to development
- Manual workflow dispatch → Choose environment

### Manual Deployment

```bash
# Build the application
npm run build

# Deploy to dev
aws s3 sync dist/ s3://tripajando-dev-website --delete
aws cloudfront create-invalidation --distribution-id E2UHS1MIUUI19Q --paths "/*"

# Deploy to prod
aws s3 sync dist/ s3://tripajando-prod-website --delete
aws cloudfront create-invalidation --distribution-id E1A3CHIUQ5NRIF --paths "/*"
```

## GitHub Environment Setup

Configure the following in GitHub repository settings:

### Dev Environment
**Variables:**
- `VITE_API_BASE_URL`: `https://api-dev.tripajando.com`
- `S3_BUCKET_NAME`: `tripajando-dev-website`

**Secrets:**
- `VITE_AUTH0_DOMAIN`
- `VITE_AUTH0_CLIENT_ID`
- `VITE_AUTH0_AUDIENCE`
- `CLOUDFRONT_DISTRIBUTION_ID`: `E2UHS1MIUUI19Q`

### Prod Environment
**Variables:**
- `VITE_API_BASE_URL`: `https://api.tripajando.com`
- `S3_BUCKET_NAME`: `tripajando-prod-website`

**Secrets:**
- `VITE_AUTH0_DOMAIN`
- `VITE_AUTH0_CLIENT_ID`
- `VITE_AUTH0_AUDIENCE`
- `CLOUDFRONT_DISTRIBUTION_ID`: `E1A3CHIUQ5NRIF`

### Repository Secrets
- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`

## Features

- Modern React with hooks and functional components
- TypeScript for type safety
- React Compiler for automatic optimization
- Fast builds with Vite 7 + rolldown
- CloudFront CDN for global content delivery
- SSL/TLS encryption
- Automated deployments with GitHub Actions
- Infrastructure as code with Terraform
- Separate dev and prod environments

## React Compiler

The React Compiler is enabled on this project. See [this documentation](https://react.dev/learn/react-compiler) for more information.

Note: This may impact Vite dev & build performance, but it automatically optimizes React components by memoizing them, reducing the need for manual `useMemo` and `useCallback`.

## Documentation

- [SETUP.md](./SETUP.md) - Detailed setup instructions
- [CLAUDE.md](./CLAUDE.md) - Claude Code integration guide

## License

Private - All rights reserved
