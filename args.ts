export function getTagNameArg() {
  const tagNameArg = process.argv.find((arg) => arg.startsWith("tag-name="));
  if (!tagNameArg) {
    throw new Error("tag-name argument is required");
  }
  return tagNameArg.split("=")[1];
}

export function getTagValueArg() {
  const tagValueArg = process.argv.find((arg) => arg.startsWith("tag-value="));
  if (!tagValueArg) {
    throw new Error("tag-value argument is required");
  }
  return tagValueArg.split("=")[1];
}

export function getResourceTypeArg() {
  const resourceArg = process.argv.find((arg) => arg.startsWith("resource="));
  return resourceArg ? resourceArg.split("=")[1] : "all";
}

export function isListModeArg() {
  const listArg = process.argv.find((arg) => arg.startsWith("list="));
  return listArg ? true : false;
}
