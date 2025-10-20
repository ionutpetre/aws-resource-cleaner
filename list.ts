import { listAwsResources } from "./src";
import { getTagNameArg, getTagValueArg, getResourceTypeArg } from "./args";

async function main() {
  const tagName = getTagNameArg();
  const tagValue = getTagValueArg();
  const tags = { [tagName]: [tagValue] };
  const resourceType = getResourceTypeArg();
  await listAwsResources(resourceType, tags);
}

main();
