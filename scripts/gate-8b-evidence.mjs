import { spawn } from "node:child_process";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import AxeBuilder from "@axe-core/playwright";
import { chromium, firefox, webkit } from "@playwright/test";

const baseUrl = process.env.QUALIFICATION_BASE_URL ?? "http://127.0.0.1:3114";
const stagingUrl = "https://hkgpipi-enquiry-staging.charltonyalazima.workers.dev";
const outputDirectory = path.resolve("outputs/gate-8b-review");
const routes = ["/", "/savings-sprint", "/implementation", "/pricing", "/method", "/verification", "/security", "/start", "/contact", "/privacy"];
const missingRoute = "/gate-8b-intentional-404";
const browserRoutes = [...routes, missingRoute];
const widths = [390, 1440];
const secretMarkers = ["TURNSTILE_SECRET_KEY", "RATE_LIMIT_HMAC_SECRET", "ENQUIRY_DESTINATION_ADDRESS", "private-destination-gate8b@example.test"];
const expected404Console = (message) => message.includes("404 (Not Found)");

await mkdir(outputDirectory, { recursive: true });

let server;
if (!process.env.QUALIFICATION_BASE_URL) {
  server = spawn(process.execPath, ["node_modules/next/dist/bin/next", "start", "--hostname", "127.0.0.1", "--port", "3114"], {
    env: { ...process.env, APP_ENVIRONMENT: "test", ENQUIRY_DESTINATION_ADDRESS: "private-destination-gate8b@example.test", ENQUIRY_TEST_MODE: "1" },
    stdio: "ignore",
  });
  let ready = false;
  for (let attempt = 0; attempt < 80; attempt += 1) {
    try {
      if ((await fetch(baseUrl)).ok) { ready = true; break; }
    } catch {}
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
  if (!ready) throw new Error("The Gate 8B evidence server did not become ready.");
}

async function writeJson(name, value) {
  await writeFile(path.join(outputDirectory, name), `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

try {
  const routeStatus = [];
  for (const route of browserRoutes) {
    const response = await fetch(`${baseUrl}${route}`, { redirect: "manual" });
    routeStatus.push({ route, status: response.status });
  }
  await writeJson("route-status.json", { expected: { public: 200, unknown: 404 }, results: routeStatus });

  const stagingHeaders = [];
  for (const route of ["/", "/start", "/privacy", "/pricing", "/verification", "/security", missingRoute]) {
    const response = await fetch(`${stagingUrl}${route}`, { redirect: "manual" });
    const selected = {};
    for (const name of ["cache-control", "content-security-policy", "permissions-policy", "referrer-policy", "strict-transport-security", "x-content-type-options", "x-frame-options", "x-powered-by"])
      selected[name] = response.headers.get(name);
    stagingHeaders.push({ route, status: response.status, headers: selected });
  }
  await writeJson("headers.json", { source: stagingUrl, results: stagingHeaders });

  const engines = { chromium, firefox, webkit };
  const matrix = [];
  const consoleSummary = [];
  for (const [browserName, browserType] of Object.entries(engines)) {
    const browser = await browserType.launch();
    for (const width of widths) {
      const context = await browser.newContext({ colorScheme: "light", locale: "en-GB", reducedMotion: "reduce", viewport: { width, height: width === 390 ? 844 : 900 } });
      const page = await context.newPage();
      for (const route of browserRoutes) {
        const consoleErrors = [];
        const pageErrors = [];
        const onConsole = (message) => { if (message.type() === "error") consoleErrors.push(message.text()); };
        const onPageError = (error) => pageErrors.push(error.message);
        page.on("console", onConsole);
        page.on("pageerror", onPageError);
        const response = await page.goto(`${baseUrl}${route}`, { waitUntil: "networkidle" });
        const overflowPixels = await page.evaluate(() => Math.max(0, document.documentElement.scrollWidth - document.documentElement.clientWidth));
        const relevantConsoleErrors = route === missingRoute ? consoleErrors.filter((message) => !expected404Console(message)) : consoleErrors;
        matrix.push({ browser: browserName, width, route, status: response?.status() ?? 0, overflowPixels, consoleErrors: relevantConsoleErrors, pageErrors });
        consoleSummary.push({ browser: browserName, width, route, consoleErrors: relevantConsoleErrors, pageErrors });
        page.off("console", onConsole);
        page.off("pageerror", onPageError);
      }
      await context.close();
    }
    await browser.close();
  }
  await writeJson("browser-matrix.json", { results: matrix });
  await writeJson("console-summary.json", { results: consoleSummary });

  const browser = await chromium.launch();
  const context = await browser.newContext({ colorScheme: "light", locale: "en-GB", reducedMotion: "reduce", viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  const destinations = new Set();
  const sourceResults = [];
  for (const route of routes) {
    await page.goto(`${baseUrl}${route}`, { waitUntil: "networkidle" });
    const hrefs = await page.locator("a[href]").evaluateAll((links) => links.map((link) => link.getAttribute("href") ?? ""));
    const internal = [];
    for (const href of hrefs) {
      if (!href || href.startsWith("mailto:") || href.startsWith("tel:") || href.startsWith("#")) continue;
      const url = new URL(href, baseUrl);
      if (url.origin === new URL(baseUrl).origin) { internal.push(url.pathname); destinations.add(url.pathname); }
    }
    sourceResults.push({ route, internal: [...new Set(internal)].sort() });
  }
  const destinationResults = [];
  for (const destination of [...destinations].sort()) destinationResults.push({ route: destination, status: (await fetch(`${baseUrl}${destination}`)).status });
  await writeJson("link-integrity.json", { sources: sourceResults, destinations: destinationResults });

  const accessibilityResults = [];
  for (const width of widths) {
    await page.setViewportSize({ width, height: width === 390 ? 844 : 900 });
    for (const route of browserRoutes) {
      await page.goto(`${baseUrl}${route}`);
      const result = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"]).analyze();
      accessibilityResults.push({ width, route, seriousOrCritical: result.violations.filter(({ impact }) => impact === "serious" || impact === "critical").map(({ id, impact }) => ({ id, impact })) });
    }
  }
  await writeJson("accessibility-summary.json", { standard: "WCAG 2.2 AA", results: accessibilityResults });

  const leakResults = [];
  for (const route of browserRoutes) {
    await page.goto(`${baseUrl}${route}`);
    const html = await page.content();
    leakResults.push({ route, markersFound: secretMarkers.filter((marker) => html.includes(marker)) });
  }
  await writeJson("secret-pii-summary.json", { renderedMarkers: secretMarkers, results: leakResults });

  const captures = [
    ["home", "/", 1440], ["home", "/", 390],
    ["savings-sprint", "/savings-sprint", 1440], ["savings-sprint", "/savings-sprint", 390],
    ["implementation", "/implementation", 1440],
    ["pricing", "/pricing", 1440], ["pricing", "/pricing", 390],
    ["method", "/method", 1440],
    ["verification", "/verification", 1440], ["verification", "/verification", 390],
    ["security", "/security", 1440], ["security", "/security", 390],
    ["start", "/start", 1440], ["start", "/start", 390],
    ["privacy", "/privacy", 1440], ["privacy", "/privacy", 390],
    ["not-found", missingRoute, 1440], ["not-found", missingRoute, 390],
  ];
  for (const [name, route, width] of captures) {
    await page.setViewportSize({ width, height: width === 390 ? 844 : 900 });
    await page.goto(`${baseUrl}${route}`, { waitUntil: "networkidle" });
    await page.evaluate(async () => { await document.fonts.ready; if (document.activeElement instanceof HTMLElement) document.activeElement.blur(); });
    await page.screenshot({ animations: "disabled", fullPage: true, path: path.join(outputDirectory, `${name}-${width}.png`) });
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(baseUrl, { waitUntil: "networkidle" });
  await page.getByRole("button", { name: "Open primary navigation" }).click();
  await page.evaluate(async () => { await document.fonts.ready; if (document.activeElement instanceof HTMLElement) document.activeElement.blur(); });
  await page.screenshot({ animations: "disabled", path: path.join(outputDirectory, "mobile-menu-390.png") });
  await context.close();
  await browser.close();
} finally {
  server?.kill();
}
