import { Construct } from 'constructs';

import * as cdk from 'aws-cdk-lib';
import { Aws, Duration, Size, Stack } from 'aws-cdk-lib';
import { CfnWorkGroup } from 'aws-cdk-lib/aws-athena';

import { Database } from '@aws-cdk/aws-glue-alpha';

import { PrivateBucket } from '../constructs/s3/private-bucket';

/**
 *
 */
export class AthenaStack extends Stack {
    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        //  Buckets
        new PrivateBucket(this, 'TestData', {
            bucketName: `dbt-athena-test-data-${Aws.REGION}`,
            lifecycleRules: [{ expiration: Duration.days(7) }],
        });

        const athenaQueryResultsBucket = new PrivateBucket(this, 'AthenaQueryResults', {
            bucketName: `dbt-athena-query-results-${Aws.REGION}`,
            lifecycleRules: [{ expiration: Duration.days(7) }],
        });

        // Athena
        const workGroupName = 'athena-dbt-tests';
        new CfnWorkGroup(this, `Workgroup-${workGroupName}`, {
            name: workGroupName,
            state: 'ENABLED',
            workGroupConfiguration: {
                bytesScannedCutoffPerQuery: Size.gibibytes(10).toBytes(),
                publishCloudWatchMetricsEnabled: true,
                resultConfiguration: {
                    outputLocation: `s3://${athenaQueryResultsBucket.bucketName}/${workGroupName}/`,
                },
            },
        });

        // Glue Data Catalog
        new Database(this, Database.name, {
            databaseName: 'dbt-tests',
        });
    }
}
