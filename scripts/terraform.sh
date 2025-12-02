#!/bin/bash

# Terraform helper script for Tripajando infrastructure
# Usage: ./scripts/terraform.sh [prod|dev] [init|plan|apply|destroy]

set -e

ENVIRONMENT=${1:-dev}
COMMAND=${2:-plan}

if [ "$ENVIRONMENT" != "prod" ] && [ "$ENVIRONMENT" != "dev" ]; then
    echo "Error: Environment must be 'prod' or 'dev'"
    echo "Usage: ./scripts/terraform.sh [prod|dev] [init|plan|apply|destroy]"
    exit 1
fi

if [ "$COMMAND" != "init" ] && [ "$COMMAND" != "plan" ] && [ "$COMMAND" != "apply" ] && [ "$COMMAND" != "destroy" ]; then
    echo "Error: Command must be 'init', 'plan', 'apply', or 'destroy'"
    echo "Usage: ./scripts/terraform.sh [prod|dev] [init|plan|apply|destroy]"
    exit 1
fi

echo "🏗️  Running Terraform $COMMAND for $ENVIRONMENT environment..."

# Navigate to terraform directory
cd "$(dirname "$0")/../terraform"

# Set terraform vars file
TFVARS_FILE="environments/$ENVIRONMENT/terraform.tfvars"

if [ ! -f "$TFVARS_FILE" ]; then
    echo "Error: Terraform vars file not found: $TFVARS_FILE"
    exit 1
fi

# Run terraform command
case $COMMAND in
    init)
        terraform init
        ;;
    plan)
        terraform plan -var-file="$TFVARS_FILE"
        ;;
    apply)
        if [ "$ENVIRONMENT" = "prod" ]; then
            echo "⚠️  WARNING: You are about to apply changes to PRODUCTION!"
            read -p "Are you sure? (yes/no): " confirm
            if [ "$confirm" != "yes" ]; then
                echo "Aborted."
                exit 0
            fi
        fi
        terraform apply -var-file="$TFVARS_FILE"
        ;;
    destroy)
        echo "⚠️  WARNING: You are about to DESTROY $ENVIRONMENT infrastructure!"
        read -p "Are you absolutely sure? Type 'destroy-$ENVIRONMENT' to confirm: " confirm
        if [ "$confirm" != "destroy-$ENVIRONMENT" ]; then
            echo "Aborted."
            exit 0
        fi
        terraform destroy -var-file="$TFVARS_FILE"
        ;;
esac

echo "✅ Terraform $COMMAND completed for $ENVIRONMENT!"

# If apply was successful, show outputs
if [ "$COMMAND" = "apply" ]; then
    echo ""
    echo "📊 Infrastructure outputs:"
    terraform output
fi
