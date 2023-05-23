import path from 'path';

import { Construct } from 'constructs';
import * as cdk from 'aws-cdk-lib';
import * as apigwv2 from '@aws-cdk/aws-apigatewayv2-alpha';
import * as apigwv2int from '@aws-cdk/aws-apigatewayv2-integrations-alpha';
import * as apigwv2auth from '@aws-cdk/aws-apigatewayv2-authorizers-alpha';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as logs from 'aws-cdk-lib/aws-logs';
import * as iam from 'aws-cdk-lib/aws-iam';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { SqsEventSource } from 'aws-cdk-lib/aws-lambda-event-sources';
import { CfnStage } from 'aws-cdk-lib/aws-apigatewayv2';
import { NagSuppressions } from 'cdk-nag';

import { ProjectStackProps } from '../props/project-stack-props';
import { getContext, getContextKey, outputParameter } from '../utils';

export interface ApiStackProps extends ProjectStackProps {
  logRetention: cdk.aws_logs.RetentionDays;
}

export class ApiStack extends cdk.Stack {
  public readonly httpApi: apigwv2.HttpApi;

  constructor(scope: cdk.App, id: string, props: ApiStackProps) {
    super(scope, id, props);

    // Resource
    // --------

    // Doc: https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_lambda_nodejs.NodejsFunction.html
    const authorizerFn = new NodejsFunction(this, 'AuthorizerFn', {
      runtime: lambda.Runtime.NODEJS_18_X,
      // Note: Removing the logRetention prop doesn't set the log retention period to the default of logs
      // never getting deleted. In order to revert back to the default retention period, we have to set
      // the logRetention prop of the function to Infinite.
      // Note: If you specify logRetention when creating a Lambda function,
      // a single Lambda function will be created to set the log retention policy and point to its execution role
      // (see the reason here https://github.com/aws/aws-cdk/issues/248 and here https://github.com/aws/aws-cdk/issues/667)
      logRetention: props.logRetention,
      environment: {
        NODE_OPTIONS: '--enable-source-maps', // See: https://docs.aws.amazon.com/lambda/latest/dg/typescript-exceptions.html
      },
      bundling: {
        sourceMap: true,
      },
      entry: path.join(__dirname, '../../../../lambdas/authorizer/src/index.ts'),
    });

    // Doc: https://docs.aws.amazon.com/cdk/api/v2/docs/@aws-cdk_aws-apigatewayv2-authorizers-alpha.HttpLambdaAuthorizer.html
    const authorizer = new apigwv2auth.HttpLambdaAuthorizer('Authorizer', authorizerFn, {
      responseTypes: [apigwv2auth.HttpLambdaResponseType.IAM],
      identitySource: ['$request.header.Authorization', '$request.header.authorization'],
    });

    // Doc: https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_sqs.Queue.html
    const provisionResourceQueue = new sqs.Queue(this, 'ProvisionResourceQueue', {
      visibilityTimeout: cdk.Duration.seconds(300), // Set the time enough to provision EC2 instance
      enforceSSL: true,
    });

    const apiFn = new NodejsFunction(this, 'ApiFn', {
      runtime: lambda.Runtime.NODEJS_18_X,
      logRetention: props.logRetention,
      tracing: lambda.Tracing.ACTIVE,
      timeout: cdk.Duration.seconds(15),
      environment: {
        NODE_OPTIONS: '--enable-source-maps', // See: https://docs.aws.amazon.com/lambda/latest/dg/typescript-exceptions.html
        API_PREFIX: 'api',
        PROVISION_RESOURCE_QUEUE_URL: provisionResourceQueue.queueUrl,
      },
      bundling: {
        sourceMap: true,
        nodeModules: [
          '@nestjs/common',
          '@nestjs/core',
          '@nestjs/platform-express',
          '@vendia/serverless-express',
          'class-transformer',
          'class-validator',
          'reflect-metadata',
          'rxjs',
        ],
        commandHooks: {
          beforeBundling(inputDir: string, outputDir: string): string[] {
            return [
              `echo "${inputDir}, ${outputDir} ###########################################"`,
              `cd ${inputDir} && npm -w lambdas/api run build && cp -r lambdas/api/dist ${outputDir}`,
            ];
          },
          afterBundling(inputDir: string, outputDir: string): string[] {
            return [`rm -r ${outputDir}/dist`];
          },
          beforeInstall(): string[] {
            return [];
          },
        },
      },
      entry: path.join(__dirname, '../../../../lambdas/api/dist/index.js'),
    });

    provisionResourceQueue.grantSendMessages(apiFn);

    const provisionResourceFn = new NodejsFunction(this, 'ProvisionResourceFn', {
      runtime: lambda.Runtime.NODEJS_18_X,
      logRetention: props.logRetention,
      environment: {
        NODE_OPTIONS: '--enable-source-maps',
      },
      bundling: {
        sourceMap: true,
      },
      entry: path.join(__dirname, '../../../../lambdas/provision-resource/src/index.ts'),
    });
    provisionResourceFn.addToRolePolicy(
      new iam.PolicyStatement({
        sid: 'AllowProvisionResourceInstance',
        actions: ['ec2:*'],
        resources: ['*'],
        // TODO: Restrict the resource to the specific instance
      })
    );

    // Doc: https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_lambda_event_sources.SqsEventSourceProps.html
    provisionResourceFn.addEventSource(
      new SqsEventSource(provisionResourceQueue, {
        batchSize: 10, // default
        // Doc: https://docs.aws.amazon.com/lambda/latest/dg/with-sqs.html#services-sqs-batchfailurereporting
        reportBatchItemFailures: true,
      })
    );

    // Write CDK cinstruct for Lambda trigered by SQS event

    // Doc: https://docs.aws.amazon.com/cdk/api/v2/docs/@aws-cdk_aws-apigatewayv2-alpha.HttpApi.html
    // See: https://docs.aws.amazon.com/cdk/api/v2/docs/aws-apigatewayv2-integrations-alpha-readme.html
    this.httpApi = new apigwv2.HttpApi(this, 'HttpApi', {
      defaultAuthorizer: authorizer,
      defaultIntegration: new apigwv2int.HttpLambdaIntegration('ApiInt', apiFn),
    });
    this.enableAccessLogging(this.httpApi, cdk.aws_logs.RetentionDays.ONE_WEEK);

    // Nag Suppresions
    // ---------------

    // CDK nag supress AwsSolutions-SQS3
    NagSuppressions.addResourceSuppressions(
      [provisionResourceQueue],
      [
        {
          id: 'AwsSolutions-SQS3',
          reason: 'Suppress AwsSolutions-SQS3 for SQS event source',
        },
      ],
      true
    );

    // Suppress rule for AWSLambdaBasicExecutionRole
    NagSuppressions.addResourceSuppressions(
      [authorizerFn, apiFn, provisionResourceFn],
      [
        {
          id: 'AwsSolutions-IAM4',
          reason: 'Suppress AwsSolutions-IAM4 for AWSLambdaBasicExecutionRole',
          appliesTo: ['Policy::arn:<AWS::Partition>:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole'],
        },
      ],
      true
    );
    NagSuppressions.addResourceSuppressions(
      [authorizerFn, apiFn, provisionResourceFn],
      [
        {
          id: 'AwsSolutions-IAM5',
          reason: 'Suppress AwsSolutions-IAM5 for IAM entity',
          appliesTo: ['Resource::*'],
        },
      ],
      true
    );
    NagSuppressions.addResourceSuppressions(
      [provisionResourceFn],
      [
        {
          id: 'AwsSolutions-IAM5',
          reason: 'Suppress AwsSolutions-IAM5 for IAM entity',
          appliesTo: ['Action::ec2:*'],
        },
      ],
      true
    );

    // Supress rule for log retention lambda
    NagSuppressions.addResourceSuppressionsByPath(
      this,
      '/ApiStack/LogRetentionaae0aa3c5b4d4f87b02d85b201efdd8a/ServiceRole/Resource',
      [
        {
          id: 'AwsSolutions-IAM4',
          reason: 'CDK managed resource',
          appliesTo: ['Policy::arn:<AWS::Partition>:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole'],
        },
      ]
    );
    NagSuppressions.addResourceSuppressionsByPath(
      this,
      '/ApiStack/LogRetentionaae0aa3c5b4d4f87b02d85b201efdd8a/ServiceRole/DefaultPolicy/Resource',
      [
        {
          id: 'AwsSolutions-IAM5',
          reason: 'CDK managed resource',
          appliesTo: ['Resource::*'],
        },
      ]
    );

    // Output
    // ------

    outputParameter(this, props.project, 'HttpApiEndpoint', this.httpApi.apiEndpoint);
    outputParameter(this, props.project, 'HttpApiId', this.httpApi.apiId);
  }

  enableAccessLogging(api: apigwv2.HttpApi, retention: cdk.aws_logs.RetentionDays) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const stage = api.defaultStage!.node.defaultChild as CfnStage;
    const logGroup = new logs.LogGroup(api, 'AccessLogs', {
      retention,
    });

    stage.accessLogSettings = {
      destinationArn: logGroup.logGroupArn,
      format: JSON.stringify({
        requestId: '$context.requestId',
        userAgent: '$context.identity.userAgent',
        sourceIp: '$context.identity.sourceIp',
        requestTime: '$context.requestTime',
        requestTimeEpoch: '$context.requestTimeEpoch',
        httpMethod: '$context.httpMethod',
        path: '$context.path',
        status: '$context.status',
        protocol: '$context.protocol',
        responseLength: '$context.responseLength',
        domainName: '$context.domainName',
      }),
    };

    logGroup.grantWrite(new iam.ServicePrincipal('apigateway.amazonaws.com'));
  }
}

export function getApiEndpoint(scope: Construct, props: ProjectStackProps, required = true) {
  return getContext(scope, getContextKey(props.project, props.env, 'httpApiEndpoint'), required);
}

export function getApiId(scope: Construct, props: ProjectStackProps, required = true) {
  return getContext(scope, getContextKey(props.project, props.env, 'httpApiId'), required);
}
