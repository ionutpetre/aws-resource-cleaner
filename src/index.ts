import { AwsResource } from "./aws-resource";
import { AppConfigResource } from "./appconfig";
import { CloudWatchResource } from "./cloud-watch";
import { CognitoResource } from "./cognito";
import { DynamoDBResource } from "./dynamodb";
import { EC2Resource } from "./ec2";
import { ECSResource } from "./ecs";
import { IAMResource } from "./iam";
import { KMSResource } from ".//kms";
import { LambdaResource } from "./lambda";
import { S3Resource } from "./s3";
import { SecretsManagerResource } from "./secrets-manager";
import { SFNResource } from "./sfn";
import { SNSResource } from "./sns";
import { SQSResource } from "./sqs";
import { SSMResource } from "./ssm";

export function getAwsResourcesByType(resourceType: string): AwsResource[] {
  const region = process.env.AWS_REGION || "";
  const account = process.env.AWS_ACCOUNT_ID || "";
  const awsOptions = {
    region,
    account,
  };
  const awsResources: AwsResource[] = [];

  if (["sqs", "all"].includes(resourceType)) {
    awsResources.push(new SQSResource(awsOptions));
  }

  if (["sns", "all"].includes(resourceType)) {
    awsResources.push(new SNSResource(awsOptions));
  }

  if (["dynamodb", "all"].includes(resourceType)) {
    awsResources.push(new DynamoDBResource(awsOptions));
  }

  if (["s3", "all"].includes(resourceType)) {
    awsResources.push(new S3Resource(awsOptions));
  }

  if (["ssm", "all"].includes(resourceType)) {
    awsResources.push(new SSMResource(awsOptions));
  }

  if (["secretsmanager", "all"].includes(resourceType)) {
    awsResources.push(new SecretsManagerResource(awsOptions));
  }

  if (["lambda", "all"].includes(resourceType)) {
    awsResources.push(new LambdaResource(awsOptions));
  }

  if (["sfn", "all"].includes(resourceType)) {
    awsResources.push(new SFNResource(awsOptions));
  }

  if (["kms", "all"].includes(resourceType)) {
    awsResources.push(new KMSResource(awsOptions));
  }

  if (["ecs", "all"].includes(resourceType)) {
    awsResources.push(new ECSResource(awsOptions));
  }

  if (["ec2", "all"].includes(resourceType)) {
    awsResources.push(new EC2Resource(awsOptions));
  }

  if (["cognito-idp", "all"].includes(resourceType)) {
    awsResources.push(new CognitoResource(awsOptions));
  }

  if (["appconfig", "all"].includes(resourceType)) {
    awsResources.push(new AppConfigResource(awsOptions));
  }

  if (["cloudwatch", "all"].includes(resourceType)) {
    awsResources.push(new CloudWatchResource(awsOptions));
  }

  if (["iam", "all"].includes(resourceType)) {
    awsResources.push(new IAMResource(awsOptions));
  }
  return awsResources;
}

export async function deleteAwsResources(
  type: string,
  tags: Record<string, string[]>,
): Promise<void> {
  const awsResources = getAwsResourcesByType(type);
  if (awsResources.length === 0) {
    console.log(`No AWS resource found for type: ${type}`);
    return;
  }
  for (const service of awsResources) {
    await service.deleteResourcesByTags(tags);
  }
}

export async function listAwsResources(
  type: string,
  tags: Record<string, string[]>,
): Promise<void> {
  const awsResources = getAwsResourcesByType(type);
  if (awsResources.length === 0) {
    console.log(`No AWS resource found for type: ${type}`);
    return;
  }
  for (const service of awsResources) {
    const resourceArns = await service.getResourceArnsByTags(tags);
    if (resourceArns.length !== 0) {
      console.log(resourceArns);
    }
  }
}
