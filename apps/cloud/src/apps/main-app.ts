#!/usr/bin/env node

import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { AwsSolutionsChecks } from 'cdk-nag';

import context from '../context';
import { VpcStack, ApiStack, CloudFrontDistributionStack } from '../stacks';
import { getVpcStackProps, getHttpApiStackProps, getCloudFrontDistributionStackProps } from '../props';

const app = new cdk.App({ context });

// Add the cdk-nag AwsSolutions Pack with extra verbose logging enabled.
cdk.Aspects.of(app).add(new AwsSolutionsChecks({ verbose: true }));

new VpcStack(app, 'VpcStack', getVpcStackProps(app));

const apiStack = new ApiStack(app, 'ApiStack', getHttpApiStackProps(app));

new CloudFrontDistributionStack(
  app,
  'CloudFrontDistributionStack',
  getCloudFrontDistributionStackProps(app, apiStack.httpApi)
);
