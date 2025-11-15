import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Skip static generation for pages that cause errors
  experimental: {
    missingSuspenseWithCSRBailout: false,
  },
};

export default nextConfig;

