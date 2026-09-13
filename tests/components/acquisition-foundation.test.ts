import { describe, expect, it } from "vitest";
import {
  acquisitionRoutes,
  applicationEnvironment,
  canonicalUrl,
  createRobots,
  createSitemap,
  createStructuredData,
  displayTitle,
  productionIndexableRoutes,
  productionNoindexRoutes,
} from "@/config/acquisition";
import { routeMetadata } from "@/config/metadata";
import { siteIdentity } from "@/config/site";

describe("technical acquisition foundation", () => {
  it("fails closed outside the explicit production environment", () => {
    expect(applicationEnvironment()).toBe("non-production");
    expect(applicationEnvironment("staging")).toBe("non-production");
    expect(applicationEnvironment("test")).toBe("non-production");
    expect(applicationEnvironment("production")).toBe("production");
    expect(createSitemap("non-production")).toEqual([]);
    expect(createRobots("non-production")).toEqual({ rules: { userAgent: "*", disallow: "/" } });
    expect(createStructuredData("non-production")).toBeNull();
  });

  it("keeps production route metadata unique, canonical and truthful", () => {
    const titles = productionIndexableRoutes.map(displayTitle);
    const descriptions = productionIndexableRoutes.map((route) => acquisitionRoutes[route].description);
    expect(new Set(titles).size).toBe(titles.length);
    expect(new Set(descriptions).size).toBe(descriptions.length);

    for (const route of productionIndexableRoutes) {
      const metadata = routeMetadata(route, "production");
      expect(metadata.description).toBe(acquisitionRoutes[route].description);
      expect(metadata.alternates).toEqual({ canonical: canonicalUrl(route) });
      expect(metadata.robots).toEqual({ index: true, follow: true });
      expect(metadata.openGraph).toMatchObject({
        title: displayTitle(route),
        description: acquisitionRoutes[route].description,
        url: canonicalUrl(route),
        siteName: siteIdentity.brandName,
        type: "website",
      });
      expect(canonicalUrl(route)).toMatch(/^https:\/\/hkgpipi\.com(?:\/|$)/);
      expect(canonicalUrl(route)).not.toContain("?");
      expect(canonicalUrl(route)).not.toContain("workers.dev");
    }
  });

  it("keeps conversion and policy utilities noindex in every environment", () => {
    for (const route of productionNoindexRoutes) {
      expect(routeMetadata(route, "production").robots).toEqual({ index: false, follow: false });
      expect(routeMetadata(route, "non-production").robots).toEqual({ index: false, follow: false });
    }
    for (const route of productionIndexableRoutes) {
      expect(routeMetadata(route, "non-production").robots).toEqual({ index: false, follow: false });
    }
  });

  it("publishes only intended production routes in robots and sitemap", () => {
    expect(createRobots("production")).toEqual({
      rules: { userAgent: "*", allow: "/", disallow: ["/design-system"] },
      sitemap: "https://hkgpipi.com/sitemap.xml",
      host: "https://hkgpipi.com",
    });
    expect(createSitemap("production")).toEqual(
      productionIndexableRoutes.map((route) => ({ url: canonicalUrl(route) })),
    );
    const sitemapText = JSON.stringify(createSitemap("production"));
    for (const route of [...productionNoindexRoutes, "/design-system", "/gate-9a-test"])
      expect(sitemapText).not.toContain(`hkgpipi.com${route}`);
    expect(sitemapText).not.toContain("workers.dev");
    expect(sitemapText).not.toContain("lastModified");
    expect(sitemapText).not.toContain("changeFrequency");
    expect(sitemapText).not.toContain("priority");
  });

  it("uses restricted structured data with no fabricated or private facts", () => {
    const data = createStructuredData("production");
    expect(data?.["@graph"].map((entry) => entry["@type"])).toEqual(["Organization", "WebSite", "Service"]);
    const serialized = JSON.stringify(data);
    expect(serialized).toContain('"name":"HKGpipi"');
    expect(serialized).toContain('"email":"enquiries@hkgpipi.com"');
    expect(serialized).toContain('"serviceType":"AWS cloud cost reduction"');
    for (const prohibited of [
      "workers.dev",
      "gmail.com",
      "AggregateRating",
      "Review",
      "LocalBusiness",
      "FAQPage",
      "Offer",
      "AWS Partner",
      "guaranteed",
      "foundingDate",
      "employee",
    ]) expect(serialized).not.toContain(prohibited);
  });
});
