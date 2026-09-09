import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

describe("homepage rendering architecture", () => {
  it("keeps the narrative server-rendered behind one null-rendering client controller", () => {
    const homeDirectory = join(process.cwd(), "src/components/home");
    const serverSources = [
      "src/app/page.tsx",
      ...readdirSync(homeDirectory)
        .filter((file) => file.endsWith(".tsx"))
        .filter((file) => file !== "home-motion-controller.tsx")
        .map((file) => `src/components/home/${file}`),
    ];

    for (const source of serverSources) {
      expect(readFileSync(join(process.cwd(), source), "utf8")).not.toMatch(/^\s*["']use client["'];/m);
    }

    const controller = readFileSync(join(homeDirectory, "home-motion-controller.tsx"), "utf8");
    expect(controller).toMatch(/^"use client";/);
    expect(controller).toContain("return null");
    expect(readFileSync(join(process.cwd(), "src/app/page.tsx"), "utf8")).toContain("<HomeMotionController />");
  });
});
