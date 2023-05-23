# techint Cloud

This is the project for CDK development with TypeScript.

The `cdk.json` file tells the CDK Toolkit how to execute your app.

## Useful commands

- `npm run test` - perform the unit tests
- `npm run cdk list (ls)` - lists the stacks in the app
- `npm run cdk synthesize (synth)` - synthesizes and prints the CloudFormation template for the specified stack(s)
- `npm run cdk bootstrap` - deploys the CDK Toolkit stack, required to deploy stacks containing assets
- `npm run cdk deploy` - deploys the specified stack(s)
- `npm run cdk deploy '*'` - deploys all stacks at once
- `npm run cdk destroy` - destroys the specified stack(s)
- `npm run cdk destroy '*'` - destroys all stacks at once
- `npm run cdk diff` - compares the specified stack with the deployed stack or a local CloudFormation template
- `npm run cdk metadata` - displays metadata about the specified stack
- `npm run cdk context` - manages cached context values
- `npm run cdk docs (doc)` - opens the CDK API reference in your browser
- `npm run cdk doctor` - checks your CDK project for potential problems

## Stacks

- [VpcStack](docs/vpc-stack/README.md)
- [ApiStack](docs/api-stack/README.md)
- [CloudFrontDistributionStack](docs/cloudfront-distribution-stack/README.md)

You can check the stack output params by executing:

```shell
$ aws cloudformation describe-stacks --stack-name <STACK_NAME> \
    --query 'Stacks[0].Outputs[*].[OutputKey,OutputValue]' --output text
```

## Resources

### CDK

- [AWS CDK Workshop](https://cdkworkshop.com/)
- [CDK Patterns](https://cdkpatterns.com/)
- [The CDK Book - A Comprehensive Guide to the AWS Cloud Development Kit](https://thecdkbook.com/)

### Others

- [AWS Lambda Powertools for TypeScript](https://awslabs.github.io/aws-lambda-powertools-typescript/latest/)
