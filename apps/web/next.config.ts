import type { NextConfig } from "next";
const nextConfig: NextConfig = {
  reactStrictMode: true,
  webpack(config) {
    // Shared TypeScript uses Node ESM .js specifiers; resolve the source for Next too.
    config.resolve.extensionAlias = { ...config.resolve.extensionAlias, ".js": [".ts", ".tsx", ".js"] };
    return config;
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL ?? (process.env.NODE_ENV === "production" ? "" : "http://localhost:4000")
  }
};
export default nextConfig;
