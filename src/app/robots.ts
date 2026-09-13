import type { MetadataRoute } from "next";
import { createRobots } from "@/config/acquisition";

export default function robots(): MetadataRoute.Robots {
  return createRobots();
}
