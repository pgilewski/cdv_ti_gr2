import * as cdk from 'aws-cdk-lib';
import { DefaultStackSynthesizer } from 'aws-cdk-lib';

import { ApiStackProps } from '../stacks/api-stack';
import { getStackName } from '../utils';

import { getProjectStackProps } from './project-stack-props';

const STACK_NAME = 'ApiStack';

export function getHttpApiStackProps(stage: cdk.Stage): ApiStackProps {
  const projectProps = getProjectStackProps(stage);
  const { project } = projectProps;

  const stackProps: ApiStackProps = {
    ...projectProps,
    stackName: getStackName(project, STACK_NAME),
    logRetention: cdk.aws_logs.RetentionDays.THREE_DAYS,
    synthesizer: new DefaultStackSynthesizer({
      generateBootstrapVersionRule: false,
    }),
  };

  return stackProps;
}
