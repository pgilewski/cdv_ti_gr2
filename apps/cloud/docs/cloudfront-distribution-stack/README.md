# CloudFront Distribution Stack

The following behaviors and origins are created:

- `api/*` -> techint API
- `*` -> techint web application

## Diagram

--TODO--

## Manual web assets deployment

To manually deploy the web assets from your `dist` directory to the S3 bucket, execute:

```shell
$ export AWS_PROFILE=<AWS_PROFILE>

# Get web assets bucket name
$ WEB_BUCKET_NAME=$(aws cloudformation describe-stacks --stack-name techint-dev-CloudFrontDistributionStack \
    --query 'Stacks[0].Outputs[?OutputKey==`WebBucketName`].OutputValue' --output text)

# Deploy all static content with cache-control settings
$ aws s3 sync apps/web/dist/ s3://$WEB_BUCKET_NAME \
    --cache-control max-age=31536000 --delete
```

//

CloudFront cache invalidation (in case you require it):

```shell
# Get CloudFront distribution Id
$ CF_DIST_ID=$(aws cloudformation describe-stacks --stack-name CloudFrontDistributionStack \
    --query 'Stacks[0].Outputs[?OutputKey==`DistributionId`].OutputValue' --output text)

# Create invalidation
$ aws cloudfront create-invalidation --distribution-id $CF_DIST_ID --paths '/*'
```

## Resources

- [React: Static File Caching](https://create-react-app.dev/docs/production-build/#static-file-caching)
- [Hosting a static website on Amazon S3 with SSL](https://exanubes.com/blog/s3-static-hosting-with-ssl)
- [How do I remove a cached file from CloudFront?](https://aws.amazon.com/premiumsupport/knowledge-center/cloudfront-clear-cache/)
- [Protecting an AWS ALB behind an AWS CloudFront distribution](https://www.arhs-group.com/protecting-aws-alb-behind-aws-cloudfront-distribution/)
- [Improve Your Architecture With Amazon CloudFront](https://catalog.us-east-1.prod.workshops.aws/workshops/4557215e-2a5c-4522-a69b-8d058aba088c/en-US)
- [Green/Blue deployments with AWS Cloudfront](https://chester.codes/cloudfront-green-blue)
