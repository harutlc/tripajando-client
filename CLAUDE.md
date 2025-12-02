# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Tripajando is a React frontend application deployed on AWS infrastructure. This repository contains only the client-side code.

**Tech Stack:**
- React 19 + TypeScript
- Vite 7 (rolldown-vite for faster builds)
- Material-UI v7 for UI components
- Auth0 React SDK for authentication
- React Router v7 for routing
- Axios for HTTP requests
- AWS (S3, CloudFront, Route53, ACM) for hosting
- Terraform for infrastructure management
- GitHub Actions for CI/CD

**Authentication:** Auth0 with automatic token management via the Auth0 React SDK

## Project Architecture

### Repository Structure

This is a **frontend-only** repository. The root directory is the React application.

```
tripajando-client/
├── src/
│   ├── components/        # Reusable UI components (Layout, ProtectedRoute)
│   ├── pages/            # Page components (Dashboard, Profile, Settings, Login)
│   ├── contexts/         # AuthContext wrapping Auth0Provider
│   ├── services/         # Axios instance with token interceptor
│   ├── hooks/            # Custom React hooks
│   ├── styles/           # MUI theme configuration
│   ├── types/            # TypeScript type definitions
│   └── assets/           # Static assets
├── terraform/            # Infrastructure as code
│   ├── environments/     # Dev and prod .tfvars files
│   └── *.tf             # Terraform resource definitions
├── scripts/             # Helper scripts (deploy.sh, terraform.sh)
├── .github/workflows/   # GitHub Actions CI/CD
└── public/              # Static files
```

### Key Architectural Patterns

**Path Aliases:** Configured in both `tsconfig.app.json` and `vite.config.ts`:
- `@/` → `src/`
- `@components/` → `src/components/`
- `@pages/` → `src/pages/`
- `@services/` → `src/services/`
- `@hooks/` → `src/hooks/`
- `@contexts/` → `src/contexts/`
- `@utils/` → `src/utils/`
- `@types/` → `src/types/`
- `@assets/` → `src/assets/`
- `@styles/` → `src/styles/`

**React Compiler:** Enabled via `babel-plugin-react-compiler` in `vite.config.ts`. Automatically optimizes components, reducing need for manual `useMemo`/`useCallback`.

**Vite 7 with Rolldown:** Uses `rolldown-vite` (Rust-based bundler) instead of standard Vite for improved build performance.

**Authentication Flow:**
1. Auth0 React SDK wraps the app in `main.tsx`
2. `AuthContext` (in `src/contexts/`) provides easy access to Auth0 hooks
3. `ProtectedRoute` component guards authenticated routes
4. Axios interceptor in `src/services/axios.ts` automatically adds tokens to API requests
5. 401 responses trigger automatic logout

**API Proxy:** Vite dev server proxies `/api` requests to `http://localhost:5000` (backend server must run separately).

## Common Commands

### Development

```bash
# Install dependencies
npm install

# Start dev server (runs on port 3000)
npm run dev

# Build for production (includes TypeScript type checking)
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

**Note:** `npm run build` runs `tsc -b && vite build`, performing type checking before building.

### Infrastructure Management

**Terraform Workspaces:**
- `default` workspace = Production environment
- `dev` workspace = Development environment

```bash
cd terraform

# Work with DEV environment
terraform workspace select dev
terraform plan -var-file="environments/dev/terraform.tfvars"
terraform apply -var-file="environments/dev/terraform.tfvars"

# Work with PROD environment
terraform workspace select default
terraform plan -var-file="environments/prod/terraform.tfvars"
terraform apply -var-file="environments/prod/terraform.tfvars"

# View outputs (CloudFront ID, S3 bucket, etc.)
terraform output
```

**Helper Scripts:**

```bash
# Terraform wrapper with safety checks
./scripts/terraform.sh [dev|prod] [init|plan|apply|destroy]

# Manual deployment (note: deploy.sh needs workspace support updates)
./scripts/deploy.sh [dev|prod]
```

### Deployment

**Automatic via GitHub Actions:**
- Push to `main` branch → Deploys to production
- Push to `dev` branch → Deploys to development
- Manual workflow dispatch → Choose environment

**Manual deployment:**
```bash
npm run build

# Deploy to dev
aws s3 sync dist/ s3://tripajando-dev-website --delete
aws cloudfront create-invalidation --distribution-id E2UHS1MIUUI19Q --paths "/*"

# Deploy to prod
aws s3 sync dist/ s3://tripajando-prod-website --delete
aws cloudfront create-invalidation --distribution-id E1A3CHIUQ5NRIF --paths "/*"
```

## Environment Configuration

### Local Development (.env)

```env
VITE_AUTH0_DOMAIN=your-domain.auth0.com
VITE_AUTH0_CLIENT_ID=your-client-id
VITE_AUTH0_AUDIENCE=https://api.tripajando.com
VITE_API_BASE_URL=http://localhost:5000
```

### GitHub Environments

The CI/CD pipeline uses GitHub Environments (not suffixed variables):

**Dev Environment:**
- Variables: `VITE_API_BASE_URL`, `S3_BUCKET_NAME`
- Secrets: `VITE_AUTH0_DOMAIN`, `VITE_AUTH0_CLIENT_ID`, `VITE_AUTH0_AUDIENCE`, `CLOUDFRONT_DISTRIBUTION_ID`

**Prod Environment:**
- Variables: `VITE_API_BASE_URL`, `S3_BUCKET_NAME`
- Secrets: `VITE_AUTH0_DOMAIN`, `VITE_AUTH0_CLIENT_ID`, `VITE_AUTH0_AUDIENCE`, `CLOUDFRONT_DISTRIBUTION_ID`

**Repository Secrets (shared):**
- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`

## Infrastructure Components

Each environment (dev/prod) includes:

- **S3 Bucket:** Static website hosting with versioning
  - Dev: `tripajando-dev-website`
  - Prod: `tripajando-prod-website`
- **CloudFront Distribution:** CDN with custom domain and SSL
  - Dev: `E2UHS1MIUUI19Q` (dev.tripajando.com)
  - Prod: `E1A3CHIUQ5NRIF` (tripajando.com)
- **ACM Certificate:** SSL/TLS certificate (must be in us-east-1 for CloudFront)
- **Route 53 Records:** A and AAAA records pointing to CloudFront
- **Origin Access Identity:** Secure CloudFront → S3 access

**Terraform Files:**
- `main.tf` - Provider configuration, workspaces
- `s3.tf` - S3 bucket, versioning, policies
- `cloudfront.tf` - CDN configuration, custom error pages for SPA
- `acm.tf` - SSL certificate with DNS validation
- `route53.tf` - DNS records
- `variables.tf` - Input variables
- `outputs.tf` - Outputs (bucket name, CloudFront ID, URLs)

## Important Notes

### Vite 7 (rolldown-vite)
The project uses `vite: "npm:rolldown-vite@7.2.5"` in package.json for faster Rust-based bundling. When adding Vite plugins, ensure compatibility with Vite 7.

### React Compiler
Automatically memoizes components. Avoid manual `useMemo`/`useCallback` unless profiling shows it's needed. May slightly slow dev/build times.

### Auth0 Configuration
- The SDK handles callbacks automatically - no `/callback` route needed
- Configure Auth0 allowed URLs:
  - Dev: `http://localhost:3000`, `https://dev.tripajando.com`
  - Prod: `https://tripajando.com`
- Tokens are managed automatically by the SDK

### Script Issues
The `scripts/deploy.sh` and `scripts/terraform.sh` files contain hardcoded paths and don't use Terraform workspaces correctly. When updating these scripts:
- `deploy.sh` line 35: Remove `/client` from path (root IS the client)
- `terraform.sh`: Add `terraform workspace select [workspace]` before commands

### Type Checking
TypeScript compilation happens during build (`tsc -b`). There's no separate type-check command. Run `npm run build` to catch type errors.

### Deployment Workflow
The `.github/workflows/deploy.yml` uses GitHub Environments to automatically select the correct configuration. It:
1. Determines environment from branch (`main` = prod, `dev` = dev)
2. Reads environment-specific variables and secrets
3. Builds with environment variables injected
4. Syncs to correct S3 bucket
5. Invalidates correct CloudFront distribution

## Environment URLs

- **Dev:** https://dev.tripajando.com
- **Prod:** https://tripajando.com
- **Dev API:** https://api-dev.tripajando.com (backend, separate repo)
- **Prod API:** https://api.tripajando.com (backend, separate repo)
