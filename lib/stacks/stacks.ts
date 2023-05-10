import { App, StackProps, Stack } from 'aws-cdk-lib';

import { AthenaStack } from './athena-stack';
import { GithubStack } from './github-stack';

/**
 * Create all stack
 */
export function allStacks(app: App, stackProps: StackProps): Stack[] {
    const regions = ['us-east-1', 'eu-west-1', 'eu-west-2', 'eu-central-1'];

    const athenaStacks = regions.map((region) => {
        return new AthenaStack(app, `${AthenaStack.name}-${region}`, {
            env: { region },
        });
    });

    const githubStack = new GithubStack(app, GithubStack.name, stackProps);

    return [...athenaStacks, githubStack];
}
