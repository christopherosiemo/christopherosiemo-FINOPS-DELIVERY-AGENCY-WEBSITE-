import type { NextConfig } from "next";

const vinextRuntime = process.argv.some((argument) => argument.includes("vinext"))
  || process.env.npm_lifecycle_event?.endsWith(":cf") === true;

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()" },
  { key: "X-Frame-Options", value: "DENY" },
];

const nextConfig: NextConfig = {
  devIndicators: false,
  poweredByHeader: false,
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
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
