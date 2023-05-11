import { App } from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';

import { AthenaStack } from '../lib/stacks/athena-stack';

test('AthenaStack has S3 bucket', () => {
    const app = new App();
    // WHEN
    const stack = new AthenaStack(app, AthenaStack.name);
    // THEN
    const template = Template.fromStack(stack);
    template.hasResource('AWS::S3::Bucket', {});
});
