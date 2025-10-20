import { deleteAwsResources, listAwsResources } from "./src";
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
    await listAwsResources(resourceType, tags);
  } else {
    await deleteAwsResources(resourceType, tags);
  }
}

main();
