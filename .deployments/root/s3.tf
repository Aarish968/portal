locals {
  s3_accesslogs_prefix_domain_bucket = "${var.provider_portal_bucket_name}/"
}

########## Policy for s3 bucket #####################
data "aws_iam_policy_document" "s3_policy" {
  statement {
    actions   = ["s3:GetObject"]
    resources = [
      "arn:aws:s3:::${var.provider_portal_bucket_name}/*",
      "arn:aws:s3:::${var.provider_portal_bucket_name}/assets/*",
      "arn:aws:s3:::${var.provider_portal_bucket_name}/vite.svg",
      "arn:aws:s3:::${var.provider_portal_bucket_name}/favicon.ico",
      "arn:aws:s3:::${var.provider_portal_bucket_name}/index.html"
    ]
    principals {
      type        = "*"
      identifiers = ["*"]
    }
  }

  statement {
    actions   = ["s3:ListBucket"]
    resources = ["arn:aws:s3:::${var.provider_portal_bucket_name}"]
    principals {
      type        = "*"
      identifiers = ["*"]
    }
  }
}

########## Domain S3 bucket provisioning #####################
module "s3_bucket" {
  source  = "terraform-aws-modules/s3-bucket/aws"
  version = "4.2.2"

  block_public_acls       = false
  block_public_policy     = false
  ignore_public_acls      = false
  restrict_public_buckets = false

  bucket                   = var.provider_portal_bucket_name
  acl                      = null  
  control_object_ownership = true
  object_ownership         = "ObjectWriter"
  force_destroy           = var.force_destroy
  
  website = {
    index_document = "index.html"
    error_document = "index.html"
  }

  attach_policy = true
  policy        = data.aws_iam_policy_document.s3_policy.json

  versioning = {
    enabled = false
  }

  cors_rule = [
    {
      allowed_headers = ["*"]
      allowed_methods = ["GET", "HEAD"]
      allowed_origins = ["*"]
      expose_headers  = ["ETag"]
      max_age_seconds = 3000
    }
  ]

  tags = {
    Name = var.provider_portal_bucket_name
  }
}

output "website_endpoint" {
  value = module.s3_bucket.s3_bucket_website_endpoint
}