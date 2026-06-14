import type { NextConfig } from "next";

const PUBLIC_APP_URL =
  process.env.NEXT_PUBLIC_APP_URL ?? "https://quick-poll-ba18.vercel.app";

const nextConfig: NextConfig = {
  output: "standalone",
  env: {
    NEXT_PUBLIC_APP_URL: PUBLIC_APP_URL,
  },
  turbopack: {
    root: import.meta.dirname,
  },
};

export default nextConfig;
