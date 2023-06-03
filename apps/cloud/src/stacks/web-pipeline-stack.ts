import * as cdk from 'aws-cdk-lib';
import * as codepipeline from 'aws-cdk-lib/aws-codepipeline';
import * as codepipeline_actions from 'aws-cdk-lib/aws-codepipeline-actions';
import * as codebuild from 'aws-cdk-lib/aws-codebuild';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as cloudfront_origins from 'aws-cdk-lib/aws-cloudfront-origins';
import { Stack } from 'aws-cdk-lib';
import { Construct } from 'constructs';

import { ProjectStackProps } from '../props';

interface ReactPipelineStackProps extends ProjectStackProps {
  githubOwner: string;
  githubRepo: string;
  githubBranch: string;
  githubTokenSecretName: string;
}

export class ReactPipelineStack extends Stack {
  constructor(scope: Construct, id: string, props: ReactPipelineStackProps) {
    super(scope, id, props);

    // Validate input props
    if (!props.githubOwner) {
      throw new Error('GitHub owner is required');
    }
    if (!props.githubRepo) {
      throw new Error('GitHub repo is required');
    }
    if (!props.githubBranch) {
      throw new Error('GitHub branch is required');
    }
    if (!props.githubTokenSecretName) {
      throw new Error('GitHub token secret name is required');
    }

    // Cognito Identity setup
    const userPoolId = '111';
    const userPoolClientId = '111';
    const identityPoolId = '111';
    // Backoffice WebApp S3 Bucket
    const webAppBucketArn = '111';

    // Lookup S3
    const artifactBucket = s3.Bucket.fromBucketArn(this, 'ReactAppBucket', webAppBucketArn);

    // Create an IAM role for CodeBuild
    const codeBuildRole = new iam.Role(this, 'CodeBuildRole', {
      assumedBy: new iam.ServicePrincipal('codebuild.amazonaws.com'),
    });

    // Add the necessary permissions to the CodeBuild role
    artifactBucket.grantReadWrite(codeBuildRole);

    // Define the build environment for CodeBuild
    const buildEnvironment = {
      buildImage: codebuild.LinuxBuildImage.STANDARD_5_0,
      environmentVariables: {
        ARTIFACT_BUCKET_NAME: { value: artifactBucket.bucketName },
        GITHUB_OWNER: { value: props.githubOwner },
        GITHUB_REPO: { value: props.githubRepo },
        GITHUB_BRANCH: { value: props.githubBranch },
        GITHUB_TOKEN_SECRET_NAME: { value: props.githubTokenSecretName },
        MONOREPO_DIRECTORY: { value: 'apps/web' }, // added for your monorepo structure
        VITE_REACT_APP_REGION: {
          value: this.region,
          type: codebuild.BuildEnvironmentVariableType.PLAINTEXT,
        },
        VITE_REACT_APP_COGNITO_USER_POOL_ID: {
          value: userPoolId,
          type: codebuild.BuildEnvironmentVariableType.PLAINTEXT,
        },
        VITE_REACT_APP_COGNITO_USER_POOL_WEB_CLIENT_ID: {
          value: userPoolClientId,
          type: codebuild.BuildEnvironmentVariableType.PLAINTEXT,
        },
        VITE_REACT_APP_IDENTITY_POOL_ID: {
          value: identityPoolId,
          type: codebuild.BuildEnvironmentVariableType.PLAINTEXT,
        },
      },
      privileged: true, // required for Docker
    };

    // Create a CodeBuild project
    const codeBuildProject = new codebuild.Project(this, 'CodeBuildProject', {
      role: codeBuildRole,
      environment: buildEnvironment,
      buildSpec: codebuild.BuildSpec.fromObject({
        version: '0.2',
        phases: {
          install: {
            commands: [
              'cd $MONOREPO_DIRECTORY', // navigate to your Vite app
              'npm install',
            ],
          },
          build: {
            commands: ['npm run build'],
          },
        },
        artifacts: {
          'base-directory': `${buildEnvironment.environmentVariables.MONOREPO_DIRECTORY.value}/dist`, // Vite build output is in the 'dist' directory
          files: ['**/*'],
        },
        cache: {
          paths: ['node_modules/**/*'], // caching node_modules can speed up the build process
        },
      }),
    });

    // Create a CodePipeline
    const pipeline = new codepipeline.Pipeline(this, 'Pipeline', {
      restartExecutionOnUpdate: true,
    });

    // Add a source action to the pipeline that listens for commits to the GitHub repository
    const sourceOutput = new codepipeline.Artifact('SourceArtifact');
    pipeline.addStage({
      stageName: 'Source',
      actions: [
        new codepipeline_actions.GitHubSourceAction({
          actionName: 'GitHubSource',
          owner: props.githubOwner,
          repo: props.githubRepo,
          branch: props.githubBranch,
          oauthToken: cdk.SecretValue.secretsManager(props.githubTokenSecretName),
          output: sourceOutput,
        }),
      ],
    });

    // Add a build action to the pipeline that uses CodeBuild to build the React project
    const buildOutput = new codepipeline.Artifact('BuildOutput');
    pipeline.addStage({
      stageName: 'Build',
      actions: [
        new codepipeline_actions.CodeBuildAction({
          actionName: 'Build',
          project: codeBuildProject,
          input: sourceOutput,
          outputs: [buildOutput],
        }),
      ],
    });

    // Deploy the React app to S3
    const deployAction = new codepipeline_actions.S3DeployAction({
      actionName: 'Deploy',
      bucket: artifactBucket,
      input: buildOutput,
      extract: true,
    });

    pipeline.addStage({
      stageName: 'Deploy',
      actions: [deployAction],
    });

    // // Create a CloudFront origin access identity
    // const originAccessIdentity = new cloudfront.OriginAccessIdentity(this, 'OriginAccessIdentity');

    // // Grant read permissions to the CloudFront origin access identity on the artifact bucket
    // artifactBucket.grantRead(originAccessIdentity);

    // // Create a CloudFront distribution
    // const distribution = new cloudfront.Distribution(this, 'Distribution', {
    //   defaultBehavior: {
    //     origin: new cloudfront_origins.S3Origin(artifactBucket, {
    //       originAccessIdentity, // use the Origin Access Identity to access the bucket
    //     }),
    //   },
    // });

    // // Output the URL of the CloudFront distribution
    // new cdk.CfnOutput(this, `${props.project.name}:webAppUrl`, {
    //   value: `https://${distribution.distributionDomainName}`,
    // });
    // Output
    // ------

    // ArtifactBucketArn
    new cdk.CfnOutput(this, `ArtifactBucketArn`, {
      value: pipeline.artifactBucket.bucketArn,
    });

    // ArtifactBucketName
    new cdk.CfnOutput(this, `ArtifactBucketName`, {
      value: pipeline.artifactBucket.bucketName,
    });

    // ArtifactBucketEncryptionKeyArn
    new cdk.CfnOutput(this, `ArtifactBucketEncryptionKeyArn`, {
      value: pipeline.artifactBucket.encryptionKey!.keyArn,
    });

    // ArtifactBucketEncryptionKeyId
    new cdk.CfnOutput(this, `ArtifactBucketEncryptionKeyId`, {
      value: pipeline.artifactBucket.encryptionKey!.keyId,
    });
  }
}
