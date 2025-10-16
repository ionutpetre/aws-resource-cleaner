import {
  AppConfigClient,
  DeleteEnvironmentCommand,
  GetApplicationCommand,
  GetEnvironmentCommand,
} from "@aws-sdk/client-appconfig";

import { AwsResource } from "./aws-resource";

export class AppConfigResource extends AwsResource {
  private client: AppConfigClient;

  constructor(options: { region: string }) {
    super(options);
    this.resourceType = "appconfig:application";
    this.client = new AppConfigClient({ region: this.region });
  }

  async deleteEnvironment(appId: string, envId: string) {
    try {
      const command = new DeleteEnvironmentCommand({
        ApplicationId: appId,
        EnvironmentId: envId,
      });
      const response = await this.client.send(command);
      console.log(
        `${this.resourceType} Environment ${envId} deleted successfully`,
      );
    } catch (error: any) {
      console.error(
        `Error deleting ${this.resourceType} Environment ${name}:`,
        error.message,
      );
    }
  }

  async getApplicationName(appId: string) {
    try {
      const command = new GetApplicationCommand({
        ApplicationId: appId,
      });
      const response = await this.client.send(command);
      return response.Name;
    } catch (error) {
      // console.error("Error getting Application:", error.message);
      return null;
    }
  }

  async getEnvironmentName(appId: string, envId: string) {
    try {
      const command = new GetEnvironmentCommand({
        ApplicationId: appId,
        EnvironmentId: envId,
      });
      const response = await this.client.send(command);
      return response.Name;
    } catch (error) {
      // console.error("Error getting Environment:", error.message);
      return null;
    }
  }

  async deleteResourceByArn(arn: string) {
    const [, , , , , appKey] = arn.split(":");
    const [, appId, , envId] = appKey.split("/");
    const appName = await this.getApplicationName(appId);
    if (!appName) {
      console.log(`Application with id ${appId} not found. Skipping...`);
      return;
    }
    const envName = await this.getEnvironmentName(appId, envId);
    if (!envName) {
      console.log(
        `Environment with id ${envId} not found in Application ${appName}. Skipping...`,
      );
      return;
    }
    await this.deleteEnvironment(appId, envId);
  }
}
