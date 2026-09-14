import { expect, test, type Page } from "@playwright/test";

const auditedRoutes = ["/", "/start", "/privacy", "/savings-sprint", "/missing-gate-8a"];
const secretMarkers = [
  "TURNSTILE_SECRET_KEY",
  "RATE_LIMIT_HMAC_SECRET",
  "ENQUIRY_DESTINATION_ADDRESS",
  "private-destination-gate8a@example.test",
];

function collectRuntimeErrors(page: Page) {
  const errors: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  page.on("pageerror", (error) => errors.push(error.message));
  return errors;
}

test("responses carry the safe header baseline and correct cache boundaries", async ({ page, request }) => {
  for (const route of auditedRoutes) {
    const response = await request.get(route);
    const headers = response.headers();
    expect(headers["x-content-type-options"]).toBe("nosniff");
    expect(headers["referrer-policy"]).toBe("strict-origin-when-cross-origin");
    expect(headers["permissions-policy"]).toBe("camera=(), microphone=(), geolocation=(), payment=(), usb=()");
    expect(headers["x-frame-options"]).toBe("DENY");
    expect(headers["x-powered-by"]).toBeUndefined();
    expect(headers["strict-transport-security"]).toBeUndefined();
    expect(headers["content-security-policy"]).toContain("default-src 'self'");
    expect(headers["content-security-policy"]).not.toContain("unsafe-eval");
  }

  const start = await request.get("/start");
  expect(start.headers()["cache-control"]).toContain("no-store");
  expect(start.headers()["cache-control"]).toContain("private");
  const privacy = await request.get("/privacy");
  expect(privacy.headers()["cache-control"]).toContain("s-maxage=31536000");

  await page.goto("/");
  const assetPath = await page.locator('script[src^="/_next/static/"]').first().getAttribute("src");
  expect(assetPath).toBeTruthy();
  const asset = await request.get(assetPath!);
  expect(asset.headers()["cache-control"]).toContain("immutable");
});

test("unknown routes are hard 404s with safe, non-indexed content", async ({ page }) => {
  const errors = collectRuntimeErrors(page);
  const response = await page.goto("/missing-gate-8a");
  expect(response?.status()).toBe(404);
  await expect(page.getByRole("heading", { level: 1, name: "Page not found." })).toBeVisible();
  await expect(page.locator('meta[name="robots"]')).toHaveCount(1);
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
  await expect(page.getByRole("link", { name: "Return to HKGpipi" })).toBeVisible();
  expect(await page.content()).not.toMatch(/stack|digest|request headers|environment variables/i);
  expect(errors.filter((message) => message !== "Failed to load resource: the server responded with a status of 404 (Not Found)")).toEqual([]);
});

test("public documents and scripts contain no server-secret markers or unexpected hosts", async ({ page, request }) => {
  const errors = collectRuntimeErrors(page);
  const observedHosts = new Set<string>();
  page.on("request", (browserRequest) => observedHosts.add(new URL(browserRequest.url()).hostname));

  for (const route of ["/", "/savings-sprint", "/verification", "/start", "/privacy"]) {
    await page.goto(route, { waitUntil: "networkidle" });
    const html = await page.content();
    for (const marker of secretMarkers) expect(html).not.toContain(marker);
    const scriptPaths = await page.locator("script[src]").evaluateAll((scripts) => scripts.map((script) => script.getAttribute("src")).filter(Boolean));
    for (const scriptPath of scriptPaths) {
      const script = await request.get(scriptPath!);
      const content = await script.text();
      for (const marker of secretMarkers) expect(content).not.toContain(marker);
    }
  }

  expect([...observedHosts]).toEqual(["127.0.0.1"]);
  expect(errors).toEqual([]);
});

test("forced colors preserves navigation, controls, focus and status boundaries", async ({ page }) => {
  await page.emulateMedia({ forcedColors: "active", reducedMotion: "reduce" });
  await page.goto("/start");
  const email = page.getByLabel("Work email");
  await email.focus();
  await expect(email).toBeVisible();
  await expect(page.getByRole("button", { name: "Send enquiry" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Privacy Policy →" })).toBeVisible();
  const focusStyle = await email.evaluate((element) => getComputedStyle(element).outlineStyle);
  expect(focusStyle).not.toBe("none");

  await page.goto("/verification");
  await expect(page.getByText("Verified saving", { exact: true })).toBeVisible();
  await expect(page.getByRole("banner")).toBeVisible();
});

test("WCAG text spacing remains usable without clipping or page overflow", async ({ page }) => {
  for (const route of ["/", "/verification", "/start", "/missing-gate-8a"]) {
    await page.goto(route);
    await page.addStyleTag({ content: `
      * { letter-spacing: 0.12em !important; line-height: 1.5 !important; word-spacing: 0.16em !important; }
      p { margin-bottom: 2em !important; }
    ` });
    const audit = await page.evaluate(() => ({
      overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    }));
    expect(audit.overflow).toBeLessThanOrEqual(0);
    await expect(page.getByRole("main")).toBeVisible();
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    if (route === "/start") await expect(page.getByRole("button", { name: "Send enquiry" })).toBeVisible();
    if (route === "/missing-gate-8a") await expect(page.getByRole("link", { name: "Return to HKGpipi" })).toBeVisible();
  }
});
