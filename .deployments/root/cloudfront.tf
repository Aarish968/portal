resource "aws_cloudfront_distribution" "provider_portal_cf" {
  origin {
    domain_name = "${module.s3_bucket.s3_bucket_bucket_domain_name}"
    origin_id   = "S3-${module.s3_bucket.s3_bucket_id}"

    s3_origin_config {
      origin_access_identity = aws_cloudfront_origin_access_identity.spa_oai.cloudfront_access_identity_path
    }
  }

  enabled             = true
  is_ipv6_enabled     = true
  comment             = "CloudFront distribution for Provider Portal"
  default_root_object = "index.html"

  default_cache_behavior {
    target_origin_id       = "S3-${module.s3_bucket.s3_bucket_id}"
    viewer_protocol_policy = "redirect-to-https"

    allowed_methods = ["GET", "HEAD"]
    cached_methods  = ["GET", "HEAD"]

    forwarded_values {
      query_string = false

      cookies {
        forward = "none"
      }
    }

    min_ttl     = 0
    default_ttl = 3600
    max_ttl     = 86400

    function_association {
      event_type   = "viewer-request"
      function_arn = aws_cloudfront_function.rewrite_uri.arn
    }
  }

  custom_error_response {
    error_code         = 403
    response_code      = 200
    response_page_path = "/index.html"
  }

  custom_error_response {
    error_code         = 404
    response_code      = 200
    response_page_path = "/index.html"
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    cloudfront_default_certificate = true
  }

  tags = {
    Environment = "sandbox"
  }
}

resource "aws_cloudfront_origin_access_identity" "spa_oai" {
  comment = "OAI for SPA CloudFront distribution"
}

resource "aws_s3_bucket_policy" "spa_bucket_policy" {
  bucket = module.s3_bucket.s3_bucket_id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Principal = {
          AWS = aws_cloudfront_origin_access_identity.spa_oai.iam_arn
        }
        Action   = "s3:GetObject"
        Resource = "${module.s3_bucket.s3_bucket_arn}/*"
      }
    ]
  })
}

resource "aws_cloudfront_function" "rewrite_uri" {
  name    = "rewrite-request-${var.provider_portal_bucket_name}"
  runtime = "cloudfront-js-1.0"
  publish = true
  code    = <<-EOF
function handler(event) {
    var request = event.request;
    var uri = request.uri;
    
    if (uri.endsWith('/')) {
        request.uri += 'index.html';
    }
    else if (!uri.includes('.')) {
        request.uri = '/index.html';
    }
    
    return request;
}
EOF
}
