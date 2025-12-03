terraform {
  required_version = ">= 1.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }

  # Backend configuration for remote state management
  backend "s3" {
    bucket         = "tripajando-terraform-state"
    key            = "terraform.tfstate"
    region         = "us-east-1"
    dynamodb_table = "tripajando-terraform-locks"
    encrypt        = true
  }
}

provider "aws" {
  region = var.aws_region

  default_tags {
    tags = merge(
      var.tags,
      {
        Project     = var.project_name
        Environment = var.environment
        ManagedBy   = "Terraform"
      }
    )
  }
}

# Provider for ACM certificate (must be in us-east-1 for CloudFront)
provider "aws" {
  alias  = "us_east_1"
  region = "us-east-1"

  default_tags {
    tags = merge(
      var.tags,
      {
        Project     = var.project_name
        Environment = var.environment
        ManagedBy   = "Terraform"
      }
    )
  }
}

locals {
  s3_origin_id = "${var.project_name}-${var.environment}-origin"
  common_tags = merge(
    var.tags,
    {
      Project     = var.project_name
      Environment = var.environment
    }
  )
}
