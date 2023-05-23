import * as cdk from 'aws-cdk-lib';
import { Environment } from 'aws-cdk-lib/core/lib/environment';

import { env } from '../env';

const PROJECT_DISPLAY_NAME = 'TechInt';
const PROJECT_NAME = 'techint';

export enum ExecutionEnv {
  DEV = 'dev',
  TEST = 'test',
  STAGE = 'stage',
  PROD = 'prod',
}

/**
 * Project properties
 */
export interface Project {
  /**
   * Project id
   *
   * Set project id to use it as a prefix for all resources.
   * Useful when you want to create multiple environments of the same project in one AWS account.
   *
   * @default - No id
   **/
  readonly id?: string;
  /**
   * Project name
   */
  readonly name: string;
  /**
   * Execution environment
   */
  readonly executionEnv: ExecutionEnv;
  /**
   * Project prefix
   */
  readonly prefix: string;
  /**
   * Project display name
   */
  readonly displayName?: string;
  /**
   * Project tags
   *
   * @default - No tags
   */
  readonly tags?: {
    [key: string]: string;
  };
}

export interface ProjectStackProps extends cdk.StackProps {
  readonly project: Project;
  readonly env: Environment;
}

export function getProjectStackProps(stage: cdk.Stage): ProjectStackProps {
  const stackEnv: cdk.Environment = {
    account: env.CDK_DEPLOY_ACCOUNT || env.CDK_DEFAULT_ACCOUNT,
    region: env.CDK_DEPLOY_REGION || env.CDK_DEFAULT_REGION,
  };
  // When you hardcode the target account and region in CDK_DEPLOY_ACCOUNT and CDK_DEPLOY_REGION environments, the stack is always deployed to that specific account and region.
  // To make the stack deployable to a different target, but to determine the target at synthesis time, your stack can use two environment variables
  // provided by the AWS CDK CLI: CDK_DEFAULT_ACCOUNT and CDK_DEFAULT_REGION. These variables are set based on the AWS profile specified using the --profile option,
  // or the default AWS profile if you don't specify one.
  const projectId = stage.node.tryGetContext(`${PROJECT_NAME}/id`);
  const executionEnv = stage.node.tryGetContext(`${PROJECT_NAME}/env`) || ExecutionEnv.DEV;

  return {
    env: stackEnv,
    project: {
      id: projectId,
      name: PROJECT_NAME,
      executionEnv,
      prefix: [projectId, PROJECT_NAME, executionEnv].filter(Boolean).join('-'),
      displayName: PROJECT_DISPLAY_NAME,
    },
    tags: {
      ...(projectId && { projectId: projectId }),
      projectName: PROJECT_NAME,
      executionEnv,
    },
  };
}
