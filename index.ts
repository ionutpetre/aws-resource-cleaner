import { AwsResourceType, deleteAwsResources, listAwsResources } from "./src";
export * from "./src";
import {
  getTagNameArg,
  getTagValueArg,
  getResourceTypeArg,
  isListModeArg,
} from "./args";

async function main() {
  const tagName = getTagNameArg();
  const tagValue = getTagValueArg();
  const tags = { [tagName]: [tagValue] };
  const resourceType = getResourceTypeArg();
  if (isListModeArg()) {
    await listAwsResources(resourceType as AwsResourceType, tags);
  } else {
    await deleteAwsResources(resourceType as AwsResourceType, tags);
  }
}

main();
