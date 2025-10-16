import { SFNClient, DeleteStateMachineCommand } from "@aws-sdk/client-sfn";

import { AwsResource } from "./aws-resource";

export class SFNResource extends AwsResource {
  private client: SFNClient;

  constructor(options: { region: string }) {
    super(options);
    this.resourceType = "states:stateMachine";
    this.client = new SFNClient({ region: this.region });
  }

  async deleteResourceByArn(stateMachineArn: string) {
    try {
      console.log(`Deleting ${this.resourceType} with ARN: ${stateMachineArn}`);
      const command = new DeleteStateMachineCommand({
        stateMachineArn,
      });
      const response = await this.client.send(command);
      console.log(
        `${this.resourceType} ${stateMachineArn} deleted successfully`,
      );
    } catch (error: any) {
      console.error(
        `Error deleting ${this.resourceType} ${stateMachineArn}:`,
        error.message,
      );
    }
  }
}
