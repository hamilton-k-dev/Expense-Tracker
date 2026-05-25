import type { NextConfig } from "next";

const appUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

const nextConfig: NextConfig = {
  env: { NEXT_PUBLIC_APP_URL: appUrl },
};

export default nextConfig;
