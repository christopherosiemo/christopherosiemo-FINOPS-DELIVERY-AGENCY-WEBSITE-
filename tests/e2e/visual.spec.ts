import { expect, test } from "@playwright/test";

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
    await expect(page).toHaveScreenshot(`${viewport.name}.png`, {
      animations: "disabled",
      caret: "initial",
      fullPage: true,
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
