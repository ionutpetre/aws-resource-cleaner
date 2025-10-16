import { KMSClient, ScheduleKeyDeletionCommand } from "@aws-sdk/client-kms";

import { AwsResource } from "./aws-resource";

export class KMSResource extends AwsResource {
  private client: KMSClient;

  constructor(options: { region: string }) {
    super(options);
    this.resourceType = "kms:key";
    this.client = new KMSClient({ region: this.region });
  }

  async deleteResourceByArn(arn: string) {
    try {
      console.log(`Deleting ${this.resourceType} with ARN: ${arn}`);
      const command = new ScheduleKeyDeletionCommand({
        KeyId: arn,
        PendingWindowInDays: 7,
      });
      const response = await this.client.send(command);
      console.log(`${this.resourceType} ${arn} deleted successfully`);
    } catch (error: any) {
      console.error(
        `Error deleting ${this.resourceType} ${arn}:`,
        error.message,
      );
    }
  }
}
