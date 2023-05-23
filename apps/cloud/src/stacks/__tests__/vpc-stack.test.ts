import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { Match, Template } from 'aws-cdk-lib/assertions';

import { ExecutionEnv } from '../../props/project-stack-props';
import { VpcStack } from '../vpc-stack';

const PROJECT_ID = 'my';
const PROJECT_NAME = 'Project';

const AWS_ACCOUNT = '11111111111111';
const AWS_REGION = 'eu-central-1';
const AWS_AVAILABILITY_ZONES = ['eu-central-1a', 'eu-central-1b', 'eu-central-1c'];

describe('VpcStack', () => {
  const app = new cdk.App({
    context: {
      // Mock cdk.context.json
      [`availability-zones:account=${AWS_ACCOUNT}:region=${AWS_REGION}`]: AWS_AVAILABILITY_ZONES,
      [`ami:account=${AWS_ACCOUNT}:filters.image-type.0=machine:filters.name.0=amzn-ami-vpc-nat-*:filters.state.0=available:owners.0=amazon:region=${AWS_REGION}`]:
        'ami-11111111111111111',
    },
  });

  const vpcStack = new VpcStack(app, 'VpcStack', {
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
    cidr: '10.0.0.0/16',
    maxAzs: 3,
    natGateways: 3,
    natInstance: {
      instanceClass: ec2.InstanceClass.T3A,
      instanceSize: ec2.InstanceSize.NANO,
    },
  });
  const template = Template.fromStack(vpcStack);

  test('should have AWS::EC2::VPC resource', () => {
    template.hasResourceProperties('AWS::EC2::VPC', {
      Tags: [
        {
          Key: 'Name',
          Value: 'my-Project-dev-vpc',
        },
      ],
    });
  });

  test('should have public AWS::EC2::Subnet resource', () => {
    template.hasResourceProperties('AWS::EC2::Subnet', {
      Tags: [
        {
          Key: 'aws-cdk:subnet-name',
          Value: 'Public',
        },
        {
          Key: 'aws-cdk:subnet-type',
          Value: 'Public',
        },
        {
          Key: 'Name',
          Value: 'my-Project-dev-public-subnet-eu-central-1a',
        },
      ],
    });
  });

  test('should have private AWS::EC2::Subnet resource', () => {
    template.hasResourceProperties('AWS::EC2::Subnet', {
      Tags: [
        {
          Key: 'aws-cdk:subnet-name',
          Value: 'Private',
        },
        {
          Key: 'aws-cdk:subnet-type',
          Value: 'Private',
        },
        {
          Key: 'Name',
          Value: 'my-Project-dev-private-subnet-eu-central-1a',
        },
      ],
    });
  });

  test('should have isolated AWS::EC2::Subnet resource', () => {
    template.hasResourceProperties('AWS::EC2::Subnet', {
      Tags: [
        {
          Key: 'aws-cdk:subnet-name',
          Value: 'Isolated',
        },
        {
          Key: 'aws-cdk:subnet-type',
          Value: 'Isolated',
        },
        {
          Key: 'Name',
          Value: 'my-Project-dev-isolated-subnet-eu-central-1a',
        },
      ],
    });
  });

  test('should have NAT AWS::EC2::Instance resource', () => {
    template.hasResourceProperties('AWS::EC2::Instance', {
      ImageId: 'ami-11111111111111111',
      Tags: [
        {
          Key: 'Name',
          Value: 'my-Project-dev-public-subnet-eu-central-1a-nat-instance',
        },
      ],
    });

    template.hasResourceProperties('AWS::EC2::Instance', {
      ImageId: 'ami-11111111111111111',
      Tags: [
        {
          Key: 'Name',
          Value: 'my-Project-dev-public-subnet-eu-central-1b-nat-instance',
        },
      ],
    });

    template.hasResourceProperties('AWS::EC2::Instance', {
      ImageId: 'ami-11111111111111111',
      Tags: [
        {
          Key: 'Name',
          Value: 'my-Project-dev-public-subnet-eu-central-1c-nat-instance',
        },
      ],
    });
  });

  test('should have AWS::SSM::Parameter resource', () => {
    template.hasResourceProperties('AWS::SSM::Parameter', {
      Name: '/my-Project-dev/VpcStack/VpcId',
    });
  });

  test('should output VpcId', () => {
    template.hasOutput('VpcId', {
      Value: {
        Ref: Match.stringLikeRegexp('^Vpc'),
      },
    });
  });
});
