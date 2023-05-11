import { Construct } from 'constructs';

import { Bucket, BucketProps, BlockPublicAccess, BucketEncryption, ObjectOwnership } from 'aws-cdk-lib/aws-s3';

export class PrivateBucket extends Bucket {
    constructor(scope: Construct, id: string, bucketProps?: BucketProps) {
        const privateProps = {
            blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
            encryption: BucketEncryption.S3_MANAGED,
            objectOwnership: ObjectOwnership.BUCKET_OWNER_ENFORCED,
        };

        bucketProps = bucketProps ? { ...bucketProps, ...privateProps } : privateProps;

        super(scope, id, bucketProps);
    }
}
