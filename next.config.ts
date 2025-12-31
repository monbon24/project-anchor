import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  basePath: '/project-anchor',
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
};

export default nextConfig;
