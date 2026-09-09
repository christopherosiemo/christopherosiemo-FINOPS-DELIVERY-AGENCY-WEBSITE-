import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  reactStrictMode: true,
  experimental: {
    serverActions: {
      bodySizeLimit: "64kb",
    },
  },
};

export default nextConfig;
