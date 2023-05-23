import * as cdk from 'aws-cdk-lib';
import * as apigwv2 from '@aws-cdk/aws-apigatewayv2-alpha';
import { DefaultStackSynthesizer } from 'aws-cdk-lib';

import { CloudFrontDistributionStackProps } from '../stacks';
import { getStackName } from '../utils';

import { getProjectStackProps } from './project-stack-props';

const STACK_NAME = 'CloudFrontDistributionStack';

export function getCloudFrontDistributionStackProps(
  stage: cdk.Stage,
  httpApi: apigwv2.HttpApi
): CloudFrontDistributionStackProps {
  const projectProps = getProjectStackProps(stage);
  const { project } = projectProps;

  const stackProps: CloudFrontDistributionStackProps = {
    ...projectProps,
    stackName: getStackName(project, STACK_NAME),
    httpApi,
    synthesizer: new DefaultStackSynthesizer({
      generateBootstrapVersionRule: false,
    }),
  };

  return stackProps;
}
