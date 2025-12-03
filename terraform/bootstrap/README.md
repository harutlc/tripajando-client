# Terraform Backend Bootstrap

This directory contains the Terraform configuration for creating the remote state backend infrastructure.

## Resources Created

- **S3 Bucket**: `tripajando-terraform-state` - Stores Terraform state files
  - Versioning enabled for state history
  - Server-side encryption enabled
  - Public access blocked

- **DynamoDB Table**: `tripajando-terraform-locks` - Provides state locking
  - Prevents concurrent Terraform operations
  - Pay-per-request billing

## Usage

These resources were already created and should only be run once. They are **not** managed by the main Terraform configuration since they are shared across all workspaces.

### To recreate (if needed)

```bash
cd terraform/bootstrap
terraform init
terraform plan
terraform apply
```

### Important Notes

- These resources are shared across all workspaces (dev, prod, etc.)
- The S3 bucket has `prevent_destroy` lifecycle rule to prevent accidental deletion
- Do not delete these resources unless you want to completely remove the remote state backend
- The main Terraform configuration in `../` uses these resources via the backend configuration in `main.tf`