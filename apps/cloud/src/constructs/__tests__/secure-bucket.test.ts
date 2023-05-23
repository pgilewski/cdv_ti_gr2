import { App, Stack } from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';
import { Match, Template } from 'aws-cdk-lib/assertions';

import { SecureBucket } from '../secure-bucket';

describe('SecureBucket', () => {
  test('exposes underlying bucket', () => {
    const stack = new Stack(new App(), 'TestingStack');

    const secureBucket = new SecureBucket(stack, 'SecureBucket', {});
    expect(secureBucket).toBeInstanceOf(s3.Bucket);
  });

  test('has BlockPublicAccess set to BLOCK_ALL', () => {
    const stack = new Stack(new App(), 'TestingStack');

    new SecureBucket(stack, 'SecureBucket', { versioned: false });
    const template = Template.fromStack(stack);

    template.hasResourceProperties('AWS::S3::Bucket', {
      PublicAccessBlockConfiguration: Match.objectEquals({
        BlockPublicAcls: true,
        BlockPublicPolicy: true,
        IgnorePublicAcls: true,
        RestrictPublicBuckets: true,
      }),
    });
  });

  test('does not allow for unencrypted uploads', () => {
    const stack = new Stack(new App(), 'TestingStack');

    new SecureBucket(stack, 'SecureBucket', { enforceSSL: false });
    const template = Template.fromStack(stack);

    template.hasResourceProperties('AWS::S3::BucketPolicy', {
      Bucket: {
        Ref: 'SecureBucket1ED1C5CE',
      },
      PolicyDocument: {
        Statement: [
          {
            Action: 's3:*',
            Condition: {
              Bool: {
                'aws:SecureTransport': 'false',
              },
            },
            Effect: 'Deny',
            Principal: {
              AWS: '*',
            },
            Resource: [
              {
                'Fn::GetAtt': ['SecureBucket1ED1C5CE', 'Arn'],
              },
              {
                'Fn::Join': [
                  '',
                  [
                    {
                      'Fn::GetAtt': ['SecureBucket1ED1C5CE', 'Arn'],
                    },
                    '/*',
                  ],
                ],
              },
            ],
          },
        ],
        Version: '2012-10-17',
      },
    });
  });

  test('has key rotation enabled', () => {
    const stack = new Stack(new App(), 'TestingStack');

    new SecureBucket(stack, 'SecureBucket', {
      encryption: s3.BucketEncryption.KMS,
    });
    const template = Template.fromStack(stack);

    template.hasResourceProperties('AWS::KMS::Key', {
      EnableKeyRotation: true,
    });
  });
});
