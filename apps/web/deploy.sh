#!/bin/bash

set -e

EXECUTION_ENV=${1:-dev}

# Get web assets bucket name
WEB_BUCKET_NAME=$(aws cloudformation describe-stacks \
  --stack-name dxstage-$EXECUTION_ENV-CloudFrontDistributionStack \
  --query 'Stacks[0].Outputs[?OutputKey==`WebBucketName`].OutputValue' --output text)

# Upload web assets
echo "Upload web assets..."

# Upload all static content with cache-control settings
aws s3 sync dist/ s3://$WEB_BUCKET_NAME \
  --cache-control max-age=31536000 --delete \
  --exclude index.html

# Upload index.html (no cache)
aws s3 cp dist/index.html s3://$WEB_BUCKET_NAME \
  --metadata-directive REPLACE \
  --cache-control max-age=0,no-cache,no-store,must-revalidate \
  --content-type text/html

# Get CloudFront distribution Id
CF_DIST_ID=$(aws cloudformation describe-stacks \
  --stack-name dxstage-$EXECUTION_ENV-CloudFrontDistributionStack \
  --query 'Stacks[0].Outputs[?OutputKey==`DistributionId`].OutputValue' --output text)

# Upload web assets
echo "Invalidate CloudFront cache..."

# Create invalidation
INVALIDATION_ID=$(aws cloudfront create-invalidation --distribution-id $CF_DIST_ID --paths '/*' | jq -r '.Invalidation.Id')

# Wait for invalidation to finish
while [ $(aws cloudfront get-invalidation --id $INVALIDATION_ID --distribution-id $CF_DIST_ID | jq -r '.Invalidation.Status') != "Completed" ]
do
  aws cloudfront wait invalidation-completed --distribution-id $CF_DIST_ID --id $INVALIDATION_ID                       
done
  echo "Done!"; 