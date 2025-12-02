# Tripajando Client Setup Guide

This is a React application with Material-UI v7.3.5 and Auth0 authentication using the official Auth0 React SDK.

## Features

- React 19 with TypeScript
- Material-UI v7.3.5 for UI components
- Auth0 React SDK for authentication
- React Router v7 for routing
- Protected routes
- Responsive layout with navigation drawer
- Dashboard, Profile, and Settings pages
- Axios for API requests with token interceptor

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Auth0 account

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Auth0

1. Go to [Auth0 Dashboard](https://manage.auth0.com/)
2. Create a new Application (Single Page Application)
3. Configure the following settings:
   - **Allowed Callback URLs**: `http://localhost:3000`
   - **Allowed Logout URLs**: `http://localhost:3000`
   - **Allowed Web Origins**: `http://localhost:3000`

**Important**: The Auth0 React SDK handles the callback automatically, so you don't need a separate `/callback` route. Just use your application's origin URL.

### 3. Environment Variables

Create a `.env` file in the client directory:

```bash
cp .env.example .env
```

Update the `.env` file with your Auth0 credentials:

```env
VITE_AUTH0_DOMAIN=your-domain.auth0.com
VITE_AUTH0_CLIENT_ID=your-client-id
VITE_API_BASE_URL=http://localhost:5000
```

**Note**: You only need `VITE_AUTH0_DOMAIN` and `VITE_AUTH0_CLIENT_ID`. The SDK handles the redirect URI automatically.

### 4. Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## Project Structure

```
src/
├── components/          # Reusable components
│   ├── Layout.tsx      # Main layout with navigation
│   └── ProtectedRoute.tsx  # Route protection component
├── contexts/           # React Context providers
│   └── AuthContext.tsx # Authentication wrapper using Auth0 SDK
├── pages/              # Page components
│   ├── Login.tsx       # Login page
│   ├── Dashboard.tsx   # Dashboard page
│   ├── Profile.tsx     # User profile page
│   └── Settings.tsx    # Settings page
├── services/           # API services
│   └── axios.ts        # Axios instance with interceptors
├── styles/             # Styling
│   └── theme.ts        # MUI theme configuration
└── types/              # TypeScript types
    └── index.ts        # Type definitions
```

## Authentication Flow

The application uses the Auth0 React SDK which handles the entire authentication flow automatically:

1. User clicks "Sign in with Auth0" on the login page
2. SDK redirects user to Auth0 Universal Login page
3. User authenticates with Auth0
4. Auth0 redirects back to your application
5. SDK automatically handles the callback and exchanges tokens
6. User information is available through the `useAuth()` hook
7. User is redirected to the dashboard

**Key Benefits of Using the Auth0 SDK:**
- Automatic token management and renewal
- Secure token storage
- Built-in PKCE flow for enhanced security
- No need for backend OAuth endpoints
- Simplified authentication logic

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Lint code

## Technology Stack

- **React 19** - UI library
- **TypeScript** - Type safety
- **Vite 7** - Build tool
- **Material-UI 7.3.5** - Component library
- **React Router 7** - Routing
- **Axios** - HTTP client
- **Auth0 React SDK** - Authentication

## Key Features

### Protected Routes

All routes except `/login` are protected. Users must be authenticated to access them.

### Responsive Layout

The layout includes:
- App bar with user menu
- Collapsible navigation drawer (responsive)
- Main content area

### Automatic Token Management

The Auth0 SDK automatically:
- Manages access tokens and refresh tokens
- Handles token renewal
- Stores tokens securely

### Theme Customization

The MUI theme is customizable in `src/styles/theme.ts`.

## Troubleshooting

### CORS Issues

Make sure your Auth0 application has `http://localhost:3000` configured in:
- Allowed Callback URLs
- Allowed Logout URLs
- Allowed Web Origins

### Auth0 Configuration

Verify in your `.env` file:
- `VITE_AUTH0_DOMAIN` should be your Auth0 domain (e.g., `your-tenant.auth0.com`)
- `VITE_AUTH0_CLIENT_ID` should be your Auth0 application's Client ID

### Login Redirect Issues

If you're experiencing redirect issues:
1. Check browser console for errors
2. Verify Auth0 application configuration matches your environment
3. Clear browser cache and localStorage
4. Check that your Auth0 application type is "Single Page Application"

## Getting Access Tokens for API Calls

If you need to call your backend API with Auth0 tokens, you can get the token using the Auth0 SDK:

```typescript
import { useAuth0 } from '@auth0/auth0-react';

const { getAccessTokenSilently } = useAuth0();

const callApi = async () => {
  const token = await getAccessTokenSilently();
  // Use token in API calls
};
```

To enable this, you need to:
1. Set up an API in Auth0 Dashboard
2. Add the API identifier as `audience` in the Auth0Provider configuration in `main.tsx`

## Infrastructure Setup

### AWS Infrastructure with Terraform

The project uses Terraform to manage AWS infrastructure for both dev and prod environments.

#### Prerequisites

- AWS CLI configured with appropriate credentials
- Terraform 1.x installed
- Route 53 hosted zone configured for your domain

#### Terraform Workspaces

The project uses Terraform workspaces to separate dev and prod state:

- `default` workspace - Production environment
- `dev` workspace - Development environment

#### Initial Infrastructure Setup

1. **Configure AWS credentials:**

```bash
aws configure
# Enter your AWS Access Key ID, Secret Access Key, and region (us-east-1)
```

2. **Verify AWS credentials:**

```bash
aws sts get-caller-identity
```

3. **Initialize Terraform:**

```bash
cd terraform
terraform init
```

4. **Deploy Dev Environment:**

```bash
# Create and switch to dev workspace
terraform workspace new dev

# Review the plan
terraform plan -var-file="environments/dev/terraform.tfvars"

# Apply the configuration
terraform apply -var-file="environments/dev/terraform.tfvars"
```

5. **Deploy Prod Environment:**

```bash
# Switch to default workspace (prod)
terraform workspace select default

# Review the plan
terraform plan -var-file="environments/prod/terraform.tfvars"

# Apply the configuration
terraform apply -var-file="environments/prod/terraform.tfvars"
```

#### Infrastructure Components

Each environment creates:
- **S3 Bucket** - Static website hosting with versioning
- **CloudFront Distribution** - CDN with custom domain and SSL
- **ACM Certificate** - SSL/TLS certificate (auto-validated via DNS)
- **Route 53 Records** - A and AAAA records for the domain
- **Origin Access Identity** - Secure CloudFront to S3 access

#### Environment Configuration Files

- `terraform/environments/dev/terraform.tfvars` - Dev environment variables
- `terraform/environments/prod/terraform.tfvars` - Prod environment variables

### GitHub Actions Setup

The project includes CI/CD with GitHub Actions for automatic deployments.

#### Setting Up GitHub Environments

1. **Go to your repository on GitHub**
2. **Navigate to Settings → Environments**

3. **Create Dev Environment:**
   - Click "New environment"
   - Name: `dev`
   - Add environment variables (Variables tab):
     - `VITE_API_BASE_URL` = `https://api-dev.tripajando.com`
     - `S3_BUCKET_NAME` = `tripajando-dev-website`
   - Add environment secrets (Secrets tab):
     - `VITE_AUTH0_DOMAIN` = Your Auth0 domain
     - `VITE_AUTH0_CLIENT_ID` = Your Auth0 client ID
     - `VITE_AUTH0_AUDIENCE` = Your Auth0 API audience
     - `CLOUDFRONT_DISTRIBUTION_ID` = Get from Terraform output

4. **Create Prod Environment:**
   - Click "New environment"
   - Name: `prod`
   - Add environment variables (Variables tab):
     - `VITE_API_BASE_URL` = `https://api.tripajando.com`
     - `S3_BUCKET_NAME` = `tripajando-prod-website`
   - Add environment secrets (Secrets tab):
     - `VITE_AUTH0_DOMAIN` = Your Auth0 domain
     - `VITE_AUTH0_CLIENT_ID` = Your Auth0 client ID
     - `VITE_AUTH0_AUDIENCE` = Your Auth0 API audience
     - `CLOUDFRONT_DISTRIBUTION_ID` = Get from Terraform output

5. **Add Repository Secrets** (Settings → Secrets and variables → Actions):
   - `AWS_ACCESS_KEY_ID` - Your AWS access key
   - `AWS_SECRET_ACCESS_KEY` - Your AWS secret key

#### Getting CloudFront Distribution IDs

After applying Terraform, get the CloudFront distribution IDs:

```bash
# For dev
terraform workspace select dev
terraform output cloudfront_distribution_id

# For prod
terraform workspace select default
terraform output cloudfront_distribution_id
```

#### Deployment Workflow

The GitHub Actions workflow automatically deploys when:
- Push to `main` branch → Deploys to production
- Push to `dev` branch → Deploys to development
- Manual trigger → Choose environment

### Manual Deployment

If you need to deploy manually:

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

### Environment URLs

After deployment, your application will be available at:
- **Dev**: https://dev.tripajando.com
- **Prod**: https://tripajando.com

DNS propagation may take a few minutes after initial setup.

## Complete Setup Checklist

### Local Development
- [ ] Install Node.js 22.x
- [ ] Clone repository
- [ ] Run `npm install`
- [ ] Create `.env` file with Auth0 credentials
- [ ] Start dev server with `npm run dev`

### AWS Infrastructure
- [ ] Configure AWS CLI
- [ ] Update `terraform/environments/dev/terraform.tfvars`
- [ ] Update `terraform/environments/prod/terraform.tfvars`
- [ ] Initialize Terraform
- [ ] Deploy dev environment
- [ ] Deploy prod environment
- [ ] Note CloudFront distribution IDs

### GitHub Configuration
- [ ] Create `dev` environment in GitHub
- [ ] Add dev environment variables and secrets
- [ ] Create `prod` environment in GitHub
- [ ] Add prod environment variables and secrets
- [ ] Add AWS credentials as repository secrets
- [ ] Test workflow by pushing to dev branch

### Auth0 Configuration
- [ ] Create Auth0 application
- [ ] Configure allowed URLs for dev (`http://localhost:3000`, `https://dev.tripajando.com`)
- [ ] Configure allowed URLs for prod (`https://tripajando.com`)
- [ ] Update GitHub environment secrets with Auth0 credentials

## Next Steps

1. Configure your Auth0 application
2. Update `.env` with your Auth0 credentials
3. Start the development server
4. Set up AWS infrastructure with Terraform
5. Configure GitHub environments and secrets
6. Test deployment to dev environment
7. Customize the theme and styling
8. Add more features to Dashboard, Profile, and Settings pages
9. Set up your backend API (optional)
10. Add tests
