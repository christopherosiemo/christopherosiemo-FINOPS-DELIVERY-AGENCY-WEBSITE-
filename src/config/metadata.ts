import type { Metadata } from "next";
import {
  acquisitionRoutes,
  applicationEnvironment,
  canonicalUrl,
  displayTitle,
  type AcquisitionRoute,
  type ApplicationEnvironment,
} from "@/config/acquisition";
import { siteIdentity } from "@/config/site";

export function routeMetadata(
  route: AcquisitionRoute,
  environment: ApplicationEnvironment = applicationEnvironment(),
): Metadata {
  const definition = acquisitionRoutes[route];
  const indexable = environment === "production" && definition.indexable;

  return {
    title: { absolute: displayTitle(route) },
    description: definition.description,
    alternates: { canonical: canonicalUrl(route) },
    robots: { index: indexable, follow: indexable },
    openGraph: {
      title: displayTitle(route),
      description: definition.description,
      url: canonicalUrl(route),
      siteName: siteIdentity.brandName,
      type: "website",
      images: [{
        url: canonicalUrl("/opengraph-image"),
        width: 1200,
        height: 630,
        alt: `${siteIdentity.brandName} — ${siteIdentity.categoryDescriptor}`,
      }],
    },
  };
}
