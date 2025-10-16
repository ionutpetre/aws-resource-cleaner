import {
  CloudWatchLogsClient,
  DescribeLogStreamsCommand,
  DeleteLogStreamCommand,
  DeleteLogGroupCommand,
} from "@aws-sdk/client-cloudwatch-logs";

import { AwsResource } from "./aws-resource";

export class CloudWatchResource extends AwsResource {
  private client: CloudWatchLogsClient;

  constructor(options: { region: string }) {
    super(options);
    this.resourceType = "logs:log-group";
    this.client = new CloudWatchLogsClient({ region: this.region });
  }

  async getLogStreams(logGroupName: string) {
    try {
      const describeCommand = new DescribeLogStreamsCommand({
        logGroupName,
      });
      const { logStreams = [] } = await this.client.send(describeCommand);
      console.log(
        `Found ${logStreams.length} log streams in log group ${logGroupName}`,
      );
      return logStreams;
    } catch (error: any) {
      console.error(
        `Error describing log streams for ${logGroupName}:`,
        error.message,
      );
      return [];
    }
  }

  async deleteLogStream(logGroupName: string, logStreamName: string) {
    try {
      const deleteCommand = new DeleteLogStreamCommand({
        logGroupName,
        logStreamName,
      });
      await this.client.send(deleteCommand);
      console.log(`Deleted stream: ${logStreamName}`);
    } catch (error: any) {
      console.error(
        `Error deleting log stream ${logStreamName}:`,
        error.message,
      );
    }
  }

  async deleteLogGroup(logGroupName: string) {
    try {
      const command = new DeleteLogGroupCommand({ logGroupName });
      await this.client.send(command);
      console.log("Log group deleted successfully.");
    } catch (error: any) {
      console.error("Error deleting log group:", error.message);
    }
  }

  async deleteResourceByArn(arn: string) {
    console.log(`Deleting ${this.resourceType} with ARN: ${arn}`);
    const [, , , , , , logGroupName] = arn.split(":");
    const logStreams = await this.getLogStreams(logGroupName);
    for (const stream of logStreams) {
      await this.deleteLogStream(logGroupName, stream.logStreamName || "");
    }
    await this.deleteLogGroup(logGroupName);
  }
}
