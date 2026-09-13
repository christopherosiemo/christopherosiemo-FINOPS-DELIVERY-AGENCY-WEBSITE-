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
    baseURL: "http://127.0.0.1:3112",
    colorScheme: "light",
    locale: "en-GB",
    trace: "retain-on-failure",
    viewport: { width: 390, height: 844 },
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"], viewport: { width: 390, height: 844 } } },
    { name: "firefox", use: { ...devices["Desktop Firefox"], viewport: { width: 390, height: 844 } } },
    { name: "webkit", use: { ...devices["Desktop Safari"], viewport: { width: 390, height: 844 } } },
  ],
  webServer: {
    command: "pnpm start --hostname 127.0.0.1 --port 3112",
    env: { APP_ENVIRONMENT: "test", ENQUIRY_TEST_MODE: "1" },
    reuseExistingServer: false,
    timeout: 120_000,
    url: "http://127.0.0.1:3112",
  },
});
