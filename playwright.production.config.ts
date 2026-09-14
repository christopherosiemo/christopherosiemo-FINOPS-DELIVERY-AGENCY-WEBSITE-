import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  testMatch: "**/production-readiness.spec.ts",
  fullyParallel: false,
  forbidOnly: Boolean(process.env.CI),
  retries: 0,
  reporter: process.env.CI ? "github" : "list",
  outputDir: "test-results/gate-10a",
  use: {
    baseURL: "http://127.0.0.1:3115",
    colorScheme: "light",
    locale: "en-GB",
    trace: "retain-on-failure",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: {
    command: "pnpm build && pnpm start --hostname 127.0.0.1 --port 3115",
    env: {
      APP_ENVIRONMENT: "production",
      TURNSTILE_EXPECTED_HOSTNAME: "hkgpipi.com",
      TURNSTILE_SITE_KEY: "1x00000000000000000000AA",
    },
    reuseExistingServer: false,
    timeout: 180_000,
    url: "http://127.0.0.1:3115",
  },
});
