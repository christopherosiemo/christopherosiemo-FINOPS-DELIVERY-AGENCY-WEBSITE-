import { mkdir, writeFile } from "node:fs/promises";
import { chromium } from "@playwright/test";

const productionBaseUrl = process.env.ACQUISITION_BASE_URL ?? "http://127.0.0.1:3114";
const stagingBaseUrl = process.env.STAGING_BASE_URL;
const outputDirectory = new URL("../outputs/gate-9a-review/", import.meta.url);
const routes = ["/", "/savings-sprint", "/implementation", "/pricing", "/method", "/verification", "/security", "/start", "/contact", "/privacy"];

await mkdir(outputDirectory, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({ colorScheme: "light", locale: "en-GB", viewport: { width: 1440, height: 900 } });
const metadata = [];
for (const route of routes) {
  const response = await page.goto(new URL(route, productionBaseUrl).toString());
  metadata.push(await page.evaluate(({ route, status }) => ({
    route,
    status,
    title: document.title,
    description: document.querySelector('meta[name="description"]')?.getAttribute("content") ?? null,
    canonical: document.querySelector('link[rel="canonical"]')?.getAttribute("href") ?? null,
    robots: document.querySelector('meta[name="robots"]')?.getAttribute("content") ?? null,
    openGraph: {
      title: document.querySelector('meta[property="og:title"]')?.getAttribute("content") ?? null,
      description: document.querySelector('meta[property="og:description"]')?.getAttribute("content") ?? null,
      url: document.querySelector('meta[property="og:url"]')?.getAttribute("content") ?? null,
      image: document.querySelector('meta[property="og:image"]')?.getAttribute("content") ?? null,
      siteName: document.querySelector('meta[property="og:site_name"]')?.getAttribute("content") ?? null,
      type: document.querySelector('meta[property="og:type"]')?.getAttribute("content") ?? null,
    },
  }), { route, status: response?.status() ?? null }));
}

await page.goto(productionBaseUrl);
const structuredData = await page.locator('script[type="application/ld+json"]').allTextContents();
const robotsProduction = await (await fetch(new URL("/robots.txt", productionBaseUrl))).text();
const sitemapProduction = await (await fetch(new URL("/sitemap.xml", productionBaseUrl))).text();
const socialCard = await (await fetch(new URL("/opengraph-image", productionBaseUrl))).arrayBuffer();

const acquisitionRouteMap = metadata.map(({ route, canonical, robots }) => ({
  route,
  canonical,
  robots,
  internallyLinkedDestinations: [],
}));
for (const entry of acquisitionRouteMap) {
  await page.goto(new URL(entry.route, productionBaseUrl).toString());
  entry.internallyLinkedDestinations = await page.locator('main a[href^="/"]').evaluateAll((links) =>
    [...new Set(links.map((link) => link.getAttribute("href")).filter(Boolean))].sort(),
  );
}

await writeFile(new URL("metadata.json", outputDirectory), `${JSON.stringify(metadata, null, 2)}\n`);
await writeFile(new URL("robots-production.txt", outputDirectory), robotsProduction);
await writeFile(new URL("sitemap-production.xml", outputDirectory), sitemapProduction);
await writeFile(new URL("structured-data.json", outputDirectory), `${JSON.stringify(structuredData.map(JSON.parse), null, 2)}\n`);
await writeFile(new URL("acquisition-route-map.json", outputDirectory), `${JSON.stringify(acquisitionRouteMap, null, 2)}\n`);
await writeFile(new URL("social-card.png", outputDirectory), Buffer.from(socialCard));

if (stagingBaseUrl) {
  const stagingPage = await browser.newPage({ locale: "en-GB" });
  const response = await stagingPage.goto(stagingBaseUrl);
  const stagingSafety = await stagingPage.evaluate((status) => ({
    status,
    robots: document.querySelector('meta[name="robots"]')?.getAttribute("content") ?? null,
    canonical: document.querySelector('link[rel="canonical"]')?.getAttribute("href") ?? null,
    structuredData: document.querySelector('script[type="application/ld+json"]')?.textContent ?? null,
  }), response?.status() ?? null);
  const robotsStaging = await (await fetch(new URL("/robots.txt", stagingBaseUrl))).text();
  const sitemapStaging = await (await fetch(new URL("/sitemap.xml", stagingBaseUrl))).text();
  const workersDevAcquisitionLeak = [stagingSafety.canonical, stagingSafety.structuredData, sitemapStaging]
    .some((value) => value?.includes("workers.dev"));
  await writeFile(new URL("robots-staging.txt", outputDirectory), robotsStaging);
  await writeFile(new URL("staging-safety.json", outputDirectory), `${JSON.stringify({ ...stagingSafety, workersDevAcquisitionLeak, sitemap: sitemapStaging }, null, 2)}\n`);
  await stagingPage.close();
}

await browser.close();
