import {
  SSMClient,
  DeleteParameterCommand,
  GetParameterCommand,
} from "@aws-sdk/client-ssm";

import { AwsResource } from "./aws-resource.js";

export class SSMResource extends AwsResource {
  private client: SSMClient;

  constructor(options: { region: string }) {
    super(options);
    this.resourceType = "ssm:parameter";
    this.client = new SSMClient({ region: this.region });
  }

  async getParameterNameByArn(parameterArn: string) {
    try {
      const command = new GetParameterCommand({
        Name: parameterArn,
      });
      const response = await this.client.send(command);
      return response?.Parameter?.Name;
    } catch (error: any) {
      console.error(
        `Error getting ${this.resourceType} name for ARN ${parameterArn}:`,
        error.message,
      );
      return null;
    }
  }

  async deleteParameterByName(name: string) {
    try {
      const command = new DeleteParameterCommand({ Name: name });
      const response = await this.client.send(command);
      console.log(`${this.resourceType} ${name} deleted successfully`);
    } catch (error: any) {
      console.error(
        `Error deleting ${this.resourceType} ${name}:`,
        error.message,
      );
    }
  }

  async deleteResourceByArn(arn: any) {
    console.log(`Deleting ${this.resourceType} with ARN: ${arn}`);
    const name = await this.getParameterNameByArn(arn);
    if (!name) {
      console.error(
        `Skipping deletion of ${this.resourceType} with ARN: ${arn} due to missing name`,
      );
      return;
    }
    await this.deleteParameterByName(name);
  }
}
