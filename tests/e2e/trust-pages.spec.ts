import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const trustRoutes = ["/method", "/verification", "/security"] as const;
const allPublicNarrativeRoutes = ["/", "/savings-sprint", "/implementation", "/pricing", ...trustRoutes] as const;
const responsiveMatrix = [
  { width: 320, height: 700 }, { width: 390, height: 844 }, { width: 768, height: 1024 },
  { width: 1024, height: 768 }, { width: 1280, height: 800 }, { width: 1440, height: 900 }, { width: 1728, height: 1117 },
];

test("Method defines the operating chain, decisions, ownership and traceability", async ({ page }) => {
  await page.goto("/method");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("From opportunity to verified saving.");
  await expect(page.getByTestId("method-stages").getByRole("heading", { level: 3 })).toHaveText(["FIND", "VALIDATE", "ASSIGN", "CHANGE", "APPROVE", "VERIFY"]);
  await expect(page.getByTestId("method-stages")).toContainText("Verified saving");
  await expect(page.getByTestId("method-decision-gates").locator("li")).toHaveText(["IDENTIFIED", "Technically valid?", "Economically meaningful?", "Acceptable engineering risk?", "Owner / context known?", "Customer approved?", "Deployed?", "Measured?"]);
  const responsibility = page.getByTestId("method-responsibility");
  await expect(responsibility.locator("caption")).toHaveText("Primary roles from opportunity identification through verification");
  await expect(responsibility.locator('thead th[scope="col"]')).toHaveCount(3);
  await expect(responsibility.locator('tbody th[scope="row"]')).toHaveCount(6);
  await expect(page.getByTestId("method-traceability")).toContainText("infra/prod/rds.tf:118");
  await expect(page.getByText(/not customer activity, a live account or a measured customer result/i)).toBeVisible();
  await expect(page.getByRole("link", { name: "Start a Savings Sprint" }).first()).toHaveAttribute("href", "/start");
  await expect(page.getByRole("link", { name: "See verification methodology" })).toHaveAttribute("href", "/verification");
});

test("Verification separates estimates, measurement context and verified outcomes", async ({ page }) => {
  await page.goto("/verification");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("A saving is verified after the change.");
  await expect(page.getByTestId("verification-definitions").locator("dt")).toHaveText(["Expected saving", "30-day measurement view", "Verified annualised saving"]);
  await expect(page.getByTestId("verification-equation")).toHaveAttribute("aria-label", /Baseline spend minus normalised post-change spend equals verified saving/);
  await expect(page.getByTestId("verification-line-specimen").getByText("£184,000", { exact: true })).toBeVisible();
  await expect(page.getByTestId("verification-line-specimen").getByText("£176,420", { exact: true })).toBeVisible();
  await expect(page.getByTestId("verification-line-specimen").getByText(/−£7,580 · −4.1%/)).toBeVisible();
  await expect(page.getByTestId("verification-timeline").locator("li")).toHaveText(["Deployment", "Day 0", "30-day measurement view", "Verified annualised result"]);
  await expect(page.getByText(/does not mean the whole engagement finishes in 30 days/)).toBeVisible();
  await expect(page.getByText(/The 25% fee applies to savings that meet that agreed definition/)).toBeVisible();
  await expect(page.getByRole("link", { name: "Review pricing" })).toHaveAttribute("href", "/pricing");
  await expect(page.getByRole("link", { name: "Review the operating method" })).toHaveAttribute("href", "/method");
});

test("Security states constrained discovery and customer-controlled production", async ({ page }) => {
  await page.goto("/security");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Read what we need.Change nothing without you.");
  await expect(page.getByText("tightly constrained read-only AWS access")).toBeVisible();
  await expect(page.getByTestId("security-planes").getByRole("heading", { level: 3 })).toHaveText(["Discovery plane", "Implementation plane"]);
  const boundary = page.getByTestId("security-access-boundary");
  await expect(boundary.locator("caption")).toHaveText("Discovery access capabilities and boundaries");
  await expect(boundary.locator('tbody th[scope="row"]')).toHaveCount(3);
  await expect(page.getByTestId("security-change-control").locator("li")).toHaveText(["HKGpipi remediation", "Customer repository / ticketing process", "Customer review", "CI / checks", "Customer approval", "Customer-controlled deployment"]);
  await expect(page.getByText(/published only when they are established and approved/)).toBeVisible();
  await expect(page.getByText(/requested AWS permission scope, intended data categories/)).toBeVisible();
  await expect(page.getByRole("link", { name: "Review the method" })).toHaveAttribute("href", "/method");
  expect(await page.locator("body").innerText()).not.toMatch(/retention (?:period|term|window|of|for)?\s*\d/i);
});

test("public narratives contain no prohibited proof or guarantee claims", async ({ page }) => {
  for (const path of allPublicNarrativeRoutes) {
    await page.goto(path);
    const text = await page.locator("body").innerText();
    expect(text).not.toMatch(/guaranteed savings|30-day guarantee|no savings, no fee|AWS Partner|AWS Advanced|enterprise-grade security|bank-grade|customer logo|testimonial|case study|SOC\s*2|ISO\s*27001|ISO\s*27017|ISO\s*27018|Cyber Essentials|PCI(?: DSS)?|HIPAA|FedRAMP|CSA STAR|AWS (?:competency|endorsement)/i);
  }
});

test("Trust routes are accessible, keyboard operable, static without JavaScript, and runtime-clean", async ({ browser, page }) => {
  const runtimeMessages: string[] = [];
  page.on("console", (message) => { if (["error", "warning"].includes(message.type())) runtimeMessages.push(message.text()); });
  page.on("pageerror", (error) => runtimeMessages.push(error.message));
  for (const path of trustRoutes) {
    await page.goto(path);
    await expect(page.locator('main[data-route-stage="trust"]')).toBeVisible();
    expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  }
  expect(runtimeMessages).toEqual([]);
  await page.goto("/method");
  await page.keyboard.press("Tab");
  await expect(page.getByRole("link", { name: "Skip to content" })).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.locator("#main-content")).toBeFocused();
  const context = await browser.newContext({ javaScriptEnabled: false });
  const noJsPage = await context.newPage();
  for (const path of trustRoutes) {
    await noJsPage.goto(path);
    await expect(noJsPage.locator('main[data-route-stage="trust"]')).toBeVisible();
    await expect(noJsPage.getByRole("heading", { level: 1 })).toHaveCount(1);
  }
  await context.close();
});

for (const viewport of responsiveMatrix) {
  test(`Trust routes have no horizontal overflow at ${viewport.width} × ${viewport.height}`, async ({ page }) => {
    await page.setViewportSize(viewport);
    for (const path of trustRoutes) {
      await page.goto(path);
      const dimensions = await page.evaluate(() => ({ clientWidth: document.documentElement.clientWidth, scrollWidth: document.documentElement.scrollWidth }));
      expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.clientWidth);
    }
  });
}
