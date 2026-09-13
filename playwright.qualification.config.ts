import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  testMatch: "**/gate-8b-qualification.spec.ts",
  fullyParallel: false,
  forbidOnly: Boolean(process.env.CI),
  retries: 0,
  timeout: 120_000,
  reporter: process.env.CI ? "github" : "list",
  outputDir: "test-results/gate-8b",
  use: {
    baseURL: "http://127.0.0.1:3113",
    colorScheme: "light",
    locale: "en-GB",
    trace: "retain-on-failure",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: {
    command: "pnpm start --hostname 127.0.0.1 --port 3113",
    env: {
      APP_ENVIRONMENT: "test",
      ENQUIRY_DESTINATION_ADDRESS: "private-destination-gate8b@example.test",
      ENQUIRY_TEST_MODE: "1",
    },
    reuseExistingServer: false,
    timeout: 120_000,
    url: "http://127.0.0.1:3113",
  },
});
