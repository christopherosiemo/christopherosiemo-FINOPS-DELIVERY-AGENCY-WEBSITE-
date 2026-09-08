import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: { "@": new URL("./src", import.meta.url).pathname },
  },
  test: {
    environment: "jsdom",
    include: ["tests/components/**/*.test.{ts,tsx}"],
    setupFiles: ["./tests/setup.ts"],
  },
});
