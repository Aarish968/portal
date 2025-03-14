########## Policy for s3 bucket #####################
data "aws_iam_policy_document" "s3_policy" {
  statement {
    actions = ["s3:GetObject"]
    resources = [
      "arn:aws:s3:::${var.provider_portal_bucket_name}/*",
      "arn:aws:s3:::${var.provider_portal_bucket_name}/assets/*",
      "arn:aws:s3:::${var.provider_portal_bucket_name}/vite.svg",
      "arn:aws:s3:::${var.provider_portal_bucket_name}/favicon.ico",
      "arn:aws:s3:::${var.provider_portal_bucket_name}/index.html"
    ]
    principals {
      type        = "AWS"
      identifiers = [aws_cloudfront_origin_access_identity.spa_oai.iam_arn]
    }
  }

  statement {
    actions   = ["s3:ListBucket"]
    resources = ["arn:aws:s3:::${var.provider_portal_bucket_name}"]
    principals {
      type        = "AWS"
      identifiers = [aws_cloudfront_origin_access_identity.spa_oai.iam_arn]
    }
  }

  statement {
    sid     = "EnforceSSLRequestsOnly"
    effect  = "Deny"
    actions = ["s3:*"]
    resources = [
      "arn:aws:s3:::${var.provider_portal_bucket_name}",
      "arn:aws:s3:::${var.provider_portal_bucket_name}/*"
    ]
    principals {
      type        = "*"
      identifiers = ["*"]
    }
    condition {
      test     = "Bool"
      variable = "aws:SecureTransport"
      values   = ["false"]
    }
  }
}

data "aws_iam_policy_document" "s3_logs_bucket_policy" {
  statement {
    sid     = "EnforceSSLRequestsOnly"
    effect  = "Deny"
    actions = ["s3:*"]
    resources = [
      "arn:aws:s3:::${var.provider_portal_accesslogs_bucket_name}",
      "arn:aws:s3:::${var.provider_portal_accesslogs_bucket_name}/*"
    ]
    principals {
      type        = "*"
      identifiers = ["*"]
    }
    condition {
      test     = "Bool"
      variable = "aws:SecureTransport"
      values   = ["false"]
    }
  }
}

########## KMS Key for S3 Encryption #####################
resource "aws_kms_key" "s3_kms_key" {
  description         = "KMS key for S3 bucket encryption"
  enable_key_rotation = true
}

resource "aws_kms_alias" "s3_kms_key_alias" {
  name          = "alias/${var.provider_portal_bucket_name}-s3-key"
  target_key_id = aws_kms_key.s3_kms_key.key_id
}

########## Logging Bucket for S3 Server Access Logs ##########
module "s3_logging_bucket" {
  source  = "terraform-aws-modules/s3-bucket/aws"
  version = "4.2.2"

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true

  bucket                   = var.provider_portal_accesslogs_bucket_name
  acl                      = "log-delivery-write"
  control_object_ownership = true
  object_ownership         = "ObjectWriter"
  force_destroy            = var.force_destroy

  attach_policy = true
  policy        = data.aws_iam_policy_document.s3_logs_bucket_policy.json

  versioning = {
    enabled = true
  }

  object_lock_enabled = true
  object_lock_configuration = {
    rule = {
      default_retention = {
        mode = "GOVERNANCE"
        days = 1
      }
    }
  }

  tags = {
    Name = var.provider_portal_accesslogs_bucket_name
  }
}

########## Domain S3 bucket provisioning #####################
module "s3_bucket" {
  source  = "terraform-aws-modules/s3-bucket/aws"
  version = "4.2.2"

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true

  bucket                   = var.provider_portal_bucket_name
  acl                      = "private"
  control_object_ownership = true
  object_ownership         = "ObjectWriter"
  force_destroy            = var.force_destroy

  website = {
    index_document = "index.html"
    error_document = "index.html"
  }

  attach_policy = true
  policy        = data.aws_iam_policy_document.s3_policy.json

  versioning = {
    enabled = true
  }

  object_lock_enabled = true
  object_lock_configuration = {
    rule = {
      default_retention = {
        mode = "GOVERNANCE"
        days = 1
      }
    }
  }

  server_side_encryption_configuration = {
    rule = {
      apply_server_side_encryption_by_default = {
        sse_algorithm     = "aws:kms"
        kms_master_key_id = aws_kms_key.s3_kms_key.arn
      }
    }
  }

  logging = {
    target_bucket = module.s3_logging_bucket.s3_bucket_id
    target_prefix = "logs/"
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
