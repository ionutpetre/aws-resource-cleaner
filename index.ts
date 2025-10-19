import { deleteAwsResources } from "./src";

function getTagNameArg() {
  const tagNameArg = process.argv.find((arg) => arg.startsWith("tag-name="));
  if (!tagNameArg) {
    throw new Error("tag-name argument is required");
  }
  return tagNameArg.split("=")[1];
}

function getTagValueArg() {
  const tagValueArg = process.argv.find((arg) => arg.startsWith("tag-value="));
  if (!tagValueArg) {
    throw new Error("tag-value argument is required");
  }
  return tagValueArg.split("=")[1];
}

function getResourceTypeArg() {
  const resourceArg = process.argv.find((arg) => arg.startsWith("resource="));
  return resourceArg ? resourceArg.split("=")[1] : "all";
}

async function main() {
  const tagName = getTagNameArg();
  const tagValue = getTagValueArg();
  const tags = { [tagName]: [tagValue] };
  const resourceType = getResourceTypeArg();
  await deleteAwsResources(resourceType, tags);
}

main();
