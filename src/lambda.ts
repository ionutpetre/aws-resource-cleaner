import { LambdaClient, DeleteFunctionCommand } from "@aws-sdk/client-lambda";

import { AwsResource } from "./aws-resource";

export class LambdaResource extends AwsResource {
  private client: LambdaClient;

  constructor(options: { region: string }) {
    super(options);
    this.resourceType = "lambda:function";
    this.client = new LambdaClient({ region: this.region });
  }

  async deleteResourceByArn(arn: string) {
    console.log(`Deleting ${this.resourceType} with ARN: ${arn}`);
    const [, , , , , , functionName] = arn.split(":");
    try {
      const command = new DeleteFunctionCommand({ FunctionName: functionName });
      const response = await this.client.send(command);
      console.log(`${this.resourceType} ${functionName} deleted successfully:`);
    } catch (error: any) {
      console.error(
        `Error deleting ${this.resourceType} ${functionName}:`,
        error.message,
      );
    }
  }
}
