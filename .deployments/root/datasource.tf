data "aws_caller_identity" "current" {}

provider "aws" {
  alias  = "cloudfront-global"
  region = "us-east-1" // NOTE: This needs to be us-east-1 for CloudFront
}

data "aws_acm_certificate" "certificate_global" {
  domain   = "*.helloporter.com"
  provider = aws.cloudfront-global
}