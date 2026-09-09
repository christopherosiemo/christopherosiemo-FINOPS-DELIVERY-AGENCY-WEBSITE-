import { expect, test } from "@playwright/test";
import { settleHomepageMotion } from "./helpers/home-motion";

const designSystemViewports = [
  { name: "design-system-390x844", width: 390, height: 844 },
  { name: "design-system-768x1024", width: 768, height: 1024 },
  { name: "design-system-1440x900", width: 1440, height: 900 },
  { name: "design-system-1728x1117", width: 1728, height: 1117 },
];

for (const viewport of designSystemViewports) {
  test(`${viewport.name} visual baseline`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.goto("/design-system");
    await page.evaluate(() => document.fonts.ready);
    await expect(page).toHaveScreenshot(`${viewport.name}.png`, {
      animations: "disabled",
      caret: "initial",
      fullPage: true,
    });
  });
}

for (const viewport of [
  { name: "homepage-390x844", width: 390, height: 844 },
  { name: "homepage-1440x900", width: 1440, height: 900 },
]) {
  test(`${viewport.name} review baseline`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.goto("/");
    await page.evaluate(() => document.fonts.ready);
    await settleHomepageMotion(page);
    await expect(page).toHaveScreenshot(`${viewport.name}.png`, {
      animations: "disabled",
      caret: "initial",
      fullPage: true,
    });
  });
}

for (const [name, selector] of [
  ["homepage-hero-ledger", "section[aria-labelledby='page-title']"],
  ["homepage-method", "section[aria-labelledby='method-sequence']"],
  ["homepage-remediation", "section[aria-labelledby='remediation-evidence']"],
  ["homepage-verification", "section[aria-labelledby='verification-evidence']"],
  ["homepage-engagement", "section[aria-labelledby='engagement-path']"],
] as const) {
  test(`${name} high-signal homepage baseline`, async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/");
    await page.evaluate(() => document.fonts.ready);
    await settleHomepageMotion(page);
    await page.evaluate(() => (document.activeElement as HTMLElement | null)?.blur());
    await expect(page.locator(selector)).toHaveScreenshot(`${name}.png`, {
      animations: "disabled",
      caret: "initial",
    });
  });
}

test("homepage-hero-ledger-1280 high-signal homepage baseline", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto("/");
  await page.evaluate(() => document.fonts.ready);
  await settleHomepageMotion(page);
  await expect(page.locator("section[aria-labelledby='page-title']")).toHaveScreenshot(
    "homepage-hero-ledger-1280.png",
    { animations: "disabled", caret: "initial" },
  );
});

for (const viewport of [
  { name: "homepage-engagement-footer-390", width: 390, height: 844 },
  { name: "homepage-engagement-footer-1440", width: 1440, height: 900 },
]) {
  test(`${viewport.name} focused transition baseline`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.goto("/");
    await page.evaluate(() => document.fonts.ready);
    await settleHomepageMotion(page);
    await page.evaluate(() => (document.activeElement as HTMLElement | null)?.blur());
    await page.addStyleTag({
      content: "body > header, .skip-link { visibility: hidden !important; }",
    });
    await page.evaluate(() => {
      const actions = document.querySelector("[data-engagement-actions]")!;
      window.scrollTo({ top: actions.getBoundingClientRect().top + window.scrollY - 64 });
    });
    await expect(page).toHaveScreenshot(`${viewport.name}.png`, {
      animations: "disabled",
      caret: "initial",
    });
  });
}

test("high-signal design primitives", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/design-system");
  await page.evaluate(() => document.fonts.ready);

  for (const [name, specimen] of [
    ["controls", page.getByTestId("control-specimen")],
    ["financial-typography", page.getByTestId("financial-typography-specimen")],
    ["savings-ledger", page.getByTestId("savings-ledger-specimen")],
    ["verification-line", page.getByTestId("verification-line-specimen").first()],
  ] as const) {
    await expect(specimen).toHaveScreenshot(`${name}.png`, {
      animations: "disabled",
      caret: "initial",
    });
  }
});

for (const viewport of [
  { name: "homepage-top-1440x900", width: 1440, height: 900 },
  { name: "homepage-top-390x844", width: 390, height: 844 },
]) {
  test(`${viewport.name} shell review baseline`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.goto("/");
    await page.evaluate(() => document.fonts.ready);
    await settleHomepageMotion(page);
    await expect(page).toHaveScreenshot(`${viewport.name}.png`, {
      animations: "disabled",
      caret: "initial",
    });
  });
}

for (const viewport of [
  { name: "mobile-menu-open-390x844", width: 390, height: 844 },
  { name: "tablet-menu-open-768x1024", width: 768, height: 1024 },
]) {
  test(`${viewport.name} shell review baseline`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.goto("/");
    await settleHomepageMotion(page);
    await page.getByRole("button", { name: "Open primary navigation" }).click();
    await page.evaluate(() => document.fonts.ready);
    await expect(page).toHaveScreenshot(`${viewport.name}.png`, {
      animations: "disabled",
      caret: "initial",
    });
  });
}

for (const viewport of [
  { name: "desktop-footer-1440", width: 1440, height: 900 },
  { name: "mobile-footer-390", width: 390, height: 844 },
]) {
  test(`${viewport.name} shell review baseline`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.goto("/");
    await page.evaluate(() => document.fonts.ready);
    await settleHomepageMotion(page);
    if (viewport.width < 768) {
      await page.addStyleTag({
        content: "body > header, .skip-link { visibility: hidden !important; }",
      });
    }
    await expect(page.getByRole("contentinfo")).toHaveScreenshot(`${viewport.name}.png`, {
      animations: "disabled",
      caret: "initial",
    });
  });
}
