import type { MetadataRoute } from "next";
import { siteIdentity } from "@/config/site";

export const productionIndexableRoutes = [
  "/",
  "/savings-sprint",
  "/implementation",
  "/pricing",
  "/method",
  "/verification",
  "/security",
] as const;

export const productionNoindexRoutes = ["/start", "/contact", "/privacy"] as const;

export type AcquisitionRoute =
  | (typeof productionIndexableRoutes)[number]
  | (typeof productionNoindexRoutes)[number];

type AcquisitionRouteDefinition = {
  title: string;
  description: string;
  indexable: boolean;
  primaryIntent: string;
  secondaryIntent: string;
  userQuestion: string;
  conversionPath: string;
};

export const acquisitionRoutes = {
  "/": {
    title: "AWS Cloud Margin Recovery",
    description: "Engineering-led AWS cost reduction: HKGpipi prepares production changes and verifies the resulting reduction against the AWS bill.",
    indexable: true,
    primaryIntent: "AWS cost reduction and cloud cost optimisation",
    secondaryIntent: "Engineering-led AWS FinOps delivery",
    userQuestion: "How can AWS savings opportunities become verified reductions on the bill?",
    conversionPath: "/savings-sprint → /start",
  },
  "/savings-sprint": {
    title: "14-Day AWS Savings Sprint",
    description: "A 14-day AWS cost assessment that ranks savings opportunities and produces a specific implementation roadmap for approved work.",
    indexable: true,
    primaryIntent: "AWS cost audit and AWS savings assessment",
    secondaryIntent: "Prioritised AWS cost optimisation roadmap",
    userQuestion: "What will an AWS savings assessment examine and deliver?",
    conversionPath: "/start",
  },
  "/implementation": {
    title: "AWS Savings Implementation",
    description: "Approved AWS savings work delivered through existing repositories, review, approval and customer-controlled deployment processes.",
    indexable: true,
    primaryIntent: "AWS FinOps implementation and cost remediation",
    secondaryIntent: "AWS infrastructure cost changes",
    userQuestion: "How are approved AWS savings turned into safe production changes?",
    conversionPath: "/pricing → /start",
  },
  "/pricing": {
    title: "AWS Cost Reduction Pricing",
    description: "Review the £5,000 Savings Sprint and the alternative fixed or verified-savings-linked implementation models.",
    indexable: true,
    primaryIntent: "AWS FinOps pricing and cost optimisation pricing",
    secondaryIntent: "AWS savings assessment cost",
    userQuestion: "What does HKGpipi charge for discovery and implementation?",
    conversionPath: "/start",
  },
  "/method": {
    title: "AWS Cost Reduction Method",
    description: "How HKGpipi finds, validates, assigns, changes, approves and verifies AWS savings while customers retain production control.",
    indexable: true,
    primaryIntent: "How AWS savings are implemented",
    secondaryIntent: "AWS cost reduction engineering method",
    userQuestion: "What evidence and decisions move an AWS saving from estimate to verified result?",
    conversionPath: "/verification → /start",
  },
  "/verification": {
    title: "AWS Savings Verification",
    description: "How expected AWS savings are reconciled with post-change billing evidence to produce a verified annualised result.",
    indexable: true,
    primaryIntent: "AWS savings verification and realised cloud savings",
    secondaryIntent: "Cloud cost reduction measurement",
    userQuestion: "How does HKGpipi distinguish estimated savings from verified savings?",
    conversionPath: "/pricing → /start",
  },
  "/security": {
    title: "AWS Access & Change Control",
    description: "Read-only AWS discovery access, bounded evidence collection and customer-controlled review, approval and deployment.",
    indexable: true,
    primaryIntent: "AWS FinOps security and read-only AWS access",
    secondaryIntent: "AWS cost optimisation change control",
    userQuestion: "What access does HKGpipi need, and who controls production changes?",
    conversionPath: "/method → /start",
  },
  "/start": {
    title: "Start a Savings Sprint",
    description: "Tell HKGpipi about your AWS estate, engineering constraint and savings priority.",
    indexable: false,
    primaryIntent: "Savings Sprint enquiry",
    secondaryIntent: "AWS cost reduction contact",
    userQuestion: "How do I start a bounded AWS savings assessment?",
    conversionPath: "Enquiry submission",
  },
  "/contact": {
    title: "Contact HKGpipi",
    description: "Contact HKGpipi about AWS savings and implementation work through the canonical Savings Sprint enquiry.",
    indexable: false,
    primaryIntent: "HKGpipi contact",
    secondaryIntent: "AWS savings enquiry",
    userQuestion: "How can I contact HKGpipi?",
    conversionPath: "/start",
  },
  "/privacy": {
    title: "Privacy Policy",
    description: "How HKGpipi collects, uses, stores and protects personal data.",
    indexable: false,
    primaryIntent: "HKGpipi privacy policy",
    secondaryIntent: "HKGpipi personal-data handling",
    userQuestion: "How does HKGpipi process personal data?",
    conversionPath: "/contact",
  },
} as const satisfies Record<AcquisitionRoute, AcquisitionRouteDefinition>;

export type ApplicationEnvironment = "production" | "non-production";

export function applicationEnvironment(value = process.env.APP_ENVIRONMENT): ApplicationEnvironment {
  return value === "production" ? "production" : "non-production";
}

export function canonicalUrl(route: AcquisitionRoute | "/sitemap.xml" | "/opengraph-image"): string {
  return new URL(route, `${siteIdentity.productionOrigin}/`).toString();
}

export function displayTitle(route: AcquisitionRoute): string {
  return `${acquisitionRoutes[route].title} | ${siteIdentity.brandName}`;
}

export function createRobots(environment = applicationEnvironment()): MetadataRoute.Robots {
  if (environment !== "production") {
    return { rules: { userAgent: "*", disallow: "/" } };
  }

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/design-system"],
    },
    sitemap: canonicalUrl("/sitemap.xml"),
    host: siteIdentity.productionOrigin,
  };
}

export function createSitemap(environment = applicationEnvironment()): MetadataRoute.Sitemap {
  if (environment !== "production") return [];
  return productionIndexableRoutes.map((route) => ({ url: canonicalUrl(route) }));
}

export function createStructuredData(environment = applicationEnvironment()) {
  if (environment !== "production") return null;

  const organizationId = `${siteIdentity.productionOrigin}/#organization`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": organizationId,
        name: siteIdentity.brandName,
        url: siteIdentity.productionOrigin,
        email: "enquiries@hkgpipi.com",
      },
      {
        "@type": "WebSite",
        "@id": `${siteIdentity.productionOrigin}/#website`,
        name: siteIdentity.brandName,
        url: siteIdentity.productionOrigin,
        publisher: { "@id": organizationId },
      },
      {
        "@type": "Service",
        "@id": `${siteIdentity.productionOrigin}/#cloud-margin-recovery`,
        name: siteIdentity.categoryDescriptor,
        serviceType: "AWS cloud cost reduction",
        url: siteIdentity.productionOrigin,
        provider: { "@id": organizationId },
      },
    ],
  } as const;
}
