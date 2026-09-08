import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { SiteHeader } from "../../src/components/site/site-header";

vi.mock("next/navigation", () => ({ usePathname: () => "/verification" }));

describe("SiteHeader", () => {
  it("exposes a labelled primary navigation", () => {
    render(<SiteHeader />);

    expect(screen.getByRole("navigation", { name: "Primary navigation" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Cloud Margin Recovery home" })).toHaveAttribute("href", "/");
    expect(screen.getByRole("navigation", { name: "Primary navigation" }).querySelectorAll("a")).toHaveLength(6);
    expect(screen.getByRole("link", { name: "Verification" })).toHaveAttribute("aria-current", "page");
    expect(screen.queryByRole("link", { name: "Home" })).not.toBeInTheDocument();
  });
});
