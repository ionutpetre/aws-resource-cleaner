import { DeleteSecurityGroupCommand, EC2Client } from "@aws-sdk/client-ec2";

import { AwsResource } from "./aws-resource";

export class EC2Resource extends AwsResource {
  private client: EC2Client;

  constructor(options: { region: string }) {
    super(options);
    this.resourceType = "ec2:security-group";
    this.client = new EC2Client({ region: this.region });
  }

  async deleteResourceByArn(arn: string) {
    console.log(`Deleting ${this.resourceType} with ARN: ${arn}`);
    const [, , , , , sgKey] = arn.split(":");
    const [, sgId] = sgKey.split("/");
    console.log(sgId);

    try {
      const command = new DeleteSecurityGroupCommand({
        GroupId: sgId,
      });
      const response = await this.client.send(command);
      console.log(`${this.resourceType} ${arn} deleted successfully:`);
    } catch (error: any) {
      console.error(
        `Error deleting ${this.resourceType} ${arn}:`,
        error.message,
      );
    }
  }
}
