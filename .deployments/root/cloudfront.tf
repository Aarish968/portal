resource "aws_cloudfront_origin_access_control" "this" {
  name                              = "${var.provider_portal_bucket_name}-oac"
  description                       = "OAC for Provider Portal CloudFront distribution"
  origin_access_control_origin_type = "s3"
  signing_behavior                  = "always"
  signing_protocol                  = "sigv4"
}

resource "aws_cloudfront_distribution" "provider_portal_cf" {
  depends_on = [aws_cloudfront_origin_access_control.this]

  origin {
    domain_name              = module.s3_bucket.s3_bucket_bucket_regional_domain_name
    origin_id                = "S3-${module.s3_bucket.s3_bucket_id}"
    origin_access_control_id = aws_cloudfront_origin_access_control.this.id
  }

  aliases = ["${var.alternative_domain}"]

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
    acm_certificate_arn      = data.aws_acm_certificate.certificate_global.arn
    ssl_support_method       = "sni-only"
  }

  tags = {
    Environment = "sandbox"
  }
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
