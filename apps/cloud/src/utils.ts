import { Construct } from 'constructs';
import * as cdk from 'aws-cdk-lib';
import * as ssm from 'aws-cdk-lib/aws-ssm';

import { Project } from './props';

export function getStackName(project: Project, name: string) {
  return [project.prefix, name].filter(Boolean).join('-');
}
export function getContextKey(project: Project, env: cdk.Environment, key: string) {
  return [project.prefix, env.account, env.region, key].filter(Boolean).join('.');
}

export function getContext(scope: Construct, key: string, required = true) {
  const value = scope.node.tryGetContext(key);

  if (!value && required) {
    throw new Error(`CDK context variable ${key} not provided!`);
  }

  return value;
}

export function getParameterName(project: Project, stack: cdk.Stack, name: string) {
  return '/' + [project.prefix, stack.stackName, name].filter(Boolean).join('/');
}

export function outputParameter(stack: cdk.Stack, project: Project, name: string, value: string, ssmParam = false) {
  new cdk.CfnOutput(stack, name, {
    value: value,
  });
  if (ssmParam) {
    new ssm.StringParameter(stack, `${name}Param`, {
      parameterName: getParameterName(project, stack, name),
      stringValue: value,
    });
  }
}
