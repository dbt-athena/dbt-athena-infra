.DEFAULT_GOAL := doctor

doctor:
	@cdk doctor

cdk-bootstrap:
	cdk bootstrap aws://${ACCOUNT_ID}/us-east-1
	cdk bootstrap aws://${ACCOUNT_ID}/eu-west-1
	cdk bootstrap aws://${ACCOUNT_ID}/eu-west-2
	cdk bootstrap aws://${ACCOUNT_ID}/eu-central-1

cdk-test:
	npm run test

# All
stag-diff-all:
	@make pre-deploy
	@cd aws-cdk; \
	NODE_ENV=stag-activity-capturing npm run cdk-diff -- "*"

stag-deploy-all:
	@make pre-deploy
	@cd aws-cdk; \
	NODE_ENV=stag-activity-capturing npm run cdk-deploy -- "*"
