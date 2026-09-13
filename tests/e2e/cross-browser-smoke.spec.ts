import { expect, test, type Page } from "@playwright/test";

function collectRuntimeErrors(page: Page) {
  const errors: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  page.on("pageerror", (error) => errors.push(error.message));
  return errors;
}

test("core pages, mobile navigation and responsive structure remain resilient", async ({ page }) => {
  const errors = collectRuntimeErrors(page);
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  const trigger = page.getByRole("button", { name: "Open primary navigation" });
  await trigger.click();
  await expect(page.getByRole("dialog", { name: "Primary navigation" })).toBeVisible();
  await page.getByRole("button", { name: "Close" }).click();
  await expect(trigger).toBeFocused();
  await page.waitForLoadState("networkidle");

  for (const route of ["/savings-sprint", "/verification", "/security", "/privacy"]) {
    await page.goto(route);
    await page.waitForLoadState("networkidle");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(0);
  }
  expect(errors).toEqual([]);
});

test("the deterministic enquiry form supports native selection and truthful validation", async ({ page }) => {
  const errors = collectRuntimeErrors(page);
  await page.goto("/start");
  const select = page.getByLabel("Approximate monthly AWS spend (optional)");
  await select.selectOption("25k-100k");
  await expect(select).toHaveValue("25k-100k");
  const send = page.getByRole("button", { name: "Send enquiry" });
  await expect(send).toBeEnabled();
  await send.click();
  await expect(page.getByRole("heading", { name: "Check the following fields." })).toBeVisible();
  await expect(page.locator('[data-submission-result="success"]')).toHaveCount(0);
  await expect(select).toHaveValue("25k-100k");
  expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(0);
  expect(errors).toEqual([]);
});

test("unknown routes return a hard 404 with safe keyboard navigation", async ({ page }) => {
  const errors = collectRuntimeErrors(page);
  const response = await page.goto("/cross-browser-missing");
  expect(response?.status()).toBe(404);
  await expect(page.getByRole("heading", { level: 1, name: "Page not found." })).toBeVisible();
  const returnLink = page.getByRole("link", { name: "Return to HKGpipi" });
  await returnLink.focus();
  await expect(returnLink).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/\/$/);
  expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(0);
  expect(errors.filter((message) => message !== "Failed to load resource: the server responded with a status of 404 (Not Found)")).toEqual([]);
});
