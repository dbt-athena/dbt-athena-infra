import { Construct } from 'constructs';

import * as cdk from 'aws-cdk-lib';
import { Stack, StackProps } from 'aws-cdk-lib';
import {
    Conditions,
    Effect,
    OpenIdConnectProvider,
    PolicyStatement,
    Role,
    WebIdentityPrincipal,
} from 'aws-cdk-lib/aws-iam';

interface RepositoryConfig {
    owner: string;
    repo: string;
    filter?: string;
}

/**
 * https://docs.github.com/en/actions/deployment/security-hardening-your-deployments/configuring-openid-connect-in-amazon-web-services
 * https://towardsthecloud.com/aws-cdk-openid-connect-github
 * https://github.com/aws-actions/configure-aws-credentials
 *
 */
export class GithubStack extends Stack {
    constructor(scope: Construct, id: string, props: StackProps) {
        super(scope, id, props);

        const repositoryConfig: RepositoryConfig[] = [{ owner: 'dbt-athena', repo: 'dbt-athena' }];

        const githubDomain = 'token.actions.githubusercontent.com';

        const ghProvider = new OpenIdConnectProvider(this, 'GithubProvider', {
            url: `https://${githubDomain}`,
            clientIds: ['sts.amazonaws.com'],
        });

        const iamRepoDeployAccess = repositoryConfig.map(
            (repoConfig) => `repo:${repoConfig.owner}/${repoConfig.repo}:${repoConfig.filter ?? '*'}`,
        );

        // Grant only requests coming from a specific GitHub repository.
        const conditions: Conditions = {
            StringLike: {
                [`${githubDomain}:sub`]: iamRepoDeployAccess,
            },
        };

        const githubAssumableRole = new Role(this, 'GithubAssumableRole', {
            assumedBy: new WebIdentityPrincipal(ghProvider.openIdConnectProviderArn, conditions),
            roleName: 'exampleGitHubDeployRole',
            description:
                'This role is used via GitHub Actions to deploy with AWS CDK or Terraform on the target AWS account',
            maxSessionDuration: cdk.Duration.hours(1),
        });

        // https://dbt-athena.github.io/docs/getting-started/prerequisites/iam-permissions
        // Athena
        githubAssumableRole.addToPolicy(
            new PolicyStatement({
                effect: Effect.ALLOW,
                actions: [
                    'athena:GetQueryExecution',
                    'athena:GetQueryResults',
                    'athena:GetWorkGroup',
                    'athena:StartQueryExecution',
                    'athena:StopQueryExecution',
                ],
                resources: ['*'],
            }),
        );

        // Glue
        githubAssumableRole.addToPolicy(
            new PolicyStatement({
                effect: Effect.ALLOW,
                actions: [
                    'glue:BatchCreatePartition',
                    'glue:BatchDeletePartition',
                    'glue:BatchDeleteTable',
                    'glue:BatchDeleteTableVersion',
                    'glue:BatchUpdatePartition',
                    'glue:CreatePartition',
                    'glue:CreateTable',
                    'glue:DeletePartition',
                    'glue:DeleteTable',
                    'glue:DeleteTableVersion',
                    'glue:GetDatabase',
                    'glue:GetDatabase',
                    'glue:GetDatabases',
                    'glue:GetDatabases',
                    'glue:GetPartition',
                    'glue:GetPartition',
                    'glue:GetPartitions',
                    'glue:GetPartitions',
                    'glue:GetTable',
                    'glue:GetTable',
                    'glue:GetTables',
                    'glue:GetTables',
                    'glue:UpdatePartition',
                    'glue:UpdateTable',
                ],
                resources: ['*'],
            }),
        );

        // S3
        githubAssumableRole.addToPolicy(
            new PolicyStatement({
                effect: Effect.ALLOW,
                actions: [
                    's3:AbortMultipartUpload',
                    's3:DeleteObject',
                    's3:GetBucketLocation',
                    's3:GetBucketLocation',
                    's3:GetObject',
                    's3:GetObject',
                    's3:ListBucket',
                    's3:ListBucket',
                    's3:ListBucketMultipartUploads',
                    's3:ListBucketMultipartUploads',
                    's3:ListMultipartUploadParts',
                    's3:ListMultipartUploadParts',
                    's3:PutObject',
                ],
                resources: ['*'],
            }),
        );

        // Kms
        githubAssumableRole.addToPolicy(
            new PolicyStatement({
                effect: Effect.ALLOW,
                actions: ['kms:GenerateDataKey*', 'kms:DescribeKey', 'kms:Decrypt'],
                resources: ['*'],
            }),
        );

        // Lake Formation
        githubAssumableRole.addToPolicy(
            new PolicyStatement({
                effect: Effect.ALLOW,
                actions: ['lakeformation:GetDataAccess'],
                resources: ['*'],
            }),
        );
    }
}
