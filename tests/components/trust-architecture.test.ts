import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { trustFacts } from "../../src/config/trust";

const trustSources = [
  "src/app/method/page.tsx",
  "src/app/verification/page.tsx",
  "src/app/security/page.tsx",
  "src/components/trust/trust-page.tsx",
].map((path) => readFileSync(path, "utf8"));

describe("Trust architecture", () => {
  it("keeps every Trust narrative server-rendered", () => {
    for (const source of trustSources) expect(source).not.toMatch(/["']use client["']/);
    expect(trustSources.at(-1)).toContain('data-suppress-footer-cta="true"');
  });

  it("centralises the approved operating sequence and boundaries", () => {
    expect(trustFacts.operatingStages.map(({ name }) => name)).toEqual(["FIND", "VALIDATE", "ASSIGN", "CHANGE", "APPROVE", "VERIFY"]);
    expect(trustFacts.accessBoundary).toBe("tightly constrained read-only AWS access");
    expect(trustFacts.measurementView).toBe("30-day measurement view");
  });
});
