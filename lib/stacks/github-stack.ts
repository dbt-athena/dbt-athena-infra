import { Construct } from 'constructs';

import * as cdk from 'aws-cdk-lib';
import { StackProps } from 'aws-cdk-lib';
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
export class GithubStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props?: StackProps) {
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

        githubAssumableRole.addToPolicy(this.createAthenaTestPolicy());
    }
    private createAthenaTestPolicy(): PolicyStatement {
        return new PolicyStatement({
            effect: Effect.ALLOW,
            actions: ['lakeformation:*', 'glue:*', 'athena:*'],
            resources: ['*'],
        });
    }
}
