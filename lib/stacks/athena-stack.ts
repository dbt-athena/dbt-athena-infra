import { Construct } from 'constructs';

import * as cdk from 'aws-cdk-lib';
import { Aws, Duration } from 'aws-cdk-lib';

import { PrivateBucket } from '../constructs/s3/private-bucket';

export class AthenaStack extends cdk.Stack {
    private readonly athenaQueryResultsBucket: PrivateBucket;
    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        this.athenaQueryResultsBucket = new PrivateBucket(this, 'AthenaQueryResults', {
            bucketName: `athena-query-results-${Aws.REGION}-${Aws.ACCOUNT_ID}`,
            lifecycleRules: [{ expiration: Duration.days(7) }],
        });
    }
}
