import * as cdk from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as cloudfront_origins from 'aws-cdk-lib/aws-cloudfront-origins';
import * as apigwv2 from '@aws-cdk/aws-apigatewayv2-alpha';
import { NagSuppressions } from 'cdk-nag';

import { ProjectStackProps } from '../props';
import { outputParameter } from '../utils';
import { SecureBucket } from '../constructs';

export interface CloudFrontDistributionStackProps extends ProjectStackProps {
  httpApi: apigwv2.HttpApi;
  environment: { [key: string]: string };
}
export class CloudFrontDistributionStack extends cdk.Stack {
  public readonly distribution: cloudfront.Distribution;

  constructor(scope: cdk.App, id: string, props: CloudFrontDistributionStackProps) {
    super(scope, id, props);
    const { environment } = props;

    // Resources
    // ---------

    const webBucket = new SecureBucket(this, 'WebBucket', {
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      enforceSSL: true,
    });

    // See: https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/AccessLogs.html#access-logs-choosing-s3-bucket
    // See: https://docs.aws.amazon.com/AmazonS3/latest/userguide/enable-server-access-logging.html#grant-log-delivery-permissions-general
    // Issue: https://github.com/aws/aws-cdk/issues/25358
    const logBucket = new SecureBucket(this, 'LogBucket', {
      accessControl: s3.BucketAccessControl.LOG_DELIVERY_WRITE,
      objectOwnership: s3.ObjectOwnership.OBJECT_WRITER,
      lifecycleRules: [
        {
          expiration: cdk.Duration.days(90),
          transitions: [
            {
              storageClass: s3.StorageClass.INFREQUENT_ACCESS,
              transitionAfter: cdk.Duration.days(30),
            },
          ],
        },
      ],
    });

    // To allow users to access the files on the S3 bucket through CloudFront, we create a particular type of CloudFront
    // user that is associated with our S3 bucket. This user, called the Origin Access Identitiy (OAI) user,
    // will request files on behalf of our site's users. The OAI user is granted read access (s3:GetObject)
    // to the bucket objects through the bucket resource policy.
    const originAccessIdentity = new cloudfront.OriginAccessIdentity(this, 'OriginAccessIdentity');
    webBucket.grantRead(originAccessIdentity);

    const apiCachePolicy = new cloudfront.CachePolicy(this, 'ApiCachePolicy', {
      headerBehavior: cloudfront.CacheHeaderBehavior.allowList('Authorization'),
      minTtl: cdk.Duration.seconds(0),
      maxTtl: cdk.Duration.seconds(1), // Issue: https://github.com/aws/aws-cdk/issues/13408
      defaultTtl: cdk.Duration.seconds(0),
    });

    // CloudFront distribution
    // Doc: https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_cloudfront.Distribution.html
    this.distribution = new cloudfront.Distribution(this, 'Distribution', {
      defaultRootObject: 'index.html',
      minimumProtocolVersion: cloudfront.SecurityPolicyProtocol.TLS_V1_2_2021,
      httpVersion: cloudfront.HttpVersion.HTTP2,
      priceClass: cloudfront.PriceClass.PRICE_CLASS_100, // the cheapest: use only North America and Europe
      defaultBehavior: {
        // Doc: https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_cloudfront.BehaviorOptions.html
        origin: new cloudfront_origins.S3Origin(webBucket, {
          // CloudFront can use the OAI to access the files in the S3 bucket
          // and serve them to users. Users cannot use a direct URL to the
          // S3 bucket to access a file there.
          originAccessIdentity,
        }),
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
      },
      additionalBehaviors: {
        'api/*': {
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          origin: new cloudfront_origins.HttpOrigin(cdk.Fn.select(2, cdk.Fn.split('/', props.httpApi.apiEndpoint))),
          allowedMethods: cloudfront.AllowedMethods.ALLOW_ALL,
          cachePolicy: apiCachePolicy,
          viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.HTTPS_ONLY,
          // See: https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/using-managed-origin-request-policies.html#managed-origin-request-policy-all-viewer
          originRequestPolicy: cloudfront.OriginRequestPolicy.fromOriginRequestPolicyId(
            this,
            'AllViewerExceptHostHeader',
            'b689b0a8-53d0-40ab-baf2-68738e2966ac'
          ),
        },
      },
      logBucket,
    });

    // Nag Suppresions
    // ---------------
    NagSuppressions.addStackSuppressions(this, [
      {
        id: 'AwsSolutions-S1',
        reason: 'Suppress AwsSolutions-S1: The S3 Bucket has server access logs disabled',
      },
      {
        id: 'AwsSolutions-CFR1',
        reason: 'Suppress AwsSolutions-CFR1: The CloudFront distribution may require Geo restrictions',
      },
      {
        id: 'AwsSolutions-CFR2',
        reason: 'Suppress AwsSolutions-CFR2: The CloudFront distribution may require integration with AWS WA',
      },
      {
        id: 'AwsSolutions-CFR4',
        reason:
          'Suppress AwsSolutions-CFR4: The CloudFront distribution allows for SSLv3 or TLSv1 for HTTPS viewer connections',
      },
    ]);

    // Outputs
    // -------

    outputParameter(this, props.project, 'WebBucketName', webBucket.bucketName);
    outputParameter(this, props.project, 'LogBucketName', logBucket.bucketName);
    outputParameter(this, props.project, 'DistributionId', this.distribution.distributionId);
    outputParameter(this, props.project, 'DistributionDomainName', this.distribution.distributionDomainName);
  }
}
