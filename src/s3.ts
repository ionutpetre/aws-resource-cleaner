import {
  S3Client,
  DeleteBucketCommand,
  ListObjectsV2Command,
  DeleteObjectsCommand,
  ListObjectVersionsCommand,
} from "@aws-sdk/client-s3";

import { AwsResource } from "./aws-resource";

export class S3Resource extends AwsResource {
  private client: S3Client;

  constructor(options: { region: string }) {
    super(options);
    this.resourceType = "s3:bucket";
    this.client = new S3Client({ region: this.region });
  }

  async deleteResourceByArn(arn: string) {
    console.log(`Deleting ${this.resourceType} with ARN: ${arn}`);
    const bucket = arn.split(":::")[1];
    try {
      await this.deleteAllObjects(bucket);
      const command = new DeleteBucketCommand({ Bucket: bucket });
      const response = await this.client.send(command);
      console.log(`${this.resourceType} ${bucket} deleted successfully:`);
    } catch (error: any) {
      console.error(
        `Error deleting ${this.resourceType} ${bucket}:`,
        error.message,
      );
    }
  }

  async deleteAllObjects(bucket: string) {
    let continuationToken;
    do {
      const listCommand: ListObjectsV2Command = new ListObjectsV2Command({
        Bucket: bucket,
        ContinuationToken: continuationToken,
      });

      const listResponse = await this.client.send(listCommand);
      const objects =
        listResponse.Contents?.map((obj) => ({
          Key: obj.Key,
        })) || [];

      if (objects.length > 0) {
        const deleteCommand = new DeleteObjectsCommand({
          Bucket: bucket,
          Delete: { Objects: objects },
        });

        const deleteResponse = await this.client.send(deleteCommand);
        console.log(
          `Deleted ${deleteResponse.Deleted?.length || 0} ${this.resourceType} objects`,
        );
      }
      continuationToken = listResponse.IsTruncated
        ? listResponse.NextContinuationToken
        : undefined;
    } while (continuationToken);

    const versionsData = await this.client.send(
      new ListObjectVersionsCommand({ Bucket: bucket }),
    );
    const objectsToDelete = [];
    if (versionsData.Versions) {
      for (const version of versionsData.Versions) {
        objectsToDelete.push({
          Key: version.Key,
          VersionId: version.VersionId,
        });
      }
    }

    if (versionsData.DeleteMarkers) {
      for (const marker of versionsData.DeleteMarkers) {
        objectsToDelete.push({ Key: marker.Key, VersionId: marker.VersionId });
      }
    }

    if (objectsToDelete.length > 0) {
      const deleteRes = await this.client.send(
        new DeleteObjectsCommand({
          Bucket: bucket,
          Delete: { Objects: objectsToDelete },
        }),
      );
      console.log(
        `Deleted ${deleteRes.Deleted?.length || 0} ${this.resourceType} objects`,
      );
    }
  }
}
