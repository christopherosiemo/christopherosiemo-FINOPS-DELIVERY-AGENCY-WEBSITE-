import { expect, test } from "@playwright/test";

const indexableRoutes = [
  ["/", "AWS Cloud Margin Recovery | HKGpipi", "Engineering-led AWS cost reduction: HKGpipi prepares production changes and verifies the resulting reduction against the AWS bill."],
  ["/savings-sprint", "14-Day AWS Savings Sprint | HKGpipi", "A 14-day AWS cost assessment that ranks savings opportunities and produces a specific implementation roadmap for approved work."],
  ["/implementation", "AWS Savings Implementation | HKGpipi", "Approved AWS savings work delivered through existing repositories, review, approval and customer-controlled deployment processes."],
  ["/pricing", "AWS Cost Reduction Pricing | HKGpipi", "Review the £5,000 Savings Sprint and the alternative fixed or verified-savings-linked implementation models."],
  ["/method", "AWS Cost Reduction Method | HKGpipi", "How HKGpipi finds, validates, assigns, changes, approves and verifies AWS savings while customers retain production control."],
  ["/verification", "AWS Savings Verification | HKGpipi", "How expected AWS savings are reconciled with post-change billing evidence to produce a verified annualised result."],
  ["/security", "AWS Access & Change Control | HKGpipi", "Read-only AWS discovery access, bounded evidence collection and customer-controlled review, approval and deployment."],
] as const;

test("production search metadata is unique, canonical and complete", async ({ page }) => {
  for (const [route, title, description] of indexableRoutes) {
    await page.goto(route);
    await expect(page).toHaveTitle(title);
    await expect(page.locator('meta[name="description"]')).toHaveAttribute("content", description);
    await expect(page.locator('link[rel="canonical"]')).toHaveCount(1);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", `https://hkgpipi.com${route === "/" ? "" : route}`);
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /index, follow/);
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute("content", title);
    await expect(page.locator('meta[property="og:description"]')).toHaveAttribute("content", description);
    await expect(page.locator('meta[property="og:url"]')).toHaveAttribute("content", `https://hkgpipi.com${route === "/" ? "" : route}`);
    await expect(page.locator('meta[property="og:site_name"]')).toHaveAttribute("content", "HKGpipi");
    await expect(page.locator('meta[property="og:type"]')).toHaveAttribute("content", "website");
    await expect(page.locator('meta[property="og:image"]')).toHaveCount(1);
    expect(await page.locator("head").innerHTML()).not.toContain("workers.dev");
  }
});

test("production utility routes and hard 404 remain noindex", async ({ page }) => {
  for (const route of ["/start", "/contact", "/privacy", "/design-system"]) {
    await page.goto(route);
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
  }
  const response = await page.goto("/gate-9a-intentional-404");
  expect(response?.status()).toBe(404);
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
  await expect(page.locator('link[rel="canonical"]')).toHaveCount(0);
});

test("production robots and sitemap are framework-native and selective", async ({ request }) => {
  const robots = await request.get("/robots.txt");
  expect(robots.status()).toBe(200);
  expect(robots.headers()["content-type"]).toContain("text/plain");
  const robotsBody = await robots.text();
  expect(robotsBody).toContain("Allow: /");
  expect(robotsBody).toContain("Disallow: /design-system");
  expect(robotsBody).toContain("Sitemap: https://hkgpipi.com/sitemap.xml");
  expect(robotsBody).not.toContain("workers.dev");

  const sitemap = await request.get("/sitemap.xml");
  expect(sitemap.status()).toBe(200);
  expect(sitemap.headers()["content-type"]).toContain("application/xml");
  const sitemapBody = await sitemap.text();
  for (const [route] of indexableRoutes)
    expect(sitemapBody).toContain(`<loc>https://hkgpipi.com${route === "/" ? "/" : route}</loc>`);
  for (const route of ["/start", "/contact", "/privacy", "/design-system", "/gate-9a-intentional-404"])
    expect(sitemapBody).not.toContain(`<loc>https://hkgpipi.com${route}</loc>`);
  expect(sitemapBody).not.toContain("workers.dev");
  expect(sitemapBody).not.toContain("lastmod");
  expect(sitemapBody).not.toContain("changefreq");
  expect(sitemapBody).not.toContain("priority");
});

test("structured data and share assets contain only approved public facts", async ({ page, request }) => {
  await page.goto("/");
  const scripts = page.locator('script[type="application/ld+json"]');
  await expect(scripts).toHaveCount(1);
  const data = JSON.parse(await scripts.textContent() ?? "null");
  expect(data["@graph"].map((entry: { "@type": string }) => entry["@type"])).toEqual(["Organization", "WebSite", "Service"]);
  const source = JSON.stringify(data);
  expect(source).toContain("enquiries@hkgpipi.com");
  for (const prohibited of ["workers.dev", "gmail.com", "AggregateRating", "Review", "LocalBusiness", "Offer", "guaranteed"])
    expect(source).not.toContain(prohibited);

  const image = await request.get("/opengraph-image");
  expect(image.status()).toBe(200);
  expect(image.headers()["content-type"]).toContain("image/png");
  expect((await image.body()).byteLength).toBeGreaterThan(10_000);
  const icon = await request.get("/icon.svg");
  expect(icon.status()).toBe(200);
  expect(icon.headers()["content-type"]).toContain("image/svg+xml");
});

test("indexable routes add no analytics or browser-side tracking", async ({ page }) => {
  const hosts = new Set<string>();
  page.on("request", (request) => hosts.add(new URL(request.url()).hostname));
  for (const [route] of indexableRoutes) await page.goto(route, { waitUntil: "networkidle" });
  expect([...hosts]).toEqual(["127.0.0.1"]);
  const source = await page.content();
  for (const marker of ["googletagmanager", "google-analytics", "gtag(", "segment.com", "clarity.ms", "facebook.net"])
    expect(source.toLowerCase()).not.toContain(marker);
});
