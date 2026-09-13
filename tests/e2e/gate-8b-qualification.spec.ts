import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

const primaryRoutes = [
  "/",
  "/savings-sprint",
  "/implementation",
  "/pricing",
  "/method",
  "/verification",
  "/security",
  "/start",
  "/contact",
  "/privacy",
] as const;
const missingRoute = "/gate-8b-intentional-404";
const widths = [320, 390, 768, 1024, 1280, 1440, 1728] as const;
const secretMarkers = [
  "TURNSTILE_SECRET_KEY",
  "RATE_LIMIT_HMAC_SECRET",
  "ENQUIRY_DESTINATION_ADDRESS",
  "private-destination-gate8b@example.test",
];

function collectRuntimeErrors(page: Page) {
  const consoleErrors: string[] = [];
  const pageErrors: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") consoleErrors.push(message.text());
  });
  page.on("pageerror", (error) => pageErrors.push(error.message));
  return { consoleErrors, pageErrors };
}

function allowed404Noise(messages: string[]) {
  return messages.filter((message) => !message.includes("404 (Not Found)"));
}

async function fillValidEnquiry(page: Page) {
  await page.getByLabel(/Work email/).fill("qualification@example.test");
  await page.getByLabel(/^Name/).fill("Qualification Reviewer");
  await page.getByLabel(/^Company/).fill("Qualification Example Ltd");
  await page.getByLabel(/What should we know/).fill("A multi-account estate with material RDS cost pressure.");
  await page.getByLabel(/What do you want to change/).fill("Rightsizing work is blocked by unclear service ownership.");
  await page.getByLabel(/Approximate monthly AWS spend/).selectOption("25k-100k");
}

test("all qualification routes resolve with coherent landmarks, headings and indexing", async ({ page }) => {
  const errors = collectRuntimeErrors(page);
  for (const route of primaryRoutes) {
    const response = await page.goto(route);
    expect(response?.status(), route).toBe(200);
    await expect(page.locator("main")).toHaveCount(1);
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.locator("h1")).not.toHaveText("");
    await expect(page.getByRole("banner")).toHaveCount(1);
    await expect(page.locator("footer")).toHaveCount(1);
    expect(await page.locator("nav").count(), route).toBeGreaterThanOrEqual(2);
    const headingLevels = await page.locator("h1,h2,h3,h4,h5,h6").evaluateAll((headings) =>
      headings.map((heading) => ({ level: Number(heading.tagName.slice(1)), text: heading.textContent?.trim() ?? "" })),
    );
    expect(headingLevels.every(({ text }) => text.length > 0), route).toBe(true);
    expect(headingLevels[0]?.level, route).toBe(1);
    for (let index = 1; index < headingLevels.length; index += 1) {
      expect(headingLevels[index].level - headingLevels[index - 1].level, `${route}: ${headingLevels[index].text}`).toBeLessThanOrEqual(1);
    }
    const robots = page.locator('meta[name="robots"]');
    if (route === "/") await expect(robots).toHaveCount(0);
    else await expect(robots).toHaveAttribute("content", /noindex/);
  }

  const response = await page.goto(missingRoute);
  expect(response?.status()).toBe(404);
  await expect(page.locator("main")).toHaveCount(1);
  await expect(page.locator("h1")).toHaveText("Page not found.");
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
  await expect(page.getByRole("link", { name: "Return to HKGpipi" })).toHaveAttribute("href", "/");
  await expect(page.getByRole("link", { name: "Start an enquiry" })).toHaveAttribute("href", "/start");
  expect(allowed404Noise(errors.consoleErrors)).toEqual([]);
  expect(errors.pageErrors).toEqual([]);
});

test("same-origin links and principal CTA destinations are intact", async ({ page, request, baseURL }) => {
  const destinations = new Set<string>();
  for (const route of primaryRoutes) {
    await page.goto(route);
    const hrefs = await page.locator("a[href]").evaluateAll((links) => links.map((link) => link.getAttribute("href") ?? ""));
    for (const href of hrefs) {
      expect(href).not.toBe("#");
      expect(href.toLowerCase()).not.toMatch(/^javascript:/);
      if (!href || href.startsWith("mailto:") || href.startsWith("tel:") || href.startsWith("#")) continue;
      const url = new URL(href, baseURL);
      if (url.origin !== new URL(baseURL!).origin) continue;
      expect(url.pathname).not.toMatch(/^\/(design-system|debug|test)(?:\/|$)/);
      destinations.add(url.pathname);
    }
  }
  for (const destination of destinations) {
    const response = await request.get(destination);
    expect(response.status(), destination).toBeLessThan(400);
  }

  const expectedCtas = new Map([
    ["Start a Savings Sprint", "/start"],
    ["Review pricing", "/pricing"],
    ["Review the operating method", "/method"],
    ["Review the method", "/method"],
    ["See verification methodology", "/verification"],
  ]);
  for (const route of primaryRoutes) {
    await page.goto(route);
    for (const [label, href] of expectedCtas) {
      for (const link of await page.getByRole("link", { name: label, exact: true }).all()) {
        await expect(link, `${route}: ${label}`).toHaveAttribute("href", href);
      }
    }
  }
});

test("commercial, operating-model, claim and privacy facts remain consistent", async ({ page }) => {
  const routeText = new Map<string, string>();
  for (const route of primaryRoutes) {
    await page.goto(route);
    routeText.set(route, (await page.locator("main").innerText()).replace(/\s+/g, " "));
  }
  for (const route of ["/", "/savings-sprint", "/pricing", "/start"] as const) {
    expect(routeText.get(route), route).toContain("£5,000");
  }
  expect(routeText.get("/pricing")).toContain("£15,000");
  expect(routeText.get("/pricing")).toContain("25%");
  expect(routeText.get("/pricing")).toMatch(/or/i);
  const expectedStages = ["Find", "Validate", "Assign", "Change", "Approve", "Verify"];
  await page.goto("/");
  expect(await page.getByTestId("method-sequence-list").locator("h3").allTextContents()).toEqual(expectedStages);
  await page.goto("/method");
  expect((await page.getByTestId("method-stages").locator("h3").allTextContents()).map((stage) => stage.toLowerCase())).toEqual(expectedStages.map((stage) => stage.toLowerCase()));
  for (const route of ["/", "/method", "/savings-sprint", "/implementation", "/security"] as const) {
    expect(routeText.get(route), route).toMatch(/customer/i);
  }
  expect(routeText.get("/verification")).toContain("Expected saving");
  expect(routeText.get("/verification")).toContain("Verified annualised saving");
  const allText = [...routeText.values()].join("\n");
  for (const prohibited of ["SOC 2", "ISO 27001", "AWS Partner", "AWS competency", "bank-grade security", "enterprise-grade security", "no savings, no fee"])
    expect(allText).not.toContain(prohibited);
  const privacy = routeText.get("/privacy")!;
  for (const fact of [
    "Privacy Policy",
    "Last updated: 13 September 2026",
    "privacy@hkgpipi.com",
    "14 Whitworth Rd",
    "material sub-processors",
    "non-essential analytics, advertising or tracking cookies",
    "Information Commissioner's Office",
  ]) expect(privacy).toContain(fact);
  expect(privacy).not.toMatch(/\[(?:TBD|PLACEHOLDER)|<[^>]+>|INSERT[_ ]/i);
});

for (const width of [390, 1440] as const) {
  test(`Axe reports no serious or critical violations across all routes at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: width === 390 ? 844 : 900 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    for (const route of [...primaryRoutes, missingRoute]) {
      await page.goto(route);
      const result = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"]).analyze();
      expect(result.violations.filter(({ impact }) => impact === "serious" || impact === "critical"), route).toEqual([]);
    }
  });
}

test("Axe covers the open mobile menu and deterministic form failure states", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page.getByRole("button", { name: "Open primary navigation" }).click();
  expect((await new AxeBuilder({ page }).analyze()).violations.filter(({ impact }) => impact === "serious" || impact === "critical")).toEqual([]);
  await page.goto("/start");
  await page.getByRole("button", { name: "Send enquiry" }).click();
  expect((await new AxeBuilder({ page }).analyze()).violations.filter(({ impact }) => impact === "serious" || impact === "critical")).toEqual([]);
  await page.goto("/start?scenario=retryable-failure");
  await fillValidEnquiry(page);
  await page.getByRole("button", { name: "Send enquiry" }).click();
  await expect(page.locator('[data-submission-result="failure"]')).toBeFocused();
  expect((await new AxeBuilder({ page }).analyze()).violations.filter(({ impact }) => impact === "serious" || impact === "critical")).toEqual([]);
});

test("keyboard focus traverses desktop actions and mobile dialog without traps", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  await page.getByRole("link", { name: "Skip to content" }).focus();
  await page.keyboard.press("Enter");
  await expect(page.locator("main")).toBeFocused();
  for (const link of [
    page.getByRole("navigation", { name: "Primary navigation" }).getByRole("link", { name: "Savings Sprint" }),
    page.getByRole("main").getByRole("link", { name: "Start a Savings Sprint" }).first(),
    page.getByRole("contentinfo").getByRole("link", { name: "Privacy" }),
  ]) {
    await link.focus();
    await expect(link).toBeFocused();
    expect(await link.evaluate((element) => getComputedStyle(element).outlineStyle)).not.toBe("none");
  }

  for (const width of [320, 390, 768]) {
    await page.setViewportSize({ width, height: 844 });
    await page.goto("/");
    const trigger = page.getByRole("button", { name: "Open primary navigation" });
    await trigger.click();
    const dialog = page.getByRole("dialog", { name: "Primary navigation" });
    await expect(dialog.getByRole("button", { name: "Close" })).toBeFocused();
    for (let index = 0; index < 12; index += 1) await page.keyboard.press("Tab");
    expect(await page.evaluate(() => document.querySelector("dialog")?.contains(document.activeElement))).toBe(true);
    await page.keyboard.press("Escape");
    await expect(dialog).not.toBeVisible();
    await expect(trigger).toBeFocused();
    expect(await page.evaluate(() => getComputedStyle(document.body).overflow)).not.toBe("hidden");
  }
});

test("responsive layout and critical controls remain contained across the full width matrix", async ({ page }) => {
  for (const width of widths) {
    await page.setViewportSize({ width, height: width < 768 ? 844 : 900 });
    for (const route of [...primaryRoutes, missingRoute]) {
      await page.goto(route);
      const audit = await page.evaluate(() => {
        const controls = [...document.querySelectorAll<HTMLElement>('a[href],button,input:not([name="website"]),select,textarea')].filter((element) => {
          const style = getComputedStyle(element);
          return style.display !== "none" && style.visibility !== "hidden" && element.getClientRects().length > 0 && element.getAttribute("aria-hidden") !== "true";
        });
        return {
          overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
          invalidControls: controls.filter((control) => {
            const box = control.getBoundingClientRect();
            return box.width <= 0 || box.height <= 0 || box.left < -1 || box.right > innerWidth + 1;
          }).map((control) => control.outerHTML.slice(0, 120)),
        };
      });
      expect(audit.overflow, `${route} at ${width}`).toBeLessThanOrEqual(0);
      expect(audit.invalidControls, `${route} at ${width}`).toEqual([]);
    }
  }
});

test("text spacing and 200% reflow equivalents remain usable", async ({ page }) => {
  for (const route of ["/", "/pricing", "/method", "/security", "/start", "/privacy"]) {
    await page.setViewportSize({ width: 720, height: 900 });
    await page.goto(route);
    await page.addStyleTag({ content: "*{letter-spacing:.12em!important;line-height:1.5!important;word-spacing:.16em!important}p{margin-bottom:2em!important}" });
    expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth), route).toBeLessThanOrEqual(0);
    await expect(page.locator("main")).toBeVisible();
    await expect(page.locator("h1")).toBeVisible();
  }
});

test("forced colours preserve focus, form, button and error distinctions", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ forcedColors: "active", reducedMotion: "reduce" });
  for (const route of ["/", "/pricing", "/security", "/start", missingRoute]) {
    await page.goto(route);
    const firstAction = page.locator("main a[href], main button, main input").first();
    await firstAction.focus();
    expect(await firstAction.evaluate((element) => getComputedStyle(element).outlineStyle), route).not.toBe("none");
  }
  await page.goto("/start");
  await page.getByRole("button", { name: "Send enquiry" }).click();
  const summary = page.locator('[aria-labelledby="error-summary-title"]');
  await expect(summary).toBeFocused();
  await expect(summary).toHaveAttribute("role", "alert");
  await expect(summary.getByRole("heading", { name: "Check the following fields." })).toBeVisible();
  await expect(page.locator("#email-error")).toContainText("Enter your email address.");
});

test("responsive tables become complete labelled records without horizontal scrolling", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  for (const route of ["/savings-sprint", "/implementation", "/method", "/security"]) {
    await page.goto(route);
    for (const table of await page.locator("table").all()) {
      await expect(table.locator("caption")).toHaveCount(1);
      for (const cell of await table.locator("tbody td").all()) {
        await expect(cell).toHaveAttribute("data-label", /\S/);
      }
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth), route).toBeLessThanOrEqual(0);
  }
});

test("deterministic conversion states stay truthful, focused and local", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  const scenarios = [
    ["verification-error", "verification-failure"],
    ["rate-limited", "rate-limited"],
    ["retryable-failure", "failure"],
    ["success", "success"],
  ] as const;
  for (const [scenario, resultName] of scenarios) {
    await page.goto(`/start?scenario=${scenario}`);
    await fillValidEnquiry(page);
    await page.getByRole("button", { name: "Send enquiry" }).click();
    const result = page.locator(`[data-submission-result="${resultName}"]`);
    await expect(result).toBeFocused();
    expect(page.url()).not.toContain("qualification%40");
    if (scenario !== "success") await expect(page.getByText("Enquiry received.")).toHaveCount(0);
  }
});

test("JavaScript-disabled routes retain meaning and the protected fallback", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  for (const route of ["/", "/savings-sprint", "/pricing", "/method", "/verification", "/security", "/privacy", missingRoute]) {
    const response = await page.goto(route);
    expect(response?.status(), route).toBe(route === missingRoute ? 404 : 200);
    await expect(page.locator("h1")).toBeVisible();
    await expect(page.locator("main")).toBeVisible();
  }
  await page.goto("/start");
  await expect(page.getByText("JavaScript is required to use the protected enquiry form.")).toBeVisible();
  await expect(page.getByRole("link", { name: "enquiries@hkgpipi.com" })).toHaveAttribute("href", "mailto:enquiries@hkgpipi.com");
  await expect(page.getByRole("button", { name: "Send enquiry" })).toBeDisabled();
  await context.close();
});

test("browser output contains no unexpected hosts, hydration errors, secrets or private data", async ({ page, request }) => {
  const errors = collectRuntimeErrors(page);
  const hosts = new Set<string>();
  page.on("request", (browserRequest) => hosts.add(new URL(browserRequest.url()).hostname));
  for (const route of primaryRoutes) {
    await page.goto(route, { waitUntil: "networkidle" });
    const html = await page.content();
    for (const marker of secretMarkers) expect(html, route).not.toContain(marker);
    for (const scriptPath of await page.locator("script[src]").evaluateAll((scripts) => scripts.map((script) => script.getAttribute("src")).filter(Boolean))) {
      const response = await request.get(scriptPath!);
      const source = await response.text();
      for (const marker of secretMarkers) expect(source, scriptPath!).not.toContain(marker);
    }
  }
  expect([...hosts]).toEqual(["127.0.0.1"]);
  expect(errors.consoleErrors).toEqual([]);
  expect(errors.pageErrors).toEqual([]);
});
