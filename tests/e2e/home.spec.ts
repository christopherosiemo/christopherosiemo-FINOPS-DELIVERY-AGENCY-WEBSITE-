import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { settleHomepageMotion } from "./helpers/home-motion";

const methodStages = ["Find", "Validate", "Assign", "Change", "Approve", "Verify"];
const ledgerHeaders = [
  "Opportunity",
  "Account / service",
  "Owner",
  "Expected saving",
  "Confidence",
  "Risk",
  "State",
];
const footerLinks = [
  ["Savings Sprint", "/savings-sprint"],
  ["Implementation", "/implementation"],
  ["Pricing", "/pricing"],
  ["Method", "/method"],
  ["Verification", "/verification"],
  ["Security", "/security"],
  ["Contact", "/contact"],
] as const;
const responsiveMatrix = [
  { width: 320, height: 700 },
  { width: 390, height: 844 },
  { width: 768, height: 1024 },
  { width: 1024, height: 768 },
  { width: 1280, height: 800 },
  { width: 1440, height: 900 },
  { width: 1728, height: 1117 },
];

test("homepage narrative preserves commercial truth and architecture", async ({ page }) => {
  const runtimeErrors: string[] = [];
  page.on("pageerror", (error) => runtimeErrors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") runtimeErrors.push(message.text());
  });

  const response = await page.goto("/");
  expect(response?.ok()).toBe(true);

  await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Turn AWS waste into verified savings.");
  await expect(page.getByRole("link", { name: "Start a Savings Sprint" }).first()).toHaveAttribute("href", "/start");
  await expect(page.getByRole("link", { name: "See how verification works" })).toHaveAttribute("href", "/verification");
  await expect(page.getByText(/14-day Savings Sprint · £5,000/)).toBeVisible();

  const ledger = page.getByTestId("homepage-ledger");
  await expect(ledger.getByText("Illustrative", { exact: true })).toBeVisible();
  await expect(ledger.getByRole("heading", { name: "Savings Ledger" })).toBeVisible();
  await expect(ledger.getByText("£4,820 / mo").first()).toBeVisible();

  const stageHeadings = page.getByTestId("method-sequence-list").getByRole("heading", { level: 3 });
  await expect(stageHeadings).toHaveText(methodStages);

  await expect(page.getByTestId("remediation-evidence").getByLabel("Illustrative Terraform remediation diff")).toContainText('instance_class = "db.r6g.2xlarge"');
  await expect(page.getByRole("link", { name: "Review our security model" })).toHaveAttribute("href", "/security");

  const verification = page.getByTestId("homepage-verification-line");
  await expect(verification).toContainText("Expected annualised saving");
  await expect(verification).toContainText("£184,000");
  await expect(verification).toContainText("Verified annualised saving");
  await expect(verification).toContainText("£176,420");
  await expect(verification).toContainText("−£7,580 · −4.1%");

  const engagement = page.locator("section[aria-labelledby='engagement-path']");
  await expect(engagement).toContainText("14-Day AWS Savings Sprint");
  await expect(engagement).toContainText("£5,000");
  await expect(engagement).toContainText("Implementation Sprint");
  await expect(engagement).toContainText("£15,000");
  await expect(engagement).toContainText("25%");
  await expect(engagement.getByRole("link", { name: "Start a Savings Sprint" })).toHaveAttribute("href", "/start");
  await expect(engagement.getByRole("link", { name: "View pricing" })).toHaveAttribute("href", "/pricing");

  const footer = page.getByRole("contentinfo");
  await expect(footer.locator("[data-footer-cta]")).toBeHidden();
  await expect(footer.getByRole("navigation", { name: "Footer navigation" })).toBeVisible();
  await expect(footer.getByText("HKGpipi", { exact: true })).toBeVisible();
  for (const [name, href] of footerLinks) {
    const link = footer.getByRole("link", { name, exact: true });
    await expect(link).toBeVisible();
    await expect(link).toHaveAttribute("href", href);
  }

  const publicText = await page.locator("body").innerText();
  expect(publicText).not.toMatch(/customer result|live account|actual saving|case study|testimonial|AWS partner|30-Day Cloud Margin Recovery/i);
  expect(publicText).not.toContain("TBD");
  expect(runtimeErrors).toEqual([]);
});

for (const viewport of [
  { width: 1280, height: 800 },
  { width: 1440, height: 900 },
  { width: 1728, height: 1117 },
]) {
  test(`desktop hero Ledger remains readable without overflow at ${viewport.width}`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.goto("/");

    const ledger = page.getByTestId("homepage-ledger");
    await expect(ledger.getByRole("columnheader")).toHaveText(ledgerHeaders);
    const dimensions = await ledger.locator("table").evaluate((table) => ({
      clientWidth: table.parentElement!.clientWidth,
      scrollWidth: table.parentElement!.scrollWidth,
    }));
    expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.clientWidth);
  });
}

test("homepage is keyboard accessible and has no obvious Axe violations", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("navigation", { name: "Primary navigation" })).toBeVisible();

  const skipLink = page.getByRole("link", { name: "Skip to content" });
  await page.keyboard.press("Tab");
  await expect(skipLink).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.locator("#main-content")).toBeFocused();
  await settleHomepageMotion(page);

  const accessibility = await new AxeBuilder({ page }).analyze();
  expect(accessibility.violations).toEqual([]);
});

test("homepage remains comprehensible with JavaScript disabled", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto("/");

  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Turn AWS waste into verified savings.");
  await expect(page.getByTestId("homepage-ledger")).toContainText("Savings Ledger");
  await expect(page.getByTestId("method-sequence-list")).toContainText("Verify");
  await expect(page.getByTestId("remediation-evidence")).toContainText("db.r6g.2xlarge");
  await expect(page.getByTestId("homepage-verification-line")).toContainText("£176,420");
  await expect(page.locator("section[aria-labelledby='engagement-path']")).toContainText("£5,000");
  expect(await page.locator('main[data-homepage="true"]').getAttribute("data-motion-controller")).toBeNull();

  await context.close();
});

test("homepage motion enters once without changing geometry or financial evidence", async ({ page }) => {
  const runtimeErrors: string[] = [];
  page.on("pageerror", (error) => runtimeErrors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") runtimeErrors.push(message.text());
  });

  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");

  const homepage = page.locator('main[data-homepage="true"]');
  await expect(homepage).toHaveAttribute("data-motion-controller", "active");
  await expect(homepage).toHaveAttribute("data-motion-ready", "true");

  const recommendation = page.getByTestId("recommendation-gap-path");
  await expect(recommendation).toContainText("Opportunity");
  await expect(recommendation).toContainText("Verified");
  await expect(recommendation).toHaveAttribute("data-motion-state", "pending");
  const before = await recommendation.boundingBox();
  await recommendation.scrollIntoViewIfNeeded();
  await expect(recommendation).toHaveAttribute("data-motion-state", "entered");
  const after = await recommendation.boundingBox();
  expect(before).not.toBeNull();
  expect(after).not.toBeNull();
  expect(after!.width).toBe(before!.width);
  expect(after!.height).toBe(before!.height);

  await page.locator("#page-title").scrollIntoViewIfNeeded();
  await recommendation.scrollIntoViewIfNeeded();
  await expect(recommendation).toHaveAttribute("data-motion-state", "entered");

  const controls = page.locator("[data-motion-sequence]").nth(1);
  await controls.scrollIntoViewIfNeeded();
  await expect(controls).toHaveAttribute("data-motion-state", "entered");

  const verification = page.locator("[data-motion-verification]");
  await expect(verification).toContainText("£184,000");
  await expect(verification).toContainText("−£7,580 · −4.1%");
  await expect(verification).toContainText("£176,420");
  await verification.scrollIntoViewIfNeeded();
  await expect(verification).toHaveAttribute("data-motion-state", "entered");
  await expect(verification).toContainText("£184,000");
  await expect(verification).toContainText("−£7,580 · −4.1%");
  await expect(verification).toContainText("£176,420");

  expect(runtimeErrors).toEqual([]);
});

test("reduced motion resolves every homepage target without choreography", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");

  const homepage = page.locator('main[data-homepage="true"]');
  await expect(homepage).toHaveAttribute("data-motion-controller", "active");
  await expect(homepage).toHaveAttribute("data-motion-preference", "reduced");
  expect(await homepage.getAttribute("data-motion-ready")).toBeNull();

  const targets = homepage.locator("[data-motion-reveal], [data-motion-sequence], [data-motion-verification]");
  expect(await targets.count()).toBeGreaterThan(0);
  expect(await targets.evaluateAll((elements) => elements.every((element) => (element as HTMLElement).dataset.motionState === "entered"))).toBe(true);
  expect(await homepage.evaluate((element) => element.getAnimations({ subtree: true }).length)).toBe(0);
  await expect(page.getByTestId("homepage-verification-line")).toContainText("£176,420");

  await page.emulateMedia({ reducedMotion: "no-preference" });
  await expect(homepage).toHaveAttribute("data-motion-preference", "standard");
  await expect(page.getByTestId("recommendation-gap-path")).toHaveAttribute("data-motion-state", "entered");
});

for (const viewport of responsiveMatrix) {
  test(`homepage has no horizontal overflow at ${viewport.width} × ${viewport.height}`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.goto("/");
    const dimensions = await page.evaluate(() => ({
      clientWidth: document.documentElement.clientWidth,
      scrollWidth: document.documentElement.scrollWidth,
    }));
    expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.clientWidth);
  });
}
