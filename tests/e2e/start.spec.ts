import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

async function makeSubmissionHuman(page: Page) {
  await page.locator('input[name="__issuedAt"]').evaluate((input) => {
    (input as HTMLInputElement).value = String(Date.now() - 5_000);
  });
}

async function fillValidEnquiry(page: Page) {
  await page.getByLabel(/Work email/).fill("alex@example.test");
  await page.getByLabel(/^Name/).fill("Alex Engineer");
  await page.getByLabel(/^Company/).fill("Example Infrastructure Ltd");
  await page.getByLabel(/What should we know/).fill("A multi-account estate with material RDS cost pressure.");
  await page.getByLabel(/What do you want to change/).fill("Rightsizing work is blocked by unclear service ownership.");
  await page.getByLabel(/Approximate monthly AWS spend/).selectOption("25k-100k");
  await makeSubmissionHuman(page);
}

test("start route presents the canonical, non-indexed enquiry boundary", async ({ page }) => {
  const response = await page.goto("/start");
  expect(response?.status()).toBe(200);
  await expect(page.locator('main[data-route-stage="conversion"]')).toBeVisible();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Tell us where AWS spend is getting in the way.");
  await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /nofollow/);
  await expect(page.getByRole("contentinfo").locator("[data-footer-cta]")).not.toBeVisible();

  for (const label of [
    /Work email/,
    /^Name/,
    /^Company/,
    /What should we know/,
    /What do you want to change/,
    /Approximate monthly AWS spend/,
  ]) await expect(page.getByLabel(label)).toBeVisible();

  await expect(page.getByRole("option")).toHaveCount(5);
  await expect(page.getByRole("button", { name: "Send enquiry" })).toBeVisible();
  await expect(page.getByText("Do not include credentials, secrets or AWS access keys.")).toBeVisible();
  await expect(page.getByText("Submitting this form is an enquiry. It does not create an engagement or authorise AWS access.")).toBeVisible();
  await expect(page.getByText("Production privacy terms must be published before public launch.")).toHaveCount(0);
  await expect(page.getByRole("link", { name: /privacy/i })).toHaveCount(0);
  const html = await page.locator("html").textContent();
  expect(html).not.toContain("ENQUIRY_TEST_MODE");
  expect(html).not.toContain("ENQUIRY_DELIVERY_PROVIDER");
});

test("server validation returns a focused linked summary and described field errors", async ({ page }) => {
  await page.goto("/start");
  await page.getByRole("button", { name: "Send enquiry" }).click();
  const summary = page.locator('[aria-labelledby="error-summary-title"]');
  await expect(summary).toBeFocused();
  await expect(summary.getByRole("heading", { name: "Check the following fields." })).toBeVisible();
  await expect(summary.getByRole("link")).toHaveCount(5);
  const email = page.getByLabel(/Work email/);
  await expect(email).toHaveAttribute("aria-invalid", "true");
  await expect(email).toHaveAttribute("aria-describedby", "email-error");
});

test("successful delivery alone renders the success state and no PII enters the URL", async ({ page }) => {
  await page.goto("/start?scenario=success");
  await fillValidEnquiry(page);
  const submit = page.getByRole("button", { name: "Send enquiry" });
  const click = submit.click();
  await expect(page.getByRole("button", { name: "Sending…" })).toBeDisabled();
  await click;
  const result = page.locator('[data-submission-result="success"]');
  await expect(result).toBeFocused();
  await expect(result.getByRole("heading", { name: "Enquiry received." })).toBeVisible();
  await expect(result).toContainText("Thanks. We have what we need to review the context you sent.");
  await expect(result).toContainText("enq-test000001");
  expect(page.url()).not.toContain("alex");
  expect(page.url()).not.toContain("Example");
});

for (const scenario of ["retryable-failure", "permanent-failure"]) {
  test(`${scenario} retains entered values and never claims receipt`, async ({ page }) => {
    await page.goto(`/start?scenario=${scenario}`);
    await fillValidEnquiry(page);
    await page.getByRole("button", { name: "Send enquiry" }).click();
    const result = page.locator('[data-submission-result="failure"]');
    await expect(result).toBeFocused();
    await expect(result.getByRole("heading", { name: "We could not send your enquiry." })).toBeVisible();
    await expect(result).toContainText("Your information has not been confirmed as delivered. Please try again.");
    await expect(page.getByLabel(/Work email/)).toHaveValue("alex@example.test");
    await expect(page.getByText("Enquiry received.")).toHaveCount(0);
  });
}

test("production-disabled delivery fails closed", async ({ page }) => {
  await page.goto("/start");
  await fillValidEnquiry(page);
  await page.getByRole("button", { name: "Send enquiry" }).click();
  await expect(page.locator('[data-submission-result="failure"]')).toBeFocused();
  await expect(page.getByText("Enquiry received.")).toHaveCount(0);
});

for (const [name, prepare] of [
  ["honeypot", async (page: Page) => page.locator('input[name="website"]').evaluate((input) => (input as HTMLInputElement).value = "bot")],
  ["fast submit", async (page: Page) => page.locator('input[name="__issuedAt"]').evaluate((input) => (input as HTMLInputElement).value = String(Date.now()))],
] as const) {
  test(`${name} is rejected without a false success`, async ({ page }) => {
    await page.goto("/start?scenario=success");
    await fillValidEnquiry(page);
    await prepare(page);
    await page.getByRole("button", { name: "Send enquiry" }).click();
    await expect(page.locator('[data-submission-result="failure"]')).toBeVisible();
    await expect(page.getByText("Enquiry received.")).toHaveCount(0);
  });
}

test("start is keyboard operable and has no detectable Axe violations", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/start");
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  await page.getByLabel(/Work email/).focus();
  for (let count = 0; count < 6; count += 1) await page.keyboard.press("Tab");
  await expect(page.getByRole("button", { name: "Send enquiry" })).toBeFocused();
  for (const control of await page.locator("form input:not([type=hidden]):not([name=website]), form textarea, form select, form button").all()) {
    expect((await control.boundingBox())?.height).toBeGreaterThanOrEqual(44);
  }
});

test("start has no runtime warnings, hydration failures, or external delivery requests", async ({ page }) => {
  const runtimeMessages: string[] = [];
  const externalRequests: string[] = [];
  page.on("console", (message) => {
    if (["warning", "error"].includes(message.type())) runtimeMessages.push(message.text());
  });
  page.on("request", (request) => {
    if (new URL(request.url()).host !== "127.0.0.1:3107") externalRequests.push(request.url());
  });
  await page.goto("/start");
  await fillValidEnquiry(page);
  await page.getByRole("button", { name: "Send enquiry" }).click();
  await expect(page.locator('[data-submission-result="failure"]')).toBeVisible();
  expect(runtimeMessages).toEqual([]);
  expect(externalRequests).toEqual([]);
});

test("native no-JavaScript submission returns an understandable server result", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto("/start?scenario=success");
  await fillValidEnquiry(page);
  await Promise.all([
    page.waitForNavigation(),
    page.getByRole("button", { name: "Send enquiry" }).click(),
  ]);
  await expect(page.getByRole("heading", { name: "Enquiry received." })).toBeVisible();
  expect(page.url()).not.toContain("alex");
  await context.close();
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
  test(`start and contact have no horizontal overflow at ${viewport.width} × ${viewport.height}`, async ({ page }) => {
    await page.setViewportSize(viewport);
    for (const path of ["/start", "/contact"]) {
      await page.goto(path);
      const dimensions = await page.locator("html").evaluate((element) => ({
        clientWidth: element.clientWidth,
        scrollWidth: element.scrollWidth,
      }));
      expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.clientWidth);
    }
  });
}

test("contact directs enquiries to the canonical flow without collecting fields", async ({ page }) => {
  await page.goto("/contact");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Talk to HKGpipi.");
  await expect(page.getByRole("link", { name: "Start an enquiry" })).toHaveAttribute("href", "/start");
  await expect(page.locator("form")).toHaveCount(0);
});
