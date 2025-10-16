import {
  SecretsManagerClient,
  DeleteSecretCommand,
} from "@aws-sdk/client-secrets-manager";

import { AwsResource } from "./aws-resource.js";

export class SecretsManagerResource extends AwsResource {
  private client: SecretsManagerClient;

  constructor(options: { region: string }) {
    super(options);
    this.resourceType = "secretsmanager:secret";
    this.client = new SecretsManagerClient({ region: this.region });
  }

  async deleteSecretById(secretId: string) {
    try {
      const command = new DeleteSecretCommand({
        SecretId: secretId,
        ForceDeleteWithoutRecovery: true,
      });
      const response = await this.client.send(command);
      console.log(`${this.resourceType} ${secretId} deleted successfully`);
    } catch (error: any) {
      console.error(
        `Error deleting ${this.resourceType} ${secretId}:`,
        error.message,
      );
    }
  }

  async deleteResourceByArn(arn: string) {
    console.log(`Deleting ${this.resourceType} with ARN: ${arn}`);
    const [, , , , , , secretId] = arn.split(":");
    await this.deleteSecretById(secretId);
  }
}
