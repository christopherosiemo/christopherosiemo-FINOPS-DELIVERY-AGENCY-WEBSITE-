import { spawn } from "node:child_process";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { chromium } from "@playwright/test";

const baseUrl = process.env.PERFORMANCE_BASE_URL ?? "http://127.0.0.1:3108";
const routes = ["/", "/savings-sprint", "/verification", "/start", "/privacy"];
const widths = [390, 1440];
const runCount = Number(process.env.PERFORMANCE_RUNS ?? "3");
const checkBudgets = process.argv.includes("--check");
const reportPath = process.env.PERFORMANCE_REPORT_PATH;

let server;
if (!process.env.PERFORMANCE_BASE_URL) {
  server = spawn(process.execPath, ["node_modules/next/dist/bin/next", "start", "--hostname", "127.0.0.1", "--port", "3108"], {
    env: { ...process.env, APP_ENVIRONMENT: "test", ENQUIRY_TEST_MODE: "1" },
    stdio: "ignore",
  });
  for (let attempt = 0; attempt < 60; attempt += 1) {
    try {
      const response = await fetch(baseUrl);
      if (response.ok) break;
    } catch {
      if (attempt === 59) throw new Error("The production audit server did not become ready.");
    }
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
}

const browser = await chromium.launch();
const samples = [];

for (let run = 1; run <= runCount; run += 1) {
  for (const width of widths) {
    for (const route of routes) {
    const context = await browser.newContext({
      colorScheme: "light",
      locale: "en-GB",
      viewport: { width, height: width === 390 ? 844 : 900 },
    });
    const page = await context.newPage();
    const consoleErrors = [];
    page.on("console", (message) => {
      if (message.type() === "error") consoleErrors.push(message.text());
    });
    page.on("pageerror", (error) => consoleErrors.push(error.message));
    await page.addInitScript(() => {
      window.__hkgpipiLabMetrics = { cls: 0, lcp: 0 };
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!entry.hadRecentInput) window.__hkgpipiLabMetrics.cls += entry.value;
        }
      }).observe({ type: "layout-shift", buffered: true });
      new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const last = entries.at(-1);
        if (last) window.__hkgpipiLabMetrics.lcp = last.startTime;
      }).observe({ type: "largest-contentful-paint", buffered: true });
    });

    const response = await page.goto(`${baseUrl}${route}`, { waitUntil: "networkidle" });
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(250);
    const metrics = await page.evaluate(() => {
      const resources = performance.getEntriesByType("resource").map((entry) => {
        const resource = /** @type {PerformanceResourceTiming} */ (entry);
        return {
          encodedBytes: resource.encodedBodySize,
          initiatorType: resource.initiatorType,
          name: resource.name,
          transferBytes: resource.transferSize,
        };
      });
      const summarize = (predicate) => {
        const matching = resources.filter(predicate);
        return {
          count: matching.length,
          encodedBytes: matching.reduce((total, item) => total + item.encodedBytes, 0),
          transferBytes: matching.reduce((total, item) => total + item.transferBytes, 0),
        };
      };
      const origin = location.origin;
      return {
        cls: window.__hkgpipiLabMetrics.cls,
        css: summarize((item) => item.initiatorType === "link" && new URL(item.name).pathname.endsWith(".css")),
        fonts: summarize((item) => /\.(?:woff2?|ttf|otf)$/i.test(new URL(item.name).pathname)),
        js: summarize((item) => item.initiatorType === "script" || new URL(item.name).pathname.endsWith(".js")),
        lcpMilliseconds: Math.round(window.__hkgpipiLabMetrics.lcp),
        overflowPixels: Math.max(0, document.documentElement.scrollWidth - document.documentElement.clientWidth),
        requestCount: resources.length + 1,
        thirdPartyHosts: [...new Set(resources
          .map((item) => new URL(item.name))
          .filter((url) => url.origin !== origin)
          .map((url) => url.hostname))].sort(),
      };
    });

    samples.push({
      ...metrics,
      consoleErrors,
      route,
      run,
      status: response?.status() ?? 0,
      width,
    });
    await context.close();
    }
  }
}

await browser.close();
server?.kill();

const median = (values) => {
  const sorted = [...values].sort((first, second) => first - second);
  return sorted[Math.floor(sorted.length / 2)];
};
const results = widths.flatMap((width) => routes.map((route) => {
  const matching = samples.filter((sample) => sample.width === width && sample.route === route);
  const maximumSummary = (key) => ({
    count: Math.max(...matching.map((sample) => sample[key].count)),
    encodedBytes: Math.max(...matching.map((sample) => sample[key].encodedBytes)),
    transferBytes: Math.max(...matching.map((sample) => sample[key].transferBytes)),
  });
  return {
    clsMedian: median(matching.map((sample) => sample.cls)),
    consoleErrors: [...new Set(matching.flatMap((sample) => sample.consoleErrors))],
    css: maximumSummary("css"),
    fonts: maximumSummary("fonts"),
    js: maximumSummary("js"),
    lcpMedianMilliseconds: median(matching.map((sample) => sample.lcpMilliseconds)),
    overflowPixels: Math.max(...matching.map((sample) => sample.overflowPixels)),
    requestCount: Math.max(...matching.map((sample) => sample.requestCount)),
    route,
    status: matching[0].status,
    thirdPartyHosts: [...new Set(matching.flatMap((sample) => sample.thirdPartyHosts))],
    width,
  };
}));

const report = { baseUrl, measuredAt: new Date().toISOString(), runCount, results };
if (reportPath) {
  await mkdir(path.dirname(reportPath), { recursive: true });
  await writeFile(reportPath, `${JSON.stringify(report, null, 2)}\n`, "utf8");
}

if (checkBudgets) {
  const budgets = JSON.parse(await readFile(new URL("../tests/performance-budget.json", import.meta.url), "utf8"));
  const failures = [];
  for (const result of results) {
    if (result.status !== 200) failures.push(`${result.route} at ${result.width}px returned ${result.status}`);
    if (result.consoleErrors.length) failures.push(`${result.route} at ${result.width}px logged console errors`);
    if (result.overflowPixels) failures.push(`${result.route} at ${result.width}px overflowed by ${result.overflowPixels}px`);
    if (result.thirdPartyHosts.length) failures.push(`${result.route} at ${result.width}px contacted ${result.thirdPartyHosts.join(", ")}`);
    if (result.js.count > budgets.maxJavaScriptRequests) failures.push(`${result.route} at ${result.width}px exceeded the JavaScript request budget`);
    if (result.js.encodedBytes > budgets.maxJavaScriptEncodedBytes) failures.push(`${result.route} at ${result.width}px exceeded the JavaScript byte budget`);
    if (result.css.count > budgets.maxCssRequests) failures.push(`${result.route} at ${result.width}px exceeded the CSS request budget`);
    if (result.css.encodedBytes > budgets.maxCssEncodedBytes) failures.push(`${result.route} at ${result.width}px exceeded the CSS byte budget`);
    if (result.fonts.count > budgets.maxFontRequests) failures.push(`${result.route} at ${result.width}px exceeded the font request budget`);
    if (result.fonts.encodedBytes > budgets.maxFontEncodedBytes) failures.push(`${result.route} at ${result.width}px exceeded the font byte budget`);
    if (result.requestCount > budgets.maxTotalRequests) failures.push(`${result.route} at ${result.width}px exceeded the total request budget`);
  }
  if (failures.length) throw new Error(`Performance budget failures:\n- ${failures.join("\n- ")}`);
}

process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
