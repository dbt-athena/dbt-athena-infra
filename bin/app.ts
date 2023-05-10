#!/usr/bin/env node
import 'source-map-support/register';

import * as cdk from 'aws-cdk-lib';
import { Stack, Tags } from 'aws-cdk-lib';

import { allStacks } from '../lib/stacks/stacks';

function main() {
    const app = new cdk.App();

    const stackProps = {
        env: {
            account: process.env.CDK_DEFAULT_ACCOUNT,
            region: 'eu-central-1', // Use Frankfurt as main region
        },
    };

    const stacks = allStacks(app, stackProps);
    stacks.forEach((stack: Stack) => {
        addTags(stack);
    });
}

function addTags(stack: Stack): void {
    Tags.of(stack).add('project', 'dbt-athena-infra');
}

main();
