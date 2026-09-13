import type { NextConfig } from "next";

const vinextRuntime = process.argv.some((argument) => argument.includes("vinext"))
  || process.env.npm_lifecycle_event?.endsWith(":cf") === true;

const nextConfig: NextConfig = {
  devIndicators: false,
  reactStrictMode: true,
  experimental: {
    serverActions: {
      bodySizeLimit: "64kb",
    },
  },
  turbopack: {
    resolveAlias: vinextRuntime ? {} : {
      "cloudflare:workers": "./src/lib/cloudflare-workers-node.ts",
    },
  },
};

export default nextConfig;
