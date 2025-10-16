import {
  CognitoIdentityProviderClient,
  DescribeUserPoolCommand,
  DeleteUserPoolDomainCommand,
  DeleteUserPoolCommand,
} from "@aws-sdk/client-cognito-identity-provider";

import { AwsResource } from "./aws-resource";

export class CognitoResource extends AwsResource {
  private client: CognitoIdentityProviderClient;

  constructor(options: { region: string }) {
    super(options);
    this.resourceType = "cognito-idp:userpool";
    this.client = new CognitoIdentityProviderClient({ region: this.region });
  }

  async getUserPoolDomain(userPoolId: string) {
    try {
      const command = new DescribeUserPoolCommand({ UserPoolId: userPoolId });
      const response = await this.client.send(command);
      const domain = response.UserPool?.Domain;
      console.log("User pool domain:", domain);
      console.log(`${this.resourceType} domain for ${userPoolId} is ${domain}`);
      return domain;
    } catch (error: any) {
      console.error(
        `Error describing ${this.resourceType} ${userPoolId}:`,
        error.message,
      );
      return null;
    }
  }

  async deleteUserPoolDomain(userPoolId: string, domain: string) {
    try {
      const command = new DeleteUserPoolDomainCommand({
        UserPoolId: userPoolId,
        Domain: domain,
      });
      const response = await this.client.send(command);
      console.log(
        `${this.resourceType} domain ${domain} deleted successfully:`,
        response,
      );
    } catch (error: any) {
      console.error(
        `Error deleting ${this.resourceType} domain ${domain}:`,
        error.message,
      );
    }
  }

  async deleteResourceByArn(arn: string) {
    console.log(`Deleting ${this.resourceType} with ARN: ${arn}`);
    const [, , , , , userPoolKey] = arn.split(":");
    const [, userPoolId] = userPoolKey.split("/");
    const domain = await this.getUserPoolDomain(userPoolId);
    if (domain) {
      await this.deleteUserPoolDomain(userPoolId, domain);
    }
    try {
      const command = new DeleteUserPoolCommand({
        UserPoolId: userPoolId,
      });
      const response = await this.client.send(command);
      console.log(`${this.resourceType} ${userPoolId} deleted successfully:`);
    } catch (error: any) {
      console.error(
        `Error deleting ${this.resourceType} ${userPoolId}:`,
        error.message,
      );
    }
  }
}
