import * as cdk from 'aws-cdk-lib';
import { Template, Annotations, Match } from 'aws-cdk-lib/assertions';
import { AwsSolutionsChecks } from 'cdk-nag';

import { ExecutionEnv } from '../../props';
import { CloudFrontDistributionStack } from '../../stacks';

const PROJECT_ID = 'my';
const PROJECT_NAME = 'Project';

const AWS_ACCOUNT = '11111111111111';
const AWS_REGION = 'eu-central-1';

describe('CloudFrontDistributionStack', () => {
  const app = new cdk.App();
  const cloudfrontDistributionStack = new CloudFrontDistributionStack(app, 'CloudFrontDistributionStack', {
    project: {
      id: PROJECT_ID,
      name: PROJECT_NAME,
      executionEnv: ExecutionEnv.DEV,
      prefix: `${PROJECT_ID}-${PROJECT_NAME}-${ExecutionEnv.DEV}`,
    },
    env: {
      account: AWS_ACCOUNT,
      region: AWS_REGION,
    },
    httpApi: {
      apiEndpoint: 'https://api.example.com',
    } as never,
  });
  const template = Template.fromStack(cloudfrontDistributionStack);
  cdk.Aspects.of(cloudfrontDistributionStack).add(new AwsSolutionsChecks());

  test('no unsuppressed warnings', () => {
    const warnings = Annotations.fromStack(cloudfrontDistributionStack).findWarning(
      '*',
      Match.stringLikeRegexp('AwsSolutions-.*')
    );
    expect(warnings).toHaveLength(0);
  });

  test('no unsuppressed errors', () => {
    const errors = Annotations.fromStack(cloudfrontDistributionStack).findError(
      '*',
      Match.stringLikeRegexp('AwsSolutions-.*')
    );
    expect(errors).toHaveLength(0);
  });

  test('specified resources created', () => {
    template.resourceCountIs('AWS::CloudFront::Distribution', 1);
  });
});
