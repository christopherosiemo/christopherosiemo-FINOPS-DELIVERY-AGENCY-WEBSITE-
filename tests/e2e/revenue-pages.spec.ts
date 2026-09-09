import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const responsiveMatrix = [
  { width: 320, height: 700 },
  { width: 390, height: 844 },
  { width: 768, height: 1024 },
  { width: 1024, height: 768 },
  { width: 1280, height: 800 },
  { width: 1440, height: 900 },
  { width: 1728, height: 1117 },
];

const revenueRoutes = ["/savings-sprint", "/implementation", "/pricing"] as const;

test("Savings Sprint explains scope, sequence, deliverable and boundaries", async ({ page }) => {
  await page.goto("/savings-sprint");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Find what is worth changing in 14 days.");
  await expect(page.getByText("£5,000").first()).toBeVisible();
  await expect(page.getByText("upfront").first()).toBeVisible();
  await expect(page.getByText("14-Day AWS Savings Sprint").first()).toBeVisible();
  await expect(page.getByRole("link", { name: "Start a Savings Sprint" }).first()).toHaveAttribute("href", "/start");
  await expect(page.getByRole("link", { name: "See what happens next" })).toHaveAttribute("href", "/implementation");
  await expect(page.getByTestId("sprint-sequence").getByRole("heading", { level: 3 })).toHaveText(["ACCESS", "FIND", "VALIDATE", "MAP", "REMEDIATE", "PRIORITISE"]);
  await expect(page.getByText("No deployment within the Sprint.")).toBeVisible();
  await expect(page.getByRole("heading", { name: "You leave with a ranked Savings Ledger." })).toBeVisible();
  const ledger = page.getByTestId("sprint-ledger");
  await expect(ledger.getByText("Illustrative", { exact: true })).toBeVisible();
  await expect(ledger.getByRole("columnheader")).toHaveText(["Priority", "Opportunity", "Expected saving", "Confidence", "Engineering risk", "Owner", "Remediation status"]);
  await expect(page.getByRole("heading", { name: "What we need from your team." })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Discovery, not uncontrolled change." })).toBeVisible();
  await expect(page.getByRole("link", { name: "Compare implementation options" })).toHaveAttribute("href", "/implementation");
});

test("Implementation presents alternative models and customer-controlled delivery", async ({ page }) => {
  await page.goto("/implementation");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Turn approved savings into production changes.");
  await expect(page.getByRole("heading", { name: "Start with approved work." })).toBeVisible();
  await expect(page.getByTestId("implementation-sequence").getByRole("heading", { level: 3 })).toHaveText(["SELECT", "PREPARE", "REVIEW", "DEPLOY", "BASELINE", "VERIFY"]);
  await expect(page.getByTestId("implementation-evidence-chain")).toContainText("IaC or implementation change");
  await expect(page.getByText("£15,000")).toBeVisible();
  await expect(page.getByText("25%")).toBeVisible();
  await expect(page.getByText("of verified savings")).toBeVisible();
  await expect(page.getByText("The contractual verification basis is agreed before outcome-based implementation begins.")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Your engineering process stays in control." })).toBeVisible();
  await expect(page.getByRole("link", { name: "Review security" })).toHaveAttribute("href", "/security");
  const body = await page.locator("body").innerText();
  expect(body).not.toMatch(/\b\d+\s+(day|week|month)s?\b|GitHub|Jira/i);
});

test("Pricing makes the commercial order and verification basis explicit", async ({ page }) => {
  await page.goto("/pricing");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("A bounded first step. Two ways to implement.");
  const sequence = page.getByTestId("pricing-sequence");
  const text = await sequence.innerText();
  expect(text.indexOf("£5,000")).toBeLessThan(text.indexOf("£15,000"));
  expect(text.indexOf("£5,000")).toBeLessThan(text.indexOf("25%"));
  await expect(sequence).toContainText("Then choose");
  await expect(sequence).toContainText("or");
  await expect(page.getByRole("heading", { name: "How verified savings affect pricing." })).toBeVisible();
  await expect(page.getByRole("link", { name: "See how verification works" })).toHaveAttribute("href", "/verification");
  await expect(page.getByRole("link", { name: "Start a Savings Sprint" }).first()).toHaveAttribute("href", "/start");
});

test("revenue routes remain truthful, accessible, keyboard operable and static without JavaScript", async ({ browser, page }) => {
  for (const path of revenueRoutes) {
    await page.goto(path);
    await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
    expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
    const publicText = await page.locator("body").innerText();
    expect(publicText).not.toMatch(/guaranteed savings|no savings, no fee|AWS partner|testimonial|case study|TBD|limited time|act now/i);
  }

  await page.goto("/savings-sprint");
  await page.keyboard.press("Tab");
  await expect(page.getByRole("link", { name: "Skip to content" })).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.locator("#main-content")).toBeFocused();

  const context = await browser.newContext({ javaScriptEnabled: false });
  const noJsPage = await context.newPage();
  for (const path of revenueRoutes) {
    await noJsPage.goto(path);
    await expect(noJsPage.locator('main[data-route-stage="revenue"]')).toBeVisible();
    await expect(noJsPage.getByRole("heading", { level: 1 })).toHaveCount(1);
  }
  await context.close();
});

for (const viewport of responsiveMatrix) {
  test(`revenue routes have no horizontal overflow at ${viewport.width} × ${viewport.height}`, async ({ page }) => {
    await page.setViewportSize(viewport);
    for (const path of revenueRoutes) {
      await page.goto(path);
      const dimensions = await page.evaluate(() => ({ clientWidth: document.documentElement.clientWidth, scrollWidth: document.documentElement.scrollWidth }));
      expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.clientWidth);
    }
  });
}
