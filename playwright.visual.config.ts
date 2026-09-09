import { defineConfig } from "@playwright/test";
import baseConfig from "./playwright.config";

export default defineConfig({
  ...baseConfig,
  testIgnore: undefined,
  testMatch: "**/visual.spec.ts",
  webServer: {
    command: "pnpm start --hostname 127.0.0.1 --port 3107",
    env: { ENQUIRY_TEST_MODE: "1" },
    reuseExistingServer: false,
    timeout: 120_000,
    url: "http://127.0.0.1:3107",
  },
});
