import {
  DeleteClusterCommand,
  DeregisterTaskDefinitionCommand,
  ECSClient,
} from "@aws-sdk/client-ecs";

import { AwsResource } from "./aws-resource";

export class ECSResource extends AwsResource {
  private client: ECSClient;

  constructor(options: { region: string }) {
    super(options);
    this.resourceTypes = ["ecs:cluster", "ecs:task-definition"];
    this.client = new ECSClient({ region: this.region });
  }

  async deleteTaskDefinition(arn: string) {
    try {
      console.log(`Deleting ${this.resourceTypes[0]} with ARN: ${arn}`);
      const command = new DeregisterTaskDefinitionCommand({
        taskDefinition: arn,
      });
      const response = await this.client.send(command);
      console.log(`${this.resourceTypes[0]} ${arn} deleted successfully`);
      console.log(response?.taskDefinition?.taskDefinitionArn);
    } catch (error: any) {
      console.error(
        `Error deleting ${this.resourceTypes[0]} ${arn}:`,
        error.message,
      );
    }
  }

  async deleteCluster(arn: string) {
    try {
      console.log(`Deleting ${this.resourceTypes[1]} with ARN: ${arn}`);
      const command = new DeleteClusterCommand({
        cluster: arn,
      });
      const response = await this.client.send(command);
      console.log(`${this.resourceTypes[1]} ${arn} deleted successfully`);
    } catch (error: any) {
      console.error(
        `Error deleting ${this.resourceTypes[1]} ${arn}:`,
        error.message,
      );
    }
  }

  async deleteResourceByArn(arn: string) {
    if (arn.includes("task-definition")) {
      await this.deleteTaskDefinition(arn);
    }
    if (arn.includes("cluster")) {
      await this.deleteCluster(arn);
    }
  }
}
