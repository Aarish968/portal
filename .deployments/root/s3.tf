locals {
  s3_accesslogs_prefix_domain_bucket = "${var.provider_portal_bucket_name}/"
}

########## Policy for s3 bucket #####################
data "aws_iam_policy_document" "s3_policy" {
  statement {
    actions   = ["s3:GetObject"]
    resources = ["arn:aws:s3:::${var.provider_portal_bucket_name}/*"]

    principals {
      type        = "AWS"
      identifiers = ["arn:aws:iam::${data.aws_caller_identity.current.account_id}:root"]
    }
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

  force_destroy = var.force_destroy

  attach_policy = true
  policy        = data.aws_iam_policy_document.s3_policy.json

  versioning = {
    enabled = false
  }

  tags = {
    Name = var.provider_portal_bucket_name
  }

}
