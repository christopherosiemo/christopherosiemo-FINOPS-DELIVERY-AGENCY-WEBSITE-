import type { MetadataRoute } from "next";
import { createSitemap } from "@/config/acquisition";

export default function sitemap(): MetadataRoute.Sitemap {
  return createSitemap();
}
