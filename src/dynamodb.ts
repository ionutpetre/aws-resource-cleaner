import { DeleteTableCommand, DynamoDBClient } from "@aws-sdk/client-dynamodb";

import { AwsResource } from "./aws-resource";

export class DynamoDBResource extends AwsResource {
  private client: DynamoDBClient;

  constructor(options: { region: string }) {
    super(options);
    this.resourceType = "dynamodb:table";
    this.client = new DynamoDBClient({ region: this.region });
  }

  async deleteResourceByArn(arn: string) {
    console.log(`Deleting ${this.resourceType} with ARN: ${arn}`);
    const [, , , , , tableKey] = arn.split(":");
    const [, tableName] = tableKey.split("/");
    try {
      const command = new DeleteTableCommand({ TableName: tableName });
      const response = await this.client.send(command);
      console.log(`${this.resourceType} ${tableName} deleted successfully:`);
    } catch (error: any) {
      console.error(
        `Error deleting ${this.resourceType} ${tableName}:`,
        error.message,
      );
    }
  }
}
