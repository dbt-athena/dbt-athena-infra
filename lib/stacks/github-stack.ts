import { Construct } from 'constructs';

import * as cdk from 'aws-cdk-lib';
import { StackProps } from 'aws-cdk-lib';

export class GithubStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);
    }
}
