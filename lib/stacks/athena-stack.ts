import { Construct } from 'constructs';

import { Aws, Duration, Size, Stack, StackProps } from 'aws-cdk-lib';
import { CfnWorkGroup } from 'aws-cdk-lib/aws-athena';

import { Database } from '@aws-cdk/aws-glue-alpha';

import { PrivateBucket } from '../constructs/s3/private-bucket';

interface AthenaStackProps extends StackProps {
    workGroupName: string;
}

/**
 * Create resources required by Athena.
 */
export class AthenaStack extends Stack {
    constructor(scope: Construct, id: string, private readonly props: AthenaStackProps) {
        super(scope, id, props);

        //  Buckets
        new PrivateBucket(this, 'TestData', { bucketName: `dbt-athena-test-data-${Aws.REGION}` });

        const athenaQueryResultsBucket = new PrivateBucket(this, 'AthenaQueryResults', {
            bucketName: `dbt-athena-query-results-${Aws.REGION}`,
            lifecycleRules: [{ expiration: Duration.days(1) }],
        });

        // Athena
        new CfnWorkGroup(this, `Workgroup-${this.props.workGroupName}`, {
            name: this.props.workGroupName,
            state: 'ENABLED',
            workGroupConfiguration: {
                bytesScannedCutoffPerQuery: Size.gibibytes(10).toBytes(),
                publishCloudWatchMetricsEnabled: true,
                resultConfiguration: {
                    outputLocation: `s3://${athenaQueryResultsBucket.bucketName}/${this.props.workGroupName}/`,
                },
            },
        });

        // Glue Data Catalog
        new Database(this, Database.name, {
            databaseName: 'dbt-tests',
        });
    }
}
