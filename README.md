# dbt-athena-infra

AWS infrastructure for dbt-athena automated and integration testing.

This is currently deployed on an AWS Account which is under the direct responsibility of [@mattiamatrix](https://github.com/mattiamatrix).


aws athena start-query-execution \
    --query-string "SHOW DATABASES" \
    --work-group "athena-dbt-tests"
