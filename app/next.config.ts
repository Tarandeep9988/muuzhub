import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  productionBrowserSourceMaps: false, // Disable source maps to reduce memory
  compress: true, // Enable gzip compression
};

export default nextConfig;
