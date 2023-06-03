import * as cdk from 'aws-cdk-lib';
import { DefaultStackSynthesizer } from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';

import { DatabaseStackProps } from '../stacks/database-stack';
import { getStackName } from '../utils';

import { getProjectStackProps } from './project-stack-props';

const STACK_NAME = 'DatabaseStack';

export function getDatabaseStackProps(stage: cdk.Stage): DatabaseStackProps {
  const projectProps = getProjectStackProps(stage);
  const { project } = projectProps;

  const stackProps: DatabaseStackProps = {
    ...projectProps,
    stackName: getStackName(project, STACK_NAME),
    logRetention: cdk.aws_logs.RetentionDays.THREE_DAYS,
    synthesizer: new DefaultStackSynthesizer({
      generateBootstrapVersionRule: false,
    }),
  };

  return stackProps;
}
