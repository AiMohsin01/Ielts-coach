import type { NextConfig } from "next";
const nextConfig: NextConfig = {
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL ?? (process.env.NODE_ENV === "production" ? "" : "http://localhost:4000")
  }
};
export default nextConfig;
