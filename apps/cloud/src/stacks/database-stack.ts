import { Construct } from 'constructs';
import { Secret } from 'aws-cdk-lib/aws-secretsmanager';
import { DatabaseInstance, DatabaseInstanceEngine, PostgresEngineVersion, DatabaseProxy } from 'aws-cdk-lib/aws-rds';
import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as rds from 'aws-cdk-lib/aws-rds';

import { ProjectStackProps } from '../props';

export interface DatabaseStackProps extends ProjectStackProps {
  logRetention: cdk.aws_logs.RetentionDays;
}

export class DatabaseStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: DatabaseStackProps) {
    super(scope, id, props);

    // Get VPC by VPC ID
    // const vpcId = getVpcId(this, props);
    const vpc = ec2.Vpc.fromLookup(this, 'Vpc', { vpcId: 'xxxxxxxxxx' });

    const apiSecurityGroup = ec2.SecurityGroup.fromSecurityGroupId(
      this,
      'ApiSecurityGroup',
      `${props.project.name}:SecurityGroupId`
    );

    const databaseCredentialsSecret = new Secret(this, 'DatabaseCredentialsSecret', {
      description: 'Credentials for the main database user',
      generateSecretString: {
        secretStringTemplate: JSON.stringify({ username: 'main' }),
        generateStringKey: 'password',
        excludePunctuation: true,
        passwordLength: 30,
      },
    });

    const database = new DatabaseInstance(this, 'Database', {
      engine: DatabaseInstanceEngine.postgres({
        version: PostgresEngineVersion.VER_13_3,
      }),
      vpc: vpc,
      credentials: rds.Credentials.fromSecret(databaseCredentialsSecret),
      vpcSubnets: { subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS },
      instanceType: new ec2.InstanceType('t3.micro'),
      allocatedStorage: 20,
      maxAllocatedStorage: 100,
      multiAz: false,
      autoMinorVersionUpgrade: true,
      deleteAutomatedBackups: true,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      securityGroups: [apiSecurityGroup], // Ensure that the database is accessible only from the API Lambda function
    });

    new DatabaseProxy(this, 'DatabaseProxy', {
      vpc: vpc,
      proxyTarget: rds.ProxyTarget.fromInstance(database),
      secrets: [databaseCredentialsSecret],
      debugLogging: false,
      idleClientTimeout: cdk.Duration.minutes(30),
      requireTLS: true,
    });

    new cdk.CfnOutput(this, 'DBSecretArn', {
      value: databaseCredentialsSecret.secretArn,
      description: 'ARN of the Secret storing DB credentials',
    });

    new cdk.CfnOutput(this, 'DBInstanceIdentifier', {
      value: database.instanceIdentifier,
      description: 'Identifier of the database instance',
    });
  }
}
