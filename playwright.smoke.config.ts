import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  testMatch: "**/cross-browser-smoke.spec.ts",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: 0,
  reporter: process.env.CI ? "github" : "list",
  outputDir: "test-results/cross-browser",
  use: {
    baseURL: "https://127.0.0.1:3112",
    colorScheme: "light",
    locale: "en-GB",
    trace: "retain-on-failure",
    ignoreHTTPSErrors: true,
    viewport: { width: 390, height: 844 },
  },
  projects: [
    { name: "chromium-390", use: { ...devices["Desktop Chrome"], viewport: { width: 390, height: 844 } } },
    { name: "chromium-1440", use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 900 } } },
    { name: "firefox-390", use: { ...devices["Desktop Firefox"], viewport: { width: 390, height: 844 } } },
    { name: "firefox-1440", use: { ...devices["Desktop Firefox"], viewport: { width: 1440, height: 900 } } },
    { name: "webkit-390", use: { ...devices["Desktop Safari"], viewport: { width: 390, height: 844 } } },
    { name: "webkit-1440", use: { ...devices["Desktop Safari"], viewport: { width: 1440, height: 900 } } },
  ],
  webServer: {
    command: "pnpm build:cf && pnpm exec wrangler dev --config dist/server/wrangler.json --port 3112 --local --local-protocol https --var APP_ENVIRONMENT:test --var ENQUIRY_TEST_MODE:1",
    ignoreHTTPSErrors: true,
    reuseExistingServer: false,
    timeout: 120_000,
    url: "https://127.0.0.1:3112",
  },
});
