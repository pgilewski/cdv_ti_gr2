#!/usr/bin/env node

import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { AwsSolutionsChecks } from 'cdk-nag';

import context from '../context';
import { VpcStack, ApiStack, CloudFrontDistributionStack } from '../stacks';
import {
  getVpcStackProps,
  getHttpApiStackProps,
  getCloudFrontDistributionStackProps,
  getDatabaseStackProps,
} from '../props';
import { DatabaseStack } from '../stacks/database-stack';

const app = new cdk.App({ context });

// Add the cdk-nag AwsSolutions Pack with extra verbose logging enabled.
cdk.Aspects.of(app).add(new AwsSolutionsChecks({ verbose: true }));

// const vpcStack = new VpcStack(app, 'VpcStack', getVpcStackProps(app));

const apiStack = new ApiStack(app, 'ApiStack', getHttpApiStackProps(app));

// const databaseStack = new DatabaseStack(app, 'DatabaseStack', getDatabaseStackProps(app));

new CloudFrontDistributionStack(app, 'CloudFrontDistributionStack', getCloudFrontDistributionStackProps(app));
