import { describe, expect, it } from "vitest";
import { commercialFacts } from "@/config/commercial";

describe("commercial facts", () => {
  it("keeps the approved offer values exact", () => {
    expect(commercialFacts).toEqual({
      savingsSprint: { name: "14-Day AWS Savings Sprint", price: "£5,000", qualifier: "upfront" },
      fixedImplementation: { name: "Implementation Sprint", price: "£15,000" },
      outcomeImplementation: { name: "Outcome-based implementation", price: "25%", qualifier: "of verified savings" },
    });
  });
});
