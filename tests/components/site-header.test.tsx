import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SiteHeader } from "../../src/components/site/site-header";

describe("SiteHeader", () => {
  it("exposes a labelled primary navigation", () => {
    render(<SiteHeader />);

    expect(screen.getByRole("navigation", { name: "Primary navigation" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Cloud Margin Recovery home" })).toHaveAttribute("href", "/");
  });
});
