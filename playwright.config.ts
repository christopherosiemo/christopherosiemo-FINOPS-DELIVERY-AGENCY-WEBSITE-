import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  testIgnore: ["**/visual.spec.ts", "**/engineering-quality.spec.ts", "**/cross-browser-smoke.spec.ts", "**/gate-8b-qualification.spec.ts"],
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: 0,
  reporter: process.env.CI
    ? [["github"], ["html", { open: "never", outputFolder: "playwright-report" }]]
    : "list",
  snapshotPathTemplate: "{testDir}/snapshots/{testFilePath}/{arg}{ext}",
  expect: {
    timeout: 15_000,
    toHaveScreenshot: {
      animations: "disabled",
      maxDiffPixelRatio: 0.002,
      threshold: 0.2,
    },
  },
  use: {
    baseURL: "http://127.0.0.1:3107",
    colorScheme: "light",
    locale: "en-GB",
    trace: "retain-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: {
    command: process.env.CI
      ? "pnpm start --hostname 127.0.0.1 --port 3107"
      : "pnpm dev --hostname 127.0.0.1 --port 3107",
    url: "http://127.0.0.1:3107",
    reuseExistingServer: false,
    timeout: 120_000,
    env: {
      APP_ENVIRONMENT: "test",
      ENQUIRY_TEST_MODE: "1",
    },
  },
});
