import { Construct } from 'constructs';
import * as kms from 'aws-cdk-lib/aws-kms';
import * as s3 from 'aws-cdk-lib/aws-s3';

export class SecureBucket extends s3.Bucket {
  constructor(scope: Construct, id: string, props?: s3.BucketProps) {
    super(scope, id, {
      ...props,
      // Create the Encryption Key, with Rotation enabled
      encryptionKey:
        props && !props.encryptionKey && props.encryption && props.encryption == s3.BucketEncryption.KMS
          ? new kms.Key(scope, `${id}EncryptionKey`, { enableKeyRotation: true })
          : undefined,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      enforceSSL: true,
    });
  }
}

// See: https://aws.amazon.com/about-aws/whats-new/2022/12/amazon-s3-automatically-enable-block-public-access-disable-access-control-lists-buckets-april-2023/
