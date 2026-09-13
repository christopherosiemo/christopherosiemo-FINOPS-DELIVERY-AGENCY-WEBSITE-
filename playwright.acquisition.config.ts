import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  testMatch: "**/acquisition.spec.ts",
  fullyParallel: false,
  forbidOnly: Boolean(process.env.CI),
  retries: 0,
  reporter: process.env.CI ? "github" : "list",
  outputDir: "test-results/gate-9a",
  use: {
    baseURL: "http://127.0.0.1:3114",
    colorScheme: "light",
    locale: "en-GB",
    trace: "retain-on-failure",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: {
    command: "pnpm dev --hostname 127.0.0.1 --port 3114",
    env: {
      APP_ENVIRONMENT: "production",
      TURNSTILE_EXPECTED_HOSTNAME: "hkgpipi.com",
    },
    reuseExistingServer: false,
    timeout: 120_000,
    url: "http://127.0.0.1:3114",
  },
});
