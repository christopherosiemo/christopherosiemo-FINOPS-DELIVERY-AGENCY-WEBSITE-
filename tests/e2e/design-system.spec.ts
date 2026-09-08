import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test("internal specimen exposes accessible semantics and remains outside public navigation", async ({ page }) => {
  const runtimeErrors: string[] = [];
  page.on("pageerror", (error) => runtimeErrors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") runtimeErrors.push(message.text());
  });

  const response = await page.goto("/design-system");
  expect(response?.ok()).toBe(true);

  await expect(page).toHaveTitle(/Internal Design System/);
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /nofollow/);
  await expect(page.getByRole("heading", { level: 1, name: "MEASURED" })).toBeVisible();
  await expect(page.getByRole("navigation", { name: "Primary navigation" }).getByRole("link")).toHaveCount(2);
  await expect(page.getByRole("navigation", { name: "Primary navigation" }).getByRole("link", { name: /design system/i })).toHaveCount(0);

  await expect(page.getByRole("link", { name: "Start a Savings Sprint" })).toHaveAttribute("href", "/contact");
  await expect(page.getByRole("button", { name: "Inspect details" })).toBeEnabled();
  await expect(page.getByRole("button", { name: "Unavailable action" })).toBeDisabled();
  await expect(page.getByLabel("Reference name")).toHaveAttribute("aria-describedby", "specimen-reference-hint");
  await expect(page.getByLabel("Example identifier")).toHaveAttribute("aria-invalid", "true");

  const skipLink = page.getByRole("link", { name: "Skip to content" });
  await page.keyboard.press("Tab");
  await expect(skipLink).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.locator("#main-content")).toBeFocused();

  const focusButton = page.getByRole("button", { name: "Focusable button" });
  await focusButton.focus();
  const focusStyle = await focusButton.evaluate((element) => {
    const computed = getComputedStyle(element);
    return { offset: computed.outlineOffset, style: computed.outlineStyle, width: computed.outlineWidth };
  });
  expect(focusStyle.style).not.toBe("none");
  expect(Number.parseFloat(focusStyle.width)).toBeGreaterThanOrEqual(2);
  expect(Number.parseFloat(focusStyle.offset)).toBeGreaterThanOrEqual(2);

  const inverseLink = page.getByRole("link", { name: "Focusable link" });
  await inverseLink.focus();
  expect(await inverseLink.evaluate((element) => getComputedStyle(element).outlineColor)).toBe("rgb(255, 255, 255)");

  const accessibility = await new AxeBuilder({ page }).analyze();
  expect(accessibility.violations).toEqual([]);
  expect(runtimeErrors).toEqual([]);
});

test("normal motion preference enables the finite Verification Line demonstration", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/design-system");

  const animation = page.getByTestId("verification-line-animation").last();
  await expect(animation).toBeVisible();
  expect(await animation.evaluate((element) => getComputedStyle(element).animationName)).not.toBe("none");
  await expect(page.getByText("Expected £184,000 annualised. Verified £176,420 annualised. Illustrative only.").last()).toBeVisible();
});

test("reduced motion resolves the animated specimen without hiding meaning", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/design-system");

  const animation = page.getByTestId("verification-line-animation").last();
  await expect(animation).toBeVisible();
  await expect(page.getByText("Expected £184,000 annualised. Verified £176,420 annualised. Illustrative only.").last()).toBeVisible();
  expect(await animation.evaluate((element) => getComputedStyle(element).animationName)).toBe("none");
});

for (const viewport of [
  { width: 320, height: 700 },
  { width: 390, height: 844 },
  { width: 768, height: 1024 },
  { width: 1024, height: 768 },
  { width: 1440, height: 900 },
  { width: 1728, height: 1117 },
]) {
  test(`design system has no page overflow at ${viewport.width} × ${viewport.height}`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.goto("/design-system");
    const dimensions = await page.locator("html").evaluate((element) => ({
      clientWidth: element.clientWidth,
      scrollWidth: element.scrollWidth,
    }));
    expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.clientWidth);
  });
}

test("public homepage has no horizontal page overflow at 320px", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 700 });
  await page.goto("/");
  const dimensions = await page.locator("html").evaluate((element) => ({
    clientWidth: element.clientWidth,
    scrollWidth: element.scrollWidth,
  }));
  expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.clientWidth);
});
