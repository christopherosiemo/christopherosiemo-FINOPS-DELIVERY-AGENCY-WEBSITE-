import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Button, DirectionalLink } from "../../src/components/ui/actions";
import { StatusBadge } from "../../src/components/ui/status-badge";
import { TextField } from "../../src/components/ui/text-field";

describe("design primitives", () => {
  it("preserves button and navigation semantics", () => {
    render(<><Button disabled>Unavailable</Button><DirectionalLink href="/contact">Continue</DirectionalLink></>);
    expect(screen.getByRole("button", { name: "Unavailable" })).toBeDisabled();
    expect(screen.getByRole("link", { name: /Continue/ })).toHaveAttribute("href", "/contact");
  });

  it("associates field labels, descriptions, and non-colour error meaning", () => {
    render(<TextField id="reference" label="Reference" error="Enter a reference." />);
    const input = screen.getByLabelText("Reference");
    expect(input).toHaveAccessibleDescription("Enter a reference.");
    expect(input).toHaveAttribute("aria-invalid", "true");
  });

  it("always renders readable status text", () => {
    render(<StatusBadge status="Verified" />);
    expect(screen.getByText("Verified")).toBeVisible();
  });
});
