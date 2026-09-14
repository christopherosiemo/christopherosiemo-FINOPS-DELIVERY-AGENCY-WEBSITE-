import { readFile, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import { spawnSync } from "node:child_process";

const args = process.argv.slice(2);
const envIndex = args.indexOf("--env");
const environment = envIndex >= 0 ? args[envIndex + 1] : undefined;
const dryRun = args.includes("--dry-run");
const supportedArgs = new Set(["--env", "--dry-run", "staging", "production"]);

if (!environment || !["staging", "production"].includes(environment) || args.some((arg) => !supportedArgs.has(arg))) {
  throw new Error("Usage: pnpm deploy:cf --env <staging|production> [--dry-run]");
}

const sourceConfigPath = path.resolve("wrangler.jsonc");
const artifactConfigPath = path.resolve("dist/server/wrangler.json");
const deployConfigPath = path.resolve("dist/server/wrangler.deploy.json");
const sourceConfig = JSON.parse(await readFile(sourceConfigPath, "utf8"));
const artifactConfig = JSON.parse(await readFile(artifactConfigPath, "utf8"));
const environmentConfig = sourceConfig.env?.[environment];

if (!environmentConfig?.name) {
  throw new Error(`Cloudflare environment ${environment} has no explicit Worker name.`);
}

const deployConfig = {
  ...artifactConfig,
  ...environmentConfig,
  main: artifactConfig.main,
  assets: artifactConfig.assets,
  no_bundle: true,
};
delete deployConfig.env;

await writeFile(deployConfigPath, `${JSON.stringify(deployConfig)}\n`, "utf8");

const wranglerCli = path.resolve("node_modules/wrangler/bin/wrangler.js");
const wranglerArgs = [wranglerCli, "deploy", "--config", deployConfigPath];
if (dryRun) wranglerArgs.push("--dry-run");

console.log(`Deploy target: ${environmentConfig.name}${dryRun ? " (dry run)" : ""}`);
try {
  const result = spawnSync(process.execPath, wranglerArgs, { stdio: "inherit" });
  if (result.error) throw result.error;
  if (result.status !== 0) process.exitCode = result.status ?? 1;
} finally {
  await unlink(deployConfigPath).catch(() => undefined);
}
