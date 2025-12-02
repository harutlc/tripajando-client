#!/bin/bash

# Deployment script for Tripajando frontend
# Usage: ./scripts/deploy.sh [prod|dev]

set -e

ENVIRONMENT=${1:-dev}

if [ "$ENVIRONMENT" != "prod" ] && [ "$ENVIRONMENT" != "dev" ]; then
    echo "Error: Environment must be 'prod' or 'dev'"
    echo "Usage: ./scripts/deploy.sh [prod|dev]"
    exit 1
fi

echo "🚀 Deploying to $ENVIRONMENT environment..."

# Set environment-specific variables
if [ "$ENVIRONMENT" = "prod" ]; then
    S3_BUCKET="tripajando-prod-website"
    CLOUDFRONT_DISTRIBUTION_ID="${CLOUDFRONT_DISTRIBUTION_ID_PROD}"
    DOMAIN="tripajando.com"
else
    S3_BUCKET="tripajando-dev-website"
    CLOUDFRONT_DISTRIBUTION_ID="${CLOUDFRONT_DISTRIBUTION_ID_DEV}"
    DOMAIN="dev.tripajando.com"
fi

# Check if CloudFront distribution ID is set
if [ -z "$CLOUDFRONT_DISTRIBUTION_ID" ]; then
    echo "Warning: CLOUDFRONT_DISTRIBUTION_ID not set. Cache invalidation will be skipped."
fi

# Navigate to client directory
cd "$(dirname "$0")/.."

# Install dependencies
echo "📦 Installing dependencies..."
npm ci

# Build the application
echo "🔨 Building application..."
npm run build

# Check if AWS CLI is installed
if ! command -v aws &> /dev/null; then
    echo "Error: AWS CLI is not installed. Please install it first."
    exit 1
fi

# Sync files to S3
echo "☁️  Uploading files to S3..."
aws s3 sync dist/ s3://$S3_BUCKET \
    --delete \
    --cache-control "public, max-age=31536000, immutable" \
    --exclude "index.html" \
    --exclude "*.txt"

# Upload index.html with no-cache
echo "📄 Uploading index.html..."
aws s3 cp dist/index.html s3://$S3_BUCKET/index.html \
    --cache-control "public, max-age=0, must-revalidate"

# Invalidate CloudFront cache
if [ -n "$CLOUDFRONT_DISTRIBUTION_ID" ]; then
    echo "♻️  Invalidating CloudFront cache..."
    INVALIDATION_ID=$(aws cloudfront create-invalidation \
        --distribution-id $CLOUDFRONT_DISTRIBUTION_ID \
        --paths "/*" \
        --query 'Invalidation.Id' \
        --output text)
    echo "Invalidation created: $INVALIDATION_ID"
fi

echo "✅ Deployment complete!"
echo "🌐 Your site is available at: https://$DOMAIN"
