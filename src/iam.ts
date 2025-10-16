import {
  DeletePolicyCommand,
  DeleteRoleCommand,
  IAMClient,
  ListPoliciesCommand,
  ListPolicyTagsCommand,
  ListRolesCommand,
  ListRoleTagsCommand,
} from "@aws-sdk/client-iam";

import { AwsResource } from "./aws-resource";

export class IAMResource extends AwsResource {
  private client: IAMClient;

  constructor(options: { region: string }) {
    super(options);
    this.resourceTypes = ["iam:role", "iam:policy"];
    this.client = new IAMClient({ region: this.region });
  }

  async deletePolicyByArn(arn: string) {
    try {
      const command = new DeletePolicyCommand({
        PolicyArn: arn,
      });
      const response = await this.client.send(command);
      console.log(`${this.resourceTypes[1]} ${arn} deleted successfully`);
    } catch (error: any) {
      console.log(
        `Error deleting ${this.resourceTypes[1]} ${arn}:`,
        error.message,
      );
    }
  }

  async getPoliciesArnsByTags(
    tagFilters: Record<string, string[]>,
  ): Promise<string[]> {
    let policyArns: string[] = [];
    let marker;
    do {
      const command: ListPoliciesCommand = new ListPoliciesCommand(
        marker ? { Marker: marker } : {},
      );
      const response = await this.client.send(command);
      for (const policy of response.Policies || []) {
        if (
          policy.AttachmentCount !== undefined &&
          policy.AttachmentCount > 0
        ) {
          console.log(
            `Getting tags for ${policy.PolicyName} ${this.resourceTypes[1]}...`,
          );
          const tagsData = await this.client.send(
            new ListPolicyTagsCommand({
              PolicyArn: policy.Arn,
            }),
          );
          const matchesAllTags = Object.entries(tagFilters).every(
            ([key, values]) =>
              (tagsData.Tags || []).some(
                (tag) => tag.Key === key && values.includes(tag?.Value || ""),
              ),
          );
          if (matchesAllTags) {
            policyArns.push(policy.Arn || "");
          }
        }
      }
      marker = response.IsTruncated ? response.Marker : undefined;
    } while (marker);
    console.log(
      `Found total of ${policyArns.length} ${this.resourceTypes[1]}s.`,
    );
    return policyArns;
  }

  async getRoleArnsByTags(
    tagFilters: Record<string, string[]>,
  ): Promise<string[]> {
    let roleArns: string[] = [];

    let marker;
    do {
      const command: ListRolesCommand = new ListRolesCommand(
        marker ? { Marker: marker } : {},
      );
      const response = await this.client.send(command);
      for (const role of response.Roles || []) {
        console.log(
          `Getting tags for ${role.RoleName} ${this.resourceTypes[0]}...`,
        );
        const tagsData = await this.client.send(
          new ListRoleTagsCommand({
            RoleName: role.RoleName,
          }),
        );

        const matchesAllTags = Object.entries(tagFilters).every(
          ([key, values]) =>
            (tagsData.Tags || []).some(
              (tag) => tag.Key === key && values.includes(tag?.Value || ""),
            ),
        );

        if (matchesAllTags) {
          roleArns.push(role.Arn || "");
        }
      }
      marker = response.IsTruncated ? response.Marker : undefined;
    } while (marker);
    console.log(`Found total of ${roleArns.length} ${this.resourceTypes[0]}s.`);
    return roleArns;
  }

  async getResourceArnsByTags(tags: Record<string, string[]>) {
    return [
      ...(await this.getPoliciesArnsByTags(tags)),
      ...(await this.getRoleArnsByTags(tags)),
    ];
  }

  async deleteRoleByName(roleName: string) {
    try {
      const command = new DeleteRoleCommand({ RoleName: roleName });
      const response = await this.client.send(command);
      console.log(`${this.resourceTypes[0]} ${roleName} deleted successfully:`);
    } catch (error: any) {
      console.log(
        `Error deleting ${this.resourceTypes[0]} ${roleName}:`,
        error.message,
      );
    }
  }

  async deleteResourceByArn(arn: string) {
    if (arn.includes("policy")) {
      console.log(`Deleting ${this.resourceTypes[1]} with ARN: ${arn}`);
      await this.deletePolicyByArn(arn);
    }

    if (arn.includes("role")) {
      console.log(`Deleting ${this.resourceTypes[0]} with ARN: ${arn}`);
      const [, , , , , roleKey] = arn.split(":");
      const [, roleName] = roleKey.split("/");
      await this.deleteRoleByName(roleName);
    }
  }
}
