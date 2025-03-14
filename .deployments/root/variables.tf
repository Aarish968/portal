variable "aws_region" {
  type = string
}

variable "provider_portal_bucket_name" {
  type = string
}

variable "provider_portal_accesslogs_bucket_name" {
  type = string
}

variable "force_destroy" {
  description = "For setting up value of force destroy attribute for s3 bucket"
  type        = bool
}

variable "alternative_domain" {
  description = "CF alternative domain name"
  type = string
}
