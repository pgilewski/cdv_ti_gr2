import * as cdk from '@aws-cdk/core';
import * as codepipeline from '@aws-cdk/aws-codepipeline';
import * as codepipeline_actions from '@aws-cdk/aws-codepipeline-actions';
import * as codebuild from '@aws-cdk/aws-codebuild';

import { CloudFrontDistributionStack } from './cloudfront-distribution-stack';

export interface PipelineStackProps extends cdk.StackProps {
  cloudFrontProps: CloudFrontDistributionStackProps;
}

export class PipelineStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props: PipelineStackProps) {
    super(scope, id, props);

    const sourceOutput = new codepipeline.Artifact();
    const buildOutput = new codepipeline.Artifact();

    const pipeline = new codepipeline.Pipeline(this, 'Pipeline', {
      pipelineName: 'WebAppPipeline',
      restartExecutionOnUpdate: true,
    });

    pipeline.addStage({
      stageName: 'GitHub_Source',
      actions: [
        new codepipeline_actions.GitHubSourceAction({
          actionName: 'GitHub_Source',
          owner: 'YourGitHubUsername',
          repo: 'YourRepo',
          branch: 'main',
          oauthToken: cdk.SecretValue.secretsManager('github-token'),
          output: sourceOutput,
        }),
      ],
    });

    const buildProject = new codebuild.PipelineProject(this, 'Build', {
      projectName: 'WebAppBuild',
      buildSpec: codebuild.BuildSpec.fromSourceFilename('buildspec.yml'),
      environment: {
        buildImage: codebuild.LinuxBuildImage.STANDARD_5_0,
        environmentVariables: {
          REACT_APP_API_ENDPOINT: {
            value: props.cloudFrontProps.httpApi.apiEndpoint,
            type: codebuild.BuildEnvironmentVariableType.PLAINTEXT,
          },
          ...props.cloudFrontProps.environment,
        },
      },
    });

    pipeline.addStage({
      stageName: 'Build',
      actions: [
        new codepipeline_actions.CodeBuildAction({
          actionName: 'Build',
          project: buildProject,
          input: sourceOutput,
          outputs: [buildOutput],
        }),
      ],
    });

    const distributionStack = new CloudFrontDistributionStack(this, 'DistributionStack', props.cloudFrontProps);

    pipeline.addStage({
      stageName: 'Deploy',
      actions: [
        new codepipeline_actions.CloudFormationCreateUpdateStackAction({
          actionName: 'CFN_Deploy',
          templatePath: buildOutput.atPath(`${STACK_NAME}.template.json`),
          stackName: STACK_NAME,
          adminPermissions: true,
          extraInputs: [buildOutput],
          parameterOverrides: {
            ...props.cloudFrontProps,
            WebBucketName: distributionStack.webBucket.bucketName,
            LogBucketName: distributionStack.logBucket.bucketName,
            DistributionId: distributionStack.distribution.distributionId,
            DistributionDomainName: distributionStack.distribution.distributionDomainName,
          },
        }),
      ],
    });
  }
}
