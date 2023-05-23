import * as cdk from 'aws-cdk-lib';
import { DefaultStackSynthesizer } from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';

import { VpcStackProps } from '../stacks';
import { getStackName } from '../utils';

import { getProjectStackProps, ExecutionEnv } from './project-stack-props';

const STACK_NAME = 'VpcStack';

export function getVpcStackProps(stage: cdk.Stage): VpcStackProps {
  const projectProps = getProjectStackProps(stage);
  const { project } = projectProps;

  const stackProps: VpcStackProps = {
    ...projectProps,
    stackName: getStackName(project, STACK_NAME),
    cidr: '10.0.0.0/16',
    maxAzs: 3, // Be aware there are regions that currently have only 2 availability zones
    natGateways: project.executionEnv == ExecutionEnv.PROD ? 3 : 1, // For full availability, increase to match maxAZs.
    // NAT instance used to save $. For full availability, use default NAT (for PROD).
    natInstance:
      project.executionEnv == ExecutionEnv.PROD
        ? undefined
        : { instanceClass: ec2.InstanceClass.T3A, instanceSize: ec2.InstanceSize.NANO },
    flowLogs: true,
    synthesizer: new DefaultStackSynthesizer({
      generateBootstrapVersionRule: false,
    }),
  };

  return stackProps;
}
