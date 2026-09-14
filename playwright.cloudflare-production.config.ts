import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  testMatch: "**/production-cf-headers.spec.ts",
  fullyParallel: false,
  forbidOnly: Boolean(process.env.CI),
  retries: 0,
  reporter: process.env.CI ? "github" : "list",
  outputDir: "test-results/production-cf-headers",
  use: {
    baseURL: "http://127.0.0.1:3116",
  },
  webServer: {
    command: "pnpm build:cf && pnpm exec wrangler dev --config dist/server/wrangler.json --port 3116 --local",
    reuseExistingServer: false,
    timeout: 180_000,
    url: "http://127.0.0.1:3116",
  },
});
