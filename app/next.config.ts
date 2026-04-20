import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  productionBrowserSourceMaps: false, // Disable source maps to reduce memory
  swcMinify: true, // Use SWC for minification (faster, less memory)
  compress: true, // Enable gzip compression
};

export default nextConfig;
