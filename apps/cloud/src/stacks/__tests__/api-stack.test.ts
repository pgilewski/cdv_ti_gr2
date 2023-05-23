import * as cdk from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';

import { ExecutionEnv } from '../../props/project-stack-props';
import { ApiStack } from '../api-stack';

const PROJECT_ID = 'my';
const PROJECT_NAME = 'Project';

const AWS_ACCOUNT = '11111111111111';
const AWS_REGION = 'eu-central-1';

describe('HttpApiStack', () => {
  const app = new cdk.App();
  const httpApistack = new ApiStack(app, 'ApiStack', {
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
    logRetention: cdk.aws_logs.RetentionDays.THREE_DAYS,
  });
  const template = Template.fromStack(httpApistack);

  test('specified resources created', () => {
    template.resourceCountIs('AWS::Lambda::Function', 4);
  });
});
