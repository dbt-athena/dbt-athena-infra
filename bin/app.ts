#!/usr/bin/env node
import 'source-map-support/register';

import * as cdk from 'aws-cdk-lib';
import { StackProps } from 'aws-cdk-lib';

import { AthenaStack } from '../lib/stacks/athena-stack';

const app = new cdk.App();

const account = process.env.CDK_DEFAULT_ACCOUNT;
const region = process.env.CDK_DEFAULT_REGION;

const stackProps: StackProps = { env: { account, region } };

const regions = ['us-east-1', 'eu-west-1', 'eu-west-2', 'eu-central-1'];

regions.forEach((region) => {
    new AthenaStack(app, `${AthenaStack.name}-${region}`, {
        env: { account, region },
    });
});
