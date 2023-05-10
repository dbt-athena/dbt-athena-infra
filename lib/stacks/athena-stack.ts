import { Construct } from 'constructs';

import * as cdk from 'aws-cdk-lib';
import { Aws, Duration, Size } from 'aws-cdk-lib';
import { CfnWorkGroup } from 'aws-cdk-lib/aws-athena';

import { PrivateBucket } from '../constructs/s3/private-bucket';

/**
 *
 */
export class AthenaStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        const athenaQueryResultsBucket = new PrivateBucket(this, 'AthenaQueryResults', {
            bucketName: `athena-query-results-${Aws.REGION}-${Aws.ACCOUNT_ID}`,
            lifecycleRules: [{ expiration: Duration.days(7) }],
        });

        const workGroupName = 'athena-dbt-tests';
        const athenaWorkgroup = new CfnWorkGroup(this, `Workgroup-${workGroupName}`, {
            name: workGroupName,
            state: 'ENABLED',
            workGroupConfiguration: {
                bytesScannedCutoffPerQuery: Size.gibibytes(10).toBytes(),
                enforceWorkGroupConfiguration: true,
                resultConfiguration: {
                    outputLocation: `s3://${athenaQueryResultsBucket.bucketName}/`,
                },
                publishCloudWatchMetricsEnabled: false,
            },
        });
    }
}
