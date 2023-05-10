import { App, StackProps, Stack } from 'aws-cdk-lib';

import { AthenaStack } from './athena-stack';
import { GithubStack } from './github-stack';

/**
 * Create all stacks
 */
export function allStacks(app: App, stackProps: StackProps): Stack[] {
    const athenaWorkGroupName = 'athena-dbt-tests';
    const regions = ['us-east-1', 'eu-west-1', 'eu-west-2', 'eu-central-1'];

    const athenaStacks = regions.map((region) => {
        return new AthenaStack(app, `${AthenaStack.name}-${region}`, {
            workGroupName: athenaWorkGroupName,
            env: { region },
        });
    });

    const githubStack = new GithubStack(app, GithubStack.name, { workGroupName: athenaWorkGroupName, ...stackProps });

    return [...athenaStacks, githubStack];
}
