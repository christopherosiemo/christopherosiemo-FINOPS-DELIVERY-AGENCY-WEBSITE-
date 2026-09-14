import { expect, test } from "@playwright/test";

const routes = ["/", "/savings-sprint", "/start", "/privacy", "/gate-10a-hard-404"];

test("production CSP preserves core routes, metadata, fonts, navigation and motion", async ({ page }) => {
  const violations: string[] = [];
  page.on("console", (message) => {
    if (/content security policy/i.test(message.text())) violations.push(message.text());
  });

  for (const route of routes) {
    const response = await page.goto(route);
    expect(response?.status()).toBe(route.includes("hard-404") ? 404 : 200);
    const csp = response?.headers()["content-security-policy"] ?? "";
    expect(csp).toContain("default-src 'self'");
    expect(csp).toContain("https://challenges.cloudflare.com");
    expect(csp).not.toContain("unsafe-eval");
    expect(response?.headers()["strict-transport-security"]).toBeUndefined();
    await expect(page.locator("h1")).toHaveCount(1);
  }

  await page.goto("/");
  await page.getByRole("link", { name: "Method", exact: true }).first().focus();
  await expect(page.getByRole("link", { name: "Method", exact: true }).first()).toBeFocused();
  expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBe(0);
  expect(violations).toEqual([]);
});

test("production start loads Turnstile under CSP without posting the form", async ({ page }) => {
  const cspViolations: string[] = [];
  page.on("console", (message) => {
    if (/content security policy/i.test(message.text())) cspViolations.push(message.text());
  });
  await page.goto("/start");
  await expect(page.locator('script[src^="https://challenges.cloudflare.com/turnstile/"]')).toHaveCount(1);
  await expect(page.getByRole("button", { name: "Send enquiry" })).toBeVisible();
  await expect(page.locator('input[name="cf-turnstile-response"]').first()).toHaveValue("");
  expect(cspViolations).toEqual([]);
});

test("production security headers remain intact", async ({ request }) => {
  const response = await request.get("/");
  expect(response.headers()["x-content-type-options"]).toBe("nosniff");
  expect(response.headers()["referrer-policy"]).toBe("strict-origin-when-cross-origin");
  expect(response.headers()["permissions-policy"]).toContain("camera=()");
  expect(response.headers()["x-frame-options"]).toBe("DENY");
  expect(response.headers()["x-powered-by"]).toBeUndefined();
});
