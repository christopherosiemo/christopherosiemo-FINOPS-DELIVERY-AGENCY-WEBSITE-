import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const methodStages = ["Find", "Validate", "Assign", "Change", "Approve", "Verify"];
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
  await expect(engagement.getByRole("link", { name: "View pricing" })).toHaveAttribute("href", "/pricing");

  await expect(page.getByRole("contentinfo")).toContainText("Find what is worth changing.");
  await expect(page.getByRole("contentinfo").getByText("HKGpipi", { exact: true })).toBeVisible();

  const publicText = await page.locator("body").innerText();
  expect(publicText).not.toMatch(/customer result|live account|actual saving|case study|testimonial|AWS partner|30-Day Cloud Margin Recovery/i);
  expect(publicText).not.toContain("TBD");
  expect(runtimeErrors).toEqual([]);
});

test("homepage is keyboard accessible and has no obvious Axe violations", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("navigation", { name: "Primary navigation" })).toBeVisible();

  const skipLink = page.getByRole("link", { name: "Skip to content" });
  await page.keyboard.press("Tab");
  await expect(skipLink).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.locator("#main-content")).toBeFocused();

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

  await context.close();
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
