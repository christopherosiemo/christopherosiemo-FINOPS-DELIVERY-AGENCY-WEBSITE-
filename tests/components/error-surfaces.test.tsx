import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import ErrorPage from "@/app/error";
import NotFound from "@/app/not-found";

describe("production error surfaces", () => {
  it("renders a calm 404 with safe navigation and no fake error code", () => {
    const { unmount } = render(<NotFound />);
    expect(screen.getByRole("heading", { level: 1, name: "Page not found." })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Return to HKGpipi" })).toHaveAttribute("href", "/");
    expect(screen.queryByText(/error\s*code/i)).not.toBeInTheDocument();
    unmount();
  });

  it("offers recovery without exposing the exception, digest or stack", () => {
    const retry = vi.fn();
    const error = Object.assign(new Error("PRIVATE RUNTIME DETAIL"), {
      digest: "private-digest",
      stack: "PRIVATE STACK",
    });
    const { container, unmount } = render(<ErrorPage error={error} retry={retry} />);
    expect(screen.getByRole("heading", { level: 1, name: "Something went wrong." })).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Try again" }));
    expect(retry).toHaveBeenCalledOnce();
    expect(container).not.toHaveTextContent("PRIVATE RUNTIME DETAIL");
    expect(container).not.toHaveTextContent("private-digest");
    expect(container).not.toHaveTextContent("PRIVATE STACK");
    unmount();
  });
});
