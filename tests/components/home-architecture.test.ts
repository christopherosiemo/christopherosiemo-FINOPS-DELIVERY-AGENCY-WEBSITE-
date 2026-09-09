import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

describe("homepage rendering architecture", () => {
  it("keeps homepage composition server-rendered", () => {
    const homeDirectory = join(process.cwd(), "src/components/home");
    const sources = [
      "src/app/page.tsx",
      ...readdirSync(homeDirectory)
        .filter((file) => file.endsWith(".tsx"))
        .map((file) => `src/components/home/${file}`),
    ];

    for (const source of sources) {
      expect(readFileSync(join(process.cwd(), source), "utf8")).not.toMatch(/^\s*["']use client["'];/m);
    }
  });
});
