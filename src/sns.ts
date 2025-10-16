import { SNSClient, DeleteTopicCommand } from "@aws-sdk/client-sns";

import { AwsResource } from "./aws-resource.js";

export class SNSResource extends AwsResource {
  private client: SNSClient;

  constructor(options: { region: string }) {
    super(options);
    this.resourceType = "sns:topic";
    this.client = new SNSClient({ region: this.region });
  }

  async deleteResourceByArn(topicArn: string) {
    console.log(`Deleting ${this.resourceType} with ARN: ${topicArn}`);
    try {
      const command = new DeleteTopicCommand({ TopicArn: topicArn });
      const response = await this.client.send(command);
      console.log(`${this.resourceType} ${topicArn} deleted successfully:`);
    } catch (error: any) {
      console.error(
        `Error deleting ${this.resourceType} ${topicArn}:`,
        error.message,
      );
    }
  }
}
