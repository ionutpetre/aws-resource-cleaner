import {
  ResourceGroupsTaggingAPIClient,
  GetResourcesCommand,
} from "@aws-sdk/client-resource-groups-tagging-api";

export class AwsResource {
  protected region: string;
  protected resourceType: string = "";
  protected resourceTypes: string[] = [];
  protected rgtClient: ResourceGroupsTaggingAPIClient;

  constructor({ region }: { region: string }) {
    if (this.constructor == AwsResource) {
      throw new Error("AwsResource classes can't be instantiated.");
    }
    this.region = region;
    this.rgtClient = new ResourceGroupsTaggingAPIClient({ region });
  }

  private getResourceTypeFilters(): string[] {
    let resourceTypeFilters: string[] = [];
    if (this.resourceType) {
      resourceTypeFilters.push(this.resourceType);
    }
    if (this.resourceTypes) {
      resourceTypeFilters = [...this.resourceTypes];
    }
    return resourceTypeFilters;
  }

  async getResourceArnsByTags(
    tags: Record<string, string[]>,
  ): Promise<string[]> {
    let paginationToken;
    let resourceArns: string[] = [];
    do {
      const command: GetResourcesCommand = new GetResourcesCommand({
        ResourceTypeFilters: this.getResourceTypeFilters(),
        TagFilters: Object.entries(tags).map(([Key, Values]) => ({
          Key,
          Values,
        })),
        PaginationToken: paginationToken,
      });
      const response = await this.rgtClient.send(command);
      const currRsourceArns = (response.ResourceTagMappingList || []).map(
        (resource) => resource.ResourceARN || "",
      );
      resourceArns = [...resourceArns, ...currRsourceArns];
      paginationToken = response.PaginationToken;
    } while (paginationToken);
    console.log(
      `Found ${resourceArns.length} ${this.resourceType ?? this.resourceTypes}s for the provided tags:`,
      JSON.stringify(tags),
    );
    return resourceArns;
  }

  async deleteResourceByArn(arn: string) {
    throw new Error("Method 'deleteResourceByArn()' must be implemented.");
  }

  async deleteResourcesByTags(tags: Record<string, string[]>) {
    const resourceArns = await this.getResourceArnsByTags(tags);
    for (const arn of resourceArns) {
      await this.deleteResourceByArn(arn);
    }
  }
}
