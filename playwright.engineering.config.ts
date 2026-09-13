import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  testMatch: "**/engineering-quality.spec.ts",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: 0,
  reporter: process.env.CI ? "github" : "list",
  outputDir: "test-results/engineering",
  use: {
    baseURL: "http://127.0.0.1:3111",
    colorScheme: "light",
    locale: "en-GB",
    trace: "retain-on-failure",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: {
    command: "pnpm start --hostname 127.0.0.1 --port 3111",
    env: {
      APP_ENVIRONMENT: "test",
      ENQUIRY_DESTINATION_ADDRESS: "private-destination-gate8a@example.test",
      ENQUIRY_TEST_MODE: "1",
    },
    reuseExistingServer: false,
    timeout: 120_000,
    url: "http://127.0.0.1:3111",
  },
});
