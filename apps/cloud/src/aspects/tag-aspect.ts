import { IConstruct } from 'constructs';
import * as cdk from 'aws-cdk-lib';

// Doc: https://docs.aws.amazon.com/cdk/v2/guide/aspects.html
// See: https://aws.hashnode.com/the-power-of-aws-cdk-aspects
export class TagAspect implements cdk.IAspect {
  private readonly tags: {
    [key: string]: string;
  };

  constructor(tags: { [key: string]: string }) {
    this.tags = tags;
  }

  public visit(node: IConstruct): void {
    if (node instanceof cdk.Stack) {
      Object.entries(this.tags).forEach(([key, value]) => {
        cdk.Tags.of(node).add(key, value);
      });
    }
  }
}
// Usage: this.node.applyAspect(new TagAspect({"tag1":"mytag1","tag2":"another tag","tag3":"andanother"}));
