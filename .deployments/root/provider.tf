terraform {
  required_providers {
    aws = {
      version = "~> 5.70.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
}
