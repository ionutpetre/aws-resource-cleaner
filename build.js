import { build } from "esbuild";

await build({
  entryPoints: ["index.ts"],
  bundle: true,
  platform: "node",
  target: "node22",
  outfile: "index.js",
  banner: {
    js: "#!/usr/bin/env node",
  },
  minify: false,
});
