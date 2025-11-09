import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Don't fail the build on linting errors in production
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Don't fail the build on type errors in production
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
