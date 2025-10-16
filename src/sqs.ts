import {
  DeleteQueueCommand,
  GetQueueUrlCommand,
  SQSClient,
} from "@aws-sdk/client-sqs";

import { AwsResource } from "./aws-resource.js";

export class SQSResource extends AwsResource {
  private client: SQSClient;

  constructor(options: { region: string }) {
    super(options);
    this.resourceType = "sqs:queue";
    this.client = new SQSClient({ region: this.region });
  }

  async getQueueUrlByArn(queueArn: string) {
    const [, , , , accountId, queueName] = queueArn.split(":");
    try {
      const command = new GetQueueUrlCommand({
        QueueName: queueName,
        QueueOwnerAWSAccountId: accountId,
      });
      const urlResponse = await this.client.send(command);
      return urlResponse.QueueUrl;
    } catch (error: any) {
      console.error(
        `Error getting URL for ${this.resourceType} ${queueArn}:`,
        error.message,
      );
      return null;
    }
  }

  async deleteQueueByUrl(queueUrl: string) {
    try {
      const command = new DeleteQueueCommand({ QueueUrl: queueUrl });
      const response = await this.client.send(command);
      console.log(`${this.resourceType} ${queueUrl} deleted successfully:`);
    } catch (error: any) {
      console.error(
        `Error deleting ${this.resourceType} ${queueUrl}:`,
        error.message,
      );
    }
  }

  async deleteResourceByArn(queueArn: string) {
    console.log(`Deleting ${this.resourceType} with ARN: ${queueArn}`);
    const queueUrl = await this.getQueueUrlByArn(queueArn);
    if (!queueUrl) {
      console.error(`Queue URL not found for ARN: ${queueArn}`);
      return;
    }
    this.deleteQueueByUrl(queueUrl);
  }
}
