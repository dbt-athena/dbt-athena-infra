.DEFAULT_GOAL := doctor

doctor:
	@cdk doctor

prettier:
	npm run prettier

cdk-bootstrap:
	cdk bootstrap aws://${ACCOUNT_ID}/us-east-1
	cdk bootstrap aws://${ACCOUNT_ID}/eu-west-1
	cdk bootstrap aws://${ACCOUNT_ID}/eu-west-2
	cdk bootstrap aws://${ACCOUNT_ID}/eu-central-1

cdk-test:
	npm run test

pre-commit:
	@make prettier
	@make cdk-test

# All
cdk-diff:
	cdk diff

cdk-deploy:
	cdk deploy --all
