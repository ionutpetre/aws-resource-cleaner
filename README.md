# AWS Resource Cleaner 🧹

Clean up AWS resources by tag — easily from the CLI or programmatically.  
Perfect for deleting test/dev resources and keeping your AWS account tidy.

---

## 🚀 Features

- Delete AWS resources by tag key/value (e.g. `env=test`)
- Works via **CLI** or as an **importable Node.js module**
- Supports multiple AWS resource types
- Uses your existing AWS credentials (no extra setup)
- Ideal for cleaning up ephemeral or CI-created environments

---

## 🧭 CLI Usage

```bash
npx aws-resource-cleaner tag-name="env" tag-value="test" resource=s3
```

## 💻 Programmatic Usage

```js
import { getAwsResourcesByType } from "aws-resource-cleaner"
await deleteAwsResources('s3',  { 'env': ['test'] });
```
