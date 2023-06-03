import { Construct } from 'constructs';
import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as logs from 'aws-cdk-lib/aws-logs';
import * as ssm from 'aws-cdk-lib/aws-ssm';
import { NagSuppressions } from 'cdk-nag';

import { ProjectStackProps } from '../props';
import { getContext, getContextKey, outputParameter } from '../utils';
import { SecureBucket } from '../constructs';

export interface NatInstance {
  readonly instanceClass: ec2.InstanceClass;
  readonly instanceSize: ec2.InstanceSize;
}

export interface VpcStackProps extends ProjectStackProps {
  readonly cidr: string;
  readonly maxAzs: number;
  readonly natGateways: number;
  readonly natInstance?: NatInstance;
  readonly flowLogs?: boolean;
}

export class VpcStack extends cdk.Stack {
  public readonly vpc: ec2.Vpc;

  constructor(scope: cdk.App, id: string, props: VpcStackProps) {
    super(scope, id, props);

    // Resources
    // ---------

    const natGatewayProvider = props.natInstance ? VpcStack.getNatGatewayProvider(props) : undefined;

    // Doc: https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_ec2.Vpc.html
    this.vpc = new ec2.Vpc(this, 'Vpc', {
      ipAddresses: ec2.IpAddresses.cidr(props.cidr),
      maxAzs: props.maxAzs,
      natGateways: props.natGateways,
      natGatewayProvider: natGatewayProvider ? natGatewayProvider : ec2.NatProvider.gateway(),
      subnetConfiguration: [
        {
          name: 'Public',
          subnetType: ec2.SubnetType.PUBLIC,
          cidrMask: 24,
        },
        {
          name: 'Private',
          subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS,
          cidrMask: 24,
        },
        {
          name: 'Isolated',
          subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
          cidrMask: 28,
        },
      ],
    });
    // Update the Name tag for the VPC
    cdk.Aspects.of(this.vpc).add(new cdk.Tag('Name', `${props.project.prefix}-vpc`));

    if (props.flowLogs) {
      // Add VPC Flow Logs

      const FlowLogLogGroup = new logs.LogGroup(this, 'FlowLogLogGroup', {
        retention: logs.RetentionDays.TWO_WEEKS,
      });

      const flowLogBucket = new SecureBucket(this, 'FlowLogBucket', {
        // Doc: https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_s3.IntelligentTieringConfiguration.html
        intelligentTieringConfigurations: [
          {
            name: 'archive',
            archiveAccessTierTime: cdk.Duration.days(90),
            deepArchiveAccessTierTime: cdk.Duration.days(180),
          },
        ],
      });
      // Suppress Nag warnings 'The S3 Bucket has server access logs disabled'
      NagSuppressions.addResourceSuppressions(flowLogBucket, [
        {
          id: 'AwsSolutions-S1',
          reason: 'Flow logs bucket does not need server access logs',
        },
      ]);

      this.vpc.addFlowLog('FlowLogCloudWatch', {
        destination: ec2.FlowLogDestination.toCloudWatchLogs(FlowLogLogGroup),
        trafficType: ec2.FlowLogTrafficType.ALL,
      });

      this.vpc.addFlowLog('FlowLogS3', {
        destination: ec2.FlowLogDestination.toS3(flowLogBucket),
        trafficType: ec2.FlowLogTrafficType.ALL,
      });
    } else {
      // Suppress Nag warnings 'The VPC does not have an associated Flow Log'
      NagSuppressions.addResourceSuppressions(this.vpc, [
        {
          id: 'AwsSolutions-VPC7',
          reason: 'VPC flow logs are not enabled',
        },
      ]);
    }

    // Pick subnets
    const publicSubnets = this.vpc.selectSubnets({
      subnetType: ec2.SubnetType.PUBLIC,
    });
    const privateSubnets = this.vpc.selectSubnets({
      subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS,
    });
    const isolatedSubnets = this.vpc.selectSubnets({
      subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
    });

    // Setup public subnet
    publicSubnets.subnets.forEach((subnet) => {
      cdk.Tags.of(subnet).add('Name', `${props.project.prefix}-public-subnet-${subnet.availabilityZone}`);

      if (props.natInstance) {
        // Escape hatch - find the nested child IConstruct by its CDK-assigned id and cast it to ec2.Instance
        // finding the ids sometimes requires detective work in the cdk source code or with console.log.
        // if the id references are valid, it will have the instanceId
        const natInstance = subnet.node.tryFindChild('NatInstance') as ec2.Instance;
        if (natInstance) {
          cdk.Aspects.of(natInstance).add(
            new cdk.Tag('Name', `${props.project.prefix}-public-subnet-${subnet.availabilityZone}-nat-instance`)
          );

          // NAT instance should be used only for DEV environment and as such does not require detailed monitoring...
          NagSuppressions.addResourceSuppressions(natInstance, [
            {
              id: 'AwsSolutions-EC28',
              reason: 'NAT instance does not require detailed monitorng',
            },
          ]);
          // ... and termination protection
          NagSuppressions.addResourceSuppressions(natInstance, [
            {
              id: 'AwsSolutions-EC29',
              reason: 'NAT instance does not require termination protection',
            },
          ]);

          // In case you would like to protect the NAT instances from being accidentally terminated uncomment the following line
          //natInstance.instance.addPropertyOverride('DisableApiTermination', true);
          // But be aware that this will cause problems with the cdk destroy command as it will fail to delete the NAT instance
          // Note: since raw overrides take place after template synthesis these fixes are not caught by cdk-nag.
        }
      } else {
        const natGateway = subnet.node.tryFindChild('NATGateway');
        if (natGateway) {
          cdk.Aspects.of(natGateway).add(
            new cdk.Tag('Name', `${props.project.prefix}-public-subnet-${subnet.availabilityZone}-nat-gateway`)
          );
        }
      }
    });

    // Adding custom NACL for isolated subnets to only allow to/from private subnets
    // Doc: https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_ec2.NetworkAcl.html
    const isolatedSubnetNACL = new ec2.NetworkAcl(this, 'IsolatedSubnetNACL', {
      vpc: this.vpc,
      subnetSelection: isolatedSubnets,
    });
    cdk.Tags.of(isolatedSubnetNACL).add('Name', `${props.project.prefix}-isolated-subnet-nacl`);

    // Setup private subnet
    privateSubnets.subnets.forEach((subnet, index) => {
      isolatedSubnetNACL.addEntry(`PrivateSubnet${index}Ingress`, {
        cidr: ec2.AclCidr.ipv4(subnet.ipv4CidrBlock),
        direction: ec2.TrafficDirection.INGRESS,
        ruleNumber: 100 + index,
        traffic: ec2.AclTraffic.allTraffic(),
      });

      isolatedSubnetNACL.addEntry(`PrivateSubnet${index}Egress`, {
        cidr: ec2.AclCidr.ipv4(subnet.ipv4CidrBlock),
        direction: ec2.TrafficDirection.EGRESS,
        ruleNumber: 100 + index,
        traffic: ec2.AclTraffic.allTraffic(),
      });

      if (natGatewayProvider) {
        // Allow inbound traffic only from private network to the NAT instance
        natGatewayProvider.connections.allowFrom(ec2.Peer.ipv4(subnet.ipv4CidrBlock), ec2.Port.allTraffic());
      }

      cdk.Tags.of(subnet).add('Name', `${props.project.prefix}-private-subnet-${subnet.availabilityZone}`);
    });

    // Setup isolated subnet
    isolatedSubnets.subnets.forEach((subnet) => {
      cdk.Tags.of(subnet).add('Name', `${props.project.prefix}-isolated-subnet-${subnet.availabilityZone}`);
    });

    // Suppress Nag warnings 'A Network ACL or Network ACL entry has been implemented'
    NagSuppressions.addResourceSuppressionsByPath(
      this,
      [
        '/VpcStack/IsolatedSubnetNACL/Resource',
        '/VpcStack/IsolatedSubnetNACL/PrivateSubnet0Ingress/Resource',
        '/VpcStack/IsolatedSubnetNACL/PrivateSubnet0Egress/Resource',
        '/VpcStack/IsolatedSubnetNACL/PrivateSubnet1Ingress/Resource',
        '/VpcStack/IsolatedSubnetNACL/PrivateSubnet1Egress/Resource',
        '/VpcStack/IsolatedSubnetNACL/PrivateSubnet2Ingress/Resource',
        '/VpcStack/IsolatedSubnetNACL/PrivateSubnet2Egress/Resource',
      ],
      [
        {
          id: 'AwsSolutions-VPC3',
          reason: 'Adding custom NACL for isolated subnets to only allow to/from private subnets',
        },
      ],
      true
    );

    // Output
    // ------

    outputParameter(this, props.project, 'VpcId', this.vpc.vpcId, true);
  }

  private static getNatGatewayProvider(props: VpcStackProps): ec2.NatInstanceProvider {
    // See: https://docs.aws.amazon.com/vpc/latest/userguide/VPC_NAT_Instance.html
    // Doc: https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_ec2.NatProvider.html
    return ec2.NatProvider.instance({
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      instanceType: ec2.InstanceType.of(props.natInstance!.instanceClass, props.natInstance!.instanceSize),
      defaultAllowedTraffic: ec2.NatTrafficDirection.OUTBOUND_ONLY,
    });
  }
}

export function getVpcId(scope: Construct, props: ProjectStackProps, required = true) {
  return getContext(scope, getContextKey(props.project, props.env, 'vpcId'), required);
}
