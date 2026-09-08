import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const publicScaffolds = [
  "/method",
  "/savings-sprint",
  "/implementation",
  "/verification",
  "/security",
  "/pricing",
  "/start",
  "/contact",
];

test("desktop shell exposes the approved navigation and footer architecture", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");

  const header = page.locator("header");
  const primary = header.getByRole("navigation", { name: "Primary navigation" });
  await expect(primary.getByRole("link")).toHaveCount(6);
  await expect(primary.getByRole("link", { name: "Home" })).toHaveCount(0);
  await expect(header.getByRole("link", { name: "Cloud Margin Recovery home" })).toHaveAttribute("href", "/");
  await expect(header.getByRole("link", { name: "Start a Savings Sprint" })).toHaveAttribute("href", "/start");

  const footer = page.getByRole("contentinfo");
  await expect(footer).toContainText("Engagements");
  await expect(footer).toContainText("Method");
  await expect(footer).toContainText("Contact");
  await expect(footer.getByRole("link", { name: "Contact" })).toHaveAttribute("href", "/contact");
  await expect(footer).not.toContainText("Verification methodology: TBD.");
  await expect(page.getByRole("link", { name: /design system/i })).toHaveCount(0);
});

for (const [path, activeLabel] of [
  ["/", null],
  ["/method", "Method"],
  ["/verification", "Verification"],
  ["/pricing", "Pricing"],
] as const) {
  test(`active-route semantics on ${path}`, async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(path);
    const primary = page.locator("header").getByRole("navigation", { name: "Primary navigation" });
    await expect(primary.locator('[aria-current="page"]')).toHaveCount(activeLabel ? 1 : 0);
    if (activeLabel) await expect(primary.getByRole("link", { name: activeLabel })).toHaveAttribute("aria-current", "page");
    await expect(page.getByRole("link", { name: "Cloud Margin Recovery home" })).not.toHaveAttribute(
      "aria-current",
      "page",
    );
  });
}

for (const path of publicScaffolds) {
  test(`${path} is a live, non-indexed route scaffold`, async ({ page }) => {
    const response = await page.goto(path);
    expect(response?.status()).toBe(200);
    await expect(page.locator('main[data-route-stage="scaffold"]')).toHaveCount(1);
    await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /nofollow/);
  });
}

test("mobile dialog is modal, keyboard operable, and returns focus", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/verification");

  const trigger = page.getByRole("button", { name: "Open primary navigation" });
  await expect(trigger).toHaveAttribute("aria-controls", "primary-navigation-dialog");
  await expect(trigger).toHaveAttribute("aria-expanded", "false");
  await trigger.click();
  await expect(trigger).toHaveAttribute("aria-expanded", "true");

  const dialog = page.getByRole("dialog", { name: "Primary navigation" });
  await expect(dialog).toBeVisible();
  await expect(dialog).toHaveJSProperty("open", true);
  await expect(dialog.getByRole("button", { name: "Close" })).toBeFocused();
  await expect(dialog.getByRole("link", { name: "Verification" })).toHaveAttribute("aria-current", "page");

  for (let index = 0; index < 12; index += 1) await page.keyboard.press("Tab");
  expect(await page.evaluate(() => document.querySelector("dialog")?.contains(document.activeElement))).toBe(true);

  await page.keyboard.press("Escape");
  await expect(dialog).not.toBeVisible();
  await expect(trigger).toBeFocused();
  await expect(trigger).toHaveAttribute("aria-expanded", "false");

  await trigger.click();
  await dialog.getByRole("button", { name: "Close" }).click();
  await expect(dialog).not.toBeVisible();
  await expect(trigger).toBeFocused();
});

test("sticky header preserves skip-link destination and visible focus", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  const skipLink = page.getByRole("link", { name: "Skip to content" });
  await page.keyboard.press("Tab");
  await expect(skipLink).toBeFocused();
  expect(await skipLink.evaluate((element) => getComputedStyle(element).outlineStyle)).not.toBe("none");
  await page.keyboard.press("Enter");
  const main = page.locator("#main-content");
  await expect(main).toBeFocused();
  const positions = await page.evaluate(() => ({
    headerBottom: document.querySelector("header")!.getBoundingClientRect().bottom,
    mainTop: document.querySelector("main")!.getBoundingClientRect().top,
    scrollPaddingTop: Number.parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop),
  }));
  expect(positions.mainTop).toBeGreaterThanOrEqual(positions.headerBottom);
  expect(positions.scrollPaddingTop).toBeGreaterThan(positions.headerBottom);
});

test("reduced motion keeps the mobile menu immediately usable", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.getByRole("button", { name: "Open primary navigation" }).click();
  const dialog = page.getByRole("dialog", { name: "Primary navigation" });
  await expect(dialog).toBeVisible();
  expect(Number.parseFloat(await dialog.evaluate((element) => getComputedStyle(element).transitionDuration))).toBeLessThanOrEqual(
    0.01,
  );
});

for (const viewport of [
  { width: 320, height: 700 },
  { width: 390, height: 844 },
  { width: 768, height: 1024 },
  { width: 1024, height: 768 },
  { width: 1280, height: 800 },
  { width: 1440, height: 900 },
  { width: 1728, height: 1117 },
]) {
  test(`shell has no horizontal overflow at ${viewport.width} × ${viewport.height}`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.goto("/pricing");
    const dimensions = await page.locator("html").evaluate((element) => ({
      clientWidth: element.clientWidth,
      scrollWidth: element.scrollWidth,
    }));
    expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.clientWidth);
    if (viewport.width < 1280) {
      await page.getByRole("button", { name: "Open primary navigation" }).click();
      await expect(page.getByRole("dialog", { name: "Primary navigation" })).toBeVisible();
    }
  });
}

test("homepage, scaffold, and open dialog have no detectable Axe violations", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  for (const path of ["/", "/method"]) {
    await page.goto(path);
    expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  }
  await page.getByRole("button", { name: "Open primary navigation" }).click();
  const dialog = page.getByRole("dialog", { name: "Primary navigation" });
  await expect(dialog).toHaveCSS("opacity", "1");
  expect((await new AxeBuilder({ page }).include("dialog").analyze()).violations).toEqual([]);
});
